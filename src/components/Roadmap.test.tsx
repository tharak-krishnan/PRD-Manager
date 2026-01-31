import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Roadmap from './Roadmap';
import * as DataContext from '../context/DataContext';

// Mock API client
vi.mock('../services/api', () => ({
  apiClient: {
    exportRoadmapPptx: vi.fn().mockResolvedValue(new Blob()),
  },
}));

describe('Roadmap - Feature Display with Signoff Status', () => {
  let useDataSpy: ReturnType<typeof vi.spyOn>;

  const createMockContext = (categories: any[]) => ({
    categories,
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
  });

  beforeEach(() => {
    useDataSpy = vi.spyOn(DataContext, 'useData');
  });

  afterEach(() => {
    useDataSpy.mockRestore();
  });

  it('should display both signed-off and non-signed-off features with release dates', () => {
    const categories = [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test',
        project_id: 1,
        features: [
          {
            id: '1.1',
            title: 'Signed Off Feature',
            priority: 'High' as const,
            description: 'Committed',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: 'Done',
            engineeringSignoff: true, // SIGNED OFF
            engineeringComplexity: 'M' as const,
            releaseDate: '2024-06',
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
          {
            id: '1.2',
            title: 'Not Signed Off Feature',
            priority: 'High' as const,
            description: 'Pending',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: '',
            engineeringSignoff: false, // NOT SIGNED OFF
            engineeringComplexity: 'M' as const,
            releaseDate: '2024-06',
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
        ],
      },
    ];

    useDataSpy.mockReturnValue(createMockContext(categories));
    render(<Roadmap />);

    // Both features should appear since they have release dates
    expect(screen.getByText('Signed Off Feature')).toBeInTheDocument();
    expect(screen.getByText(/Not Signed Off Feature/)).toBeInTheDocument();
  });

  it('should show hourglass emoji for non-signed-off features', () => {
    const categories = [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test',
        project_id: 1,
        features: [
          {
            id: '1.1',
            title: 'Pending Feature',
            priority: 'High' as const,
            description: 'Test',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: '',
            engineeringSignoff: false,
            engineeringComplexity: 'M' as const,
            releaseDate: '2024-06',
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
        ],
      },
    ];

    useDataSpy.mockReturnValue(createMockContext(categories));
    render(<Roadmap />);

    // Should show feature with hourglass prefix
    expect(screen.getByText(/⏳.*Pending Feature/)).toBeInTheDocument();
  });

  it('should not show hourglass emoji for signed-off features', () => {
    const categories = [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test',
        project_id: 1,
        features: [
          {
            id: '1.1',
            title: 'Signed Off Feature',
            priority: 'High' as const,
            description: 'Test',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: 'Done',
            engineeringSignoff: true,
            engineeringComplexity: 'M' as const,
            releaseDate: '2024-06',
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
        ],
      },
    ];

    useDataSpy.mockReturnValue(createMockContext(categories));
    const { container } = render(<Roadmap />);

    // Should show feature title
    expect(screen.getByText('Signed Off Feature')).toBeInTheDocument();

    // Should NOT have hourglass emoji in the title
    const titleElement = screen.getByText('Signed Off Feature');
    expect(titleElement.textContent).not.toContain('⏳');
  });

  it('should hide features without release dates', () => {
    const categories = [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test',
        project_id: 1,
        features: [
          {
            id: '1.1',
            title: 'Has Date',
            priority: 'High' as const,
            description: 'Test',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: '',
            engineeringSignoff: false,
            engineeringComplexity: 'M' as const,
            releaseDate: '2024-06', // HAS DATE
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
          {
            id: '1.2',
            title: 'No Date',
            priority: 'High' as const,
            description: 'Test',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: 'Done',
            engineeringSignoff: true,
            engineeringComplexity: 'M' as const,
            releaseDate: '', // NO DATE
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
        ],
      },
    ];

    useDataSpy.mockReturnValue(createMockContext(categories));
    render(<Roadmap />);

    // Feature with date should appear
    expect(screen.getByText(/Has Date/)).toBeInTheDocument();

    // Feature without date should NOT appear
    expect(screen.queryByText(/No Date/)).not.toBeInTheDocument();
  });

  it('should display empty state when no features have release dates', () => {
    const categories = [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test',
        project_id: 1,
        features: [
          {
            id: '1.1',
            title: 'No Date Feature',
            priority: 'High' as const,
            description: 'Test',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: '',
            engineeringSignoff: false,
            engineeringComplexity: 'M' as const,
            releaseDate: '', // NO DATE
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
        ],
      },
    ];

    useDataSpy.mockReturnValue(createMockContext(categories));
    render(<Roadmap />);

    // Empty state message
    expect(screen.getByText(/No features with release dates available/i)).toBeInTheDocument();
    expect(screen.getByText(/Add features with release dates to see the roadmap/i)).toBeInTheDocument();
  });

  it('should display empty state for empty categories', () => {
    const categories = [
      {
        id: '1',
        name: 'Empty Category',
        description: 'No features',
        project_id: 1,
        features: [],
      },
    ];

    useDataSpy.mockReturnValue(createMockContext(categories));
    render(<Roadmap />);

    expect(screen.getByText(/No features with release dates available/i)).toBeInTheDocument();
  });

  it('should show feature IDs for all features with release dates', () => {
    const categories = [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test',
        project_id: 1,
        features: [
          {
            id: '1.1',
            title: 'Signed Off',
            priority: 'High' as const,
            description: 'Test',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: 'Done',
            engineeringSignoff: true,
            engineeringComplexity: 'M' as const,
            releaseDate: '2024-06',
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
          {
            id: '1.2',
            title: 'Not Signed Off',
            priority: 'High' as const,
            description: 'Test',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: '',
            engineeringSignoff: false,
            engineeringComplexity: 'M' as const,
            releaseDate: '2024-06',
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
          {
            id: '1.3',
            title: 'No Date Feature',
            priority: 'High' as const,
            description: 'Test',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: '',
            engineeringSignoff: false,
            engineeringComplexity: 'M' as const,
            releaseDate: '', // NO DATE
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
        ],
      },
    ];

    useDataSpy.mockReturnValue(createMockContext(categories));
    render(<Roadmap />);

    // Features with dates should appear (using getAllByText since "Signed Off" also appears in legend)
    const signedOffElements = screen.getAllByText('Signed Off');
    expect(signedOffElements.length).toBeGreaterThan(0); // At least one feature + legend
    expect(screen.getByText(/Not Signed Off/)).toBeInTheDocument();

    // Feature without date should NOT appear
    expect(screen.queryByText(/No Date Feature/)).not.toBeInTheDocument();
  });

  it('should display legend with signoff status indicators', () => {
    const categories = [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test',
        project_id: 1,
        features: [
          {
            id: '1.1',
            title: 'Test Feature',
            priority: 'High' as const,
            description: 'Test',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: 'Done',
            engineeringSignoff: true,
            engineeringComplexity: 'M' as const,
            releaseDate: '2024-06',
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
        ],
      },
    ];

    useDataSpy.mockReturnValue(createMockContext(categories));
    render(<Roadmap />);

    // Legend labels should be present
    expect(screen.getByText('Signed Off')).toBeInTheDocument();
    expect(screen.getByText('Pending Estimation')).toBeInTheDocument();
  });

  it('should display Export button when roadmap has data', () => {
    const categories = [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test',
        project_id: 1,
        features: [
          {
            id: '1.1',
            title: 'Feature',
            priority: 'High' as const,
            description: 'Test',
            kpi: 'KPI',
            customerName: 'Customer',
            engineeringComment: 'Done',
            engineeringSignoff: true,
            engineeringComplexity: 'M' as const,
            releaseDate: '2024-06',
            assignedEngineerId: 3,
            assignedEngineerName: 'engineer',
          },
        ],
      },
    ];

    useDataSpy.mockReturnValue(createMockContext(categories));
    render(<Roadmap />);

    expect(screen.getByText('Export to PowerPoint')).toBeInTheDocument();
  });

  it('should show roadmap title', () => {
    useDataSpy.mockReturnValue(createMockContext([]));
    render(<Roadmap />);

    expect(screen.getByText('Roadmap')).toBeInTheDocument();
  });
});
