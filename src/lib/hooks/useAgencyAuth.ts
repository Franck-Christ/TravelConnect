import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

interface AgencyAdmin {
  id: string;
  email: string;
  full_name: string;
  agency_id?: string;
}

interface AgencyAuthContextType {
  agencyAdmin: AgencyAdmin | null;
  loading: boolean;
  error: string | null;
  agencySignIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  agencySignOut: () => Promise<void>;
  updateAgencyProfile: (data: { full_name?: string; phone_number?: string; agency_id?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AgencyAuthContext = createContext<AgencyAuthContextType | undefined>(undefined);

export function AgencyAuthProvider({ children }: { children: React.ReactNode }) {
  const [agencyAdmin, setAgencyAdmin] = useState<AgencyAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing agency admin session
    const checkAgencySession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          // Check if user is an agency admin
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, full_name, role, agency_id')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            throw profileError;
          }
          
          // Only set agency admin if role is agency_admin
          if (profile.role === 'agency_admin') {
            setAgencyAdmin({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              agency_id: profile.agency_id
            });
          }
        }
      } catch (err: any) {
        console.error('Error checking agency session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkAgencySession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Check if user is an agency admin
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, full_name, role, agency_id')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }
          
          // Only set agency admin if role is agency_admin
          if (profile.role === 'agency_admin') {
            setAgencyAdmin({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              agency_id: profile.agency_id
            });
            navigate('/agency-dashboard');
          }
        } else if (event === 'SIGNED_OUT') {
          setAgencyAdmin(null);
          navigate('/agency-login');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const agencySignIn = async (email: string, password: string) => {
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
        // Check if user is an agency admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, full_name, role, agency_id')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        // Only allow agency_admin role to sign in
        if (profile.role !== 'agency_admin') {
          // Sign out non-agency admin users
          await supabase.auth.signOut();
          throw new Error('Access denied. Agency admin privileges required.');
        }
        
        setAgencyAdmin({
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          agency_id: profile.agency_id
        });
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Error signing in as agency admin:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const agencySignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setAgencyAdmin(null);
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAgencyProfile = async (data: { full_name?: string; phone_number?: string; agency_id?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!agencyAdmin) {
        throw new Error('No agency admin logged in');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', agencyAdmin.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setAgencyAdmin(prev => prev ? { ...prev, ...data } : null);
      
      return { success: true };
    } catch (err: any) {
      console.error('Error updating agency profile:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    agencyAdmin,
    loading,
    error,
    agencySignIn,
    agencySignOut,
    updateAgencyProfile
  };

  return <AgencyAuthContext.Provider value={value}>{children}</AgencyAuthContext.Provider>;
}

export function useAgencyAuth() {
  const context = useContext(AgencyAuthContext);
  if (context === undefined) {
    throw new Error('useAgencyAuth must be used within an AgencyAuthProvider');
  }
  return context;
} 