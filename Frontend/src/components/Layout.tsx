import React from 'react';
import LeftSidebar from './LeftSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-16 md:ml-64">
        <main className="mx-auto p-4 w-full h-full">
          {children}
        </main>
      </div>
    </div> 
  );
};

export default Layout; 