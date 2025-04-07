import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  user_id: string;
  trip_id: string;
  trip_title: string;
  user_email: string;
  booking_date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  total_price: number;
}

const AdminBookingsPage: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, [page, filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Base query
      let query = supabase
        .from('bookings')
        .select('*, trips(title), users(email)', { count: 'exact' });

      // Apply filter if not 'all'
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      // Fetch total count
      const { count } = await query;
      setTotalBookings(count || 0);

      // Fetch paginated bookings
      const { data, error } = await query
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
        .order('booking_date', { ascending: false });

      if (error) throw error;

      // Transform data to match Booking interface
      const transformedBookings = data?.map(booking => ({
        id: booking.id,
        user_id: booking.user_id,
        trip_id: booking.trip_id,
        trip_title: booking.trips?.title || 'Unknown Trip',
        user_email: booking.users?.email || 'Unknown User',
        booking_date: booking.booking_date,
        status: booking.status,
        total_price: booking.total_price
      })) || [];

      setBookings(transformedBookings);
    } catch (error: any) {
      toast.error('Failed to fetch bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      toast.success('Booking status updated successfully');
      fetchBookings();
    } catch (error: any) {
      toast.error('Failed to update booking status');
      console.error(error);
    }
  };

  if (!isAdmin) {
    //return <Navigate to="/admin/login" />;
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-grow p-6 ml-64">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Booking Management</h1>
            <div className="flex space-x-2">
              {(['all', 'confirmed', 'pending', 'cancelled'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded ${
                    filter === status 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading bookings...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Booking ID</th>
                      <th className="py-3 px-6 text-left">User Email</th>
                      <th className="py-3 px-6 text-left">Trip</th>
                      <th className="py-3 px-6 text-left">Booking Date</th>
                      <th className="py-3 px-6 text-left">Total Price</th>
                      <th className="py-3 px-6 text-center">Status</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">
                          {booking.id.slice(0, 8)}...
                        </td>
                        <td className="py-3 px-6 text-left">{booking.user_email}</td>
                        <td className="py-3 px-6 text-left">{booking.trip_title}</td>
                        <td className="py-3 px-6 text-left">
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-left">${booking.total_price}</td>
                        <td className="py-3 px-6 text-center">
                          <span 
                            className={`
                              px-3 py-1 rounded-full text-xs 
                              ${booking.status === 'confirmed' ? 'bg-green-200 text-green-800' : 
                                booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 
                                'bg-red-200 text-red-800'}
                            `}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center space-x-2">
                            {booking.status !== 'confirmed' && (
                              <button 
                                onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                className="text-green-500 hover:text-green-700"
                                title="Confirm Booking"
                              >
                                ✅
                              </button>
                            )}
                            {booking.status !== 'cancelled' && (
                              <button 
                                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                className="text-red-500 hover:text-red-700"
                                title="Cancel Booking"
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <span>Total Bookings: {totalBookings}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setPage(page - 1)} 
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">{page}</span>
                  <button 
                    onClick={() => setPage(page + 1)} 
                    disabled={bookings.length < itemsPerPage}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
}
export default AdminBookingsPage;