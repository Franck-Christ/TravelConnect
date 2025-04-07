import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  role: 'admin' | 'agency_admin' | 'customer';
  created_at: string;
  updated_at: string;
}

interface UseUsersOptions {
  search?: string;
  role?: string;
}

interface UpdateRoleResult {
  success: boolean;
  error?: string;
}

interface ImportUsersResult {
  success: boolean;
  imported?: number;
  error?: string;
}

export function useUsers(options: UseUsersOptions = {}) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simple query to fetch all profiles
        let { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Apply filters in memory if needed
        let filteredProfiles = profiles || [];
        
        if (options.search) {
          const searchLower = options.search.toLowerCase();
          filteredProfiles = filteredProfiles.filter(profile => 
            profile.email?.toLowerCase().includes(searchLower) || 
            profile.full_name?.toLowerCase().includes(searchLower)
          );
        }
        
        if (options.role) {
          filteredProfiles = filteredProfiles.filter(profile => 
            profile.role === options.role
          );
        }

        setUsers(filteredProfiles);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [options.search, options.role]);

  const updateUserRole = async (userId: string, newRole: string): Promise<UpdateRoleResult> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole as Profile['role'] } : user
        )
      );

      return { success: true };
    } catch (err: any) {
      console.error('Error updating user role:', err);
      return { 
        success: false, 
        error: err.message || 'Failed to update user role' 
      };
    }
  };

  const importUsers = async (): Promise<ImportUsersResult> => {
    try {
      setImporting(true);
      
      // This is a placeholder for actual import logic
      // In a real implementation, you might:
      // 1. Upload a CSV file
      // 2. Process the file
      // 3. Insert records into the database
      
      // Simulate a delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll just return a success with a random number
      const importedCount = Math.floor(Math.random() * 10) + 1;
      
      return { 
        success: true, 
        imported: importedCount 
      };
    } catch (err: any) {
      console.error('Error importing users:', err);
      return { 
        success: false, 
        error: err.message || 'Failed to import users' 
      };
    } finally {
      setImporting(false);
    }
  };

  return {
    users,
    loading,
    error,
    importing,
    updateUserRole,
    importUsers
  };
} 