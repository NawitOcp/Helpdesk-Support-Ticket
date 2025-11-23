import React from 'react';
import HeaderBar from './HeaderBar';

/**
 * App Layout Component
 * Main layout wrapper with header and content area
 */
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
      <main className="max-w-7xl mx-auto px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;