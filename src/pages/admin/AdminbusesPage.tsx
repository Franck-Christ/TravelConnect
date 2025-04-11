import React, { useState, useEffect } from 'react';
import { Search, Plus, Bus, Trash2, Edit } from 'lucide-react';
import { useBuses } from '../../lib/hooks/useBuses';
import type { Bus as BusType } from '../../types/database';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

const AMENITIES = [
  'Air Conditioning',
  'Wifi',
  'USB Ports',
  'Toilet',
  'Entertainment',
  'Refreshments',
  'Reclining Seats',
  'Luggage Space'
];

// Predefined list of agencies
const AGENCIES = [
  { id: '1', name: 'Finex' },
  { id: '2', name: 'Mogamo' },
  { id: '3', name: 'Musango' },
  { id: '4', name: 'General' }
];

interface Agency {
  id: string;
  name: string;
}

export default function Buses() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [busToDelete, setBusToDelete] = useState<BusType | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>(AGENCIES);
  const [newBus, setNewBus] = useState<Partial<BusType>>({
    name: '',
    type: '',
    capacity: 0,
    amenities: {},
    status: 'active',
    agency_id: ''
  });
  
  const { 
    buses, 
    loading, 
    error, 
    addBus, 
    updateBusStatus, 
    deleteBus,
    refreshBuses 
  } = useBuses({ search });

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newBus.name || !newBus.type || !newBus.agency_id || !newBus.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const result = await addBus(newBus as Omit<BusType, 'id' | 'created_at'>);
    if (result.success) {
      setShowAddModal(false);
      setNewBus({
        name: '',
        type: '',
        capacity: 0,
        amenities: {},
        status: 'active',
        agency_id: ''
      });
    }
  };

  const handleDeleteBus = async (bus: BusType) => {
    setBusToDelete(bus);
    setShowDeleteModal(true);
  };

  const confirmDeleteBus = async () => {
    if (!busToDelete) return;
    
    const result = await deleteBus(busToDelete.id);
    if (result.success) {
      setShowDeleteModal(false);
      setBusToDelete(null);
    }
  };

  const handleStatusChange = async (busId: string, status: BusType['status']) => {
    const result = await updateBusStatus(busId, status);
    if (!result.success) {
      toast.error('Failed to update bus status');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bus Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Bus
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search buses..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading buses...
                  </td>
                </tr>
              ) : buses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No buses found
                  </td>
                </tr>
              ) : (
                buses.map((bus) => (
                  <tr key={bus.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Bus className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{bus.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bus.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bus.agencies?.name || 'Unknown Agency'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bus.capacity} seats
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${bus.status === 'active' ? 'bg-green-100 text-green-800' : 
                          bus.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {bus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <select
                          value={bus.status}
                          onChange={(e) => handleStatusChange(bus.id, e.target.value as BusType['status'])}
                          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <button
                          onClick={() => handleDeleteBus(bus)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete Bus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Bus</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddBus}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bus Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newBus.name}
                    onChange={(e) => setNewBus({ ...newBus, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bus Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newBus.type}
                    onChange={(e) => setNewBus({ ...newBus, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="VIP">VIP</option>
                    <option value="Standard">Standard</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Agency <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newBus.agency_id}
                    onChange={(e) => setNewBus({ ...newBus, agency_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select agency</option>
                    {agencies.map(agency => (
                      <option key={agency.id} value={agency.id}>
                        {agency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newBus.capacity}
                    onChange={(e) => setNewBus({ ...newBus, capacity: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newBus.status}
                    onChange={(e) => setNewBus({ ...newBus, status: e.target.value as BusType['status'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITIES.map((amenity) => (
                      <label key={amenity} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={newBus.amenities?.[amenity.toLowerCase().replace(' ', '_')] || false}
                          onChange={(e) => setNewBus({
                            ...newBus,
                            amenities: {
                              ...newBus.amenities,
                              [amenity.toLowerCase().replace(' ', '_')]: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && busToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Delete Bus</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBusToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the bus "{busToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBusToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBus}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Bus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}