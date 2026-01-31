import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FeatureTable from './FeatureTable';
import { DataProvider } from '../context/DataContext';
import { AuthProvider } from '../context/AuthContext';

// Mock API client
vi.mock('../services/api', () => ({
  apiClient: {
    getEngineers: vi.fn().mockResolvedValue([
      { id: 3, username: 'engineer', email: 'engineer@test.com' }
    ]),
    getCategories: vi.fn().mockResolvedValue([]),
    getProjects: vi.fn().mockResolvedValue([]),
    getCurrentUser: vi.fn().mockResolvedValue({
      id: 2,
      username: 'pm',
      email: 'pm@test.com',
      role: 'product_manager'
    }),
  },
}));

const mockCategories = [
  {
    id: '1',
    name: 'Test Category',
    description: 'Test',
    project_id: 1,
    features: [
      {
        id: '1.1',
        title: 'Assigned Feature',
        priority: 'High' as const,
        description: 'Test feature with assigned engineer',
        kpi: 'Test KPI',
        customerName: 'Test Customer',
        engineeringComment: 'Test comment',
        engineeringSignoff: false,
        engineeringComplexity: 'M' as const,
        releaseDate: '2024-01',
        assignedEngineerId: 3,
        assignedEngineerName: 'engineer',
      },
      {
        id: '1.2',
        title: 'Unassigned Feature',
        priority: 'Medium' as const,
        description: 'Test feature without assigned engineer',
        kpi: 'Test KPI',
        customerName: 'Test Customer',
        engineeringComment: '',
        engineeringSignoff: false,
        engineeringComplexity: 'S' as const,
        releaseDate: '2024-02',
        assignedEngineerId: undefined,
        assignedEngineerName: undefined,
      },
    ],
  },
];

// Mock DataContext
vi.mock('../context/DataContext', async () => {
  const actual = await vi.importActual('../context/DataContext');
  return {
    ...actual,
    useData: () => ({
      categories: mockCategories,
      addFeature: vi.fn(),
      updateFeature: vi.fn(),
      deleteFeature: vi.fn(),
      selectedProjectId: 1,
    }),
  };
});

// Mock AuthContext
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: {
        id: 2,
        username: 'pm',
        email: 'pm@test.com',
        role: 'product_manager',
      },
      isAuthenticated: true,
      isLoading: false,
      hasRole: () => true,
      canEditFeature: () => true,
    }),
  };
});

describe('FeatureTable - Engineer Assignment Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('access_token', 'mock-token');
  });

  it('should display engineer name when feature is assigned', async () => {
    render(
      <BrowserRouter>
        <FeatureTable categoryId="1" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Assigned Feature')).toBeInTheDocument();
    });

    // Check that the engineer name is displayed
    expect(screen.getByText('engineer')).toBeInTheDocument();

    // Check that the label "Engineer" is displayed
    const engineerLabels = screen.getAllByText('Engineer');
    expect(engineerLabels.length).toBeGreaterThan(0);
  });

  it('should display "Unassigned" when feature has no assigned engineer', async () => {
    render(
      <BrowserRouter>
        <FeatureTable categoryId="1" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Unassigned Feature')).toBeInTheDocument();
    });

    // Check that "Unassigned" text is displayed
    expect(screen.getByText('Unassigned')).toBeInTheDocument();

    // Check that the label "Engineer" is displayed for unassigned feature too
    const engineerLabels = screen.getAllByText('Engineer');
    expect(engineerLabels.length).toBeGreaterThan(0);
  });

  it('should display "Engineer" label for both assigned and unassigned features', async () => {
    render(
      <BrowserRouter>
        <FeatureTable categoryId="1" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Assigned Feature')).toBeInTheDocument();
      expect(screen.getByText('Unassigned Feature')).toBeInTheDocument();
    });

    // Should have 2 "Engineer" labels (one for each feature)
    const engineerLabels = screen.getAllByText('Engineer');
    expect(engineerLabels).toHaveLength(2);
  });

  it('should show assigned engineer name, not User ID', async () => {
    render(
      <BrowserRouter>
        <FeatureTable categoryId="1" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Assigned Feature')).toBeInTheDocument();
    });

    // Should show "engineer" not "User #3"
    expect(screen.getByText('engineer')).toBeInTheDocument();
    expect(screen.queryByText('User #3')).not.toBeInTheDocument();
  });

  it('should render feature titles as links to detail pages', async () => {
    render(
      <BrowserRouter>
        <FeatureTable categoryId="1" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Assigned Feature')).toBeInTheDocument();
    });

    // Feature titles should be links
    const assignedFeatureLink = screen.getByText('Assigned Feature').closest('a');
    const unassignedFeatureLink = screen.getByText('Unassigned Feature').closest('a');

    expect(assignedFeatureLink).toHaveAttribute('href', '/feature/1.1');
    expect(unassignedFeatureLink).toHaveAttribute('href', '/feature/1.2');
  });
});
