import { getConnection } from '../config/database';

export const getAllProducts = async () => {
  const connection = await getConnection();
  try {
    const [products]: any = await connection.execute(
      'SELECT * FROM products WHERE is_active = TRUE ORDER BY product_code ASC'
    );
    return products;
  } finally {
    connection.release();
  }
};

export const getProductById = async (id: string | number) => {
  const connection = await getConnection();
  try {
    const [products]: any = await connection.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      throw new Error('المنتج غير موجود');
    }

    return products[0];
  } finally {
    connection.release();
  }
};

export const createProduct = async (data: {
  product_code: string;
  product_name_ar: string;
  product_name_en?: string;
  category_id?: number | null;
  unit_of_measure?: string;
  product_type?: 'Stockable' | 'Service' | 'Consumable';
  track_inventory?: boolean;
  cost_price?: number;
  sale_price?: number;
  reorder_level?: number;
  warehouse_id?: number | null;
  income_account_id?: number | null;
  expense_account_id?: number | null;
  inventory_account_id?: number | null;
  description?: string;
}) => {
  const {
    product_code,
    product_name_ar,
    product_name_en,
    category_id,
    unit_of_measure,
    product_type,
    track_inventory,
    cost_price,
    sale_price,
    reorder_level,
    warehouse_id,
    income_account_id,
    expense_account_id,
    inventory_account_id,
    description,
  } = data;

  // Validation
  if (!product_code || !product_name_ar) {
    throw new Error('رمز المنتج والاسم بالعربية مطلوبة');
  }

  const connection = await getConnection();
  try {
    // Check if product code already exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM products WHERE product_code = ?',
      [product_code]
    );

    if (existing.length > 0) {
      throw new Error('رمز المنتج مستخدم بالفعل');
    }

    const result: any = await connection.execute(
      `INSERT INTO products (
        product_code, product_name_ar, product_name_en, category_id, unit_of_measure,
        product_type, track_inventory, cost_price, sale_price, reorder_level,
        warehouse_id, income_account_id, expense_account_id, inventory_account_id,
        description, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_code,
        product_name_ar,
        product_name_en || null,
        category_id || null,
        unit_of_measure || 'وحدة',
        product_type || 'Stockable',
        track_inventory !== undefined ? track_inventory : true,
        cost_price || 0,
        sale_price || 0,
        reorder_level || 0,
        warehouse_id || null,
        income_account_id || null,
        expense_account_id || null,
        inventory_account_id || null,
        description || null,
        true,
      ]
    );

    return { id: result[0].insertId, message: 'تم إضافة المنتج بنجاح' };
  } finally {
    connection.release();
  }
};

export const updateProduct = async (
  id: string | number,
  data: {
    product_code: string;
    product_name_ar: string;
    product_name_en?: string;
    category_id?: number | null;
    unit_of_measure?: string;
    product_type?: 'Stockable' | 'Service' | 'Consumable';
    track_inventory?: boolean;
    cost_price?: number;
    sale_price?: number;
    reorder_level?: number;
    warehouse_id?: number | null;
    income_account_id?: number | null;
    expense_account_id?: number | null;
    inventory_account_id?: number | null;
    is_active?: boolean;
    description?: string;
  }
) => {
  const {
    product_code,
    product_name_ar,
    product_name_en,
    category_id,
    unit_of_measure,
    product_type,
    track_inventory,
    cost_price,
    sale_price,
    reorder_level,
    warehouse_id,
    income_account_id,
    expense_account_id,
    inventory_account_id,
    is_active,
    description,
  } = data;

  // Validation
  if (!product_code || !product_name_ar) {
    throw new Error('رمز المنتج والاسم بالعربية مطلوبة');
  }

  const connection = await getConnection();
  try {
    // Check if product exists
    const [product]: any = await connection.execute(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (product.length === 0) {
      throw new Error('المنتج غير موجود');
    }

    // Check if product code is unique (if changed)
    const [existing]: any = await connection.execute(
      'SELECT id FROM products WHERE product_code = ? AND id != ?',
      [product_code, id]
    );

    if (existing.length > 0) {
      throw new Error('رمز المنتج مستخدم بالفعل');
    }

    await connection.execute(
      `UPDATE products SET
        product_code = ?, product_name_ar = ?, product_name_en = ?, category_id = ?,
        unit_of_measure = ?, product_type = ?, track_inventory = ?, cost_price = ?,
        sale_price = ?, reorder_level = ?, warehouse_id = ?, income_account_id = ?,
        expense_account_id = ?, inventory_account_id = ?, is_active = ?, description = ?
      WHERE id = ?`,
      [
        product_code,
        product_name_ar,
        product_name_en || null,
        category_id || null,
        unit_of_measure || 'وحدة',
        product_type || 'Stockable',
        track_inventory !== undefined ? track_inventory : true,
        cost_price || 0,
        sale_price || 0,
        reorder_level || 0,
        warehouse_id || null,
        income_account_id || null,
        expense_account_id || null,
        inventory_account_id || null,
        is_active !== undefined ? is_active : true,
        description || null,
        id,
      ]
    );

    return { message: 'تم تحديث المنتج بنجاح' };
  } finally {
    connection.release();
  }
};

export const deleteProduct = async (id: string | number) => {
  const connection = await getConnection();
  try {
    // Check if product exists
    const [product]: any = await connection.execute(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if (product.length === 0) {
      throw new Error('المنتج غير موجود');
    }

    // Soft delete: set is_active = FALSE
    await connection.execute(
      'UPDATE products SET is_active = FALSE WHERE id = ?',
      [id]
    );

    return { message: 'تم حذف المنتج بنجاح' };
  } finally {
    connection.release();
  }
};
