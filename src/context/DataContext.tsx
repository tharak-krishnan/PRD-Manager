import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

export type Priority = 'High' | 'Medium' | 'Low';
export type TShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
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
}
export interface Category {
  id: string;
  name: string;
  description: string;
  features: Feature[];
}
interface DataContextType {
  categories: Category[];
  selectedCategoryId: string | null;
  addCategory: (category: Omit<Category, 'id' | 'features'>) => Promise<void>;
  updateCategory: (id: string, data: Partial<Omit<Category, 'id' | 'features'>>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  selectCategory: (id: string | null) => void;
  addFeature: (categoryId: string, feature: Omit<Feature, 'id'>) => Promise<void>;
  updateFeature: (categoryId: string, featureId: string, data: Partial<Omit<Feature, 'id'>>) => Promise<void>;
  deleteFeature: (categoryId: string, featureId: string) => Promise<void>;
  isLoading: boolean;
  refreshCategories: () => Promise<void>;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('1');
  const [isLoading, setIsLoading] = useState(true);

  const refreshCategories = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch categories if user is authenticated
    const token = localStorage.getItem('access_token');
    if (token) {
      refreshCategories();
    } else {
      setIsLoading(false);
    }
  }, []);

  const addCategory = async (category: Omit<Category, 'id' | 'features'>) => {
    try {
      const newCategory = await apiClient.createCategory(category.name, category.description);
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
    categories,
    selectedCategoryId,
    addCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
    addFeature,
    updateFeature,
    deleteFeature,
    isLoading,
    refreshCategories,
  };

  // Show loading state while fetching initial data
  if (isLoading && categories.length === 0) {
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
