import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { CheckIcon, XIcon } from 'lucide-react';
interface CategoryFormProps {
  categoryId: string;
  onCancel: () => void;
}
const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryId,
  onCancel
}) => {
  const {
    categories,
    updateCategory
  } = useData();
  const category = categories.find(c => c.id === categoryId);
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  if (!category) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateCategory(categoryId, {
        name,
        description
      });
      onCancel();
    }
  };
  return <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 mb-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">
        Edit Category
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Category Name
          </label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={4} />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-600 transition-colors flex items-center">
            <XIcon size={16} className="mr-1.5" />
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <CheckIcon size={16} className="mr-1.5" />
            Save
          </button>
        </div>
      </form>
    </div>;
};
export default CategoryForm;