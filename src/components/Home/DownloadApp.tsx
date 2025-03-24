import React from 'react';
import { Apple, CheckCircle, Smartphone } from 'lucide-react';

const DownloadApp: React.FC = () => {
  return (
    <section className="py-16 bg-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Download Our Mobile App</h2>
            <p className="text-xl mb-8">
              Get the Moto de GO app for a better experience. Book tickets, track your bus, and receive real-time updates on the go.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-blue-300 mr-3 flex-shrink-0 mt-0.5" />
                <p>Book tickets anytime, anywhere</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-blue-300 mr-3 flex-shrink-0 mt-0.5" />
                <p>Receive instant notifications about your trip</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-blue-300 mr-3 flex-shrink-0 mt-0.5" />
                <p>Access your tickets offline</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-blue-300 mr-3 flex-shrink-0 mt-0.5" />
                <p>Track your bus in real-time</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="#" 
                className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition duration-150"
              >
                <Apple className="h-6 w-6 mr-2" />
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition duration-150"
              >
                <Smartphone className="h-6 w-6 mr-2" />
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-600 rounded-3xl transform rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="TravelConnect Mobile App" 
                className="relative w-full max-w-xs rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;