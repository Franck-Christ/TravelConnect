import React, { useState, useEffect } from 'react';
import { Users, Bus, CreditCard, Calendar } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

// Sample data for the chart
const chartData = [
  { name: 'Jan', bookings: 0 },
  { name: 'Feb', bookings:0 },
  { name: 'Mar', bookings: 0 },
  { name: 'Apr', bookings: 0 },
  { name: 'May', bookings: 0 },
  { name: 'Jun', bookings: 0 }
];

// Define types for our data
interface Stats {
  totalBookings: number;
  activeUsers: number;
  activeBuses: number;
  revenue: number;
}

interface Booking {
  id: string;
  amount: number;
  created_at: string;
  users?: {
    name: string;
  };
  trips?: {
    destination: string;
  };
}

interface Route {
  destination: string;
  count: number;
}

export default function AdminDashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    activeUsers: 0,
    activeBuses: 0,
    revenue: 0
  });
  
  const [displayStats, setDisplayStats] = useState<Stats>({
    totalBookings: 0,
    activeUsers: 0,
    activeBuses: 0,
    revenue: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch bookings count
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });
          
        if (bookingsError) throw bookingsError;
        
        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        // Fetch buses count
        const { count: busesCount, error: busesError } = await supabase
          .from('buses')
          .select('*', { count: 'exact', head: true });
          
        if (busesError) throw busesError;
        
        // Fetch revenue (sum of all booking amounts)
        const { data: revenueData, error: revenueError } = await supabase
          .from('bookings')
          .select('amount');
          
        if (revenueError) throw revenueError;
        
        const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.amount || 0), 0) || 0;
        
        // Fetch recent bookings
        const { data: recentBookingsData, error: recentBookingsError } = await supabase
          .from('bookings')
          .select('*, users(name), trips(destination)')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentBookingsError) throw recentBookingsError;
        
        // Fetch popular routes
        const { data: popularRoutesData, error: popularRoutesError } = await supabase
          .from('trips')
          .select('destination, count')
          .order('count', { ascending: false })
          .limit(5);
          
        if (popularRoutesError) throw popularRoutesError;
        
        // Update state with fetched data
        setStats({
          totalBookings: bookingsCount || 0,
          activeUsers: usersCount || 0,
          activeBuses: busesCount || 0,
          revenue: totalRevenue
        });
        
        setRecentBookings(recentBookingsData as Booking[] || []);
        setPopularRoutes(popularRoutesData as Route[] || []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Animate the stats with auto-increment
  useEffect(() => {
    if (isLoading) return;
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;
    
    const timers: NodeJS.Timeout[] = [];
    
    // Animate each stat
    Object.keys(stats).forEach((key) => {
      const targetValue = stats[key as keyof Stats];
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const currentValue = Math.floor(progress * targetValue);
        
        setDisplayStats(prev => ({
          ...prev,
          [key]: currentValue
        }));
        
        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);
      
      timers.push(timer);
    });
    
    // Cleanup timers
    return () => {
      timers.forEach(timer => clearInterval(timer));
    };
  }, [stats, isLoading]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Bookings"
          value={displayStats.totalBookings.toLocaleString()}
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Active Users"
          value={displayStats.activeUsers.toLocaleString()}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Active Buses"
          value={displayStats.activeBuses.toLocaleString()}
          icon={Bus}
          trend={{ value: 5, isPositive: true }}
        />
        <DashboardCard
          title="Revenue"
          value={`${displayStats.revenue.toLocaleString()} FCFA`}
          icon={CreditCard}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Booking Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking, index) => (
                <div key={index} className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="font-medium">{booking.users?.name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">{booking.trips?.destination || 'Unknown Destination'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{booking.amount?.toLocaleString()} FCFA</p>
                    <p className="text-sm text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent bookings found</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Popular Routes</h2>
          <div className="space-y-4">
            {popularRoutes.length > 0 ? (
              popularRoutes.map((route, index) => (
                <div key={index} className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="font-medium">{route.destination}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{route.count} bookings</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No popular routes found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}