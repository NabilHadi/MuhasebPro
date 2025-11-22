export interface InvoiceLineItem {
  id?: number;
  line_number?: number;              // رقم الصنف (line number)
  product_code: string;              // رقم الصنف (product code)
  product_name_ar: string;           // اسم الصنف (product name)
  unit: string;                      // الوحدة (unit)
  quantity: number;                  // الكمية (quantity)
  price: number;                     // السعر (price)
  discount_amount?: number;          // خصم مبلغ (discount amount)
  discount_percent?: number;         // خصم % (discount percentage)
  total_discount?: number;           // خصومات (total discounts)
  net_amount?: number;               // الصافي (net amount)
  tax?: number;                      // الضريبة (tax)
  total: number;                     // الاجمالي (total)
  notes?: string;                    // ملاحظة (notes)
}

export interface Invoice {
  id?: number;
  invoice_number: string;
  payment_method?: string;
  company_id?: number;
  company_name?: string;
  warehouse_id?: number;
  warehouse_name?: string;
  is_posted?: boolean;
  tax_number?: string;
  mobile?: string;
  document_number?: string;
  invoice_date: string;
  supply_date?: string;
  branch_id?: number;
  branch_name?: string;
  account_id?: number;
  employee_id?: number;
  employee_name?: string;
  customer_id?: number;
  customer_name_ar?: string;
  address?: string;
  line_items?: InvoiceLineItem[];
  subtotal?: number;
  discount_fixed?: number;
  discount_percent?: number;
  tax?: number;
  total?: number;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceFormData {
  invoice_number: string;
  payment_method?: string;
  company_id?: number;
  company_name?: string;
  warehouse_id?: number;
  warehouse_name?: string;
  is_posted?: boolean;
  tax_number?: string;
  mobile?: string;
  document_number?: string;
  invoice_date: string;
  supply_date?: string;
  branch_id?: number;
  branch_name?: string;
  account_id?: number;
  employee_id?: number;
  employee_name?: string;
  customer_id?: number;
  customer_name_ar?: string;
  address?: string;
  line_items?: InvoiceLineItem[];
  subtotal?: number;
  discount_fixed?: number;
  discount_percent?: number;
  tax?: number;
  total?: number;
  notes?: string;
}

export interface Customer {
  id: number;
  code: string;
  name_ar: string;
  name_en?: string;
}

export interface Product {
  id: number;
  product_code: string;
  product_name_ar: string;
  product_name_en?: string;
  selling_price: number;
  unit_id?: number;
}
