import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Booking } from '../../types/database';

interface BookingFilters {
  status?: Booking['status'];
  startDate?: string;
  endDate?: string;
  search?: string;
}

export function useBookings(filters: BookingFilters = {}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('bookings')
          .select(`
            *,
            user:users(*),
            bus:buses(*),
            route:routes(*)
          `)
          .order('created_at', { ascending: false });

        if (filters.status) {
          query = query.eq('status', filters.status);
        }

        if (filters.startDate) {
          query = query.gte('booking_date', filters.startDate);
        }

        if (filters.endDate) {
          query = query.lte('booking_date', filters.endDate);
        }

        if (filters.search) {
          query = query.or(`id.ilike.%${filters.search}%,user_id.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [filters]);

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));

      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'An error occurred' 
      };
    }
  };

  return { bookings, loading, error, updateBookingStatus };
}