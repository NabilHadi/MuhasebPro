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
  cost?: string;
  profit_ratio?: string;
  selling_price?: string;
  main_category_id?: number | null;
  product_group?: string | null;
  classification_1?: string | null;
  classification_2?: string | null;
  classification_3?: string | null;
  classification_4?: string | null;
  classification_5?: string | null;
  category_id?: number | null;
  unit_id?: number | null;
  product_type: 'Stockable' | 'Service';
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  category_name_ar?: string;
  category_name_en?: string;
  main_category_name_ar?: string;
  main_category_name_en?: string;
  unit_name_ar?: string;
  unit_name_en?: string;
  short_name?: string;
  product_quantity?: string | null;
}

export interface ProductFormData {
  product_code: string;
  product_name_ar: string;
  product_name_en: string;
  cost: number;
  profit_ratio: number;
  selling_price: number;
  main_category_id: number | null;
  product_group: string | null;
  classification_1: string | null;
  classification_2: string | null;
  classification_3: string | null;
  classification_4: string | null;
  classification_5: string | null;
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
