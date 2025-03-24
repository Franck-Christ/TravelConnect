import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Download, MapPin, QrCode } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../types';
import { supabase } from '../lib/supabase';

const MyTripsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      setLoading(true);
      
      // In a real app, this would be a call to Supabase
      // For demo purposes, we'll simulate a delay and return mock data
      setTimeout(() => {
        const today = new Date();
        
        const mockBookings: Booking[] = [
          {
            id: '1',
            user_id: user.id,
            trip_id: '1',
            trip: {
              id: '1',
              agency_id: '1',
              agency: {
                id: '1',
                name: 'Garanti Express',
                logo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
                rating: 4.5,
                review_count: 120
              },
              departure_city: 'Douala',
              destination_city: 'Yaoundé',
              departure_time: '08:00',
              arrival_time: '11:30',
              duration: '3h 30m',
              price: 5000,
              bus_type: 'VIP',
              available_seats: 15,
              total_seats: 30,
              amenities: ['Wi-Fi', 'AC', 'USB Charging']
            },
            passenger_name: user.full_name || 'User',
            passenger_phone: user.phone || '',
            seat_number: 'A12',
            booking_date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            payment_status: 'completed',
            payment_method: 'mtn_momo',
            booking_status: 'confirmed',
            qr_code: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BOOKING-1'
          },
          {
            id: '2',
            user_id: user.id,
            trip_id: '2',
            trip: {
              id: '2',
              agency_id: '2',
              agency: {
                id: '2',
                name: 'Touristique Express',
                logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
                rating: 4.2,
                review_count: 85
              },
              departure_city: 'Bamenda',
              destination_city: 'Bafoussam',
              departure_time: '09:30',
              arrival_time: '13:00',
              duration: '3h 30m',
              price: 4500,
              bus_type: 'Classic',
              available_seats: 22,
              total_seats: 45,
              amenities: ['AC']
            },
            passenger_name: user.full_name || 'User',
            passenger_phone: user.phone || '',
            seat_number: 'B05',
            booking_date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            payment_status: 'completed',
            payment_method: 'orange_money',
            booking_status: 'completed',
            qr_code: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BOOKING-2'
          },
          {
            id: '3',
            user_id: user.id,
            trip_id: '3',
            trip: {
              id: '3',
              agency_id: '3',
              agency: {
                id: '3',
                name: 'Buca Voyages',
                logo_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
                rating: 4.7,
                review_count: 150
              },
              departure_city: 'Yaoundé',
              destination_city: 'Douala',
              departure_time: '12:00',
              arrival_time: '15:30',
              duration: '3h 30m',
              price: 6000,
              bus_type: 'VIP',
              available_seats: 8,
              total_seats: 25,
              amenities: ['Wi-Fi', 'AC', 'USB Charging', 'Refreshments', 'TV']
            },
            passenger_name: user.full_name || 'User',
            passenger_phone: user.phone || '',
            seat_number: 'C08',
            booking_date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            payment_status: 'pending',
            booking_status: 'confirmed',
            qr_code: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BOOKING-3'
          }
        ];
        
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    };

    fetchBookings();
  }, [user]);

  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    return bookingDate > today && booking.booking_status !== 'cancelled';
  });

  const pastBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    return bookingDate <= today || booking.booking_status === 'cancelled';
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to view your trips.
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-150 ease-in-out"
            >
              Sign In
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Trips</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'upcoming'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Upcoming Trips ({upcomingBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'past'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Past Trips ({pastBookings.length})
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {activeTab === 'upcoming' && (
                    <>
                      {upcomingBookings.length > 0 ? (
                        <div className="space-y-6">
                          {upcomingBookings.map((booking) => (
                            <div key={booking.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-blue-50 p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                                  <span className="font-medium">{formatDate(booking.booking_date)}</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  booking.payment_status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {booking.payment_status === 'completed' ? 'Paid' : 'Payment Pending'}
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <div className="flex items-center mb-4">
                                  <img
                                    src={booking.trip.agency.logo_url}
                                    alt={booking.trip.agency.name}
                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                  />
                                  <div>
                                    <h3 className="font-semibold">{booking.trip.agency.name}</h3>
                                    <p className="text-sm text-gray-600">
                                      Bus Type: {booking.trip.bus_type} • Seat: {booking.seat_number}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div>
                                    <div className="text-sm text-gray-600">Departure</div>
                                    <div className="font-semibold">{booking.trip.departure_time}</div>
                                    <div className="text-sm flex items-center">
                                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                      {booking.trip.departure_city}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="text-sm text-gray-600 mb-1">Duration</div>
                                    <div className="font-semibold">{booking.trip.duration}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-600">Arrival</div>
                                    <div className="font-semibold">{booking.trip.arrival_time}</div>
                                    <div className="text-sm flex items-center justify-end">
                                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                      {booking.trip.destination_city}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                  <div className="flex space-x-2 mb-2 md:mb-0">
                                    <button className="flex items-center text-blue-600 hover:text-blue-800">
                                      <QrCode className="h-5 w-5 mr-1" />
                                      View Ticket
                                    </button>
                                    <button className="flex items-center text-blue-600 hover:text-blue-800">
                                      <Download className="h-5 w-5 mr-1" />
                                      Download
                                    </button>
                                  </div>
                                  <div>
                                    <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm">
                                      Cancel Trip
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
                          <p className="text-gray-600 mb-6">You don't have any upcoming trips booked.</p>
                          <Link
                            to="/search"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                          >
                            Book a Trip
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                  
                  {activeTab === 'past' && (
                    <>
                      {pastBookings.length > 0 ? (
                        <div className="space-y-6">
                          {pastBookings.map((booking) => (
                            <div key={booking.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                                  <span className="font-medium">{formatDate(booking.booking_date)}</span>
                                </div>
                                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                  Completed
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <div className="flex items-center mb-4">
                                  <img
                                    src={booking.trip.agency.logo_url}
                                    alt={booking.trip.agency.name}
                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                  />
                                  <div>
                                    <h3 className="font-semibold">{booking.trip.agency.name}</h3>
                                    <p className="text-sm text-gray-600">
                                      Bus Type: {booking.trip.bus_type} • Seat: {booking.seat_number}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div>
                                    <div className="text-sm text-gray-600">Departure</div>
                                    <div className="font-semibold">{booking.trip.departure_time}</div>
                                    <div className="text-sm flex items-center">
                                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                      {booking.trip.departure_city}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="text-sm text-gray-600 mb-1">Duration</div>
                                    <div className="font-semibold">{booking.trip.duration}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-600">Arrival</div>
                                    <div className="font-semibold">{booking.trip.arrival_time}</div>
                                    <div className="text-sm flex items-center justify-end">
                                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                      {booking.trip.destination_city}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                  <button className="flex items-center text-blue-600 hover:text-blue-800">
                                    <Download className="h-5 w-5 mr-1" />
                                    Download Receipt
                                  </button>
                                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm">
                                    Book Again
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No past trips</h3>
                          <p className="text-gray-600">You don't have any past trips.</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};



export default MyTripsPage;