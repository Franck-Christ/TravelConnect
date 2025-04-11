import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// Pages
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import MyTripsPage from "./pages/MyTripsPage";
import SupportPage from "./pages/SupportPage";

// Admin Pages
import AdminAuthPage from "./pages/admin/AdminAuthPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
// import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminTripsPage from "./pages/admin/AdminTripsPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminSupportPage from "./pages/admin/AdminSupportPage";
import { NotFoundPage } from "./components/admin/NotFoundPage";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import UserManagement from './pages/admin/UserManagement';
import AdminbusesPage from './pages/admin/AdminbusesPage';
import AdminRoutespage from'./pages/admin/AdminRoutesPage';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/booking/:tripId" element={<BookingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/admin" element={<AdminAuthPage />} />
         {/* <Route path="/admin-payments" element={<AdminPaymentsPage />} />
          <Route path="/admin-promotions" element={<AdminPromotionsPage />} />
          <Route path="/admin-notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin-reports" element={<AdminReportsPage />} />
          <Route path="/admin-agencies" element={<AdminAgenciesPage />} />
          <Route path="/admin-settings" element={<AdminSettingsPage />} />   */}
          <Route path="/admin-users" element={<UserManagement />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminAuthPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          {/* <Route path="/admin-users" element={<AdminUsersPage />} /> */}
          <Route path="/admin-users" element={<UserManagement />} />
          <Route path="/admin-bookings" element={<AdminBookingsPage />} />
          <Route path="/admin-buses" element={<AdminbusesPage />} />
          <Route path="/admin-routes" element={<AdminRoutespage/>} />
          {/* Protected Admin Routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            {/* <Route path="/admin/users" element={<AdminUsersPage />} /> */}
            <Route path="/admin/trips" element={<AdminTripsPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/support" element={<AdminSupportPage />} />
          </Route>

          {/* Redirect all unknown routes to 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        

        <Toaster position="top-right" />
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
