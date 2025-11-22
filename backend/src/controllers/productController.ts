import { getConnection } from '../config/database';

export const getAllProducts = async () => {
  const connection = await getConnection();
  try {
    const [products]: any = await connection.execute(
      `SELECT 
        p.id, p.product_code, p.product_name_ar, p.product_name_en, p.cost, p.profit_ratio, 
        p.selling_price, p.main_category_id, p.product_group, p.classification_1, p.classification_2, 
        p.classification_3, p.classification_4, p.classification_5, p.category_id, p.unit_id, 
        p.product_type, p.is_active, p.description, p.created_at, p.updated_at,
        pc.id as category_id_join, pc.category_name_ar, pc.category_name_en,
        u.id as unit_id_join, u.name_ar as unit_name_ar, u.name_en as unit_name_en, u.short_name,
        mc.id as main_category_id_join, mc.category_name_ar as main_category_name_ar, mc.category_name_en as main_category_name_en
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN product_categories mc ON p.main_category_id = mc.id
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
      `SELECT 
        p.id, p.product_code, p.product_name_ar, p.product_name_en, p.cost, p.profit_ratio, 
        p.selling_price, p.main_category_id, p.product_group, p.classification_1, p.classification_2, 
        p.classification_3, p.classification_4, p.classification_5, p.category_id, p.unit_id, 
        p.product_type, p.is_active, p.description, p.created_at, p.updated_at,
        pc.id as category_id_join, pc.category_name_ar, pc.category_name_en,
        u.id as unit_id_join, u.name_ar as unit_name_ar, u.name_en as unit_name_en, u.short_name,
        mc.id as main_category_id_join, mc.category_name_ar as main_category_name_ar, mc.category_name_en as main_category_name_en
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN product_categories mc ON p.main_category_id = mc.id
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
  cost?: number;
  profit_ratio?: number;
  selling_price?: number;
  main_category_id?: number | null;
  product_group?: string | null;
  classification_1?: string | null;
  classification_2?: string | null;
  classification_3?: string | null;
  classification_4?: string | null;
  classification_5?: string | null;
  category_id?: number | null;
  unit_id?: number | null;
  product_type?: 'Stockable' | 'Service';
  description?: string;
}) => {
  const {
    product_code,
    product_name_ar,
    product_name_en,
    cost = 0,
    profit_ratio = 0,
    selling_price = 0,
    main_category_id,
    product_group,
    classification_1,
    classification_2,
    classification_3,
    classification_4,
    classification_5,
    category_id,
    unit_id,
    product_type = 'Stockable',
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

    // Validate main category if provided
    if (main_category_id) {
      const [categoryCheck]: any = await connection.execute(
        'SELECT id FROM product_categories WHERE id = ? AND is_active = TRUE',
        [main_category_id]
      );
      if (categoryCheck.length === 0) {
        throw new Error('القسم الأساسي المحدد غير موجود');
      }
    }

    // Validate category if provided (for backward compatibility)
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
        product_code, product_name_ar, product_name_en, cost, profit_ratio, selling_price,
        main_category_id, product_group, classification_1, classification_2, classification_3,
        classification_4, classification_5, category_id, unit_id, product_type, description, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_code,
        product_name_ar,
        product_name_en || null,
        cost,
        profit_ratio,
        selling_price,
        main_category_id || null,
        product_group || null,
        classification_1 || null,
        classification_2 || null,
        classification_3 || null,
        classification_4 || null,
        classification_5 || null,
        category_id || null,
        unit_id || null,
        product_type,
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
    cost?: number;
    profit_ratio?: number;
    selling_price?: number;
    main_category_id?: number | null;
    product_group?: string | null;
    classification_1?: string | null;
    classification_2?: string | null;
    classification_3?: string | null;
    classification_4?: string | null;
    classification_5?: string | null;
    category_id?: number | null;
    unit_id?: number | null;
    product_type?: 'Stockable' | 'Service';
    is_active?: boolean;
    description?: string;
  }
) => {
  const {
    product_code,
    product_name_ar,
    product_name_en,
    cost,
    profit_ratio,
    selling_price,
    main_category_id,
    product_group,
    classification_1,
    classification_2,
    classification_3,
    classification_4,
    classification_5,
    category_id,
    unit_id,
    product_type = 'Stockable',
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

    // Validate main category if provided
    if (main_category_id) {
      const [categoryCheck]: any = await connection.execute(
        'SELECT id FROM product_categories WHERE id = ? AND is_active = TRUE',
        [main_category_id]
      );
      if (categoryCheck.length === 0) {
        throw new Error('القسم الأساسي المحدد غير موجود');
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
        product_code = ?, product_name_ar = ?, product_name_en = ?, cost = ?, profit_ratio = ?,
        selling_price = ?, main_category_id = ?, product_group = ?, classification_1 = ?,
        classification_2 = ?, classification_3 = ?, classification_4 = ?, classification_5 = ?,
        category_id = ?, unit_id = ?, product_type = ?, is_active = ?, description = ?
      WHERE id = ?`,
      [
        product_code,
        product_name_ar,
        product_name_en || null,
        cost !== undefined ? cost : currentProduct.cost,
        profit_ratio !== undefined ? profit_ratio : currentProduct.profit_ratio,
        selling_price !== undefined ? selling_price : currentProduct.selling_price,
        main_category_id !== undefined ? (main_category_id || null) : currentProduct.main_category_id,
        product_group !== undefined ? (product_group || null) : currentProduct.product_group,
        classification_1 !== undefined ? (classification_1 || null) : currentProduct.classification_1,
        classification_2 !== undefined ? (classification_2 || null) : currentProduct.classification_2,
        classification_3 !== undefined ? (classification_3 || null) : currentProduct.classification_3,
        classification_4 !== undefined ? (classification_4 || null) : currentProduct.classification_4,
        classification_5 !== undefined ? (classification_5 || null) : currentProduct.classification_5,
        category_id !== undefined ? (category_id || null) : currentProduct.category_id,
        unit_id !== undefined ? (unit_id || null) : currentProduct.unit_id,
        product_type,
        is_active !== undefined ? is_active : currentProduct.is_active,
        description !== undefined ? (description || currentProduct.description) : currentProduct.description,
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
