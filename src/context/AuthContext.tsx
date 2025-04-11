import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (credentials: { identifier: string; password: string }) => Promise<{ error: any }>;
  signUp: (credentials: { fullname: string; email: string; phone: string; password: string; username: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        setUser(data as User || {
          id: session.user.id,
          email: session.user.email,
          phone: session.user.phone,
        });
      }
      
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser(data as User || {
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ identifier, password }: { identifier: string; password: string }) => {
    // Check if identifier is an email
    const isEmail = identifier.includes('@');
    
    let { data, error } = await supabase.auth.signInWithPassword({
      email: isEmail ? identifier : '',
      phone: !isEmail ? identifier : '',
      password,
    });

    if (error && !isEmail) {
      // If phone login fails, try username login
      const { data: userData } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();

      if (userData?.email) {
        ({ data, error } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password,
        }));
      }
    }

    if (!error && data?.user) {
      // Fetch user profile after successful sign-in
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      setUser(profileData as User || {
        id: data.user.id,
        email: data.user.email,
        phone: data.user.phone,
      });
    }

    return { error };
  };

  const signUp = async ({ email, phone, password, username, fullname }: { 
    email: string;
    phone: string;
    password: string;
    username: string;
    fullname: string;
  }) => {
    // Format phone number to E.164 format if provided
    let formattedPhone = phone;
    if (phone && !phone.startsWith('+')) {
      formattedPhone = `+237${phone.replace(/^0+/, '')}`;
    }

    // Determine if we're using email or phone for signup
    const signUpData = email 
      ? { email, password }
      : { phone: formattedPhone, password };

    const { data, error } = await supabase.auth.signUp({
      ...signUpData,
      options: {
        data: {
          username,
          fullname,
        },
      },
    });

    if (!error && data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email || null,
            phone: formattedPhone || null,
            username,
            full_name: fullname,
          },
        ]);

      return { error: profileError };
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (!error) {
      setUser({ ...user, ...data });
    }

    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};