import React from 'react';
import Dashboard from './pages/Dashboard';
import { DataProvider } from './context/DataContext';
export function App() {
  return <DataProvider>
      <div className="w-full min-h-screen bg-gray-900 text-gray-100">
        <Dashboard />
      </div>
    </DataProvider>;
}