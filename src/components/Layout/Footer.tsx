import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Bus className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">TravelConnect</span>
            </div>
            <p className="text-gray-300 mb-4">
              The easiest way to book intercity travel in Cameroon.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-white">Search Trips</Link>
              </li>
              <li>
                <Link to="/my-trips" className="text-gray-300 hover:text-white">My Trips</Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-white">Support</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Routes</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?from=Douala&to=Yaoundé" className="text-gray-300 hover:text-white">
                  Douala → Yaoundé
                </Link>
              </li>
              <li>
                <Link to="/search?from=Bamenda&to=Bafoussam" className="text-gray-300 hover:text-white">
                  Bamenda → Bafoussam
                </Link>
              </li>
              <li>
                <Link to="/search?from=Yaoundé&to=Douala" className="text-gray-300 hover:text-white">
                  Yaoundé → Douala
                </Link>
              </li>
              <li>
                <Link to="/search?from=Buea&to=Douala" className="text-gray-300 hover:text-white">
                  Buea → Douala
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-300 mb-2">Email: support@travelconnect.cm</p>
            <p className="text-gray-300 mb-2">Phone: +237 6XX XXX XXX</p>
            <p className="text-gray-300">
              Address: Akwa, Douala, Cameroon
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} TravelConnect. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/faq" className="text-gray-300 hover:text-white text-sm">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;