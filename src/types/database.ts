export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  product_id: string;
  quantity_change: number;
  type: 'IN' | 'OUT';
  created_by: string;
  created_at: string;
}