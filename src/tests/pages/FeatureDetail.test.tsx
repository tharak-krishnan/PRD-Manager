import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FeatureDetail from '../../pages/FeatureDetail';
import * as AuthContext from '../../context/AuthContext';
import * as DataContext from '../../context/DataContext';

const mockCategories = [
  {
    id: 'cat-1',
    name: 'Test Category',
    description: 'Test Description',
    project_id: 1,
    features: [
      {
        id: 'feat-1',
        title: 'Test Feature',
        description: 'Feature description',
        priority: 'High' as const,
        kpi: 'Test KPI',
        customerName: 'Test Customer',
        releaseDate: '2024-01',
        engineeringComment: 'Test comment',
        engineeringComplexity: 'M' as const,
        engineeringSignoff: false,
        assignedEngineerId: 3,
        assignedEngineerName: 'engineer',
      },
    ],
  },
];

describe('FeatureDetail', () => {
  const mockAuthContext = {
    user: { id: 2, username: 'pm', email: 'pm@test.com', role: 'product_manager' as const },
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    hasRole: vi.fn(),
    canEditFeature: vi.fn(() => true),
  };

  const mockDataContext = {
    categories: mockCategories,
    addFeature: vi.fn(),
    updateFeature: vi.fn(),
    deleteFeature: vi.fn(),
    selectedProjectId: 1,
    projects: [],
    selectedCategoryId: null,
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    selectProject: vi.fn(),
    refreshProjects: vi.fn(),
    addCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    selectCategory: vi.fn(),
    refreshCategories: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue(mockAuthContext);
    vi.spyOn(DataContext, 'useData').mockReturnValue(mockDataContext);
  });

  it('renders feature details when feature exists', () => {
    render(
      <MemoryRouter initialEntries={['/feature/feat-1']}>
        <Routes>
          <Route path="/feature/:featureId" element={<FeatureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Test Feature')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('shows edit button when user has permission', () => {
    render(
      <MemoryRouter initialEntries={['/feature/feat-1']}>
        <Routes>
          <Route path="/feature/:featureId" element={<FeatureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /edit feature/i })).toBeInTheDocument();
  });

  it('does not show edit button when user lacks permission', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      ...mockAuthContext,
      user: null,
      canEditFeature: vi.fn(() => false),
    });

    render(
      <MemoryRouter initialEntries={['/feature/feat-1']}>
        <Routes>
          <Route path="/feature/:featureId" element={<FeatureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByRole('button', { name: /edit feature/i })).not.toBeInTheDocument();
  });

  it('enters edit mode when edit button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/feature/feat-1']}>
        <Routes>
          <Route path="/feature/:featureId" element={<FeatureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const editButton = screen.getByRole('button', { name: /edit feature/i });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  it('saves changes when save button is clicked', async () => {
    const mockUpdateFeature = vi.fn();
    vi.spyOn(DataContext, 'useData').mockReturnValue({
      ...mockDataContext,
      updateFeature: mockUpdateFeature,
    });

    render(
      <MemoryRouter initialEntries={['/feature/feat-1']}>
        <Routes>
          <Route path="/feature/:featureId" element={<FeatureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit feature/i });
    fireEvent.click(editButton);

    // Change the title
    const titleInput = screen.getByDisplayValue('Test Feature');
    fireEvent.change(titleInput, { target: { value: 'Updated Feature' } });

    // Save
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateFeature).toHaveBeenCalled();
    });
  });

  it('cancels editing when cancel button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/feature/feat-1']}>
        <Routes>
          <Route path="/feature/:featureId" element={<FeatureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edit feature/i });
    fireEvent.click(editButton);

    // Change the title
    const titleInput = screen.getByDisplayValue('Test Feature');
    fireEvent.change(titleInput, { target: { value: 'Updated Feature' } });

    // Cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      // Should exit edit mode and revert changes
      expect(screen.getByRole('button', { name: /edit feature/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument();
    });
  });

  it('shows not found message when feature does not exist', () => {
    render(
      <MemoryRouter initialEntries={['/feature/nonexistent']}>
        <Routes>
          <Route path="/feature/:featureId" element={<FeatureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Feature Not Found')).toBeInTheDocument();
    expect(screen.getByText(/does not exist/i)).toBeInTheDocument();
  });

  it('displays share link section', () => {
    render(
      <MemoryRouter initialEntries={['/feature/feat-1']}>
        <Routes>
          <Route path="/feature/:featureId" element={<FeatureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Share this feature:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument();
  });

  it('displays priority badge with correct color', () => {
    render(
      <MemoryRouter initialEntries={['/feature/feat-1']}>
        <Routes>
          <Route path="/feature/:featureId" element={<FeatureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const priorityBadge = screen.getByText('High Priority');
    expect(priorityBadge).toBeInTheDocument();
    expect(priorityBadge.className).toContain('text-red-400');
  });
});
