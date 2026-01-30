import React from 'react';
import { DataProvider } from '../context/DataContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <DataProvider>
      <div className="w-full min-h-screen bg-gray-900 text-gray-100">
        {children}
      </div>
    </DataProvider>
  );
};

export default Layout;
