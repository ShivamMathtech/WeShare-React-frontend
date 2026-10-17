import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { loadState, reducer, STORAGE_KEY } from './model';
import { people } from './data';

const StoreContext = createContext(null);
export function StoreProvider({ children }) {
  const loaded = useMemo(() => {
    try { return loadState(window.localStorage); }
    catch { return loadState({ getItem: () => { throw new Error('Unavailable'); } }); }
  }, []);
  const [state, dispatch] = useReducer(reducer, loaded.state);
  const [storageError, setStorageError] = useState(loaded.error);
  const [toast, setToast] = useState(null);
  const timeout = useRef(null);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { setStorageError('Changes are available for this visit, but your browser could not save them. Free some storage or allow site storage.'); }
  }, [state]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  function notify(message, type = 'success') {
    clearTimeout(timeout.current); setToast({ message, type });
    timeout.current = setTimeout(() => setToast(null), 4500);
  }
  const person = id => id === 'me' ? state.profile : people.find(p => p.id === id) || { id, name: 'Community member', avatar: 'jakob' };
  const toggle = (key, id) => dispatch({ type: 'TOGGLE', payload: { key, id } });
  return <StoreContext.Provider value={{ state, dispatch, person, toggle, notify, toast, storageError, dismissStorageError: () => setStorageError('') }}>{children}</StoreContext.Provider>;
}
export function useStore() { return useContext(StoreContext); }
