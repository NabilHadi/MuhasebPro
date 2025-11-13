export interface ProductCategory {
  id: number;
  category_number: number;
  category_name_ar: string;
  category_name_en?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: number;
  name_ar: string;
  name_en?: string;
  short_name?: string;
  category_id?: number;
  is_active: boolean;
}

export interface Product {
  id: number;
  product_code: string;
  product_name_ar: string;
  product_name_en?: string;
  category_id?: number | null;
  unit_id?: number | null;
  product_type: 'Stockable' | 'Service';
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  category_name_ar?: string;
  unit_name_ar?: string;
  short_name?: string;
}

export interface ProductFormData {
  product_code: string;
  product_name_ar: string;
  product_name_en: string;
  category_id: number | null;
  unit_id: number | null;
  product_type: 'Stockable' | 'Service';
  is_active: boolean;
  description: string;
}

export interface CategoryFormData {
  category_number: number;
  category_name_ar: string;
  category_name_en: string;
  description: string;
}
