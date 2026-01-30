import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock data
export const mockCategories = [
  {
    id: '1',
    name: 'Category 1',
    description: 'Description 1',
    features: [],
  },
  {
    id: '2',
    name: 'Category 2',
    description: 'Description 2',
    features: [],
  },
];

export const mockFeatures = [
  {
    id: 'F-001',
    title: 'Feature 1',
    priority: 'High' as const,
    description: 'Description 1',
    kpi: 'KPI 1',
    customerName: 'Customer 1',
    engineeringComment: 'Comment 1',
    engineeringSignoff: true,
    engineeringComplexity: 'M' as const,
    releaseDate: '2024-06',
  },
  {
    id: 'F-002',
    title: 'Feature 2',
    priority: 'Medium' as const,
    description: 'Description 2',
    kpi: 'KPI 2',
    customerName: 'Customer 2',
    engineeringComment: 'Comment 2',
    engineeringSignoff: false,
    engineeringComplexity: 'L' as const,
    releaseDate: '2024-07',
  },
];

// Mock user
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialCategories?: any[];
  authValue?: any;
  dataValue?: any;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialCategories = mockCategories,
    authValue,
    dataValue,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Default auth context value
  const defaultAuthValue = {
    user: null,
    login: async () => {},
    logout: () => {},
    register: async () => {},
    isAuthenticated: false,
    isLoading: false,
  };

  // Default data context value
  const defaultDataValue = {
    categories: initialCategories,
    selectedCategoryId: null,
    addCategory: async () => {},
    updateCategory: async () => {},
    deleteCategory: async () => {},
    selectCategory: () => {},
    addFeature: async () => {},
    updateFeature: async () => {},
    deleteFeature: async () => {},
    isLoading: false,
    refreshCategories: async () => {},
  };

  const AuthContext = React.createContext(authValue || defaultAuthValue);
  const DataContext = React.createContext(dataValue || defaultDataValue);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthContext.Provider value={authValue || defaultAuthValue}>
          <DataContext.Provider value={dataValue || defaultDataValue}>
            {children}
          </DataContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
