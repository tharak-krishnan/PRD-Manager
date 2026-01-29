import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, mockCategories } from '../testUtils';
import Sidebar from '../../components/Sidebar';

// Mock useData hook
vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    projects: [{ id: 1, name: 'Test Project', description: 'Test' }],
    selectedProjectId: 1,
    categories: mockCategories,
    selectedCategoryId: null,
    selectCategory: vi.fn(),
    addCategory: vi.fn(),
  }),
}));

// Mock useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'test', role: 'admin' },
    logout: vi.fn(),
  }),
}));

describe('Sidebar Component', () => {
  it('renders PRD Manager title', () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText('PRD Manager')).toBeInTheDocument();
  });

  it('renders categories section', () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('renders roadmap button', () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText('Roadmap')).toBeInTheDocument();
  });

  it('renders help link', () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('shows add category button', () => {
    renderWithProviders(<Sidebar />);
    const addButtons = screen.getAllByRole('button');
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it('displays category list', () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });
});
