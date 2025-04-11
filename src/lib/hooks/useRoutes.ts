import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Route } from '../../types/database';

export function useRoutes(search?: string) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('routes')
          .select('*')
          .order('created_at', { ascending: false });

        if (search) {
          query = query.or(`start_point.ilike.%${search}%,destination.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setRoutes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [search]);

  const addRoute = async (route: Omit<Route, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .insert([route])
        .select()
        .single();

      if (error) throw error;

      setRoutes([data, ...routes]);
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'An error occurred' 
      };
    }
  };

  const updateRoute = async (id: string, updates: Partial<Route>) => {
    try {
      const { error } = await supabase
        .from('routes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setRoutes(routes.map(route => 
        route.id === id ? { ...route, ...updates } : route
      ));

      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'An error occurred' 
      };
    }
  };

  return { routes, loading, error, addRoute, updateRoute };
}