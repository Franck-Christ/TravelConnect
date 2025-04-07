// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <Icon 
          icon="mdi:alert-circle-outline" 
          className="mx-auto h-16 w-16 text-red-500 mb-4" 
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Icon icon="mdi:home" className="mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};