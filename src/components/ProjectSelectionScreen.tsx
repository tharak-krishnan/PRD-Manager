import React from 'react';
import { useData } from '../context/DataContext';
import { FolderOpen, Inbox } from 'lucide-react';

const ProjectSelectionScreen: React.FC = () => {
  const { projects, selectProject } = useData();

  if (projects.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md">
          <Inbox size={64} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-100 mb-2">No Projects Yet</h2>
          <p className="text-gray-400">
            Create your first project using the project selector in the sidebar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-900 p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">Select a Project</h2>
          <p className="text-gray-400">Choose a project to view its categories and features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => selectProject(project.id)}
              className="group p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-gray-750 transition-all text-left"
            >
              <div className="flex items-start mb-3">
                <div className="p-2 bg-blue-900/30 rounded-lg group-hover:bg-blue-900/50 transition-colors">
                  <FolderOpen size={24} className="text-blue-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-blue-400 transition-colors">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSelectionScreen;
