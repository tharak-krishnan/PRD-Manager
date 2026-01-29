import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FeatureTable from '../components/FeatureTable';
import Roadmap from '../components/Roadmap';
import CategoryForm from '../components/CategoryForm';
import ProjectSelectionScreen from '../components/ProjectSelectionScreen';
import { useData } from '../context/DataContext';
import { EditIcon, Trash2Icon, FileSpreadsheet, FileText, Upload } from 'lucide-react';
import { apiClient } from '../services/api';
const Dashboard: React.FC = () => {
  const {
    selectedProjectId,
    categories,
    selectedCategoryId,
    deleteCategory
  } = useData();
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  // const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all features in this category.')) {
      deleteCategory(id);
    }
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    setExportError(null);

    try {
      const blob = await apiClient.exportPrdExcel();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prd_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setExportError(error.response?.data?.error || 'Failed to export to Excel');
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportWord = async () => {
    setIsExportingWord(true);
    setExportError(null);

    try {
      const blob = await apiClient.exportPrdWord();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prd_${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setExportError(error.response?.data?.error || 'Failed to export to Word');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setExportError(null);
    setImportSuccess(null);

    try {
      const result = await apiClient.importPrdExcel(file);
      setImportSuccess(`Successfully imported ${result.categories_imported} categories and ${result.features_imported} features`);

      // Reload the page to show the imported data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setExportError(error.response?.data?.error || 'Failed to import Excel file');
    } finally {
      setIsImporting(false);
      // Reset the file input
      event.target.value = '';
    }
  };
  return <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {selectedProjectId === null ? (
        <ProjectSelectionScreen />
      ) : (
      <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
        {/* Header with export and category buttons - only show when category is selected */}
        {selectedCategoryId && (
          <div className="mb-6 flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={handleExportExcel}
                disabled={isExportingExcel || categories.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isExportingExcel || categories.length === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <FileSpreadsheet size={16} />
                {isExportingExcel ? 'Exporting...' : 'Export to Excel'}
              </button>
              <button
                onClick={handleExportWord}
                disabled={isExportingWord || categories.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isExportingWord || categories.length === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <FileText size={16} />
                {isExportingWord ? 'Exporting...' : 'Export to Word'}
              </button>
              <label
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isImporting
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                <Upload size={16} />
                {isImporting ? 'Importing...' : 'Import from Excel'}
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleImportExcel}
                  disabled={isImporting}
                  className="hidden"
                />
              </label>
            </div>
            {editingCategoryId !== selectedCategoryId && (
              <div className="flex space-x-2">
                <button onClick={() => setEditingCategoryId(selectedCategoryId)} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 transition-colors flex items-center">
                  <EditIcon size={16} className="mr-1.5" />
                  Edit Category
                </button>
                <button onClick={() => handleDeleteCategory(selectedCategoryId)} className="px-3 py-1.5 bg-gray-800 border border-red-900/50 rounded-md text-red-400 hover:bg-red-900/30 transition-colors flex items-center">
                  <Trash2Icon size={16} className="mr-1.5" />
                  Delete Category
                </button>
              </div>
            )}
          </div>
        )}
        {exportError && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-400 text-sm">
            {exportError}
          </div>
        )}
        {importSuccess && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-700/50 rounded-lg text-green-400 text-sm">
            {importSuccess}
          </div>
        )}
        {selectedCategoryId && <>
            {editingCategoryId === selectedCategoryId && <CategoryForm categoryId={selectedCategoryId} onCancel={() => setEditingCategoryId(null)} />}
            <FeatureTable categoryId={selectedCategoryId} />
          </>}
        {!selectedCategoryId && <Roadmap />}
      </div>
      )}
    </div>;
};
export default Dashboard;