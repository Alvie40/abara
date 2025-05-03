export interface Book {
  id: number;
  title: string;
  description: string;
  price: number;
  author: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  city: string;
  country: string;
  state: string;
  zipcode: string;
}

export interface Order {
  id?: number;
  name: string;
  email?: string;
  address: Address;
  phone: string;
  book_ids: number[];
  total_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface CartState {
  items: CartItem[];
  total: number;
}