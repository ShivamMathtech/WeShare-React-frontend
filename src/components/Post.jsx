import { useState } from 'react';
import { Bookmark, Check, ChevronDown, Download, Globe2, Hash, Heart, ImagePlus, MessageCircle, MoreHorizontal, Pencil, Radio, Send, Share2, Smile, Trash2, Users } from 'lucide-react';
import { Art, Avatar, Badge, Button, Empty, IconButton, useUI } from './UI';
import { useStore } from '../state/Store';
import { uid } from '../state/model';
import { copyText, timeAgo } from '../lib/format';
import { deleteMedia, downloadMedia, useMediaUrl } from '../lib/media';

export function UploadVideo({ asset, ...props }) {
  const { url, error } = useMediaUrl(asset);
  return error ? <p className="error-notice">{error}</p> : url ? <video src={url} controls playsInline preload="metadata" {...props}/> : <p className="small-muted">Loading your video…</p>;
}
export function ComposerCard({ community }) {
  const { person } = useStore(); const { openModal } = useUI();
  const compose = (options = {}) => openModal('compose', { ...options, community });
  return <section className="panel composer-card" aria-label="Create a post"><div className="composer-top"><Avatar person={person('me')} size={40}/><button className="composer-placeholder" onClick={() => compose()}>What’s on your mind, {person('me').name.split(' ')[0]}?</button><IconButton label="Add a feeling" onClick={() => compose({ prefix: 'Feeling inspired ✨ ' })}><Smile size={18}/></IconButton><Button onClick={() => compose()}>Share post</Button></div><div className="composer-bottom"><button onClick={() => compose()}><ImagePlus size={16} className="blue-text"/>Image / Video</button><button onClick={() => compose({ attach: true })}><Download size={15} className="amber-text"/>Attachment</button><button onClick={() => openModal('live')}><Radio size={15} className="pink-text"/>Live</button><button onClick={() => compose({ prefix: '#' })}><Hash size={15} className="green-text"/>Hashtag</button><button onClick={() => compose({ mention: true })}><Users size={15}/>Mention</button><span className="composer-audience"><Globe2 size={13}/> Public</span></div></section>;
}
export function Stories() {
  const { state, person } = useStore(); const { openModal } = useUI();
  return <section className="panel stories" aria-label="Stories"><button className="story" aria-label="Your story" onClick={() => openModal('add-story')}><span className="story-ring your-story"><Avatar person={person('me')} size={52}/><span className="story-plus">+</span></span><span>Your story</span></button>{state.stories.slice(0, 9).map((story, i) => <button className="story" aria-label={`${person(story.author).name}’s story`} key={story.id} onClick={() => openModal('story', i)}><span className={`story-ring story-ring-${i % 3}`}><Avatar person={person(story.author)} size={52}/></span><span>{person(story.author).name.split(' ')[0]}</span></button>)}</section>;
}
export function PostCard({ post, expanded = false }) {
  const { state, dispatch, person, toggle, notify } = useStore(); const { openModal, go } = useUI();
  const [showComments, setShowComments] = useState(expanded), [comment, setComment] = useState('');
  const liked = state.likedPosts.includes(post.id), saved = state.savedPosts.includes(post.id);
  const author = person(post.author);
  const share = async () => {
    try { await copyText(`${location.href.split('#')[0]}#post/${post.id}`); notify('Post link copied. Locally created posts are only available in this browser.'); }
    catch (error) { notify(error.message, 'error'); }
  };
  function addComment(e) {
    e.preventDefault(); if (!comment.trim()) return;
    dispatch({ type: 'POST_COMMENT', payload: { postId: post.id, comment: { id: uid(), author: 'me', text: comment.trim(), createdAt: new Date().toISOString() } } });
    setComment('');
  }
  return <article className="panel post-card" id={post.id}>
    <header className="post-header"><button className="person-line" onClick={() => go('profile', post.author === 'me' ? '' : post.author)}><Avatar person={author} size={38}/><span><strong>{author.name} {post.author === 'cameron' && <Badge/>}</strong><small>{timeAgo(post.createdAt)}<span className="dot-separator">·</span>{post.audience === 'Friends' ? <Users size={11}/> : <Globe2 size={11}/>}</small></span></button><details className="dropdown"><summary aria-label={`Options for post by ${author.name}`}><MoreHorizontal size={20}/></summary><div className="dropdown-menu"><button onClick={e => { toggle('savedPosts', post.id); e.currentTarget.closest('details').open = false; }}><Bookmark size={15}/>{saved ? 'Unsave post' : 'Save post'}</button><button onClick={share}><Share2 size={15}/>Copy link</button>{post.author === 'me' && <><button onClick={() => openModal('compose', { post })}><Pencil size={15}/>Edit post</button><button className="danger-text" onClick={() => openModal('confirm', { title: 'Delete this post?', text: 'Your post and its comments will be removed from this browser.', confirm: 'Delete post', action: async () => { await Promise.all([...(post.images || []), post.video, post.attachment?.asset].filter(key => key?.startsWith('upload:')).map(deleteMedia)); dispatch({ type: 'POST_DELETE', payload: post.id }); notify('Post deleted.'); } })}><Trash2 size={15}/>Delete post</button></>}</div></details></header>
    {post.text && <p className="post-text">{post.text}</p>}
    {!!post.images?.length && <div className={`post-images images-${Math.min(post.images.length, 3)}`}>{post.images.map((art, index) => <button className="image-open" key={`${art}-${index}`} onClick={() => openModal('photo', { art, title: `${author.name}’s photo` })} aria-label={`Open photo ${index + 1} by ${author.name}`}><Art name={art} alt={`Creative work by ${author.name}`}/></button>)}</div>}
    {post.video && <div className="post-video"><UploadVideo asset={post.video}/></div>}
    {post.attachment && <button className="post-attachment" onClick={() => downloadMedia(post.attachment).catch(e => notify(e.message, 'error'))}><Download size={17}/><span>{post.attachment.name}</span></button>}
    <div className="post-actions"><button aria-label={`${liked ? 'Unlike' : 'Like'} post by ${author.name}`} aria-pressed={liked} className={liked ? 'liked' : ''} onClick={() => toggle('likedPosts', post.id)}><Heart size={17} fill={liked ? 'currentColor' : 'none'}/><span>{post.likes + Number(liked)}<span className="action-word"> Likes</span></span></button><button aria-label={showComments ? 'Hide comments' : 'Show comments'} onClick={() => setShowComments(!showComments)} aria-expanded={showComments}><MessageCircle size={17}/><span>{post.comments.length}<span className="action-word"> Comments</span></span></button><button onClick={share}><Share2 size={16}/><span>Share</span></button><IconButton label={saved ? 'Unsave post' : 'Save post'} aria-pressed={saved} className={`save-post ${saved ? 'blue-text' : ''}`} onClick={() => toggle('savedPosts', post.id)}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'}/></IconButton></div>
    {showComments && <section className="comments" aria-label="Comments">{post.comments.map(c => <div className="comment" key={c.id}><Avatar person={person(c.author)} size={29}/><div><div className="comment-bubble"><strong>{person(c.author).name}</strong><p>{c.text}</p></div><small>{timeAgo(c.createdAt)}</small></div></div>)}<form className="comment-form" onSubmit={addComment}><Avatar person={person('me')} size={29}/><input value={comment} onChange={e => setComment(e.target.value)} maxLength={800} aria-label="Write a comment" placeholder="Write a thoughtful comment…"/><IconButton label="Send comment" type="submit" disabled={!comment.trim()}><Send size={17}/></IconButton></form></section>}
  </article>;
}
export function Feed({ community, postId }) {
  const { state } = useStore(); const [sort, setSort] = useState('latest');
  let list = state.posts.filter(p => (!community || p.community === community) && (!postId || p.id === postId));
  if (sort === 'following' && !postId) list = list.filter(p => state.following.includes(p.author) || p.author === 'me');
  list = [...list].sort((a, b) => sort === 'popular' ? b.likes + Number(state.likedPosts.includes(b.id)) - a.likes - Number(state.likedPosts.includes(a.id)) : new Date(b.createdAt) - new Date(a.createdAt));
  return <div className="feed-page">{!postId && !community && <Stories/>}{!postId && <ComposerCard community={community}/>}<div className="feed-divider"><span>{postId ? 'Post' : community ? 'Community feed' : 'Your daily inspiration'}</span>{!postId && <label>Sort by: <select aria-label="Sort feed" value={sort} onChange={e => setSort(e.target.value)}><option value="latest">Latest</option><option value="popular">Most liked</option><option value="following">Following</option></select></label>}</div>{list.map(post => <PostCard post={post} key={post.id} expanded={Boolean(postId)}/>)}{!list.length && <div className="panel"><Empty title={postId ? 'This post isn’t available here' : 'A little quiet here'}>{postId ? 'Posts you create are saved in this browser only. Open the link in the browser where it was created.' : 'Follow a creator or share the first post.'}</Empty></div>}<p className="end-of-feed"><Check size={16}/>You’re all caught up. Go make something great.</p></div>;
}
