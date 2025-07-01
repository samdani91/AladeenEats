import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Toaster } from '@/components/ui/sonner';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;