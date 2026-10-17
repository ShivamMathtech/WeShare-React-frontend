import { describe, expect, it } from 'vitest';
import { createInitialState, products } from '../src/state/data';
import { cartTotal, filterProducts, loadState, reducer } from '../src/state/model';

describe('persistent social state', () => {
  it('creates, comments on, edits, and deletes an owned post', () => {
    let s = createInitialState();
    const post = { id: 'mine', author: 'me', text: 'First thought', comments: [] };
    s = reducer(s, { type: 'POST_CREATE', payload: post });
    s = reducer(s, { type: 'POST_COMMENT', payload: { postId: 'mine', comment: { id: 'c', text: 'A reply', author: 'me' } } });
    s = reducer(s, { type: 'POST_EDIT', payload: { id: 'mine', text: 'Updated', audience: 'Friends' } });
    expect(s.posts[0]).toMatchObject({ text: 'Updated', audience: 'Friends', comments: [{ text: 'A reply' }] });
    s = reducer(s, { type: 'TOGGLE', payload: { key: 'savedPosts', id: 'mine' } });
    s = reducer(s, { type: 'POST_DELETE', payload: 'mine' });
    expect(s.posts.some(p => p.id === 'mine')).toBe(false);
    expect(s.savedPosts).not.toContain('mine');
  });
  it('does not edit or delete another creator’s post', () => {
    const s = createInitialState();
    const edited = reducer(s, { type: 'POST_EDIT', payload: { id: 'post-1', text: 'Unexpected' } });
    const deleted = reducer(s, { type: 'POST_DELETE', payload: 'post-1' });
    expect(edited.posts[0].text).toBe(s.posts[0].text);
    expect(deleted.posts).toHaveLength(s.posts.length);
  });
  it('toggles likes without accumulating duplicates', () => {
    let s = createInitialState();
    const action = { type: 'TOGGLE', payload: { key: 'likedPosts', id: 'post-1' } };
    s = reducer(s, action); expect(s.likedPosts).toEqual(['post-1']);
    s = reducer(s, action); expect(s.likedPosts).toEqual([]);
    expect(s.posts[0].likes).toBe(30);
  });
  it('accepts a friend request idempotently', () => {
    let s = createInitialState(); const action = { type: 'FRIEND_ACCEPT', payload: 'carter' };
    s = reducer(reducer(s, action), action);
    expect(s.friendRequests).not.toContain('carter');
    expect(s.friends.filter(id => id === 'carter')).toHaveLength(1);
    expect(s.following).toContain('carter');
  });
  it('keeps messages isolated by conversation', () => {
    const s = createInitialState();
    const updated = reducer(s, { type: 'MESSAGE_SEND', payload: { person: 'tony', message: { text: 'Hello', author: 'me' } } });
    expect(updated.messages.tony.at(-1).text).toBe('Hello');
    expect(updated.messages.cameron).toEqual(s.messages.cameron);
  });
  it('recovers from invalid saved JSON and inaccessible storage', () => {
    expect(loadState({ getItem: () => '{bad json' }).error).toBeTruthy();
    expect(loadState({ getItem: () => { throw new Error(); } }).state.posts.length).toBeGreaterThan(0);
    expect(loadState({ getItem: () => null }).error).toBe('');
  });
  it('loads a previous session and rejects invalid collection types', () => {
    const s = createInitialState(); s.profile.name = 'Shivam Singh';
    expect(loadState({ getItem: () => JSON.stringify(s) }).state.profile.name).toBe('Shivam Singh');
    s.cart = 'invalid';
    expect(loadState({ getItem: () => JSON.stringify(s) }).error).toBeTruthy();
  });
});
describe('marketplace', () => {
  it('combines search, category, price, condition, location, and verification filters', () => {
    const list = filterProducts(products, { query: 'head', category: 'Electronics', maxPrice: '120', condition: 'Second hand', location: 'Brooklyn', verified: true });
    expect(list.map(p => p.id)).toEqual(['p11']);
    expect(filterProducts(products, { maxPrice: '0' })).toEqual([]);
  });
  it('sorts prices numerically without modifying the catalogue', () => {
    const before = products.map(p => p.id);
    const low = filterProducts(products, { sort: 'low' });
    expect(low[0].price).toBe(12.89);
    expect(low.at(-1).price).toBe(2304);
    expect(products.map(p => p.id)).toEqual(before);
  });
  it('calculates quantity changes and caps a line at ten', () => {
    let s = createInitialState();
    for (let i = 0; i < 12; i++) s = reducer(s, { type: 'CART_ADD', payload: 'p4' });
    expect(s.cart).toEqual([{ id: 'p4', quantity: 10 }]);
    expect(cartTotal(s.cart, products)).toBe(150);
    s = reducer(s, { type: 'CART_QUANTITY', payload: { id: 'p4', quantity: 0 } });
    expect(s.cart).toHaveLength(0);
  });
});
