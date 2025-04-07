import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Menu, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Bus className="h-8 w-8 mr-2" />
            
                <span className="font-bold text-xl">TravelConnect</span>
            </Link>
            
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-blue-700">Home</Link>
            <Link to="/search" className="px-3 py-2 rounded-md hover:bg-blue-700">Search</Link>
            <Link to="/my-trips" className="px-3 py-2 rounded-md hover:bg-blue-700">My Trips</Link>
            <Link to="/support" className="px-3 py-2 rounded-md hover:bg-blue-700">Support</Link>
            <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-blue-700">Admin</Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md hover:bg-blue-800">
                  <User className="h-5 w-5 mr-1" />
                  <span>Profile</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Profile</Link>
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-md bg-white text-blue-800 hover:bg-gray-100">
                Sign In
              </Link>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className="block px-3 py-2 rounded-md hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            <Link 
              to="/admin" 
              className="block px-3 py-2 rounded-md hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
            <Link 
              to="/my-trips" 
              className="block px-3 py-2 rounded-md hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              My Trips
            </Link>
            <Link 
              to="/support" 
              className="block px-3 py-2 rounded-md hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block px-3 py-2 rounded-md bg-white text-blue-800 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;