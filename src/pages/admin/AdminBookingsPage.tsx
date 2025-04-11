// import React, { useState, useEffect } from 'react';
// import { Navigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';
// import { useAdminAuth } from '../../context/AdminAuthContext';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import toast from 'react-hot-toast';

// interface Booking {
//   id: string;
//   user_id: string;
//   trip_id: string;
//   passenger_name: string;
//   passenger_phone: string;
//   passenger_id?: string;
//   seat_number: string;
//   booking_date: string;
//   payment_status: string;
//   payment_method?: string;
//   booking_status: 'confirmed' | 'pending' | 'cancelled';
//   qr_code?: string;
//   created_at: string;
//   updated_at: string;
//   // Joined fields from related tables
//   trip_title?: string;
//   user_email?: string;
// }

// const AdminBookingsPage: React.FC = () => {
//   const { isAdmin } = useAdminAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalBookings, setTotalBookings] = useState(0);
//   const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchBookings();
//   }, [page, filter]);

//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       // Base query
//       let query = supabase
//         .from('bookings')
//         .select(`
//           *,
//           trips:trips(title),
//           users:users(email)
//         `, { count: 'exact' });

//       // Apply filter if not 'all'
//       if (filter !== 'all') {
//         query = query.eq('booking_status', filter);
//       }

//       // Fetch total count
//       const { count } = await query;
//       setTotalBookings(count || 0);

//       // Fetch paginated bookings
//       const { data, error } = await query
//         .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
//         .order('booking_date', { ascending: false });

//       if (error) throw error;

//       // Transform data to match Booking interface
//       const transformedBookings = data?.map(booking => ({
//         ...booking,
//         trip_title: booking.trips?.title || 'Unknown Trip',
//         user_email: booking.users?.email || 'Unknown User'
//       })) || [];

//       setBookings(transformedBookings);
//     } catch (error: any) {
//       toast.error('Failed to fetch bookings');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateBookingStatus = async (bookingId: string, newStatus: Booking['booking_status']) => {
//     try {
//       const { error } = await supabase
//         .from('bookings')
//         .update({ booking_status: newStatus })
//         .eq('id', bookingId);
      
//       if (error) throw error;
      
//       toast.success('Booking status updated successfully');
//       fetchBookings();
//     } catch (error: any) {
//       toast.error('Failed to update booking status');
//       console.error(error);
//     }
//   };

//   if (!isAdmin) {
    
 

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <AdminSidebar />
//       <main className="flex-grow p-6 ml-64">
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold">Booking Management</h1>
//             <div className="flex space-x-2">
//               {(['all', 'confirmed', 'pending', 'cancelled'] as const).map(status => (
//                 <button
//                   key={status}
//                   onClick={() => setFilter(status)}
//                   className={`px-4 py-2 rounded ${
//                     filter === status 
//                       ? 'bg-blue-500 text-white' 
//                       : 'bg-gray-200 text-gray-700'
//                   }`}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-center py-4">Loading bookings...</div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full bg-white">
//                   <thead>
//                     <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//                       <th className="py-3 px-6 text-left">Booking ID</th>
//                       <th className="py-3 px-6 text-left">Passenger</th>
//                       <th className="py-3 px-6 text-left">Contact</th>
//                       <th className="py-3 px-6 text-left">Trip</th>
//                       <th className="py-3 px-6 text-left">Seat</th>
//                       <th className="py-3 px-6 text-left">Payment</th>
//                       <th className="py-3 px-6 text-center">Status</th>
//                       <th className="py-3 px-6 text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-gray-600 text-sm font-light">
//                     {bookings.map((booking) => (
//                       <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100">
//                         <td className="py-3 px-6 text-left">
//                           {booking.id.slice(0, 8)}...
//                         </td>
//                         <td className="py-3 px-6 text-left">
//                           {booking.passenger_name}
//                           {booking.passenger_id && (
//                             <span className="text-xs text-gray-500 block">
//                               ID: {booking.passenger_id}
//                             </span>
//                           )}
//                         </td>
//                         <td className="py-3 px-6 text-left">{booking.passenger_phone}</td>
//                         <td className="py-3 px-6 text-left">
//                           {booking.trip_title}
//                           <span className="text-xs text-gray-500 block">
//                             {new Date(booking.booking_date).toLocaleDateString()}
//                           </span>
//                         </td>
//                         <td className="py-3 px-6 text-left">{booking.seat_number}</td>
//                         <td className="py-3 px-6 text-left">
//                           <span className={`px-2 py-1 rounded-full text-xs ${
//                             booking.payment_status === 'paid' 
//                               ? 'bg-green-200 text-green-800' 
//                               : 'bg-yellow-200 text-yellow-800'
//                           }`}>
//                             {booking.payment_status}
//                           </span>
//                           {booking.payment_method && (
//                             <span className="text-xs text-gray-500 block">
//                               {booking.payment_method}
//                             </span>
//                           )}
//                         </td>
//                         <td className="py-3 px-6 text-center">
//                           <span 
//                             className={`
//                               px-3 py-1 rounded-full text-xs 
//                               ${booking.booking_status === 'confirmed' ? 'bg-green-200 text-green-800' : 
//                                 booking.booking_status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 
//                                 'bg-red-200 text-red-800'}
//                             `}
//                           >
//                             {booking.booking_status}
//                           </span>
//                         </td>
//                         <td className="py-3 px-6 text-center">
//                           <div className="flex item-center justify-center space-x-2">
//                             {booking.booking_status !== 'confirmed' && (
//                               <button 
//                                 onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
//                                 className="text-green-500 hover:text-green-700"
//                                 title="Confirm Booking"
//                               >
//                                 ✅
//                               </button>
//                             )}
//                             {booking.booking_status !== 'cancelled' && (
//                               <button 
//                                 onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
//                                 className="text-red-500 hover:text-red-700"
//                                 title="Cancel Booking"
//                               >
//                                 ❌
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
              
//               {/* Pagination */}
//               <div className="flex justify-between items-center mt-4">
//                 <span>Total Bookings: {totalBookings}</span>
//                 <div className="flex space-x-2">
//                   <button 
//                     onClick={() => setPage(page - 1)} 
//                     disabled={page === 1}
//                     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   <span className="px-4 py-2">{page}</span>
//                   <button 
//                     onClick={() => setPage(page + 1)} 
//                     disabled={bookings.length < itemsPerPage}
//                     className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };
// }
// export default AdminBookingsPage;
import React, { useState } from 'react';
import { Search, Calendar, User, Bus, MapPin } from 'lucide-react';
import { useBookings } from '../../lib/hooks/useBookings';
import { format } from 'date-fns';
import type { Booking } from '../../types/database';

export default function Bookings() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Booking['status'] | ''>('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const { bookings, loading, error, updateBookingStatus } = useBookings({
    search,
    status: statusFilter || undefined,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  return (
    <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Booking Management</h1>
        <div className="flex gap-4">
          <div className="flex gap-4">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Booking['status'] | '')}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {booking.id.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user?.full_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.route?.start_point}
                          </div>
                          <div className="text-sm text-gray-500">
                            to {booking.route?.destination}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Bus className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900">
                          {booking.bus?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${booking.total_amount}
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                            {booking.status}
                          </span>
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking.id, e.target.value as Booking['status'])}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                        </td>
                      </tr>
                ))
              )}
                  </tbody>
                </table>
              </div>
        </div>
    </div>
  );
}