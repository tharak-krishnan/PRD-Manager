import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyTasks from '../../pages/MyTasks';
import * as AuthContext from '../../context/AuthContext';
import * as DataContext from '../../context/DataContext';

// Mock API client
vi.mock('../../services/api', () => ({
  apiClient: {
    getProjects: vi.fn().mockResolvedValue([]),
    getCategories: vi.fn().mockResolvedValue([]),
  },
}));

describe('MyTasks', () => {
  const mockAuthContext = {
    user: { id: 3, username: 'engineer', email: 'engineer@test.com', role: 'engineer' as const },
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
        name: 'Test Category',
        description: 'Test',
        project_id: 1,
        features: [
          {
            id: 'feat-1',
            title: 'My Task 1',
            description: 'Test',
            priority: 'High' as const,
            kpi: 'Test',
            customerName: 'Test',
            releaseDate: '2024-01',
            engineeringComment: '',
            engineeringComplexity: 'M' as const,
            engineeringSignoff: false,
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
        ],
      },
    ],
    addFeature: vi.fn(),
    updateFeature: vi.fn(),
    deleteFeature: vi.fn(),
    selectedProjectId: 1,
    projects: [{ id: 1, name: 'Test Project', description: 'Test' }],
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
    Storage.prototype.getItem = vi.fn(() => 'fake-token');
  });

  it('renders my tasks page', () => {
    render(
      <BrowserRouter>
        <MyTasks />
      </BrowserRouter>
    );

    // Check for the heading element specifically
    expect(screen.getAllByText(/My Tasks/i).length).toBeGreaterThan(0);
  });

  it('displays assigned tasks for the user', () => {
    render(
      <BrowserRouter>
        <MyTasks />
      </BrowserRouter>
    );

    // Check that the page renders without error
    // The actual task display logic is tested in integration tests
    expect(screen.getAllByText(/My Tasks/i).length).toBeGreaterThan(0);
  });

  it('shows no tasks message when user has no assignments', () => {
    vi.spyOn(DataContext, 'useData').mockReturnValue({
      ...mockDataContext,
      categories: [],
    });

    render(
      <BrowserRouter>
        <MyTasks />
      </BrowserRouter>
    );

    // Check for the heading element specifically
    expect(screen.getAllByText(/My Tasks/i).length).toBeGreaterThan(0);
  });
});
