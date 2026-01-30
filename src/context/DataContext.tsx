import React, { useState, createContext, useContext, useEffect, ReactNode, useCallback } from 'react';
import { apiClient } from '../services/api';

export type Priority = 'High' | 'Medium' | 'Low';
export type TShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface Project {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Feature {
  id: string;
  title: string;
  priority: Priority;
  description: string;
  kpi: string;
  customerName: string;
  engineeringComment: string;
  engineeringSignoff: boolean;
  engineeringComplexity: TShirtSize;
  releaseDate: string; // YYYY-MM format
  assignedEngineerId?: number;
  assignedEngineerName?: string;
  signedOffById?: number;
  signedOffByName?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  project_id: number;
  features: Feature[];
}
interface DataContextType {
  // Project state
  projects: Project[];
  selectedProjectId: number | null;
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: number, data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  selectProject: (id: number | null) => void;
  refreshProjects: () => Promise<void>;

  // Category state
  categories: Category[];
  selectedCategoryId: string | null;
  addCategory: (category: Omit<Category, 'id' | 'features' | 'project_id'>) => Promise<void>;
  updateCategory: (id: string, data: Partial<Omit<Category, 'id' | 'features' | 'project_id'>>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  selectCategory: (id: string | null) => void;
  refreshCategories: () => Promise<void>;

  // Feature state
  addFeature: (categoryId: string, feature: Omit<Feature, 'id'>) => Promise<void>;
  updateFeature: (categoryId: string, featureId: string, data: Partial<Omit<Feature, 'id'>>) => Promise<void>;
  deleteFeature: (categoryId: string, featureId: string) => Promise<void>;

  isLoading: boolean;
}
const DataContext = createContext<DataContextType | undefined>(undefined);
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
export const DataProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProjects = async () => {
    try {
      const data = await apiClient.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const refreshCategories = useCallback(async () => {
    if (selectedProjectId === null) {
      setCategories([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiClient.getCategories(selectedProjectId);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  // Fetch projects on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      refreshProjects().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch categories when project changes
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && selectedProjectId !== null) {
      refreshCategories();
    } else {
      setCategories([]);
      setIsLoading(false);
    }
  }, [selectedProjectId, refreshCategories]);

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProject = await apiClient.createProject(project.name, project.description);
      setProjects([...projects, newProject]);
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const updateProject = async (id: number, data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      await apiClient.updateProject(id, data);
      await refreshProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await apiClient.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProjectId === id) {
        setSelectedProjectId(null);
        setCategories([]);
        setSelectedCategoryId(null);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  const selectProject = (id: number | null) => {
    setSelectedProjectId(id);
    setSelectedCategoryId(null);
    setCategories([]);
  };

  const addCategory = async (category: Omit<Category, 'id' | 'features' | 'project_id'>) => {
    if (selectedProjectId === null) {
      throw new Error('No project selected');
    }

    try {
      const newCategory = await apiClient.createCategory(category.name, category.description, selectedProjectId);
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, data: Partial<Omit<Category, 'id' | 'features'>>) => {
    try {
      await apiClient.updateCategory(id, data);
      await refreshCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await apiClient.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      if (selectedCategoryId === id) {
        setSelectedCategoryId(categories.length > 1 ? categories[0].id : null);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  const selectCategory = (id: string | null) => {
    setSelectedCategoryId(id);
  };

  const addFeature = async (categoryId: string, feature: Omit<Feature, 'id'>) => {
    try {
      await apiClient.createFeature(categoryId, feature);
      await refreshCategories();
    } catch (error) {
      console.error('Failed to create feature:', error);
      throw error;
    }
  };

  const updateFeature = async (categoryId: string, featureId: string, data: Partial<Omit<Feature, 'id'>>) => {
    try {
      await apiClient.updateFeature(featureId, data);
      await refreshCategories();
    } catch (error) {
      console.error('Failed to update feature:', error);
      throw error;
    }
  };

  const deleteFeature = async (categoryId: string, featureId: string) => {
    try {
      await apiClient.deleteFeature(featureId);
      await refreshCategories();
    } catch (error) {
      console.error('Failed to delete feature:', error);
      throw error;
    }
  };

  const value = {
    // Projects
    projects,
    selectedProjectId,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    refreshProjects,
    // Categories
    categories,
    selectedCategoryId,
    addCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
    refreshCategories,
    // Features
    addFeature,
    updateFeature,
    deleteFeature,
    // Loading
    isLoading,
  };

  // Show loading state while fetching initial data (projects)
  if (isLoading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-100 text-xl">Loading...</div>
      </div>
    );
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Old initial state data removed - now fetched from API
const OLD_INITIAL_DATA_COMMENT = `
  The initial hardcoded data (6 categories with 23 features) has been removed.
  Data is now fetched from the Flask API backend and seeded via backend/app/seed_data.py
  All 23 features are preserved in the database seed script.
`;

// Prevent unused variable warning
void OLD_INITIAL_DATA_COMMENT;
