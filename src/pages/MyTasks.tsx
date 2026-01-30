import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CheckIcon, AlertCircle, Calendar, FolderIcon, Menu } from 'lucide-react';
import FeatureEditModal from '../components/FeatureEditModal';
import Sidebar from '../components/Sidebar';
import { Feature, Priority, TShirtSize, Category } from '../context/DataContext';
import { apiClient } from '../services/api';

const MyTasks: React.FC = () => {
  const { updateFeature } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchInProgressRef = useRef(false);

  // Fetch all categories across all projects for the user's tasks
  useEffect(() => {
    // Prevent concurrent fetches
    if (fetchInProgressRef.current) {
      console.log('MyTasks: Fetch already in progress, skipping');
      return;
    }

    const fetchAllCategories = async () => {
      try {
        fetchInProgressRef.current = true;
        setIsLoading(true);

        // Verify token exists
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('No access token found in localStorage');
          console.log('Available localStorage keys:', Object.keys(localStorage));
          setAllCategories([]);
          setIsLoading(false);
          return;
        }

        console.log('Token found, fetching projects...');

        // First, get all projects
        const projects = await apiClient.getProjects();
        console.log('Projects fetched successfully:', projects);

        // Ensure projects is an array
        if (!Array.isArray(projects)) {
          console.error('Projects response is not an array:', projects);
          setAllCategories([]);
          setIsLoading(false);
          return;
        }

        if (projects.length === 0) {
          console.warn('No projects found');
          setAllCategories([]);
          setIsLoading(false);
          return;
        }

        console.log(`Fetching categories for ${projects.length} project(s)...`);

        // Then, fetch categories for each project
        const allCategoriesPromises = projects.map((project: any) =>
          apiClient.getCategories(project.id)
        );

        const categoriesByProject = await Promise.all(allCategoriesPromises);
        console.log('Categories fetched for all projects:', categoriesByProject);

        const flattenedCategories = categoriesByProject.flat();
        console.log('Flattened categories count:', flattenedCategories.length);

        setAllCategories(flattenedCategories);
      } catch (error: any) {
        console.error('Failed to fetch categories:', error);
        console.error('Error response:', error.response);
        console.error('Error message:', error.message);
        if (error.response?.status === 422) {
          console.error('422 Error - Token might be invalid or expired');
          console.error('Token in localStorage:', localStorage.getItem('access_token')?.substring(0, 50));
        }
        setAllCategories([]);
      } finally {
        setIsLoading(false);
        fetchInProgressRef.current = false;
      }
    };

    if (user) {
      fetchAllCategories();
    } else {
      setIsLoading(false);
    }
  }, [user?.id]);

  if (!user) return null;

  // Get all features assigned to current user that are not signed off
  const myPendingTasks = allCategories.flatMap((category) =>
    category.features
      .filter(
        (feature) => {
          const isAssignedToMe = feature.assignedEngineerId === user.id;
          const isNotSignedOff = !feature.engineeringSignoff;

          // Debug logging
          if (feature.id === '2.1') {
            console.log('Feature 2.1 Debug:');
            console.log('  assignedEngineerId:', feature.assignedEngineerId, typeof feature.assignedEngineerId);
            console.log('  user.id:', user.id, typeof user.id);
            console.log('  isAssignedToMe:', isAssignedToMe);
            console.log('  engineeringSignoff:', feature.engineeringSignoff);
            console.log('  isNotSignedOff:', isNotSignedOff);
            console.log('  Will show:', isAssignedToMe && isNotSignedOff);
          }

          return isAssignedToMe && isNotSignedOff;
        }
      )
      .map((feature) => ({
        ...feature,
        categoryId: category.id,
        categoryName: category.name,
      }))
  );

  console.log('My Tasks - Total pending tasks:', myPendingTasks.length);
  console.log('My Tasks - Task IDs:', myPendingTasks.map(t => t.id));

  const handleEditFeature = (feature: Feature & { categoryId: string }) => {
    setEditingFeature(feature);
    setEditingCategoryId(feature.categoryId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFeature(null);
    setEditingCategoryId(null);
  };

  const handleSaveFeature = async (featureData: Omit<Feature, 'id'>) => {
    if (editingFeature && editingCategoryId) {
      await updateFeature(editingCategoryId, editingFeature.id, featureData);

      // Update local state to reflect changes
      setAllCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === editingCategoryId
            ? {
                ...category,
                features: category.features.map(f =>
                  f.id === editingFeature.id ? { ...f, ...featureData } : f
                ),
              }
            : category
        )
      );
    }
  };

  const handleQuickSignoff = async (categoryId: string, featureId: string) => {
    const feature = allCategories
      .find((c) => c.id === categoryId)
      ?.features.find((f) => f.id === featureId);

    if (feature) {
      await updateFeature(categoryId, featureId, {
        ...feature,
        engineeringSignoff: true,
      });

      // Update local state to reflect sign-off
      setAllCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === categoryId
            ? {
                ...category,
                features: category.features.map(f =>
                  f.id === featureId ? { ...f, engineeringSignoff: true } : f
                ),
              }
            : category
        )
      );
    }
  };

  const priorityColorMap: Record<Priority, string> = {
    High: 'bg-red-900/50 text-red-400 border border-red-700/50',
    Medium: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50',
    Low: 'bg-green-900/50 text-green-400 border border-green-700/50',
  };

  const complexityColorMap: Record<TShirtSize, string> = {
    XS: 'bg-green-900/40 text-green-400 border border-green-700/40',
    S: 'bg-blue-900/40 text-blue-400 border border-blue-700/40',
    M: 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/40',
    L: 'bg-orange-900/40 text-orange-400 border border-orange-700/40',
    XL: 'bg-red-900/40 text-red-400 border border-red-700/40',
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-xl font-bold text-gray-100">My Tasks</h1>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-100"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="w-full p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">My Tasks</h1>
            <p className="text-gray-400">
              Features assigned to you that are pending engineering sign-off
            </p>
          </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-gray-400 text-lg">Loading your tasks...</div>
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Tasks</p>
              <p className="text-3xl font-bold text-gray-100 mt-1">
                {myPendingTasks.length}
              </p>
            </div>
            <AlertCircle className="text-yellow-400" size={32} />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">High Priority</p>
              <p className="text-3xl font-bold text-red-400 mt-1">
                {myPendingTasks.filter((t) => t.priority === 'High').length}
              </p>
            </div>
            <AlertCircle className="text-red-400" size={32} />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Categories</p>
              <p className="text-3xl font-bold text-blue-400 mt-1">
                {new Set(myPendingTasks.map((t) => t.categoryId)).size}
              </p>
            </div>
            <FolderIcon className="text-blue-400" size={32} />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {myPendingTasks.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
          <CheckIcon className="mx-auto text-green-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-400">
            You have no pending tasks assigned to you at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myPendingTasks
            .sort((a, b) => {
              // Sort by priority (High > Medium > Low)
              const priorityOrder = { High: 0, Medium: 1, Low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((task) => (
              <div
                key={task.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-100">
                        {task.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          priorityColorMap[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          complexityColorMap[task.engineeringComplexity]
                        }`}
                      >
                        {task.engineeringComplexity}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <FolderIcon size={14} />
                        {task.categoryName}
                      </span>
                      <span className="flex items-center gap-1">
                        ID: {task.id}
                      </span>
                      {task.releaseDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(task.releaseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditFeature(task)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleQuickSignoff(task.categoryId, task.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <CheckIcon size={16} />
                      Sign Off
                    </button>
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">
                      Description
                    </h4>
                    <p className="text-gray-300">{task.description}</p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  {task.kpi && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                        KPI
                      </h4>
                      <p className="text-gray-300 text-sm">{task.kpi}</p>
                    </div>
                  )}
                  {task.customerName && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                        Customer
                      </h4>
                      <p className="text-gray-300 text-sm">{task.customerName}</p>
                    </div>
                  )}
                  {task.engineeringComment && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                        Engineering Comment
                      </h4>
                      <p className="text-gray-300 text-sm">{task.engineeringComment}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
        </>
      )}

          {/* Edit Modal */}
          {editingFeature && (
            <FeatureEditModal
              feature={editingFeature}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveFeature}
              userRole={user.role}
              userId={user.id}
              isNewFeature={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
