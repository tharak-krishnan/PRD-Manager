import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn((key: string) => null),
  setItem: vi.fn((key: string, value: string) => undefined),
  removeItem: vi.fn((key: string) => undefined),
  clear: vi.fn(() => undefined),
};
global.localStorage = localStorageMock as Storage;

// Mock API client
vi.mock('../services/api', () => ({
  apiClient: {
    getCategories: vi.fn(() => Promise.resolve([])),
    createCategory: vi.fn(() => Promise.resolve({ id: '1', name: 'Test', description: '', features: [] })),
    updateCategory: vi.fn(() => Promise.resolve({ id: '1', name: 'Updated', description: '', features: [] })),
    deleteCategory: vi.fn(() => Promise.resolve()),
    createFeature: vi.fn(() => Promise.resolve({ id: 'F-001', title: 'Test' })),
    updateFeature: vi.fn(() => Promise.resolve({ id: 'F-001', title: 'Updated' })),
    deleteFeature: vi.fn(() => Promise.resolve()),
  },
}));
