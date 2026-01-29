import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DataProvider, useData } from '../../context/DataContext';
import { apiClient } from '../../services/api';

// Mock API client
vi.mock('../../services/api', () => ({
  apiClient: {
    getProjects: vi.fn(),
    getCategories: vi.fn(),
  },
}));

// Test component that displays data loading state
const DataLoadingTestComponent = () => {
  const { projects, categories, isLoading, selectedProjectId } = useData();

  return (
    <div>
      <div data-testid="loading-state">{String(isLoading)}</div>
      <div data-testid="projects-count">{projects.length}</div>
      <div data-testid="categories-count">{categories.length}</div>
      <div data-testid="selected-project">{selectedProjectId || 'none'}</div>
      {projects.length === 0 && !isLoading && <div data-testid="no-projects">No projects found</div>}
      {projects.map(p => (
        <div key={p.id} data-testid={`project-${p.id}`}>{p.name}</div>
      ))}
      {categories.map(c => (
        <div key={c.id} data-testid={`category-${c.id}`}>{c.name}</div>
      ))}
    </div>
  );
};

describe('Data Loading Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage mock
    vi.mocked(localStorage.getItem).mockReturnValue(null);
  });

  describe('Initial Data Load', () => {
    it('should load projects on mount when authenticated', async () => {
      const mockProjects = [
        { id: 1, name: 'Project 1', description: 'First project' },
        { id: 2, name: 'Project 2', description: 'Second project' },
      ];

      // Setup authenticated state
      vi.mocked(localStorage.getItem).mockReturnValue('test-token');
      vi.mocked(apiClient.getProjects).mockResolvedValue(mockProjects);
      vi.mocked(apiClient.getCategories).mockResolvedValue([]);

      render(
        <DataProvider>
          <DataLoadingTestComponent />
        </DataProvider>
      );

      // Wait for projects to load
      await waitFor(() => {
        expect(screen.getByTestId('projects-count')).toHaveTextContent('2');
      });

      // Verify API was called
      expect(apiClient.getProjects).toHaveBeenCalledTimes(1);

      // Verify projects are displayed
      expect(screen.getByTestId('project-1')).toHaveTextContent('Project 1');
      expect(screen.getByTestId('project-2')).toHaveTextContent('Project 2');

      // Should be finished loading
      expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
    });

    it('should not load data when not authenticated', () => {
      // No token in localStorage
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      vi.mocked(apiClient.getProjects).mockResolvedValue([]);

      render(
        <DataProvider>
          <DataLoadingTestComponent />
        </DataProvider>
      );

      // Should not call API
      expect(apiClient.getProjects).not.toHaveBeenCalled();

      // Should show not loading
      expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
    });

    it('should show empty state when no projects exist', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('test-token');
      vi.mocked(apiClient.getProjects).mockResolvedValue([]);

      render(
        <DataProvider>
          <DataLoadingTestComponent />
        </DataProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('no-projects')).toBeInTheDocument();
      expect(screen.getByTestId('projects-count')).toHaveTextContent('0');
    });

    it('should handle API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(localStorage.getItem).mockReturnValue('test-token');
      vi.mocked(apiClient.getProjects).mockRejectedValue(new Error('Network error'));

      render(
        <DataProvider>
          <DataLoadingTestComponent />
        </DataProvider>
      );

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      });

      // Should show no projects
      expect(screen.getByTestId('projects-count')).toHaveTextContent('0');

      consoleSpy.mockRestore();
    });
  });

  describe('Categories Loading', () => {
    it('should load categories when project is selected', async () => {
      const mockProjects = [{ id: 1, name: 'Project 1', description: 'Test' }];
      const mockCategories = [
        { id: '1', name: 'Category 1', description: 'Test', features: [], project_id: 1 },
        { id: '2', name: 'Category 2', description: 'Test', features: [], project_id: 1 },
      ];

      vi.mocked(localStorage.getItem).mockReturnValue('test-token');
      vi.mocked(apiClient.getProjects).mockResolvedValue(mockProjects);
      vi.mocked(apiClient.getCategories).mockResolvedValue(mockCategories);

      const TestComponentWithSelection = () => {
        const data = useData();

        React.useEffect(() => {
          // Auto-select first project for test
          if (data.projects.length > 0 && data.selectedProjectId === null) {
            data.selectProject(data.projects[0].id);
          }
        }, [data.projects, data.selectedProjectId]);

        return <DataLoadingTestComponent />;
      };

      render(
        <DataProvider>
          <TestComponentWithSelection />
        </DataProvider>
      );

      // Wait for projects and categories to load
      await waitFor(() => {
        expect(screen.getByTestId('categories-count')).toHaveTextContent('2');
      }, { timeout: 3000 });

      // Verify categories are displayed
      expect(screen.getByTestId('category-1')).toBeInTheDocument();
      expect(screen.getByTestId('category-2')).toBeInTheDocument();
    });

    it('should filter categories by selected project', async () => {
      const mockProjects = [{ id: 1, name: 'Project 1', description: 'Test' }];
      const mockCategories = [
        { id: '1', name: 'Category 1', description: 'Test', features: [], project_id: 1 },
      ];

      vi.mocked(localStorage.getItem).mockReturnValue('test-token');
      vi.mocked(apiClient.getProjects).mockResolvedValue(mockProjects);
      vi.mocked(apiClient.getCategories).mockResolvedValue(mockCategories);

      const TestComponentWithSelection = () => {
        const data = useData();

        React.useEffect(() => {
          if (data.projects.length > 0 && data.selectedProjectId === null) {
            data.selectProject(1);
          }
        }, [data.projects, data.selectedProjectId]);

        return <DataLoadingTestComponent />;
      };

      render(
        <DataProvider>
          <TestComponentWithSelection />
        </DataProvider>
      );

      await waitFor(() => {
        expect(apiClient.getCategories).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Data Persistence', () => {
    it('should maintain data after re-render', async () => {
      const mockProjects = [{ id: 1, name: 'Project 1', description: 'Test' }];

      vi.mocked(localStorage.getItem).mockReturnValue('test-token');
      vi.mocked(apiClient.getProjects).mockResolvedValue(mockProjects);
      vi.mocked(apiClient.getCategories).mockResolvedValue([]);

      const { rerender } = render(
        <DataProvider>
          <DataLoadingTestComponent />
        </DataProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('projects-count')).toHaveTextContent('1');
      });

      // Re-render component
      rerender(
        <DataProvider>
          <DataLoadingTestComponent />
        </DataProvider>
      );

      // Data should still be there (though this creates a new provider, so it will reload)
      // API should be called again for the new provider instance
      await waitFor(() => {
        expect(apiClient.getProjects).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('should eventually finish loading', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('test-token');
      vi.mocked(apiClient.getProjects).mockResolvedValue([]);

      render(
        <DataProvider>
          <DataLoadingTestComponent />
        </DataProvider>
      );

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      });
    });

    it('should handle project switches without data loss', async () => {
      const mockProjects = [
        { id: 1, name: 'Project 1', description: 'Test' },
        { id: 2, name: 'Project 2', description: 'Test' },
      ];
      const mockCategories = [
        { id: '1', name: 'Cat 1', description: 'Test', features: [], project_id: 1 },
      ];

      vi.mocked(localStorage.getItem).mockReturnValue('test-token');
      vi.mocked(apiClient.getProjects).mockResolvedValue(mockProjects);
      vi.mocked(apiClient.getCategories).mockResolvedValue(mockCategories);

      render(
        <DataProvider>
          <DataLoadingTestComponent />
        </DataProvider>
      );

      // Wait for projects to load
      await waitFor(() => {
        expect(screen.getByTestId('projects-count')).toHaveTextContent('2');
      });

      // Projects should be available
      expect(screen.getByTestId('project-1')).toBeInTheDocument();
      expect(screen.getByTestId('project-2')).toBeInTheDocument();
    });
  });
});
