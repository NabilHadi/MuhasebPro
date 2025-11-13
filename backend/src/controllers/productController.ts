import { getConnection } from '../config/database';

export const getAllProducts = async () => {
  const connection = await getConnection();
  try {
    const [products]: any = await connection.execute(
      `SELECT p.*, 
              pc.category_name_ar, pc.category_name_en,
              u.name_ar as unit_name_ar, u.name_en as unit_name_en, u.short_name
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN units_of_measure u ON p.unit_id = u.id
       WHERE p.is_active = TRUE 
       ORDER BY p.product_code ASC`
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
      `SELECT p.*, 
              pc.category_name_ar, pc.category_name_en,
              u.name_ar as unit_name_ar, u.name_en as unit_name_en, u.short_name
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN units_of_measure u ON p.unit_id = u.id
       WHERE p.id = ?`,
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
  unit_id?: number | null;
  product_type?: 'Stockable' | 'Service';
  reorder_level?: number;
  description?: string;
}) => {
  const {
    product_code,
    product_name_ar,
    product_name_en,
    category_id,
    unit_id,
    product_type = 'Stockable',
    reorder_level = 0,
    description,
  } = data;

  // Validation
  if (!product_code || !product_name_ar) {
    throw new Error('رمز المنتج والاسم بالعربية مطلوبة');
  }

  const connection = await getConnection();
  try {
    // Check if product code already exists among active products only
    const [existing]: any = await connection.execute(
      'SELECT id FROM products WHERE product_code = ? AND is_active = TRUE',
      [product_code]
    );

    if (existing.length > 0) {
      throw new Error('رمز المنتج مستخدم بالفعل');
    }

    // Validate category if provided
    if (category_id) {
      const [categoryCheck]: any = await connection.execute(
        'SELECT id FROM product_categories WHERE id = ? AND is_active = TRUE',
        [category_id]
      );
      if (categoryCheck.length === 0) {
        throw new Error('الفئة المحددة غير موجودة');
      }
    }

    // Validate unit if provided
    if (unit_id) {
      const [unitCheck]: any = await connection.execute(
        'SELECT id FROM units_of_measure WHERE id = ? AND is_active = TRUE',
        [unit_id]
      );
      if (unitCheck.length === 0) {
        throw new Error('وحدة القياس المحددة غير موجودة');
      }
    }

    const result: any = await connection.execute(
      `INSERT INTO products (
        product_code, product_name_ar, product_name_en, category_id, unit_id,
        product_type, reorder_level, description, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_code,
        product_name_ar,
        product_name_en || null,
        category_id || null,
        unit_id || null,
        product_type,
        reorder_level,
        description || null,
        true,
      ]
    );

    const productId = result[0].insertId;
    return { id: productId, message: 'تم إضافة المنتج بنجاح' };
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
    unit_id?: number | null;
    product_type?: 'Stockable' | 'Service';
    reorder_level?: number;
    is_active?: boolean;
    description?: string;
  }
) => {
  const {
    product_code,
    product_name_ar,
    product_name_en,
    category_id,
    unit_id,
    product_type = 'Stockable',
    reorder_level,
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
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (product.length === 0) {
      throw new Error('المنتج غير موجود');
    }

    const currentProduct = product[0];

    // Check if product code is unique (if changed)
    if (product_code !== currentProduct.product_code) {
      const [existing]: any = await connection.execute(
        'SELECT id FROM products WHERE product_code = ? AND id != ? AND is_active = TRUE',
        [product_code, id]
      );

      if (existing.length > 0) {
        throw new Error('رمز المنتج مستخدم بالفعل');
      }
    }

    // Validate category if provided
    if (category_id) {
      const [categoryCheck]: any = await connection.execute(
        'SELECT id FROM product_categories WHERE id = ? AND is_active = TRUE',
        [category_id]
      );
      if (categoryCheck.length === 0) {
        throw new Error('الفئة المحددة غير موجودة');
      }
    }

    // Validate unit if provided
    if (unit_id) {
      const [unitCheck]: any = await connection.execute(
        'SELECT id FROM units_of_measure WHERE id = ? AND is_active = TRUE',
        [unit_id]
      );
      if (unitCheck.length === 0) {
        throw new Error('وحدة القياس المحددة غير موجودة');
      }
    }

    await connection.execute(
      `UPDATE products SET
        product_code = ?, product_name_ar = ?, product_name_en = ?, category_id = ?,
        unit_id = ?, product_type = ?, reorder_level = ?, is_active = ?, description = ?
      WHERE id = ?`,
      [
        product_code,
        product_name_ar,
        product_name_en || null,
        category_id || null,
        unit_id || null,
        product_type,
        reorder_level !== undefined ? reorder_level : currentProduct.reorder_level,
        is_active !== undefined ? is_active : currentProduct.is_active,
        description || currentProduct.description,
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
