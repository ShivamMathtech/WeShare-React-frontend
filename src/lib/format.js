export const money = amount => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
export const dateLabel = date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
export const eventTime = date => new Date(date).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
export const bytes = size => size < 1024 ? `${size} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`;
export function timeAgo(date) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)} hr ago`;
  return dateLabel(date);
}
export async function copyText(text) {
  if (navigator.clipboard && globalThis.isSecureContext) return navigator.clipboard.writeText(text);
  const el = document.createElement('textarea'); el.value = text; el.style.position = 'fixed'; el.style.opacity = '0'; document.body.append(el); el.select();
  const success = document.execCommand('copy'); el.remove();
  if (!success) throw new Error('Copy is unavailable. Copy the page URL from your address bar.');
}
