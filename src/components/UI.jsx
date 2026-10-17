import { createContext, useContext, useEffect, useId, useRef } from 'react';
import { X, Check, Search, ImageOff, AlertCircle } from 'lucide-react';
import { useMediaUrl } from '../lib/media';

export const UIContext = createContext(null);
export const useUI = () => useContext(UIContext);

// Use the supplied artwork as a sprite sheet. Nothing depends on an external image host.
// [x, y, width, height] in the original 564 × 1974 reference.
export const artwork = {
  sound: [143, 204, 129, 100], bubbles: [278, 204, 129, 100],
  planning: [143, 864, 124, 64], monument: [278, 864, 129, 64],
  summer: [143, 1015, 125, 64], craft: [278, 1015, 128, 64],
  'video-color': [278, 864, 129, 64], 'video-soft': [143, 864, 124, 64],
  monitor: [144, 1641, 55, 43], watch: [212, 1641, 55, 43], drone: [281, 1641, 56, 43], candle: [349, 1641, 56, 43],
  earbuds: [144, 1740, 55, 43], chair: [212, 1740, 55, 43], charger: [281, 1740, 56, 43], shoes: [349, 1740, 56, 43],
  bag: [144, 1839, 55, 43], cap: [212, 1839, 55, 43], headphones: [281, 1839, 56, 43], perfume: [349, 1839, 56, 43],
  jakob: [144, 73, 23, 25], tony: [178, 73, 25, 25], cameron: [213, 73, 24, 25], roger: [248, 73, 24, 25],
  angel: [283, 73, 24, 25], emerson: [318, 73, 23, 25], corey: [352, 73, 24, 25], zain: [386, 73, 24, 25],
};
export function Art({ name, alt = '', className = '', style, onClick }) {
  const { url, error } = useMediaUrl(name);
  if (name?.startsWith('upload:')) {
    return url ? <img src={url} alt={alt} className={`art ${className}`} style={style} onClick={onClick} /> : <div className={`art asset-fallback ${className}`} style={style} role="img" aria-label={error || 'Loading image'}><ImageOff size={22} /><span>{error ? 'Image unavailable' : 'Loading…'}</span></div>;
  }
  const crop = artwork[name];
  if (!crop) return <div className={`art asset-fallback ${className}`} role="img" aria-label={alt || 'Image unavailable'}><ImageOff size={22}/></div>;
  return <svg className={`art ${className}`} style={style} viewBox={crop.join(' ')} preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt || name} onClick={onClick}><image href={`${import.meta.env.BASE_URL}assets/reference.jpg`} x="0" y="0" width="564" height="1974" /></svg>;
}
export function Avatar({ person, size = 36, online = false, className = '' }) {
  return <span aria-hidden="true" className={`avatar ${className}`} style={{ width: size, height: size, flex: `0 0 ${size}px` }}><Art name={person?.avatar || 'jakob'} alt={person?.name || 'Your profile'} />{online && <i className="online-dot" />}</span>;
}
export function IconButton({ label, children, className = '', ...props }) {
  return <button type="button" aria-label={label} title={label} className={`icon-button ${className}`} {...props}>{children}</button>;
}
export function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button type="button" className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}
export function Badge() { return <span className="verified" aria-label="Verified"><Check size={8} strokeWidth={3}/></span>; }
export function Empty({ icon: Icon = Search, title, children, action }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={28}/></span><h3>{title}</h3><p>{children}</p>{action}</div>;
}
export function SearchInput({ value, onChange, placeholder = 'Search', label = placeholder }) {
  return <label className="search-field"><Search size={16}/><input aria-label={label} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>{value && <button className="clear-search" type="button" aria-label={`Clear ${label.toLowerCase()}`} onClick={() => onChange('')}><X size={14}/></button>}</label>;
}
export function PageHeading({ title, subtitle, children }) {
  return <div className="page-heading"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div><div className="heading-actions">{children}</div></div>;
}
export function Modal({ title, children, onClose, wide = false, className = '' }) {
  const ref = useRef(null); const titleId = useId(); const onCloseRef = useRef(onClose); onCloseRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement; const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const nodes = () => [...ref.current.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]')].filter(el => !el.hidden && el.type !== 'file');
    (ref.current.querySelector('[data-autofocus]') || nodes()[0] || ref.current).focus();
    const onKey = e => {
      if (e.key === 'Escape') onCloseRef.current();
      if (e.key === 'Tab') {
        const list = nodes(), first = list[0], last = list[list.length - 1];
        if (!list.length) { e.preventDefault(); return; }
        if (e.shiftKey && (document.activeElement === first || !ref.current.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', onKey); if (previous?.isConnected) previous.focus(); };
  }, []);
  return <div className="modal-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className={`modal ${wide ? 'modal-wide' : ''} ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} ref={ref}><header className="modal-header"><h2 id={titleId}>{title}</h2><IconButton label="Close dialog" onClick={onClose}><X size={19}/></IconButton></header>{children}</section></div>;
}
export function ErrorNotice({ children }) { return children ? <p role="alert" className="error-notice"><AlertCircle size={17}/>{children}</p> : null; }
