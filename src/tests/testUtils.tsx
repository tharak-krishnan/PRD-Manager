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

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialCategories?: any[];
}

export function renderWithProviders(
  ui: ReactElement,
  { initialCategories = mockCategories, ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
