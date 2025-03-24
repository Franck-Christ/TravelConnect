import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Filter, MapPin, Search } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { Trip } from '../types';
import { supabase } from '../lib/supabase';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [departureCity, setDepartureCity] = useState(searchParams.get('from') || '');
  const [destinationCity, setDestinationCity] = useState(searchParams.get('to') || '');
  const [travelDate, setTravelDate] = useState(searchParams.get('date') || '');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const cameroonCities = [
    'Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Buea', 'Limbe', 
    'Kribi', 'Garoua', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa'
  ];

  const busTypes = ['VIP', 'Classic', 'Minibus'];
  const amenities = ['Wi-Fi', 'AC', 'USB Charging', 'Refreshments', 'TV'];

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      
      // In a real app, this would be a call to Supabase
      // For demo purposes, we'll simulate a delay and return mock data
      setTimeout(() => {
        const mockTrips: Trip[] = [
          {
            id: '1',
            agency_id: '1',
            agency: {
              id: '1',
              name: 'Garanti Express',
              //logo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
              rating: 4.5,
              review_count: 120
            },
            departure_city: departureCity || 'Douala',
            destination_city: destinationCity || 'Yaoundé',
            departure_time: '08:00',
            arrival_time: '11:30',
            duration: '3h 30m',
            price: 5000,
            bus_type: 'VIP',
            available_seats: 15,
            total_seats: 30,
            amenities: ['Wi-Fi', 'AC', 'USB Charging']
          },
          {
            id: '2',
            agency_id: '2',
            agency: {
              id: '2',
              name: 'Touristique Express',
              //logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
              rating: 4.2,
              review_count: 85
            },
            departure_city: departureCity || 'Douala',
            destination_city: destinationCity || 'Yaoundé',
            departure_time: '09:30',
            arrival_time: '13:00',
            duration: '3h 30m',
            price: 4500,
            bus_type: 'Classic',
            available_seats: 22,
            total_seats: 45,
            amenities: ['AC']
          },
          {
            id: '3',
            agency_id: '3',
            agency: {
              id: '3',
              name: 'Buca Voyages',
              //logo_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
              rating: 4.7,
              review_count: 150
            },
            departure_city: departureCity || 'Douala',
            destination_city: destinationCity || 'Yaoundé',
            departure_time: '12:00',
            arrival_time: '15:30',
            duration: '3h 30m',
            price: 6000,
            bus_type: 'VIP',
            available_seats: 8,
            total_seats: 25,
            amenities: ['Wi-Fi', 'AC', 'USB Charging', 'Refreshments', 'TV']
          },
          {
            id: '4',
            agency_id: '4',
            agency: {
              id: '4',
              name: 'General Voyages',
              //logo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
              rating: 3.8,
              review_count: 65
            },
            departure_city: departureCity || 'Douala',
            destination_city: destinationCity || 'Yaoundé',
            departure_time: '15:00',
            arrival_time: '18:30',
            duration: '3h 30m',
            price: 3500,
            bus_type: 'Minibus',
            available_seats: 10,
            total_seats: 15,
            amenities: []
          }
        ];
        
        setTrips(mockTrips);
        setLoading(false);
      }, 1000);
    };

    fetchTrips();
  }, [departureCity, destinationCity, travelDate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({
      from: departureCity,
      to: destinationCity,
      date: travelDate
    });
  };

  const handleSelectTrip = (tripId: string) => {
    navigate(`/booking/${tripId}`);
  };

  const toggleBusType = (busType: string) => {
    setSelectedBusTypes(prev => 
      prev.includes(busType) 
        ? prev.filter(type => type !== busType)
        : [...prev, busType]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filteredTrips = trips.filter(trip => {
    if (selectedBusTypes.length > 0 && !selectedBusTypes.includes(trip.bus_type)) {
      return false;
    }
    
    if (trip.price < priceRange[0] || trip.price > priceRange[1]) {
      return false;
    }
    
    if (selectedAmenities.length > 0) {
      return selectedAmenities.every(amenity => trip.amenities.includes(amenity));
    }
    
    return true;
  });

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-blue-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold mb-6">Search for Trips</h1>
            
            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <label htmlFor="departure" className="block text-gray-700 text-sm font-medium mb-2">
                    From
                  </label>
                  <div className="relative">
                    <select
                      id="departure"
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-2 text-gray-900"
                      required
                    >
                      <option value="">Select departure city</option>
                      {cameroonCities.map((city) => (
                        <option key={`from-${city}`} value={city}>{city}</option>
                      ))}
                    </select>
                    <MapPin className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
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
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-2 text-gray-900"
                      required
                    >
                      <option value="">Select destination city</option>
                      {cameroonCities.map((city) => (
                        <option key={`to-${city}`} value={city}>{city}</option>
                      ))}
                    </select>
                    <MapPin className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
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
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-2 text-gray-900"
                      required
                    />
                    <Calendar className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center text-blue-600"
                  >
                    <Filter className="h-5 w-5 mr-1" />
                    {showFilters ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-6`}>
                  <div>
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span>{priceRange[0]} FCFA</span>
                      <span>{priceRange[1]} FCFA</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Bus Type</h3>
                    <div className="space-y-2">
                      {busTypes.map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`type-${type}`}
                            checked={selectedBusTypes.includes(type)}
                            onChange={() => toggleBusType(type)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Amenities</h3>
                    <div className="space-y-2">
                      {amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`amenity-${amenity}`}
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => toggleAmenity(amenity)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h2 className="text-lg font-semibold mb-2">
                  {departureCity && destinationCity 
                    ? `${departureCity} to ${destinationCity}` 
                    : 'All Routes'}
                  {travelDate && ` - ${new Date(travelDate).toLocaleDateString()}`}
                </h2>
                <p className="text-gray-600">
                  {loading 
                    ? 'Searching for trips...' 
                    : `${filteredTrips.length} trips found`}
                </p>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTrips.length > 0 ? (
                    filteredTrips.map((trip) => (
                      <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <img
                                src={trip.agency.logo_url}
                                alt={trip.agency.name}
                                className="h-12 w-12 rounded-full object-cover mr-4"
                              />
                              <div>
                                <h3 className="font-semibold">{trip.agency.name}</h3>
                                <div className="flex items-center text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {trip.agency.rating}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span>{trip.agency.review_count} reviews</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{trip.price} FCFA</div>
                              <div className="text-sm text-gray-600">per person</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-600">Departure</div>
                              <div className="font-semibold">{trip.departure_time}</div>
                              <div className="text-sm">{trip.departure_city}</div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-sm text-gray-600 mb-1">Duration</div>
                              <div className="font-semibold">{trip.duration}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Arrival</div>
                              <div className="font-semibold">{trip.arrival_time}</div>
                              <div className="text-sm">{trip.destination_city}</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center space-x-2 mb-2 md:mb-0">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {trip.bus_type}
                              </span>
                              {trip.amenities.map((amenity, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 mr-4">
                                {trip.available_seats} seats available
                              </span>
                              <button 
                                onClick={() => handleSelectTrip(trip.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                              >
                                Select Seats
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <h3 className="text-lg font-semibold mb-2">No trips found</h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your search criteria or selecting different dates.
                      </p>
                      <button 
                        onClick={() => {
                          setSelectedBusTypes([]);
                          setSelectedAmenities([]);
                          setPriceRange([0, 20000]);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;