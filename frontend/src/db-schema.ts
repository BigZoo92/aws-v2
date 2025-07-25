export type UserRole = 'standard' | 'admin';

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
};

export type Product = {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  price: number | null;
  created_at: string;
  image_url: string | null;
};

export type Comment = {
  id: number;
  user_id: number;
  product_id: number;
  content: string;
  created_at: string;
};
