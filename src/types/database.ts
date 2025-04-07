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