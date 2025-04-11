export type UserRole = 'admin' | 'agency_admin' | 'customer';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
} 
export interface Booking {
  id: string;
  user_id: string;
  trip_id: string;
  passenger_name: string;
  passenger_phone: string;
  passenger_id?: string;
  seat_number: string;
  booking_date: string;
  payment_status: string;
  payment_method?: string;
  booking_status: string;
  qr_code?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
  trips?: {
    destination: string;
  };
}
export interface Route {
  id: string;
  start_point: string;
  destination: string;
  distance: number;
  duration: string;
  base_fare: number;
  created_at: string;
}
export interface Bus {
  id: string;
  name: string;
  type: string;
  capacity: number;
  amenities: Record<string, boolean>;
  status: 'active' | 'maintenance' | 'inactive';
  agency_id: string;
  created_at: string;
  agencies?: {
    name: string;
  };
}