import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [departureCity, setDepartureCity] = React.useState('');
  const [destinationCity, setDestinationCity] = React.useState('');
  const [travelDate, setTravelDate] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?from=${departureCity}&to=${destinationCity}&date=${travelDate}`);
  };

  const cameroonCities = [
    'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Buea', 'Limbe', 
    'Kribi', 'Garoua', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa'
  ];

  return (
    <div className="relative bg-blue-800 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80)' }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Travel Across Cameroon with Ease
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Book intercity bus tickets online. Simple, fast, and secure.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label htmlFor="departure" className="block text-gray-700 text-sm font-medium mb-2">
                  From
                </label>
                <div className="relative">
                  <select
                    id="departure"
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    className="block w-full text-slate-900 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-3"
                    required
                  >
                    <option value="">Select departure city</option>
                    {cameroonCities.map((city) => (
                      <option key={`from-${city}`} value={city}>{city}</option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="destination" className="block text-gray-700 text-sm font-medium mb-2">
                  To
                </label>
                <div className="relative">
                  <select
                    id="destination"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="block w-full text-slate-900 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-3"
                    required
                  >
                    <option value="">Select destination city</option>
                    {cameroonCities.map((city) => (
                      <option key={`to-${city}`} value={city}>{city}</option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-2">
                  Travel Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full text-slate-900 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-3"
                    required
                  />
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-150 ease-in-out"
              >
                Search Trips
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;