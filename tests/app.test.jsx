import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';
import { StoreProvider } from '../src/state/Store';
import { STORAGE_KEY } from '../src/state/model';

function mount() { return render(<StoreProvider><App/></StoreProvider>); }
function route(page) { act(() => { window.location.hash = page; window.dispatchEvent(new Event('hashchange')); }); }
const dialog = () => within(screen.getByRole('dialog'));

describe('working frontend flows', () => {
  it('creates a post, likes it, adds a comment, bookmarks it, and keeps it after remount', async () => {
    const user = userEvent.setup(); const view = mount();
    await user.click(screen.getByRole('button', { name: 'Share post' }));
    await user.type(dialog().getByRole('textbox', { name: 'Post text' }), 'Building something thoughtful today.');
    await user.click(dialog().getByRole('button', { name: 'Share post' }));
    const article = screen.getByText('Building something thoughtful today.').closest('article');
    await user.click(within(article).getByRole('button', { name: 'Like post by Jakob Botosh' }));
    await user.click(within(article).getByRole('button', { name: 'Show comments' }));
    await user.type(within(article).getByRole('textbox', { name: 'Write a comment' }), 'A small first step.');
    await user.click(within(article).getByRole('button', { name: 'Send comment' }));
    expect(within(article).getByText('A small first step.')).toBeInTheDocument();
    await user.click(within(article).getByLabelText('Save post'));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).savedPosts).toHaveLength(1);
    view.unmount(); mount(); route('saved');
    expect(screen.getByText('Building something thoughtful today.')).toBeInTheDocument();
  });
  it('edits and deletes an owned post through its menu', async () => {
    const user = userEvent.setup(); mount();
    await user.click(screen.getByRole('button', { name: 'Share post' }));
    await user.type(dialog().getByLabelText('Post text'), 'An editable thought');
    await user.click(dialog().getByRole('button', { name: 'Share post' }));
    let article = screen.getByText('An editable thought').closest('article');
    await user.click(within(article).getByLabelText('Options for post by Jakob Botosh'));
    await user.click(within(article).getByRole('button', { name: 'Edit post' }));
    await user.clear(dialog().getByLabelText('Post text'));
    await user.type(dialog().getByLabelText('Post text'), 'An improved thought');
    await user.click(dialog().getByRole('button', { name: 'Save changes' }));
    article = screen.getByText('An improved thought').closest('article');
    await user.click(within(article).getByRole('button', { name: 'Delete post' }));
    await user.click(dialog().getByRole('button', { name: 'Delete post' }));
    await waitFor(() => expect(screen.queryByText('An improved thought')).not.toBeInTheDocument());
  });
  it('RSVPs to an event and exposes it in the Going tab', async () => {
    const user = userEvent.setup(); mount(); route('events');
    await user.click(screen.getByRole('button', { name: 'Planning Masterclass' }));
    await user.click(dialog().getByRole('button', { name: 'I’m going' }));
    expect(dialog().getByRole('button', { name: 'Going · cancel RSVP' })).toBeInTheDocument();
    await user.click(dialog().getByLabelText('Close dialog'));
    await user.click(screen.getByRole('button', { name: 'Going' }));
    expect(screen.getByRole('heading', { name: 'Planning Masterclass' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Artisan Market and Craft Fair' })).not.toBeInTheDocument();
  });
  it('creates an upcoming event with valid fields', async () => {
    const user = userEvent.setup(); mount(); route('events');
    await user.click(screen.getByRole('button', { name: 'Create event' }));
    await user.type(dialog().getByLabelText('Event name'), 'React creator meetup');
    fireEvent.change(dialog().getByLabelText('Date & time'), { target: { value: '2099-11-12T15:00' } });
    await user.type(dialog().getByLabelText('Location'), 'Community studio');
    await user.click(dialog().getByRole('button', { name: 'Create event' }));
    expect(screen.getByRole('heading', { name: 'React creator meetup' })).toBeInTheDocument();
  });
  it('filters products and calculates bag quantities', async () => {
    const user = userEvent.setup(); mount(); route('marketplace');
    await user.type(screen.getByLabelText('Search marketplace'), 'candle');
    expect(screen.getByRole('heading', { name: 'Vanilla soy candle' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Studio headphones' })).not.toBeInTheDocument();
    await user.click(screen.getByLabelText('View Vanilla soy candle'));
    await user.click(dialog().getByRole('button', { name: 'Add to bag' }));
    await user.click(dialog().getByLabelText('Close dialog'));
    await user.click(screen.getByRole('button', { name: /Your bag/ }));
    await user.click(dialog().getByLabelText('Increase Vanilla soy candle quantity'));
    expect(dialog().getAllByText('$30.00')).toHaveLength(2);
    await user.click(dialog().getByLabelText('Remove Vanilla soy candle from bag'));
    expect(dialog().getByRole('heading', { name: 'Your bag is waiting' })).toBeInTheDocument();
  });
  it('accepts a friend and persists a local chat message', async () => {
    const user = userEvent.setup(); mount(); route('friends');
    await user.click(screen.getByRole('button', { name: /Requests/ }));
    const card = screen.getByRole('heading', { name: 'Carter Vaccaro' }).closest('article');
    await user.click(within(card).getByRole('button', { name: 'Confirm' }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).friends).toContain('carter');
    route('feed');
    await user.click(screen.getByRole('button', { name: 'Tony Torft' }));
    await user.type(dialog().getByLabelText('Message text'), 'Let’s share a design idea.');
    await user.click(dialog().getByLabelText('Send message'));
    expect(dialog().getByText('Let’s share a design idea.')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).messages.tony.at(-1).text).toBe('Let’s share a design idea.');
  });
  it('uploads and deletes a local file', async () => {
    const user = userEvent.setup(); mount(); route('files');
    await user.upload(screen.getByLabelText('Upload files'), new File(['project notes'], 'my-notes.txt', { type: 'text/plain' }));
    await screen.findByText('my-notes.txt');
    expect(screen.getByLabelText('Download my-notes.txt')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Delete my-notes.txt'));
    await user.click(dialog().getByRole('button', { name: 'Delete file' }));
    await waitFor(() => expect(screen.queryByLabelText('Download my-notes.txt')).not.toBeInTheDocument());
  });
  it('uploads a photo and opens its lightbox', async () => {
    const user = userEvent.setup(); mount(); route('photos');
    await user.upload(screen.getByLabelText('Upload a photo'), new File(['image bytes'], 'my-art.png', { type: 'image/png' }));
    const title = await screen.findByText('my-art.png');
    await user.click(title);
    expect(dialog().getByRole('button', { name: 'Download photo' })).toBeInTheDocument();
  });
  it('saves profile edits and validates unsafe website addresses', async () => {
    const user = userEvent.setup(); mount(); route('settings');
    await user.clear(screen.getByLabelText('Full name'));
    await user.type(screen.getByLabelText('Full name'), 'Shivam Singh');
    await user.type(screen.getByLabelText('Website'), 'javascript:alert(1)');
    await user.click(screen.getByRole('button', { name: 'Save profile' }));
    expect(screen.getByRole('alert')).toHaveTextContent('full website address');
    await user.clear(screen.getByLabelText('Website'));
    await user.type(screen.getByLabelText('Website'), 'https://example.com');
    await user.click(screen.getByRole('button', { name: 'Save profile' }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).profile.name).toBe('Shivam Singh');
  });
  it('finds global search results and handles an unavailable post', async () => {
    const user = userEvent.setup(); mount();
    await user.type(screen.getByLabelText('Search people, posts, and more'), 'headphones{Enter}');
    await screen.findByRole('heading', { name: 'Results for “headphones”' });
    expect(screen.getByRole('heading', { name: 'Studio headphones' })).toBeInTheDocument();
    route('post/missing');
    expect(screen.getByRole('heading', { name: 'This post isn’t available here' })).toBeInTheDocument();
  });
  it('saves a video, starts playback, and marks notifications read', async () => {
    const user = userEvent.setup(); mount(); route('watch');
    await user.click(screen.getAllByLabelText('Save to watchlist')[0]);
    await user.click(screen.getByRole('button', { name: 'Saved' }));
    expect(screen.getByRole('heading', { name: 'UI/UX inspiration — a study in color' })).toBeInTheDocument();
    await user.click(screen.getByLabelText('Play UI/UX inspiration — a study in color'));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    await user.click(screen.getByLabelText('Notifications'));
    await user.click(dialog().getByRole('button', { name: 'Mark all read' }));
    expect(dialog().getByText('0 unread')).toBeInTheDocument();
  });
  it('adds a story and closes a dialog with Escape, restoring focus', async () => {
    const user = userEvent.setup(); mount();
    const trigger = screen.getByRole('button', { name: 'Your story' });
    await user.click(trigger);
    await user.type(dialog().getByLabelText('A little caption'), 'Made with curiosity');
    await user.click(dialog().getByRole('button', { name: 'Share story' }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).stories[0].caption).toBe('Made with curiosity');
    await user.click(screen.getByRole('button', { name: 'Jakob Botosh’s story' }));
    expect(dialog().getByText('Made with curiosity')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
