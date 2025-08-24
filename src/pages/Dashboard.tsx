import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FeatureTable from '../components/FeatureTable';
import Roadmap from '../components/Roadmap';
import CategoryForm from '../components/CategoryForm';
import { useData } from '../context/DataContext';
import { EditIcon, Trash2Icon } from 'lucide-react';
const Dashboard: React.FC = () => {
  const {
    categories,
    selectedCategoryId,
    deleteCategory
  } = useData();
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all features in this category.')) {
      deleteCategory(id);
    }
  };
  return <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
        {selectedCategoryId && <>
            {editingCategoryId === selectedCategoryId ? <CategoryForm categoryId={selectedCategoryId} onCancel={() => setEditingCategoryId(null)} /> : <div className="mb-4 flex justify-end space-x-2">
                <button onClick={() => setEditingCategoryId(selectedCategoryId)} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 transition-colors flex items-center">
                  <EditIcon size={16} className="mr-1.5" />
                  Edit Category
                </button>
                <button onClick={() => handleDeleteCategory(selectedCategoryId)} className="px-3 py-1.5 bg-gray-800 border border-red-900/50 rounded-md text-red-400 hover:bg-red-900/30 transition-colors flex items-center">
                  <Trash2Icon size={16} className="mr-1.5" />
                  Delete Category
                </button>
              </div>}
            <FeatureTable categoryId={selectedCategoryId} />
          </>}
        {!selectedCategoryId && <Roadmap />}
      </div>
    </div>;
};
export default Dashboard;