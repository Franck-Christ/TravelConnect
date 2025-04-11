import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Bus,
  Map,
  BookOpen,
  CreditCard,
  Tag,
  Bell,
  MessageSquare,
  BarChart3,
  Settings,
  Building2
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
  { icon: Users, label: 'User Management', path: '/admin-users' },
  { icon: Bus, label: 'Bus Management', path: '/admin-buses' },
  { icon: Map, label: 'Route Management', path: '/admin-routes' },
  { icon: BookOpen, label: 'Bookings', path: '/admin-bookings' },


  // { icon: CreditCard, label: 'Payments', path: '/admin-payments' },
  // { icon: Tag, label: 'Promotions', path: '/admin-promotions' },
  // { icon: Bell, label: 'Notifications', path: '/admin-notifications' },
  // { icon: MessageSquare, label: 'Support', path: '/admin-support' },
  // { icon: Settings, label: 'Settings', path: '/admin-settings' },
];

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 min-h-screen p-4">
      <div className="flex items-center mb-8">
        <Bus className="text-blue-500 h-8 w-8" />
        <h1 className="text-white text-xl font-bold ml-2">TravelConnect</h1>
      </div>
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive ? 'bg-gray-800 text-white' : ''
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}