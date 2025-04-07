import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import toast from 'react-hot-toast';

interface Trip {
  id: string;
  title: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  available_slots: number;
}

const AdminTripsPage: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalTrips, setTotalTrips] = useState(0);
  const itemsPerPage = 10;

  // State for creating/editing trip
  const [editingTrip, setEditingTrip] = useState<Partial<Trip> | null>(null);

  useEffect(() => {
    fetchTrips();
  }, [page]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      // Fetch total trips count
      const { count } = await supabase
        .from('trips')
        .select('*', { count: 'exact' });
      setTotalTrips(count || 0);

      // Fetch paginated trips
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch trips');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);
      
      if (error) throw error;
      
      toast.success('Trip deleted successfully');
      fetchTrips();
    } catch (error: any) {
      toast.error('Failed to delete trip');
      console.error(error);
    }
  };

  const handleSaveTrip = async () => {
    try {
      if (editingTrip?.id) {
        // Update existing trip
        const { error } = await supabase
          .from('trips')
          .update({
            title: editingTrip.title,
            description: editingTrip.description,
            price: editingTrip.price,
            start_date: editingTrip.start_date,
            end_date: editingTrip.end_date,
            available_slots: editingTrip.available_slots
          })
          .eq('id', editingTrip.id);

        if (error) throw error;
        toast.success('Trip updated successfully');
      } else {
        // Create new trip
        const { error } = await supabase
          .from('trips')
          .insert({
            title: editingTrip?.title,
            description: editingTrip?.description,
            price: editingTrip?.price,
            start_date: editingTrip?.start_date,
            end_date: editingTrip?.end_date,
            available_slots: editingTrip?.available_slots
          });

        if (error) throw error;
        toast.success('Trip created successfully');
      }

      // Reset editing state and refresh trips
      setEditingTrip(null);
      fetchTrips();
    } catch (error: any) {
      toast.error('Failed to save trip');
      console.error(error);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-grow p-6 ml-64">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Trip Management</h1>
            <button 
              onClick={() => setEditingTrip({})}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create New Trip
            </button>
          </div>
          
          {/* Trip Editing Modal */}
          {editingTrip !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">
                  {editingTrip.id ? 'Edit Trip' : 'Create New Trip'}
                </h2>
                <input 
                  type="text"
                  placeholder="Title"
                  value={editingTrip.title || ''}
                  onChange={(e) => setEditingTrip({...editingTrip, title: e.target.value})}
                  className="w-full mb-2 p-2 border rounded"
                />
                <textarea 
                  placeholder="Description"
                  value={editingTrip.description || ''}
                  onChange={(e) => setEditingTrip({...editingTrip, description: e.target.value})}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input 
                  type="number"
                  placeholder="Price"
                  value={editingTrip.price || ''}
                  onChange={(e) => setEditingTrip({...editingTrip, price: Number(e.target.value)})}
                  className="w-full mb-2 p-2 border rounded"
                />
                <div className="flex space-x-2 mb-2">
                  <input 
                    type="date"
                    placeholder="Start Date"
                    value={editingTrip.start_date || ''}
                    onChange={(e) => setEditingTrip({...editingTrip, start_date: e.target.value})}
                    className="w-1/2 p-2 border rounded"
                  />
                  <input 
                    type="date"
                    placeholder="End Date"
                    value={editingTrip.end_date || ''}
                    onChange={(e) => setEditingTrip({...editingTrip, end_date: e.target.value})}
                    className="w-1/2 p-2 border rounded"
                  />
                </div>
                <input 
                  type="number"
                  placeholder="Available Slots"
                  value={editingTrip.available_slots || ''}
                  onChange={(e) => setEditingTrip({...editingTrip, available_slots: Number(e.target.value)})}
                  className="w-full mb-2 p-2 border rounded"
                />
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => setEditingTrip(null)}
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveTrip}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">Loading trips...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Title</th>
                      <th className="py-3 px-6 text-left">Price</th>
                      <th className="py-3 px-6 text-left">Start Date</th>
                      <th className="py-3 px-6 text-left">End Date</th>
                      <th className="py-3 px-6 text-center">Available Slots</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {trips.map((trip) => (
                      <tr key={trip.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">{trip.title}</td>
                        <td className="py-3 px-6 text-left">${trip.price}</td>
                        <td className="py-3 px-6 text-left">
                          {new Date(trip.start_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {new Date(trip.end_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-center">{trip.available_slots}</td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center space-x-2">
                            <button 
                              onClick={() => setEditingTrip(trip)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteTrip(trip.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <span>Total Trips: {totalTrips}</span>
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
                    disabled={trips.length < itemsPerPage}
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

export default AdminTripsPage;