import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminDashboardStats from '../../components/admin/AdminDashboardStats';

const AdminDashboardPage: React.FC = () => {
  const { isAdmin } = useAdminAuth();

  if (!isAdmin) {
   // return <Navigate to="/admin-users" />;
  

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-grow p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <AdminDashboardStats />
      </main>
    </div>
  );
};
}
export default AdminDashboardPage;