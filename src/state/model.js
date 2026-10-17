import { createInitialState } from './data';

export const STORAGE_KEY = 'weshare.frontend.v1';
const toggle = (values, value) => values.includes(value) ? values.filter(v => v !== value) : [...values, value];
export const uid = () => globalThis.crypto?.randomUUID?.() ?? `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function loadState(storage) {
  const initial = createInitialState();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { state: initial, error: '' };
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || !Array.isArray(saved.posts) || !saved.profile || typeof saved.profile.name !== 'string') throw new Error('Invalid data');
    // Preserve new default fields when the application adds features.
    const merged = { ...initial, ...saved, profile: { ...initial.profile, ...saved.profile }, settings: { ...initial.settings, ...saved.settings } };
    for (const [key, value] of Object.entries(initial)) {
      if (Array.isArray(value) && !Array.isArray(merged[key])) throw new Error('Invalid data');
    }
    if (!merged.messages || typeof merged.messages !== 'object' || Object.values(merged.messages).some(v => !Array.isArray(v))) throw new Error('Invalid messages');
    return { state: merged, error: '' };
  } catch {
    return { state: initial, error: 'Saved data could not be loaded. A fresh demo is shown. Browser storage may be unavailable.' };
  }
}

export function reducer(state, action) {
  const { type, payload: p } = action;
  switch (type) {
    case 'POST_CREATE': return { ...state, posts: [p, ...state.posts] };
    case 'POST_EDIT': return { ...state, posts: state.posts.map(post => post.id === p.id && post.author === 'me' ? { ...post, text: p.text, audience: p.audience } : post) };
    case 'POST_DELETE': return { ...state, posts: state.posts.filter(post => post.id !== p || post.author !== 'me'), savedPosts: state.savedPosts.filter(id => id !== p), likedPosts: state.likedPosts.filter(id => id !== p) };
    case 'POST_COMMENT': return { ...state, posts: state.posts.map(post => post.id === p.postId ? { ...post, comments: [...post.comments, p.comment] } : post) };
    case 'TOGGLE': return { ...state, [p.key]: toggle(state[p.key], p.id) };
    case 'EVENT_CREATE': return { ...state, events: [...state.events, p] };
    case 'FRIEND_ACCEPT': return { ...state, friendRequests: state.friendRequests.filter(id => id !== p), friends: [...new Set([...state.friends, p])], following: [...new Set([...state.following, p])] };
    case 'FRIEND_DISMISS': return { ...state, friendRequests: state.friendRequests.filter(id => id !== p) };
    case 'FRIEND_REMOVE': return { ...state, friends: state.friends.filter(id => id !== p) };
    case 'MESSAGE_SEND': return { ...state, messages: { ...state.messages, [p.person]: [...(state.messages[p.person] || []), p.message] } };
    case 'MESSAGE_READ': return { ...state, unreadMessages: state.unreadMessages.filter(id => id !== p) };
    case 'MESSAGE_ACCEPT': return { ...state, messageRequests: state.messageRequests.filter(id => id !== p) };
    case 'CART_ADD': {
      const item = state.cart.find(item => item.id === p);
      return { ...state, cart: item ? state.cart.map(v => v.id === p ? { ...v, quantity: Math.min(v.quantity + 1, 10) } : v) : [...state.cart, { id: p, quantity: 1 }] };
    }
    case 'CART_QUANTITY': return { ...state, cart: p.quantity <= 0 ? state.cart.filter(item => item.id !== p.id) : state.cart.map(item => item.id === p.id ? { ...item, quantity: Math.min(10, p.quantity) } : item) };
    case 'FILE_ADD': return { ...state, files: [p, ...state.files] };
    case 'FILE_REMOVE': return { ...state, files: state.files.filter(file => file.id !== p) };
    case 'PHOTO_ADD': return { ...state, photos: [p, ...state.photos] };
    case 'PHOTO_REMOVE': return { ...state, photos: state.photos.filter(photo => photo.id !== p || !photo.uploaded) };
    case 'STORY_ADD': return { ...state, stories: [p, ...state.stories] };
    case 'PROFILE_UPDATE': return { ...state, profile: { ...state.profile, ...p } };
    case 'SETTINGS_UPDATE': return { ...state, settings: { ...state.settings, ...p } };
    case 'NOTIFICATIONS_READ': return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    case 'NOTIFICATION_READ': return { ...state, notifications: state.notifications.map(n => n.id === p ? { ...n, read: true } : n) };
    case 'RESET': return createInitialState();
    default: return state;
  }
}

export function filterProducts(products, filters) {
  return products.filter(p =>
    (!filters.query || p.title.toLowerCase().includes(filters.query.toLowerCase())) &&
    (!filters.category || filters.category === 'All products' || p.category === filters.category) &&
    (!filters.condition || p.condition === filters.condition) &&
    (!filters.verified || p.verified) &&
    (!filters.maxPrice || p.price <= Number(filters.maxPrice)) &&
    (!filters.location || filters.location === 'All locations' || p.location === filters.location)
  ).sort((a, b) => filters.sort === 'low' ? a.price - b.price : filters.sort === 'high' ? b.price - a.price : filters.sort === 'rating' ? b.rating - a.rating : 0);
}

export function cartTotal(cart, products) {
  return cart.reduce((sum, item) => sum + (products.find(p => p.id === item.id)?.price ?? 0) * item.quantity, 0);
}
