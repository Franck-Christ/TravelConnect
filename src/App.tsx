import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SearchPage from './pages/SearchPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import MyTripsPage from './pages/MyTripsPage';
import SupportPage from './pages/SupportPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/booking/:tripId" element={<BookingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;