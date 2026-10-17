import { useEffect, useState } from 'react';

const DB = 'weshare-media-v1';
let dbPromise;
const objectUrls = new Map();
function database() {
  if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error('This browser does not support local file storage.'));
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('assets');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => { dbPromise = undefined; reject(new Error('Local file storage is unavailable.')); };
    request.onblocked = () => reject(new Error('Close other WeShare tabs and retry.'));
  });
  return dbPromise;
}
async function transaction(mode, callback) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('assets', mode);
    const request = callback(tx.objectStore('assets'));
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(new Error('The file could not be saved. Your browser storage may be full.'));
    tx.onabort = () => reject(new Error('The file operation was interrupted. Please try again.'));
  });
}
export async function saveMedia(file, { kind = 'file', maxMB = 20 } = {}) {
  if (!file || file.size === 0) throw new Error('Choose a non-empty file.');
  if (file.size > maxMB * 1024 * 1024) throw new Error(`Choose a file smaller than ${maxMB} MB.`);
  if (kind === 'image' && !/^image\/(png|jpeg|webp|gif)$/.test(file.type)) throw new Error('Choose a PNG, JPEG, WebP, or GIF image.');
  const key = `upload:${crypto.randomUUID()}`;
  await transaction('readwrite', store => store.put(file, key));
  return key;
}
export async function getMedia(key) { return transaction('readonly', store => store.get(key)); }
export async function deleteMedia(key) {
  if (!key?.startsWith('upload:')) return;
  await transaction('readwrite', store => store.delete(key));
  if (objectUrls.has(key)) { URL.revokeObjectURL(objectUrls.get(key)); objectUrls.delete(key); }
}
export async function clearMedia() {
  await transaction('readwrite', store => store.clear());
  objectUrls.forEach(url => URL.revokeObjectURL(url)); objectUrls.clear();
}
export function useMediaUrl(key) {
  const [result, setResult] = useState({ key, url: '', error: '' });
  useEffect(() => {
    let active = true;
    if (!key?.startsWith('upload:')) return;
    if (objectUrls.has(key)) { setResult({ key, url: objectUrls.get(key), error: '' }); return; }
    getMedia(key).then(blob => {
      if (!blob) throw new Error('This upload is no longer available in this browser.');
      if (!objectUrls.has(key)) objectUrls.set(key, URL.createObjectURL(blob));
      if (active) setResult({ key, url: objectUrls.get(key), error: '' });
    }).catch(error => active && setResult({ key, url: '', error: error.message }));
    return () => { active = false; };
  }, [key]);
  return result.key === key ? result : { url: '', error: '' };
}
export async function downloadMedia(file) {
  const blob = await getMedia(file.asset);
  if (!blob) throw new Error('This file is no longer available. Please upload it again.');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = file.name;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
