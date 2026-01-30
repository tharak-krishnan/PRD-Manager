import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { DataProvider, useData } from '../../context/DataContext';
import { apiClient } from '../../services/api';

// Mock apiClient
vi.mock('../../services/api', () => ({
  apiClient: {
    getProjects: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    getCategories: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    createFeature: vi.fn(),
    updateFeature: vi.fn(),
    deleteFeature: vi.fn(),
  },
}));

// Test component
const TestComponent = () => {
  const data = useData();
  return (
    <div>
      <div data-testid="categories">{data.categories.length}</div>
      <div data-testid="projects">{data.projects.length}</div>
      <div data-testid="selectedProjectId">{data.selectedProjectId || 'null'}</div>
      <div data-testid="isLoading">{String(data.isLoading)}</div>
      <button onClick={() => data.selectProject(1)}>SelectProject</button>
      <button onClick={() => data.addCategory({ name: 'New', description: 'Desc' })}>Add</button>
      <button onClick={() => data.updateCategory('1', { name: 'Updated' })}>Update</button>
      <button onClick={() => data.deleteCategory('1')}>Delete</button>
      <button onClick={() => data.selectCategory('2')}>Select</button>
      <button onClick={() => data.addFeature('1', { title: 'F' })}>AddF</button>
      <button onClick={() => data.updateFeature('1', 'F-001', { title: 'U' })}>UpdateF</button>
      <button onClick={() => data.deleteFeature('1', 'F-001')}>DeleteF</button>
      <button onClick={() => data.refreshCategories()}>Refresh</button>
    </div>
  );
};

describe('DataContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('throws error when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useData must be used within a DataProvider');
    spy.mockRestore();
  });

  it('renders children when data is loaded', async () => {
    const mockProjects = [{ id: 1, name: 'Project 1', description: 'Desc' }];
    const mockCategories = [{ id: '1', name: 'Cat1', description: 'Desc1', features: [], project_id: 1 }];

    // Configure localStorage mock to return token
    vi.mocked(localStorage.getItem).mockReturnValue('token');
    vi.mocked(apiClient.getProjects).mockResolvedValue(mockProjects);
    vi.mocked(apiClient.getCategories).mockResolvedValue(mockCategories);

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    // Wait for getProjects to be called and complete
    await waitFor(() => {
      expect(apiClient.getProjects).toHaveBeenCalled();
    });

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByTestId('projects')).toHaveTextContent('1');
    }, { timeout: 3000 });
  });

  it('calls all CRUD methods', async () => {
    const mockProjects = [{ id: 1, name: 'Project 1', description: 'Desc' }];
    const mockCategories = [{ id: '1', name: 'Cat1', description: 'Desc1', features: [], project_id: 1 }];
    // Configure localStorage mock to return token
    vi.mocked(localStorage.getItem).mockReturnValue('token');
    vi.mocked(apiClient.getProjects).mockResolvedValue(mockProjects);
    vi.mocked(apiClient.getCategories).mockResolvedValue(mockCategories);
    vi.mocked(apiClient.createCategory).mockResolvedValue({ id: '2', name: 'New', description: 'Desc', features: [], project_id: 1 });
    vi.mocked(apiClient.updateCategory).mockResolvedValue({});
    vi.mocked(apiClient.deleteCategory).mockResolvedValue({});
    vi.mocked(apiClient.createFeature).mockResolvedValue({});
    vi.mocked(apiClient.updateFeature).mockResolvedValue({});
    vi.mocked(apiClient.deleteFeature).mockResolvedValue({});

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
    });

    // Select project first
    await act(async () => {
      screen.getByText('SelectProject').click();
    });
    await waitFor(() => {
      expect(screen.getByTestId('selectedProjectId')).toHaveTextContent('1');
    });

    // Test all methods
    await act(async () => {
      screen.getByText('Add').click();
    });
    await waitFor(() => expect(apiClient.createCategory).toHaveBeenCalled());

    await act(async () => {
      screen.getByText('Update').click();
    });
    await waitFor(() => expect(apiClient.updateCategory).toHaveBeenCalled());

    await act(async () => {
      screen.getByText('Delete').click();
    });
    await waitFor(() => expect(apiClient.deleteCategory).toHaveBeenCalled());

    await act(async () => {
      screen.getByText('Select').click();
    });

    await act(async () => {
      screen.getByText('AddF').click();
    });
    await waitFor(() => expect(apiClient.createFeature).toHaveBeenCalled());

    await act(async () => {
      screen.getByText('UpdateF').click();
    });
    await waitFor(() => expect(apiClient.updateFeature).toHaveBeenCalled());

    await act(async () => {
      screen.getByText('DeleteF').click();
    });
    await waitFor(() => expect(apiClient.deleteFeature).toHaveBeenCalled());

    vi.clearAllMocks();
    await act(async () => {
      screen.getByText('Refresh').click();
    });
    await waitFor(() => expect(apiClient.getCategories).toHaveBeenCalled());
  });

  it('handles errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Configure localStorage mock to return token
    vi.mocked(localStorage.getItem).mockReturnValue('token');
    vi.mocked(apiClient.getProjects).mockRejectedValue(new Error('Failed'));

    render(
      <DataProvider>
        <div data-testid="child">Test</div>
      </DataProvider>
    );

    // Wait a bit for the error to be caught
    await new Promise(resolve => setTimeout(resolve, 100));

    consoleSpy.mockRestore();
  });

  it('skips fetching when not authenticated', () => {
    // Reset localStorage mock to return null (no token)
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    vi.mocked(apiClient.getProjects).mockResolvedValue([]);
    vi.mocked(apiClient.getCategories).mockResolvedValue([]);

    render(
      <DataProvider>
        <div data-testid="child">Child</div>
      </DataProvider>
    );

    // Should not call API when no token
    expect(apiClient.getProjects).not.toHaveBeenCalled();
    expect(apiClient.getCategories).not.toHaveBeenCalled();
  });
});
