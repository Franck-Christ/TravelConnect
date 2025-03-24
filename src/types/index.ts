export interface User {
  id: string;
  email?: string;
  phone?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  preferred_routes?: string[];
}

export interface Agency {
  id: string;
  name: string;
  logo_url?: string;
  rating: number;
  review_count: number;
}

export interface Trip {
  id: string;
  agency_id: string;
  agency: Agency;
  departure_city: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: number;
  bus_type: 'VIP' | 'Classic' | 'Minibus';
  available_seats: number;
  total_seats: number;
  amenities: string[];
}

export interface Booking {
  id: string;
  user_id: string;
  trip_id: string;
  trip: Trip;
  passenger_name: string;
  passenger_phone: string;
  passenger_id?: string;
  seat_number: string;
  booking_date: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_method?: 'mtn_momo' | 'orange_money' | 'card' | 'cash';
  booking_status: 'confirmed' | 'cancelled' | 'completed';
  qr_code?: string;
}