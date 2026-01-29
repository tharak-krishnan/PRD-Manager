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
    getEngineers: vi.fn(),
  },
}));

// Mock useData hook
const mockSelectCategory = vi.fn();
const mockDeleteCategory = vi.fn();
const mockRefreshCategories = vi.fn();

vi.mock('../../context/DataContext', () => ({
  useData: () => ({
    projects: [{ id: 1, name: 'Test Project', description: 'Test' }],
    selectedProjectId: 1,
    categories: [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test description',
        features: [],
        project_id: 1,
      },
    ],
    selectedCategoryId: '1',
    selectCategory: mockSelectCategory,
    deleteCategory: mockDeleteCategory,
    refreshCategories: mockRefreshCategories,
  }),
}));

// Mock useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'test', role: 'admin' },
    logout: vi.fn(),
  }),
}));

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock getEngineers to return empty array
    vi.mocked(apiClient.getEngineers).mockResolvedValue([]);
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

    renderWithProviders(<Dashboard />);

    const deleteButton = screen.getByText('Delete Category');
    await user.click(deleteButton);

    // Modal should appear - look for the modal by role
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click the Delete button in the modal
    const modalDeleteButton = screen.getAllByRole('button').find(btn => btn.textContent === 'Delete');
    if (modalDeleteButton) {
      await user.click(modalDeleteButton);
    }

    await waitFor(() => {
      expect(mockDeleteCategory).toHaveBeenCalledWith('1');
    });
  });

  it('does not delete category if confirmation is cancelled', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Dashboard />);

    const deleteButton = screen.getByText('Delete Category');
    await user.click(deleteButton);

    // Modal should appear - look for the modal by role
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click the Cancel button in the modal
    const cancelButton = screen.getAllByRole('button').find(btn => btn.textContent === 'Cancel');
    if (cancelButton) {
      await user.click(cancelButton);
    }

    await waitFor(() => {
      expect(mockDeleteCategory).not.toHaveBeenCalled();
    });
  });
});
