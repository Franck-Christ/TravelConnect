import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Bus } from '../../types/database';
import toast from 'react-hot-toast';

// Predefined list of agencies
const AGENCIES = [
  { id: '1', name: 'Finex' },
  { id: '2', name: 'Mogamo' },
  { id: '3', name: 'Musango' },
  { id: '4', name: 'General' }
];

interface BusFilters {
  agency_id?: string;
  status?: Bus['status'];
  search?: string;
}

export function useBuses(filters: BusFilters = {}) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuses();
  }, [filters]);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('buses')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.agency_id) {
        query = query.eq('agency_id', filters.agency_id);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,type.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching buses:', error);
        throw error;
      }
      
      // Transform the data to match the expected format with predefined agencies
      const transformedData = data?.map(bus => {
        const agency = AGENCIES.find(a => a.id === bus.agency_id);
        return {
          ...bus,
          agencies: {
            name: agency?.name || 'Unknown Agency'
          }
        };
      }) || [];
      
      setBuses(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching buses';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateBusStatus = async (busId: string, status: Bus['status']) => {
    try {
      const { error } = await supabase
        .from('buses')
        .update({ status })
        .eq('id', busId);

      if (error) throw error;

      setBuses(buses.map(bus => 
        bus.id === busId ? { ...bus, status } : bus
      ));

      toast.success('Bus status updated successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating bus status';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const addBus = async (bus: Omit<Bus, 'id' | 'created_at'>) => {
    try {
      // Ensure the data structure matches the database schema
      const busData = {
        name: bus.name,
        type: bus.type,
        capacity: bus.capacity,
        amenities: bus.amenities || {},
        status: bus.status,
        agency_id: bus.agency_id
      };

      const { data, error } = await supabase
        .from('buses')
        .insert([busData])
        .select('*')
        .single();

      if (error) throw error;

      // Transform the data to match the expected format
      const agency = AGENCIES.find(a => a.id === data.agency_id);
      const newBus = {
        ...data,
        agencies: {
          name: agency?.name || 'Unknown Agency'
        }
      };

      setBuses([newBus, ...buses]);
      toast.success('Bus added successfully');
      return { success: true, data: newBus };
    } catch (err) {
      console.error('Error adding bus:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while adding bus';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteBus = async (busId: string) => {
    try {
      const { error } = await supabase
        .from('buses')
        .delete()
        .eq('id', busId);

      if (error) throw error;

      setBuses(buses.filter(bus => bus.id !== busId));
      toast.success('Bus deleted successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting bus';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return { 
    buses, 
    loading, 
    error, 
    updateBusStatus, 
    addBus, 
    deleteBus,
    refreshBuses: fetchBuses 
  };
}