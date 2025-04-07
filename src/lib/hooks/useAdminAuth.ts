import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  error: string | null;
  adminSignIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminSignOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing admin session
    const checkAdminSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          // Check if user is an admin
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, full_name, role')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            throw profileError;
          }
          
          // Only set admin if role is admin
          if (profile.role === 'admin') {
            setAdmin({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name
            });
          }
        }
      } catch (err: any) {
        console.error('Error checking admin session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Check if user is an admin
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, full_name, role')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }
          
          // Only set admin if role is admin
          if (profile.role === 'admin') {
            setAdmin({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name
            });
            navigate('/admin-dashboard');
          }
        } else if (event === 'SIGNED_OUT') {
          setAdmin(null);
          navigate('/admin');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const adminSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Check if user is an admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, full_name, role')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        // Only allow admin role to sign in
        if (profile.role !== 'admin') {
          // Sign out non-admin users
          await supabase.auth.signOut();
          throw new Error('Access denied. Admin privileges required.');
        }
        
        setAdmin({
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name
        });
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Error signing in as admin:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const adminSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setAdmin(null);
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    admin,
    loading,
    error,
    adminSignIn,
    adminSignOut
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
} 