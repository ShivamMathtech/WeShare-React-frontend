import { useEffect, useRef, useState } from 'react';
import { Bell, Bookmark, CalendarDays, CheckCheck, ChevronDown, ChevronRight, Compass, FileText, Home, Image, Menu, MessageCircle, MoreHorizontal, PlaySquare, Plus, Search, Settings, ShoppingBag, Users, X } from 'lucide-react';
import { Avatar, Badge, Button, IconButton, SearchInput, useUI } from './UI';
import { useStore } from '../state/Store';
import { communities, people } from '../state/data';

export const navigation = [
  ['feed', 'Feed', Home], ['friends', 'Friends', Users], ['events', 'Event', CalendarDays],
  ['watch', 'Watch Videos', PlaySquare], ['photos', 'Photos', Image], ['marketplace', 'Marketplace', ShoppingBag], ['files', 'Files', FileText],
];
export function Header() {
  const { state, person } = useStore();
  const { go, openModal, setMobileMenu } = useUI();
  const [search, setSearch] = useState('');
  return <header className="topbar"><div className="topbar-inner">
    <IconButton className="mobile-menu-button" label="Open navigation" onClick={() => setMobileMenu(true)}><Menu size={23}/></IconButton>
    <a className="brand" href="#feed"><span className="brand-mark"><CheckCheck size={23} strokeWidth={2.4}/></span><span>WeShare<span className="brand-dot">.</span></span></a>
    <form className="global-search" onSubmit={e => { e.preventDefault(); if (search.trim()) go('search', search.trim()); }}><SearchInput value={search} onChange={setSearch} placeholder="Search people, posts, and more"/><button className="sr-only" type="submit">Search WeShare</button><kbd>↵</kbd></form>
    <div className="header-actions">
      <IconButton label="Open messages" onClick={() => openModal('messages')}><MessageCircle size={20}/>{state.unreadMessages.length > 0 && <span className="unread-dot"/>}</IconButton>
      <IconButton label="Notifications" onClick={() => openModal('notifications')}><Bell size={20}/>{state.notifications.some(n => !n.read) && <span className="unread-dot"/>}</IconButton>
      <IconButton label="Saved items" onClick={() => go('saved')} className="header-saved"><Bookmark size={19}/></IconButton>
      <button className="account-button" onClick={() => go('profile')}><Avatar person={person('me')} size={32}/><span>{state.profile.name}</span><ChevronDown size={13}/></button>
    </div>
  </div></header>;
}
export function Sidebar() {
  const { state, person } = useStore(); const { route, go, mobileMenu, setMobileMenu, openModal } = useUI();
  const drawer = useRef(null);
  useEffect(() => {
    if (!mobileMenu) return;
    const previous = document.activeElement, oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const nodes = () => [...drawer.current.querySelectorAll('button:not([disabled]), a[href]')];
    nodes()[0]?.focus();
    const trap = e => {
      if (e.key !== 'Tab') return;
      const list = nodes(), first = list[0], last = list.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', trap); if (previous?.isConnected) previous.focus(); };
  }, [mobileMenu]);
  const active = route.page === 'post' || route.page === 'community' ? 'feed' : route.page;
  const navigate = (page, param) => { go(page, param); setMobileMenu(false); };
  const showInfo = title => { setMobileMenu(false); openModal('info', title); };
  return <>
    {mobileMenu && <button className="nav-backdrop" aria-label="Close navigation" onClick={() => setMobileMenu(false)}/>}
    <aside ref={drawer} className={`sidebar ${mobileMenu ? 'is-open' : ''}`} role={mobileMenu ? 'dialog' : undefined} aria-modal={mobileMenu || undefined} aria-label={mobileMenu ? 'Navigation menu' : 'Main navigation'}>
      <div className="mobile-sidebar-title"><span className="brand">WeShare.</span><IconButton label="Close navigation" onClick={() => setMobileMenu(false)}><X size={20}/></IconButton></div>
      <button className="profile-mini panel" onClick={() => navigate('profile')}><div className="person-line"><Avatar person={person('me')} size={39}/><div><strong>{state.profile.name} <Badge/></strong><small>@{state.profile.handle}</small></div></div><div className="profile-stats"><span><b>2.3k</b><small>Followers</small></span><span><b>{232 + state.following.length}</b><small>Following</small></span><span><b>{80 + state.posts.filter(p => p.author === 'me').length}</b><small>Posts</small></span></div></button>
      <nav className="nav-list">{navigation.map(([id, label, Icon]) => <a key={id} href={`#${id}`} onClick={() => setMobileMenu(false)} className={`nav-item ${active === id ? 'active' : ''}`} aria-current={active === id ? 'page' : undefined}><Icon size={18}/><span>{label}</span>{id === 'events' && <span className="nav-badge coral">{state.events.length}</span>}{id === 'files' && state.files.length > 0 && <span className="nav-badge purple">{state.files.length}</span>}</a>)}</nav>
      <section className="sidebar-pages"><h2>Pages you like</h2>{communities.filter(c => state.followedPages.includes(c.id)).map(c => <button key={c.id} className="community-link" onClick={() => navigate('community', c.id)}><span style={{ background: c.color }} className="community-icon">{c.initials}</span><span>{c.title}</span>{c.id === 'behance' && <Badge/>}</button>)}<button className="text-button muted" onClick={() => navigate('communities')}>View all <ChevronRight size={12}/></button></section>
      <button className="sidebar-settings" onClick={() => navigate('settings')}><Settings size={16}/>Settings & preferences</button>
      <footer className="sidebar-footer"><div><button onClick={() => showInfo('Privacy')}>Privacy</button><button onClick={() => showInfo('Terms')}>Terms</button><button onClick={() => showInfo('About WeShare')}>About</button></div><span>WeShare © {new Date().getFullYear()}</span><span className="local-label">Your creative community</span></footer>
    </aside>
  </>;
}
export function MobileNav() {
  const { route } = useUI();
  return <nav className="bottom-nav" aria-label="Mobile navigation">{navigation.filter(([id]) => ['feed', 'friends', 'events', 'watch', 'marketplace'].includes(id)).map(([id, label, Icon]) => <a href={`#${id}`} key={id} className={route.page === id ? 'active' : ''}><Icon size={20}/><span>{id === 'watch' ? 'Watch' : id === 'marketplace' ? 'Shop' : label}</span></a>)}</nav>;
}
export function MessageList({ full = false }) {
  const { state, person } = useStore(); const { openModal } = useUI();
  const [tab, setTab] = useState('Primary'), [query, setQuery] = useState('');
  const ids = tab === 'Requests' ? state.messageRequests : tab === 'General' ? people.filter(p => !state.friends.includes(p.id) && !state.messageRequests.includes(p.id)).map(p => p.id) : state.friends;
  const visible = ids.filter(id => person(id).name.toLowerCase().includes(query.toLowerCase()));
  return <section className={`panel messages-panel ${full ? 'messages-full' : ''}`}><div className="panel-heading"><h2>Messages</h2><IconButton label="New message" onClick={() => openModal('new-message')}><Plus size={17}/></IconButton></div><SearchInput value={query} onChange={setQuery} placeholder="Search messages"/><div className="message-tabs" role="tablist" aria-label="Message inbox">{['Primary', 'General', 'Requests'].map(t => <button role="tab" aria-selected={tab === t} key={t} onClick={() => setTab(t)} className={tab === t ? 'active' : ''}>{t}{t === 'Requests' && <span>({state.messageRequests.length})</span>}</button>)}</div><div className="message-people">{visible.slice(0, full ? 30 : 8).map(id => <button className="message-person" onClick={() => openModal('chat', id)} key={id}><Avatar person={person(id)} size={31} online={person(id).online && state.settings.activityVisible}/><span><strong>{person(id).name}</strong>{full && <small>{state.messages[id]?.at(-1)?.text || 'Start a conversation'}</small>}</span>{state.unreadMessages.includes(id) && <i className="message-unread"/>}</button>)}{visible.length === 0 && <p className="small-muted empty-inline">No conversations found.</p>}</div>{!full && <button className="text-button muted" onClick={() => openModal('messages')}>View all <ChevronRight size={12}/></button>}</section>;
}
export function SuggestedPeople({ heading = 'Suggested for you' }) {
  const { state, person, toggle } = useStore(); const { go } = useUI();
  const suggestions = people.filter(p => !state.following.includes(p.id)).slice(0, 5);
  return <section className="panel suggestions"><div className="panel-heading"><h2>{heading}</h2><Users size={15}/></div>{suggestions.map(p => <div className="suggestion" key={p.id}><button className="person-line" onClick={() => go('profile', p.id)}><Avatar person={person(p.id)} size={31}/><span><strong>{p.name}</strong><small>{p.role}</small></span></button><IconButton label={`Follow ${p.name}`} onClick={() => toggle('following', p.id)}><Plus size={16}/></IconButton></div>)}{!suggestions.length && <p className="small-muted">You’re following everyone in this demo.</p>}<button className="text-button muted" onClick={() => go('friends')}>See all <ChevronRight size={12}/></button></section>;
}
export function ActivityPanel() {
  const { state, person } = useStore(); const { openModal } = useUI();
  return <section className="panel activity-panel"><div className="panel-heading"><h2>Latest activity</h2><IconButton label="View all notifications" onClick={() => openModal('notifications')}><MoreHorizontal size={17}/></IconButton></div>{state.notifications.map(n => <button key={n.id} className="activity-item" onClick={() => openModal('notifications')}><Avatar person={person(n.actor)} size={30}/><span><strong>{person(n.actor).name}</strong> {n.text}<small>From your community</small></span></button>)}</section>;
}
export function RightRail() {
  const { state } = useStore(); const { route, openModal, go } = useUI();
  if (['marketplace', 'files', 'settings', 'search'].includes(route.page)) return null;
  return <aside className="right-rail" aria-label="Community sidebar">{['feed', 'post', 'community'].includes(route.page) ? <><MessageList/><section className="panel mini-events"><div className="panel-heading"><h2>Events</h2><IconButton label="See all events" onClick={() => go('events')}><MoreHorizontal size={17}/></IconButton></div><button className="event-invites" onClick={() => go('events')}><CalendarDays size={17}/><strong>{state.events.length} upcoming events</strong></button>{state.events.slice(0, 3).map(event => <button key={event.id} className="mini-event" onClick={() => openModal('event', event.id)}><CalendarDays size={15}/><span><strong>{event.title}</strong><small>{event.location.split(',')[0]}</small></span></button>)}</section><div className="rail-note"><Compass size={18}/><p>A little space for your people,<br/>ideas, and everyday inspiration.</p></div></> : route.page === 'watch' ? <><SuggestedPeople heading="Creators to follow"/><section className="panel"><div className="panel-heading"><h2>Your watchlist</h2><Bookmark size={16}/></div><p className="small-muted">{state.savedVideos.length ? `${state.savedVideos.length} video${state.savedVideos.length > 1 ? 's' : ''} ready for later.` : 'Save a video to watch it again later.'}</p><Button variant="soft" className="full-width" onClick={() => go('saved')}>Open watchlist</Button></section></> : <><SuggestedPeople/><ActivityPanel/></>}</aside>;
}
