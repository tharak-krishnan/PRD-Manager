import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryForm from '../../components/CategoryForm';
import * as AuthContext from '../../context/AuthContext';
import * as DataContext from '../../context/DataContext';

describe('CategoryForm', () => {
  const mockUpdateCategory = vi.fn();
  const mockOnCancel = vi.fn();

  const mockAuthContext = {
    user: { id: 2, username: 'pm', email: 'pm@test.com', role: 'product_manager' as const },
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    hasRole: vi.fn(),
    canEditFeature: vi.fn(),
  };

  const mockDataContext = {
    categories: [
      {
        id: 'cat-1',
        name: 'Existing Category',
        description: 'Existing Description',
        project_id: 1,
        features: [],
      },
    ],
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
    updateCategory: mockUpdateCategory,
    deleteCategory: vi.fn(),
    selectCategory: vi.fn(),
    refreshCategories: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue(mockAuthContext);
    vi.spyOn(DataContext, 'useData').mockReturnValue(mockDataContext);
  });

  it('renders category form with pre-populated fields', () => {
    render(
      <BrowserRouter>
        <CategoryForm categoryId="cat-1" onCancel={mockOnCancel} />
      </BrowserRouter>
    );

    expect(screen.getByDisplayValue('Existing Category')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
  });

  it('calls updateCategory when form is submitted', () => {
    render(
      <BrowserRouter>
        <CategoryForm categoryId="cat-1" onCancel={mockOnCancel} />
      </BrowserRouter>
    );

    const nameInput = screen.getByDisplayValue('Existing Category');
    fireEvent.change(nameInput, { target: { value: 'Updated Category' } });

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    expect(mockUpdateCategory).toHaveBeenCalledWith('cat-1', {
      name: 'Updated Category',
      description: 'Existing Description',
    });
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <BrowserRouter>
        <CategoryForm categoryId="cat-1" onCancel={mockOnCancel} />
      </BrowserRouter>
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockUpdateCategory).not.toHaveBeenCalled();
  });

  it('returns null when category is not found', () => {
    render(
      <BrowserRouter>
        <CategoryForm categoryId="nonexistent" onCancel={mockOnCancel} />
      </BrowserRouter>
    );

    // Component should return null, so no form elements should be present
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
  });
});
