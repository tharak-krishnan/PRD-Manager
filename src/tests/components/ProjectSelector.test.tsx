import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectSelector from '../../components/ProjectSelector';
import * as DataContext from '../../context/DataContext';
import * as AuthContext from '../../context/AuthContext';

describe('ProjectSelector', () => {
  const mockProjects = [
    { id: 1, name: 'Project 1', description: 'Desc 1' },
    { id: 2, name: 'Project 2', description: 'Desc 2' },
  ];

  const mockDataContext = {
    categories: [],
    addFeature: vi.fn(),
    updateFeature: vi.fn(),
    deleteFeature: vi.fn(),
    selectedProjectId: 1,
    projects: mockProjects,
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

  const mockAuthContext = {
    user: { id: 1, username: 'admin', email: 'admin@test.com', role: 'admin' as const },
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    hasRole: vi.fn((role) => role === 'admin'),
    canEditFeature: vi.fn(),
  };

  beforeEach(() => {
    vi.spyOn(DataContext, 'useData').mockReturnValue(mockDataContext);
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue(mockAuthContext);
  });

  it('renders project selector with projects', () => {
    render(<ProjectSelector />);

    expect(screen.getByText('Project 1')).toBeInTheDocument();
  });

  it('allows selecting a different project', () => {
    render(<ProjectSelector />);

    // Open the dropdown
    const selectButton = screen.getByRole('button', { name: /select project/i });
    fireEvent.click(selectButton);

    // Click on Project 2
    const project2Button = screen.getByText('Project 2');
    fireEvent.click(project2Button);

    expect(mockDataContext.selectProject).toHaveBeenCalledWith(2);
  });

  it('shows add project button for admin users', () => {
    render(<ProjectSelector />);

    // Open the dropdown first
    const selectButton = screen.getByRole('button', { name: /select project/i });
    fireEvent.click(selectButton);

    // Now the "New Project" button should be visible
    expect(screen.getByText('New Project')).toBeInTheDocument();
  });

  it('does not show add project button for non-admin users', () => {
    const nonAdminAuth = {
      ...mockAuthContext,
      user: { id: 2, username: 'user', email: 'user@test.com', role: 'engineer' as const },
      hasRole: vi.fn(() => false),
    };
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue(nonAdminAuth);

    render(<ProjectSelector />);

    // Open the dropdown
    const selectButton = screen.getByRole('button', { name: /select project/i });
    fireEvent.click(selectButton);

    // "New Project" button should not be visible for engineers
    expect(screen.queryByText('New Project')).not.toBeInTheDocument();
  });
});
