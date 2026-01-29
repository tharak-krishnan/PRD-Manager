import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../hooks/useModal';
import Modal from './Modal';
import { ChevronDown, Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';

const ProjectSelector: React.FC = () => {
  const { projects, selectedProjectId, selectProject, addProject, updateProject, deleteProject } = useData();
  const { user } = useAuth();
  const { modalState, hideModal, confirm, alert: showAlert } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const canManageProjects = user?.role === 'admin' || user?.role === 'product_manager';
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
        setEditingId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddProject = async () => {
    if (name.trim()) {
      try {
        await addProject({ name: name.trim(), description: description.trim() });
        setName('');
        setDescription('');
        setIsAdding(false);
      } catch (error) {
        console.error('Failed to add project:', error);
      }
    }
  };

  const handleUpdateProject = async (id: number) => {
    if (name.trim()) {
      try {
        await updateProject(id, { name: name.trim(), description: description.trim() });
        setName('');
        setDescription('');
        setEditingId(null);
      } catch (error) {
        console.error('Failed to update project:', error);
      }
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (projects.length <= 1) {
      showAlert(
        'Cannot Delete Project',
        'You cannot delete the last project. At least one project must exist.'
      );
      return;
    }

    confirm(
      'Delete Project',
      'Are you sure you want to delete this project?\n\nAll categories and features in this project will be permanently deleted.',
      async () => {
        try {
          await deleteProject(id);
        } catch (error) {
          console.error('Failed to delete project:', error);
        }
      },
      'Delete Project',
      'Cancel'
    );
  };

  const startEditing = (project: { id: number; name: string; description: string }) => {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description);
    setIsAdding(false);
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditingId(null);
    setName('');
    setDescription('');
  };

  return (
    <>
      <Modal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
      />

      <div className="relative mb-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 flex items-center justify-between hover:bg-gray-600 transition-colors"
        aria-label="Select project"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center flex-1 min-w-0">
          <FolderOpen size={18} className="mr-2 flex-shrink-0 text-blue-400" />
          <span className="truncate">
            {selectedProject ? selectedProject.name : 'Select a project'}
          </span>
        </div>
        <ChevronDown size={18} className={`ml-2 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Project list */}
          <div className="py-1">
            {projects.map(project => (
              <div
                key={project.id}
                className={`group ${editingId === project.id ? '' : 'hover:bg-gray-600'}`}
              >
                {editingId === project.id ? (
                  <div className="px-3 py-2 space-y-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateProject(project.id);
                        } else if (e.key === 'Escape') {
                          setEditingId(null);
                          setName('');
                          setDescription('');
                        }
                      }}
                      placeholder="Project name"
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Project name"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateProject(project.id);
                        } else if (e.key === 'Escape') {
                          setEditingId(null);
                          setName('');
                          setDescription('');
                        }
                      }}
                      placeholder="Description"
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Project description"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateProject(project.id)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setName('');
                          setDescription('');
                        }}
                        className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center px-3 py-2">
                    <button
                      onClick={() => {
                        selectProject(project.id);
                        setIsOpen(false);
                      }}
                      className={`flex-1 text-left ${
                        selectedProjectId === project.id
                          ? 'text-blue-400 font-medium'
                          : 'text-gray-300'
                      }`}
                    >
                      <div className="truncate">{project.name}</div>
                      {project.description && (
                        <div className="text-xs text-gray-500 truncate">{project.description}</div>
                      )}
                    </button>
                    {canManageProjects && (
                      <div className="flex space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(project);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-400 rounded hover:bg-gray-600"
                          title="Edit project"
                        >
                          <Edit2 size={14} />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-400 rounded hover:bg-gray-600"
                            title="Delete project"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add new project form */}
          {canManageProjects && (
            <>
              <div className="border-t border-gray-600" />
              {isAdding ? (
                <div className="px-3 py-2 space-y-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddProject();
                      } else if (e.key === 'Escape') {
                        setIsAdding(false);
                        setName('');
                        setDescription('');
                      }
                    }}
                    placeholder="Project name"
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="New project name"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddProject();
                      } else if (e.key === 'Escape') {
                        setIsAdding(false);
                        setName('');
                        setDescription('');
                      }
                    }}
                    placeholder="Description"
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="New project description"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddProject}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setName('');
                        setDescription('');
                      }}
                      className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={startAdding}
                  className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  <span className="text-sm">New Project</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ProjectSelector;
