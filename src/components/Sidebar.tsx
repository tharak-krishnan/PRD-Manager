import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { canManageUsers } from '../utils/permissions';
import { PlusIcon, FolderIcon, BarChartIcon, HelpCircle, ChevronLeft, ChevronRight, Users, LogOut, X, CheckSquare } from 'lucide-react';
import ProjectSelector from './ProjectSelector';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const {
    selectedProjectId,
    categories,
    selectedCategoryId,
    selectCategory,
    addCategory
  } = useData();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleSelectCategory = (id: string) => {
    selectCategory(id);
    setShowRoadmap(false);
    // Navigate to dashboard to show the selected category
    if (location.pathname !== '/') {
      navigate('/');
    }
    // Close mobile menu when selecting a category
    if (onClose) onClose();
  };

  const handleShowRoadmap = () => {
    setShowRoadmap(true);
    selectCategory(null);
    // Navigate to dashboard to show the roadmap
    if (location.pathname !== '/') {
      navigate('/');
    }
    // Close mobile menu when showing roadmap
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 h-full bg-gray-800 border-r border-gray-700 p-4 flex flex-col
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Main navigation"
      >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-100">PRD Manager</h2>
          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-100"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          )}
        </div>
        {user && (
          <div className="px-3 py-2 bg-gray-700/50 rounded-md border border-gray-600">
            <div className="text-xs text-gray-400 mb-1">Logged in as</div>
            <div className="text-sm font-medium text-gray-200">{user.username}</div>
            <div className="text-xs text-blue-400 mt-1 capitalize">
              {user.role.replace('_', ' ')}
            </div>
          </div>
        )}
      </div>

      {/* Project Selector */}
      <ProjectSelector />

      {/* Categories Section - only show when project is selected */}
      {selectedProjectId !== null ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase">
              Categories
            </h3>
            <button onClick={() => setIsAddingCategory(true)} className="text-gray-400 hover:text-blue-400 transition-colors">
              <PlusIcon size={18} />
            </button>
          </div>
      {isAddingCategory && <div className="mb-4 flex flex-col space-y-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleAddCategory();
              } else if (e.key === 'Escape') {
                setIsAddingCategory(false);
                setNewCategoryName('');
              }
            }}
            placeholder="Category name"
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="New category name"
            autoFocus
          />
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
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center px-2">
          <p className="text-sm text-gray-500">Select a project to view categories</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700 space-y-1">
        <button onClick={handleShowRoadmap} className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors ${showRoadmap ? 'bg-blue-900/50 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}`}>
          <BarChartIcon size={18} className="mr-2" />
          <span>Roadmap</span>
        </button>
        {user && user.role === 'engineer' && (
          <Link
            to="/my-tasks"
            className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors block ${
              location.pathname === '/my-tasks'
                ? 'bg-blue-900/50 text-blue-400'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={onClose}
          >
            <CheckSquare size={18} className="mr-2" />
            <span>My Tasks</span>
          </Link>
        )}
        {user && canManageUsers(user.role) && (
          <Link to="/users" className="w-full text-left px-3 py-2 rounded-md flex items-center transition-colors text-gray-300 hover:bg-gray-700 block">
            <Users size={18} className="mr-2" />
            <span>Users</span>
          </Link>
        )}
        <Link to="/help" className="w-full text-left px-3 py-2 rounded-md flex items-center transition-colors text-gray-300 hover:bg-gray-700 block">
          <HelpCircle size={18} className="mr-2" />
          <span>Help</span>
        </Link>
        <button onClick={logout} className="w-full text-left px-3 py-2 rounded-md flex items-center transition-colors text-gray-300 hover:bg-gray-700">
          <LogOut size={18} className="mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
};
export default Sidebar;