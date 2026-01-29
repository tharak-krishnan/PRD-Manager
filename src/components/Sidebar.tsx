import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { PlusIcon, FolderIcon, BarChartIcon, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
const Sidebar: React.FC = () => {
  const {
    categories,
    selectedCategoryId,
    selectCategory,
    addCategory
  } = useData();
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({
        name: newCategoryName,
        description: 'New category description'
      });
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };
  const handleSelectCategory = (id: string) => {
    selectCategory(id);
    setShowRoadmap(false);
  };
  const handleShowRoadmap = () => {
    setShowRoadmap(true);
    selectCategory(null);
  };

  // Pagination logic
  const totalCategories = categories.length;
  const totalPages = Math.ceil(totalCategories / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return categories.slice(startIndex, endIndex);
  }, [categories, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return <div className="w-64 h-full bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-100">PRD Manager</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase">
          Categories
        </h3>
        <button onClick={() => setIsAddingCategory(true)} className="text-gray-400 hover:text-blue-400 transition-colors">
          <PlusIcon size={18} />
        </button>
      </div>
      {isAddingCategory && <div className="mb-4 flex flex-col space-y-2">
          <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Category name" className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" autoFocus />
          <div className="flex space-x-2">
            <button onClick={handleAddCategory} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
              Add
            </button>
            <button onClick={() => {
          setIsAddingCategory(false);
          setNewCategoryName('');
        }} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md text-sm hover:bg-gray-600 transition-colors">
              Cancel
            </button>
          </div>
        </div>}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {paginatedCategories.map(category => <li key={category.id}>
              <button onClick={() => handleSelectCategory(category.id)} className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors ${selectedCategoryId === category.id ? 'bg-blue-900/50 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}`} title={category.name}>
                <FolderIcon size={18} className="mr-2 flex-shrink-0" />
                <span className="truncate flex-1 min-w-0">{category.name}</span>
                <span className="ml-2 flex-shrink-0 text-xs text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded-full">
                  {category.features.length}
                </span>
              </button>
            </li>)}
        </ul>
      </div>
      {totalPages > 1 && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between px-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1 rounded transition-colors ${
                currentPage === 1
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs text-gray-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1 rounded transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-gray-700 space-y-1">
        <button onClick={handleShowRoadmap} className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors ${showRoadmap ? 'bg-blue-900/50 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}`}>
          <BarChartIcon size={18} className="mr-2" />
          <span>Roadmap</span>
        </button>
        <Link to="/help" className="w-full text-left px-3 py-2 rounded-md flex items-center transition-colors text-gray-300 hover:bg-gray-700 block">
          <HelpCircle size={18} className="mr-2" />
          <span>Help</span>
        </Link>
      </div>
    </div>;
};
export default Sidebar;