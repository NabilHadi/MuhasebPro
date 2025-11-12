import { getConnection } from '../config/database';

export const getAllProductCategories = async () => {
  const connection = await getConnection();
  try {
    const [categories]: any = await connection.execute(
      'SELECT * FROM product_categories WHERE is_active = TRUE ORDER BY category_name_ar ASC'
    );
    return categories;
  } finally {
    connection.release();
  }
};

export const getProductCategoryById = async (id: string | number) => {
  const connection = await getConnection();
  try {
    const [categories]: any = await connection.execute(
      'SELECT * FROM product_categories WHERE id = ?',
      [id]
    );

    if (categories.length === 0) {
      throw new Error('الفئة غير موجودة');
    }

    return categories[0];
  } finally {
    connection.release();
  }
};

export const createProductCategory = async (data: {
  category_name_ar: string;
  category_name_en?: string;
  description?: string;
}) => {
  const { category_name_ar, category_name_en, description } = data;

  // Validation
  if (!category_name_ar) {
    throw new Error('اسم الفئة بالعربية مطلوب');
  }

  const connection = await getConnection();
  try {
    // Check if category name already exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM product_categories WHERE category_name_ar = ?',
      [category_name_ar]
    );

    if (existing.length > 0) {
      throw new Error('اسم الفئة مستخدم بالفعل');
    }

    const result: any = await connection.execute(
      `INSERT INTO product_categories (category_name_ar, category_name_en, description, is_active)
       VALUES (?, ?, ?, ?)`,
      [category_name_ar, category_name_en || null, description || null, true]
    );

    return { id: result[0].insertId, message: 'تم إضافة الفئة بنجاح' };
  } finally {
    connection.release();
  }
};

export const updateProductCategory = async (
  id: string | number,
  data: {
    category_name_ar: string;
    category_name_en?: string;
    description?: string;
    is_active?: boolean;
  }
) => {
  const { category_name_ar, category_name_en, description, is_active } = data;

  // Validation
  if (!category_name_ar) {
    throw new Error('اسم الفئة بالعربية مطلوب');
  }

  const connection = await getConnection();
  try {
    // Check if category exists
    const [category]: any = await connection.execute(
      'SELECT * FROM product_categories WHERE id = ?',
      [id]
    );

    if (category.length === 0) {
      throw new Error('الفئة غير موجودة');
    }

    // Check if category name is unique (if changed)
    if (category_name_ar !== category[0].category_name_ar) {
      const [existing]: any = await connection.execute(
        'SELECT id FROM product_categories WHERE category_name_ar = ? AND id != ?',
        [category_name_ar, id]
      );

      if (existing.length > 0) {
        throw new Error('اسم الفئة مستخدم بالفعل');
      }
    }

    await connection.execute(
      `UPDATE product_categories SET
        category_name_ar = ?, category_name_en = ?, description = ?, is_active = ?
      WHERE id = ?`,
      [
        category_name_ar,
        category_name_en || null,
        description || null,
        is_active !== undefined ? is_active : category[0].is_active,
        id,
      ]
    );

    return { message: 'تم تحديث الفئة بنجاح' };
  } finally {
    connection.release();
  }
};

export const deleteProductCategory = async (id: string | number) => {
  const connection = await getConnection();
  try {
    // Check if category exists
    const [category]: any = await connection.execute(
      'SELECT id FROM product_categories WHERE id = ?',
      [id]
    );

    if (category.length === 0) {
      throw new Error('الفئة غير موجودة');
    }

    // Check if any products use this category
    const [productsUsingCategory]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id]
    );

    if (productsUsingCategory[0].count > 0) {
      throw new Error(`لا يمكن حذف الفئة - يوجد ${productsUsingCategory[0].count} منتج(ات) تستخدم هذه الفئة`);
    }

    // Soft delete: set is_active = FALSE
    await connection.execute(
      'UPDATE product_categories SET is_active = FALSE WHERE id = ?',
      [id]
    );

    return { message: 'تم حذف الفئة بنجاح' };
  } finally {
    connection.release();
  }
};
