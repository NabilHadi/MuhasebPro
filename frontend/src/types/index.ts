export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'accountant' | 'sales' | 'warehouse';
}

export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  createdAt?: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  creditLimit?: number;
  createdAt?: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  buyingPrice: number;
  sellingPrice: number;
  quantity: number;
  minimumStock: number;
  maximumStock: number;
  createdAt?: string;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  manager?: string;
  capacity?: number;
  createdAt?: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
}

export interface DashboardStats {
  totalSalesToday: number;
  totalPurchasesToday: number;
  productCount: number;
  lowStockProducts: Product[];
}
