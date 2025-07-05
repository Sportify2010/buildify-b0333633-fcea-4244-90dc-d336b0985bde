
export interface Sport {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  sport_id: string;
  logo_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  sport?: Sport;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  sport_id: string;
  start_time: string;
  end_time: string | null;
  stream_url: string | null;
  thumbnail_url: string | null;
  status: 'upcoming' | 'live' | 'completed';
  created_at: string;
  updated_at: string;
  sport?: Sport;
  teams?: Team[];
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'canceled' | 'expired';
  payment_method: 'bank_transfer' | 'card' | 'paypal';
  payment_id: string | null;
  start_date: string;
  end_date: string | null;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  event_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  event?: Event;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'bank_transfer', name: 'Bank Transfer', icon: 'building-bank' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
  { id: 'paypal', name: 'PayPal', icon: 'paypal' }
];