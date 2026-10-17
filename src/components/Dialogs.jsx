import { useEffect, useRef, useState } from 'react';
import { Bell, Check, ChevronLeft, ChevronRight, Download, Send } from 'lucide-react';
import { Art, Avatar, Button, Empty, ErrorNotice, IconButton, Modal, SearchInput, useUI } from './UI';
import { MessageList } from './Layout';
import { useStore } from '../state/Store';
import { people } from '../state/data';
import { uid } from '../state/model';
import { downloadMedia } from '../lib/media';
import { timeAgo } from '../lib/format';

export function MessagesDialog({ onClose }) { return <Modal title="Your inbox" onClose={onClose}><MessageList full/></Modal>; }
export function NewMessageDialog({ onClose }) {
  const { openModal } = useUI(); const [q, setQ] = useState('');
  return <Modal title="Start a conversation" onClose={onClose}><div className="form-body"><SearchInput value={q} onChange={setQ} placeholder="Find someone"/>{people.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).map(p => <button className="message-person" key={p.id} onClick={() => openModal('chat', p.id)}><Avatar person={p} size={36}/><span><strong>{p.name}</strong><small>{p.role}</small></span><ChevronRight size={16}/></button>)}</div></Modal>;
}
export function ChatDialog({ personId, onClose }) {
  const { state, person, dispatch } = useStore(); const [text, setText] = useState(''); const bottom = useRef();
  const messages = state.messages[personId] || [], p = person(personId), request = state.messageRequests.includes(personId);
  useEffect(() => { dispatch({ type: 'MESSAGE_READ', payload: personId }); }, [personId, dispatch]);
  useEffect(() => { bottom.current?.scrollIntoView?.({ block: 'nearest' }); }, [messages.length]);
  function send(e) { e.preventDefault(); if (!text.trim() || request) return; dispatch({ type: 'MESSAGE_SEND', payload: { person: personId, message: { id: uid(), author: 'me', text: text.trim(), createdAt: new Date().toISOString() } } }); setText(''); }
  return <Modal title={`Chat with ${p.name}`} onClose={onClose}><div className="chat-profile"><Avatar person={p} size={39}/><span><strong>{p.name}</strong><small>Local conversation · messages stay in this browser</small></span></div><div className="chat-messages" aria-live="polite">{messages.length ? messages.map(m => <div className={`chat-message ${m.author === 'me' ? 'outgoing' : ''}`} key={m.id}>{m.author !== 'me' && <Avatar person={p} size={27}/>}<div><p>{m.text}</p><small>{timeAgo(m.createdAt)}{m.author === 'me' && ' · Saved locally'}</small></div></div>) : <Empty title="Say a little hello">Start a local conversation. No messages are delivered to other people.</Empty>}<span ref={bottom}/></div>{request ? <div className="chat-request"><p>Accept this sample request to start a conversation.</p><Button onClick={() => dispatch({ type: 'MESSAGE_ACCEPT', payload: personId })}>Accept request</Button></div> : <form className="chat-form" onSubmit={send}><input data-autofocus aria-label="Message text" placeholder="Write a message…" maxLength={2000} value={text} onChange={e => setText(e.target.value)}/><Button type="submit" disabled={!text.trim()} aria-label="Send message"><Send size={18}/></Button></form>}</Modal>;
}
export function NotificationsDialog({ onClose }) {
  const { state, person, dispatch } = useStore(); const { go } = useUI();
  return <Modal title="A little activity" onClose={onClose}><div className="notification-list"><div className="notification-toolbar"><span>{state.notifications.filter(n => !n.read).length} unread</span><Button variant="text" onClick={() => dispatch({ type: 'NOTIFICATIONS_READ' })}><Check size={15}/>Mark all read</Button></div>{state.notifications.map(n => <button className={`notification-row ${!n.read ? 'unread' : ''}`} key={n.id} onClick={() => { dispatch({ type: 'NOTIFICATION_READ', payload: n.id }); onClose(); go(n.target); }}><Avatar person={person(n.actor)} size={40}/><span><strong>{person(n.actor).name}</strong> {n.text}<small>Sample community activity</small></span>{!n.read && <i className="message-unread"/>}</button>)}</div></Modal>;
}
export function StoryDialog({ index: initialIndex = 0, onClose }) {
  const { state, person } = useStore(); const [index, setIndex] = useState(initialIndex); const story = state.stories[index];
  useEffect(() => { const keys = e => { if (e.key === 'ArrowLeft') setIndex(i => Math.max(0, i - 1)); if (e.key === 'ArrowRight') setIndex(i => Math.min(state.stories.length - 1, i + 1)); }; document.addEventListener('keydown', keys); return () => document.removeEventListener('keydown', keys); }, [state.stories.length]);
  if (!story) return null;
  return <Modal title={`${person(story.author).name}’s story`} onClose={onClose} className="story-modal"><div className="story-viewer"><Art name={story.art} alt={story.caption || 'Creative story'}/><div className="story-viewer-top"><div className="story-progress">{state.stories.map((s, i) => <span className={i <= index ? 'viewed' : ''} key={s.id}/>)}</div><span className="person-line"><Avatar person={person(story.author)} size={35}/><strong>{person(story.author).name}</strong></span></div><p className="story-caption">{story.caption}</p><div className="story-controls"><IconButton label="Previous story" disabled={index === 0} onClick={() => setIndex(index - 1)}><ChevronLeft size={22}/></IconButton><span>{index + 1} / {state.stories.length}</span><IconButton label="Next story" disabled={index === state.stories.length - 1} onClick={() => setIndex(index + 1)}><ChevronRight size={22}/></IconButton></div></div></Modal>;
}
export function PhotoDialog({ photo, onClose }) {
  const { notify } = useStore();
  return <Modal title={photo.title || 'A little inspiration'} onClose={onClose} wide><div className="photo-lightbox"><Art name={photo.art} alt={photo.title}/></div>{photo.art?.startsWith('upload:') && <div className="modal-footer"><Button variant="soft" onClick={() => downloadMedia({ asset: photo.art, name: photo.title || 'photo.jpg' }).catch(e => notify(e.message, 'error'))}><Download size={16}/>Download photo</Button></div>}</Modal>;
}
export function ConfirmDialog({ data, onClose }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function confirm() { setBusy(true); try { await data.action(); onClose(); } catch (e) { setError(e.message); setBusy(false); } }
  return <Modal title={data.title} onClose={() => !busy && onClose()}><div className="form-body"><p>{data.text}</p><ErrorNotice>{error}</ErrorNotice><div className="dialog-actions"><Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button><Button variant="danger" onClick={confirm} disabled={busy}>{busy ? 'Working…' : data.confirm}</Button></div></div></Modal>;
}
export function InfoDialog({ title, onClose }) {
  return <Modal title={title} onClose={onClose}><div className="form-body prose">{title === 'Privacy' ? <><h3>Your data stays with you</h3><p>This frontend stores your text, preferences, and activity in this browser. Uploaded photos, videos, and files are stored on this device.</p><p>No account is created and no message, file, or purchase is sent to another person. You can remove all local data in Settings.</p></> : title === 'Terms' ? <><h3>A space to explore</h3><p>WeShare is an interactive frontend demonstration. People, activity, and listings are sample content. There is no connected authentication, payment service, or messaging server.</p><p>Only upload files you have permission to use. For a public service, connect a backend and replace this information with your own terms.</p></> : <><h3>Ideas are better together.</h3><p>WeShare brings your feed, creative community, events, videos, and everyday finds into one little space.</p><p>Built with React. Inspired by the reference UI you provided.</p></>}<Button onClick={onClose}>Got it</Button></div></Modal>;
}
