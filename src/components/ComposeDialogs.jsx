import { useEffect, useRef, useState } from 'react';
import { AtSign, Check, FilePlus2, Hash, ImagePlus, LoaderCircle, Radio, Video, X } from 'lucide-react';
import { Art, Avatar, Button, ErrorNotice, IconButton, Modal, useUI } from './UI';
import { useStore } from '../state/Store';
import { people } from '../state/data';
import { uid } from '../state/model';
import { deleteMedia, saveMedia } from '../lib/media';

function DraftPreview({ file }) {
  const [url, setUrl] = useState('');
  useEffect(() => { const value = URL.createObjectURL(file); setUrl(value); return () => URL.revokeObjectURL(value); }, [file]);
  return file.type.startsWith('video/') ? <video src={url} controls playsInline/> : <img src={url} alt={file.name}/>;
}
export function ComposeDialog({ options = {}, onClose }) {
  const { state, dispatch, person, notify } = useStore();
  const [text, setText] = useState(options.post?.text || options.prefix || '');
  const [audience, setAudience] = useState(options.post?.audience || 'Public');
  const [files, setFiles] = useState([]), [attachment, setAttachment] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [mention, setMention] = useState(Boolean(options.mention));
  const picker = useRef(), attachmentPicker = useRef(), mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const selectMedia = event => {
    const chosen = Array.from(event.target.files || []); event.target.value = '';
    if (chosen.some(f => !/^image\/(png|jpeg|webp|gif)$/.test(f.type) && !/^video\/(mp4|webm)$/.test(f.type))) return setError('Choose PNG, JPEG, WebP, GIF, MP4, or WebM files.');
    if ([...files, ...chosen].length > 4) return setError('You can attach up to 4 photos, or one video.');
    const all = [...files, ...chosen];
    if (all.some(f => f.type.startsWith('video/')) && all.length > 1) return setError('Attach one video or up to 4 photos in a post.');
    if (all.some(f => f.size > (f.type.startsWith('video/') ? 20 : 5) * 1024 * 1024)) return setError('Images must be under 5 MB; videos must be under 20 MB.');
    setFiles(all); setError('');
  };
  async function submit(e) {
    e.preventDefault(); if (busy || (!text.trim() && !files.length && !attachment && !options.post?.images?.length)) return;
    setBusy(true); setError(''); const keys = [];
    try {
      if (options.post) dispatch({ type: 'POST_EDIT', payload: { id: options.post.id, text: text.trim(), audience } });
      else {
        const images = []; let video, attached;
        for (const file of files) { const key = await saveMedia(file, { kind: file.type.startsWith('image/') ? 'image' : 'file', maxMB: file.type.startsWith('image/') ? 5 : 20 }); keys.push(key); if (file.type.startsWith('video/')) video = key; else images.push(key); }
        if (attachment) { const key = await saveMedia(attachment, { maxMB: 10 }); keys.push(key); attached = { asset: key, name: attachment.name, size: attachment.size }; }
        dispatch({ type: 'POST_CREATE', payload: { id: uid(), author: 'me', text: text.trim(), images, video, attachment: attached, createdAt: new Date().toISOString(), audience, likes: 0, shares: 0, comments: [], community: options.community || 'uiux' } });
      }
      notify(options.post ? 'Your post has been updated.' : 'Your post is ready. Shared to your local feed.'); onClose();
    } catch (err) { await Promise.allSettled(keys.map(deleteMedia)); if (mounted.current) { setError(err.message); setBusy(false); } }
  }
  return <Modal title={options.post ? 'Edit your post' : 'Create a post'} onClose={() => !busy && onClose()}><form onSubmit={submit} className="compose-form"><div className="person-line"><Avatar person={person('me')} size={43}/><div><strong>{state.profile.name}</strong><label className="audience-select"><select value={audience} onChange={e => setAudience(e.target.value)} aria-label="Post audience"><option>Public</option><option>Friends</option><option>Only me</option></select></label></div></div><textarea data-autofocus placeholder="What’s on your mind?" aria-label="Post text" maxLength={2000} value={text} onChange={e => setText(e.target.value)} rows={5}/><div className="text-count">{text.length}/2000</div>{mention && <label className="field">Mention a friend<select aria-label="Mention a friend" defaultValue="" onChange={e => { if (e.target.value) { setText(t => `${t}${t && !t.endsWith(' ') ? ' ' : ''}@${e.target.value} `); setMention(false); } }}><option value="">Choose a person</option>{people.map(p => <option key={p.id}>{p.name}</option>)}</select></label>}
      {files.length > 0 && <div className="draft-media">{files.map((f, i) => <div key={`${f.name}-${i}`}><DraftPreview file={f}/><IconButton label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))}><X size={15}/></IconButton></div>)}</div>}{attachment && <div className="draft-attachment"><FilePlus2 size={16}/>{attachment.name}<IconButton label="Remove attachment" onClick={() => setAttachment(null)}><X size={15}/></IconButton></div>}
      {!options.post && <div className="add-to-post"><span>Add to your post</span><IconButton label="Add photo or video" onClick={() => picker.current.click()}><ImagePlus className="blue-text" size={21}/></IconButton><IconButton label="Attach a file" onClick={() => attachmentPicker.current.click()}><FilePlus2 className="amber-text" size={21}/></IconButton><IconButton label="Add hashtag" onClick={() => setText(t => `${t} #`)}><Hash className="green-text" size={21}/></IconButton><IconButton label="Mention someone" onClick={() => setMention(!mention)}><AtSign size={21}/></IconButton><input ref={picker} className="sr-only" aria-label="Upload post media" tabIndex={-1} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" onChange={selectMedia}/><input ref={attachmentPicker} className="sr-only" aria-label="Upload post attachment" tabIndex={-1} type="file" onChange={e => { setAttachment(e.target.files?.[0] || null); e.target.value = ''; }}/></div>}
      <ErrorNotice>{error}</ErrorNotice><p className="local-disclosure">Saved on this device. Audience labels are part of the frontend demo.</p><Button type="submit" className="full-width" disabled={busy || (!text.trim() && !files.length && !attachment && !options.post?.images?.length)}>{busy ? <><LoaderCircle size={17} className="spin"/>Saving…</> : options.post ? 'Save changes' : 'Share post'}</Button>
    </form></Modal>;
}
export function AddStoryDialog({ onClose }) {
  const { dispatch, notify } = useStore(); const [art, setArt] = useState('planning'), [caption, setCaption] = useState(''), [file, setFile] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try { const selected = file ? await saveMedia(file, { kind: 'image', maxMB: 5 }) : art; dispatch({ type: 'STORY_ADD', payload: { id: uid(), author: 'me', art: selected, caption: caption.trim(), createdAt: new Date().toISOString() } }); notify('Your story is ready.'); onClose(); } catch (err) { setError(err.message); setBusy(false); }
  }
  return <Modal title="Add to your story" onClose={() => !busy && onClose()}><form className="form-body" onSubmit={submit}><p className="small-muted">Choose a background or upload a photo.</p><div className="art-choices">{['planning', 'sound', 'bubbles', 'summer', 'monument', 'craft'].map(a => <button type="button" key={a} onClick={() => { setArt(a); setFile(null); }} aria-label={`Select ${a} background`} aria-pressed={art === a && !file}><Art name={a}/>{art === a && !file && <Check size={18}/>}</button>)}</div><label className="field">Your photo<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e => setFile(e.target.files?.[0] || null)}/></label><label className="field">A little caption<textarea data-autofocus value={caption} onChange={e => setCaption(e.target.value)} maxLength={200} rows={2} placeholder="Share a moment…"/></label><ErrorNotice>{error}</ErrorNotice><Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Share story'}</Button></form></Modal>;
}
export function LiveDialog({ onClose }) {
  const video = useRef(null), stream = useRef(null), alive = useRef(true);
  const [active, setActive] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const stop = () => { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; if (video.current) video.current.srcObject = null; setActive(false); };
  useEffect(() => { alive.current = true; return () => { alive.current = false; stream.current?.getTracks().forEach(t => t.stop()); }; }, []);
  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) return setError('Camera access requires localhost or HTTPS in a browser that supports it.');
    setBusy(true); setError('');
    try { const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); if (!alive.current) { media.getTracks().forEach(t => t.stop()); return; } stream.current = media; video.current.srcObject = media; await video.current.play(); setActive(true); }
    catch (err) { stop(); setError(err.name === 'NotAllowedError' ? 'Camera permission was denied. Allow camera access in your browser and try again.' : 'Could not open a camera. Check that it is connected and not in use.'); }
    finally { if (alive.current) setBusy(false); }
  }
  return <Modal title="Live camera preview" onClose={onClose}><div className="form-body"><div className="camera-preview"><video ref={video} muted playsInline autoPlay aria-label="Local camera preview"/>{!active && <Video size={45}/>}</div><p className="small-muted">Preview your camera on this device. Public livestreaming needs a backend and is not connected in this frontend.</p><ErrorNotice>{error}</ErrorNotice><Button onClick={active ? stop : start} disabled={busy}><Radio size={17}/>{busy ? 'Opening camera…' : active ? 'Stop camera' : 'Start camera'}</Button></div></Modal>;
}
