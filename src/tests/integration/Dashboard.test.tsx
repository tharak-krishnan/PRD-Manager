import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../testUtils';
import userEvent from '@testing-library/user-event';
import Dashboard from '../../pages/Dashboard';
import { apiClient } from '../../services/api';

// Mock API client
vi.mock('../../services/api', () => ({
  apiClient: {
    exportPrdExcel: vi.fn(),
    exportPrdWord: vi.fn(),
    importPrdExcel: vi.fn(),
  },
}));

// Mock useData hook
const mockSelectCategory = vi.fn();
const mockDeleteCategory = vi.fn();

vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    categories: [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test description',
        features: [],
      },
    ],
    selectedCategoryId: '1',
    selectCategory: mockSelectCategory,
    deleteCategory: mockDeleteCategory,
  }),
}));

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with export buttons', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Export to Excel')).toBeInTheDocument();
    expect(screen.getByText('Export to Word')).toBeInTheDocument();
    expect(screen.getByText('Import from Excel')).toBeInTheDocument();
  });

  it('renders category action buttons when category is selected', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Edit Category')).toBeInTheDocument();
    expect(screen.getByText('Delete Category')).toBeInTheDocument();
  });

  it('calls export Excel when button is clicked', async () => {
    const user = userEvent.setup();
    const mockBlob = new Blob(['test'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    vi.mocked(apiClient.exportPrdExcel).mockResolvedValue(mockBlob);

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:test');
    global.URL.revokeObjectURL = vi.fn();

    renderWithProviders(<Dashboard />);

    const exportButton = screen.getByText('Export to Excel');
    await user.click(exportButton);

    await waitFor(() => {
      expect(apiClient.exportPrdExcel).toHaveBeenCalled();
    });
  });

  it('calls export Word when button is clicked', async () => {
    const user = userEvent.setup();
    const mockBlob = new Blob(['test'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    vi.mocked(apiClient.exportPrdWord).mockResolvedValue(mockBlob);

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:test');
    global.URL.revokeObjectURL = vi.fn();

    renderWithProviders(<Dashboard />);

    const exportButton = screen.getByText('Export to Word');
    await user.click(exportButton);

    await waitFor(() => {
      expect(apiClient.exportPrdWord).toHaveBeenCalled();
    });
  });

  it('shows delete confirmation when delete category is clicked', async () => {
    const user = userEvent.setup();
    global.confirm = vi.fn(() => true);

    renderWithProviders(<Dashboard />);

    const deleteButton = screen.getByText('Delete Category');
    await user.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(mockDeleteCategory).toHaveBeenCalledWith('1');
  });

  it('does not delete category if confirmation is cancelled', async () => {
    const user = userEvent.setup();
    global.confirm = vi.fn(() => false);

    renderWithProviders(<Dashboard />);

    const deleteButton = screen.getByText('Delete Category');
    await user.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(mockDeleteCategory).not.toHaveBeenCalled();
  });
});
