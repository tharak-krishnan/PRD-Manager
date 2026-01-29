import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { App } from '../App';

// Mock DataContext to avoid API calls
vi.mock('../context/DataContext', () => ({
  DataProvider: ({ children }: any) => <div data-testid="data-provider">{children}</div>,
  useData: () => ({
    categories: [],
    isLoading: false,
    selectedCategoryId: null,
    addCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    selectCategory: vi.fn(),
    addFeature: vi.fn(),
    updateFeature: vi.fn(),
    deleteFeature: vi.fn(),
    refreshCategories: vi.fn(),
  }),
}));

// Mock Dashboard component
vi.mock('../pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

describe('App', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('data-provider')).toBeInTheDocument();
  });

  it('wraps Dashboard in DataProvider', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('dashboard')).toBeInTheDocument();
  });
});
