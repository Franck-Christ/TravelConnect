import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bus, Calendar, CreditCard, MapPin } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import SeatSelection from '../components/Booking/SeatSelection';
import PaymentModal from '../components/Payment/PaymentModal';
import { Trip } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BookingPage: React.FC = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const trip: Trip = {
    id: tripId || '1',
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
    total_seats: 50,
    amenities: ['Wi-Fi', 'AC', 'USB Charging']
  };

  const handleSeatSelectionChange = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    // In a real app, create the booking in the database
    navigate('/my-trips');
  };

  const handleBooking = () => {
    if (!user) {
      toast.error('Please sign in to book tickets');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setShowPaymentModal(true);
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Search Results
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <img
                      src={trip.agency.logo_url}
                      alt={trip.agency.name}
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{trip.agency.name}</h2>
                      <div className="flex items-center text-sm text-gray-600">
                        <Bus className="h-4 w-4 mr-1" />
                        {trip.bus_type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {trip.price.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-gray-600">per seat</div>
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Departure</div>
                      <div className="font-semibold">{trip.departure_time}</div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {trip.departure_city}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-sm text-gray-600 mb-1">Duration</div>
                      <div className="font-semibold">{trip.duration}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Arrival</div>
                      <div className="font-semibold">{trip.arrival_time}</div>
                      <div className="flex items-center justify-end text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {trip.destination_city}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {trip.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <SeatSelection
                  price={trip.price}
                  availableSeats={trip.available_seats}
                  onSeatSelectionChange={handleSeatSelectionChange}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Seats</span>
                    <span className="font-medium">
                      {selectedSeats.length > 0 
                        ? selectedSeats.join(', ')
                        : 'None selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Seat</span>
                    <span className="font-medium">{trip.price.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Seats</span>
                    <span className="font-medium">× {selectedSeats.length}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-blue-600">
                        {(trip.price * selectedSeats.length).toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Payment
                  </button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    By proceeding, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={trip.price * selectedSeats.length}
        onPaymentComplete={handlePaymentComplete}
      />
    </Layout>
  );
};

export default BookingPage;