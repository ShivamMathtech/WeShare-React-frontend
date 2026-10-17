import { describe, expect, it } from 'vitest';
import { clearMedia, deleteMedia, getMedia, saveMedia } from '../src/lib/media';

describe('local upload storage', () => {
  it('stores, reads, and deletes a file in IndexedDB', async () => {
    const key = await saveMedia(new File(['a real local file'], 'notes.txt', { type: 'text/plain' }));
    expect(await getMedia(key)).toBeDefined();
    await deleteMedia(key);
    expect(await getMedia(key)).toBeUndefined();
  });
  it('rejects empty files, oversized files, and non-image uploads', async () => {
    await expect(saveMedia(new File([], 'empty.txt'))).rejects.toThrow('non-empty');
    await expect(saveMedia(new File(['hello'], 'notes.txt', { type: 'text/plain' }), { kind: 'image' })).rejects.toThrow('PNG');
    await expect(saveMedia(new File(['123456'], 'small.txt'), { maxMB: 0.000001 })).rejects.toThrow('smaller');
  });
  it('clears stored uploads when the user resets the demo', async () => {
    const key = await saveMedia(new File(['temporary'], 'temp.txt'));
    await clearMedia();
    expect(await getMedia(key)).toBeUndefined();
  });
});
