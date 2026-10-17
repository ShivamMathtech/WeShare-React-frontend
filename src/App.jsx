import { Fragment, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Header, MobileNav, RightRail, Sidebar } from './components/Layout';
import { Button, Empty, IconButton, UIContext } from './components/UI';
import { Feed } from './components/Post';
import { AddStoryDialog, ComposeDialog, LiveDialog } from './components/ComposeDialogs';
import { ChatDialog, ConfirmDialog, InfoDialog, MessagesDialog, NewMessageDialog, NotificationsDialog, PhotoDialog, StoryDialog } from './components/Dialogs';
import Events, { CreateEventDialog, EventDialog } from './pages/Events';
import Watch from './pages/Watch';
import Marketplace, { CartDialog, ProductDialog } from './pages/Marketplace';
import { Communities, Files, Friends, Photos, Profile, Saved } from './pages/Community';
import Search from './pages/Search';
import Settings from './pages/Settings';
import { useStore } from './state/Store';

function readRoute() {
  const [page, ...parts] = location.hash.slice(1).split('/');
  try { return { page: page || 'feed', param: decodeURIComponent(parts.join('/')) }; }
  catch { return { page: 'feed', param: '' }; }
}
export default function App() {
  const { toast, storageError, dismissStorageError } = useStore();
  const [route, setRoute] = useState(readRoute), [modal, setModal] = useState(null), [mobileMenu, setMobileMenu] = useState(false);
  useEffect(() => {
    const change = () => { setRoute(readRoute()); setMobileMenu(false); window.scrollTo?.({ top: 0, behavior: 'instant' }); };
    window.addEventListener('hashchange', change); return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => { document.title = `${({ feed: 'Your feed', events: 'Events', watch: 'Videos', marketplace: 'Marketplace', friends: 'People', photos: 'Photos', files: 'Files', settings: 'Settings', saved: 'Saved', profile: 'Profile', search: 'Search' })[route.page] || 'Community'} · WeShare`; }, [route.page]);
  useEffect(() => {
    if (!mobileMenu) return;
    const key = e => { if (e.key === 'Escape') setMobileMenu(false); };
    document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key);
  }, [mobileMenu]);
  const go = (page, param = '') => { location.hash = `${page}${param ? `/${encodeURIComponent(param)}` : ''}`; };
  const openModal = (type, data) => setModal({ type, data, key: `${type}-${Date.now()}` });
  const closeModal = () => setModal(null);
  const wide = ['marketplace', 'files', 'settings', 'search'].includes(route.page);
  function page() {
    switch (route.page) {
      case 'feed': return <Feed/>;
      case 'post': return <Feed postId={route.param}/>;
      case 'friends': return <Friends/>;
      case 'events': return <Events/>;
      case 'watch': return <Watch/>;
      case 'photos': return <Photos/>;
      case 'marketplace': return <Marketplace/>;
      case 'files': return <Files/>;
      case 'profile': return <Profile personId={route.param}/>;
      case 'community': return <Communities communityId={route.param}/>;
      case 'communities': return <Communities/>;
      case 'saved': return <Saved/>;
      case 'settings': return <Settings/>;
      case 'search': return <Search query={route.param}/>;
      default: return <div className="panel"><Empty title="That page took a different turn" action={<Button onClick={() => go('feed')}>Back to your feed</Button>}>Let’s bring you back to your community.</Empty></div>;
    }
  }
  function dialog() {
    if (!modal) return null;
    const props = { onClose: closeModal };
    switch (modal.type) {
      case 'compose': return <ComposeDialog {...props} options={modal.data}/>;
      case 'add-story': return <AddStoryDialog {...props}/>;
      case 'story': return <StoryDialog {...props} index={modal.data}/>;
      case 'photo': return <PhotoDialog {...props} photo={modal.data}/>;
      case 'event': return <EventDialog {...props} eventId={modal.data}/>;
      case 'create-event': return <CreateEventDialog {...props}/>;
      case 'product': return <ProductDialog {...props} productId={modal.data}/>;
      case 'cart': return <CartDialog {...props}/>;
      case 'messages': return <MessagesDialog {...props}/>;
      case 'new-message': return <NewMessageDialog {...props}/>;
      case 'chat': return <ChatDialog {...props} personId={modal.data}/>;
      case 'notifications': return <NotificationsDialog {...props}/>;
      case 'confirm': return <ConfirmDialog {...props} data={modal.data}/>;
      case 'info': return <InfoDialog {...props} title={modal.data}/>;
      case 'live': return <LiveDialog {...props}/>;
      default: return null;
    }
  }
  return <UIContext.Provider value={{ route, go, openModal, mobileMenu, setMobileMenu }}><a href="#main" className="skip-link" onClick={e => { e.preventDefault(); document.getElementById('main').focus(); }}>Skip to content</a><Header/><div className={`app-layout ${wide ? 'wide-layout' : ''}`}><Sidebar/><main id="main" tabIndex={-1} className="main-content" key={`${route.page}-${route.param}`}>{storageError && <div role="alert" className="storage-banner"><AlertCircle size={19}/><p>{storageError}</p><IconButton label="Dismiss storage warning" onClick={dismissStorageError}><X size={16}/></IconButton></div>}{page()}</main><RightRail/></div><MobileNav/><Fragment key={modal?.key}>{dialog()}</Fragment>{toast && <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`} role={toast.type === 'error' ? 'alert' : 'status'}>{toast.type === 'error' ? <AlertCircle size={19}/> : <CheckCircle2 size={19}/>}<span>{toast.message}</span></div>}</UIContext.Provider>;
}
