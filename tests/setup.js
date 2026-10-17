import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
Object.defineProperty(URL, 'createObjectURL', { value: vi.fn(() => 'blob:local-demo'), writable: true });
Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn(), writable: true });
Object.defineProperty(HTMLMediaElement.prototype, 'play', { value: vi.fn(() => Promise.resolve()), writable: true });
beforeEach(() => { localStorage.clear(); window.history.replaceState(null, '', '/'); });
afterEach(() => cleanup());
