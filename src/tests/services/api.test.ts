import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../../services/api';

describe('API Client', () => {
  let mockPost: any;
  let mockGet: any;
  let mockPut: any;
  let mockDelete: any;

  beforeEach(() => {
    // Spy on the private client methods
    mockPost = vi.spyOn((apiClient as any).client, 'post');
    mockGet = vi.spyOn((apiClient as any).client, 'get');
    mockPut = vi.spyOn((apiClient as any).client, 'put');
    mockDelete = vi.spyOn((apiClient as any).client, 'delete');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication', () => {
    it('registers a user', async () => {
      const mockResponse = { data: { user: { id: 1 }, access_token: 'token' } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await apiClient.register('user', 'email@test.com', 'pass');

      expect(mockPost).toHaveBeenCalledWith('/auth/register', {
        username: 'user',
        email: 'email@test.com',
        password: 'pass',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('logs in a user', async () => {
      const mockResponse = { data: { user: { id: 1 }, access_token: 'test-token' } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await apiClient.login('user', 'pass');

      expect(mockPost).toHaveBeenCalledWith('/auth/login', { username: 'user', password: 'pass' });
      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'test-token');
      expect(result).toEqual(mockResponse.data);
    });

    it('gets current user', async () => {
      const mockResponse = { data: { id: 1, username: 'user' } };
      mockGet.mockResolvedValue(mockResponse);

      const result = await apiClient.getCurrentUser();

      expect(mockGet).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Categories', () => {
    it('gets categories', async () => {
      const mockResponse = { data: [{ id: '1', name: 'Cat1' }] };
      mockGet.mockResolvedValue(mockResponse);

      const result = await apiClient.getCategories();

      expect(mockGet).toHaveBeenCalledWith('/categories');
      expect(result).toEqual(mockResponse.data);
    });

    it('creates a category', async () => {
      const mockResponse = { data: { id: '1', name: 'New Cat' } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await apiClient.createCategory('New Cat', 'Description');

      expect(mockPost).toHaveBeenCalledWith('/categories', { name: 'New Cat', description: 'Description' });
      expect(result).toEqual(mockResponse.data);
    });

    it('updates a category', async () => {
      const mockResponse = { data: { id: '1', name: 'Updated' } };
      mockPut.mockResolvedValue(mockResponse);

      const result = await apiClient.updateCategory('1', { name: 'Updated' });

      expect(mockPut).toHaveBeenCalledWith('/categories/1', { name: 'Updated' });
      expect(result).toEqual(mockResponse.data);
    });

    it('deletes a category', async () => {
      const mockResponse = { data: {} };
      mockDelete.mockResolvedValue(mockResponse);

      const result = await apiClient.deleteCategory('1');

      expect(mockDelete).toHaveBeenCalledWith('/categories/1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Features', () => {
    it('creates a feature', async () => {
      const mockResponse = { data: { id: 'F-001' } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await apiClient.createFeature('cat1', { title: 'Feature' });

      expect(mockPost).toHaveBeenCalledWith('/categories/cat1/features', { title: 'Feature' });
      expect(result).toEqual(mockResponse.data);
    });

    it('updates a feature', async () => {
      const mockResponse = { data: { id: 'F-001', title: 'Updated' } };
      mockPut.mockResolvedValue(mockResponse);

      const result = await apiClient.updateFeature('F-001', { title: 'Updated' });

      expect(mockPut).toHaveBeenCalledWith('/features/F-001', { title: 'Updated' });
      expect(result).toEqual(mockResponse.data);
    });

    it('deletes a feature', async () => {
      const mockResponse = { data: {} };
      mockDelete.mockResolvedValue(mockResponse);

      const result = await apiClient.deleteFeature('F-001');

      expect(mockDelete).toHaveBeenCalledWith('/features/F-001');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Exports', () => {
    it('exports roadmap to PowerPoint', async () => {
      const mockBlob = new Blob(['pptx']);
      const mockResponse = { data: mockBlob };
      mockPost.mockResolvedValue(mockResponse);

      const result = await apiClient.exportRoadmapPptx();

      expect(mockPost).toHaveBeenCalledWith('/export/roadmap/pptx', {}, { responseType: 'blob' });
      expect(result).toEqual(mockBlob);
    });

    it('exports PRD to Excel', async () => {
      const mockBlob = new Blob(['xlsx']);
      const mockResponse = { data: mockBlob };
      mockPost.mockResolvedValue(mockResponse);

      const result = await apiClient.exportPrdExcel();

      expect(mockPost).toHaveBeenCalledWith('/export/prd/excel', {}, { responseType: 'blob' });
      expect(result).toEqual(mockBlob);
    });

    it('exports PRD to Word', async () => {
      const mockBlob = new Blob(['docx']);
      const mockResponse = { data: mockBlob };
      mockPost.mockResolvedValue(mockResponse);

      const result = await apiClient.exportPrdWord();

      expect(mockPost).toHaveBeenCalledWith('/export/prd/word', {}, { responseType: 'blob' });
      expect(result).toEqual(mockBlob);
    });

    it('imports PRD from Excel', async () => {
      const mockFile = new File(['content'], 'test.xlsx');
      const mockResponse = { data: { message: 'Imported' } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await apiClient.importPrdExcel(mockFile);

      expect(mockPost).toHaveBeenCalled();
      const callArgs = mockPost.mock.calls[0];
      expect(callArgs[0]).toBe('/import/prd/excel');
      expect(callArgs[1]).toBeInstanceOf(FormData);
      expect(result).toEqual(mockResponse.data);
    });
  });
});
