import { getConnection } from '../config/database';

export const getAllProducts = async () => {
  const connection = await getConnection();
  try {
    const [products]: any = await connection.execute('SELECT * FROM products ORDER BY createdAt DESC');
    return products;
  } finally {
    connection.release();
  }
};

export const createProduct = async (data: {
  name: string;
  sku: string;
  description?: string;
  category?: string;
  buyingPrice?: number;
  sellingPrice?: number;
  minimumStock?: number;
  maximumStock?: number;
}) => {
  const { name, sku, description, category, buyingPrice, sellingPrice, minimumStock, maximumStock } = data;

  // Validation
  if (!name || !sku) {
    throw new Error('اسم المنتج والرمز مطلوبة');
  }

  const connection = await getConnection();
  try {
    const result: any = await connection.execute(
      'INSERT INTO products (name, sku, description, category, buyingPrice, sellingPrice, minimumStock, maximumStock, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, sku, description || null, category || null, buyingPrice || 0, sellingPrice || 0, minimumStock || 0, maximumStock || 0, 0]
    );
    return { id: result[0].insertId, message: 'تم إضافة المنتج بنجاح' };
  } finally {
    connection.release();
  }
};

export const updateProduct = async (id: string | number, data: {
  name: string;
  sku: string;
  description?: string;
  category?: string;
  buyingPrice?: number;
  sellingPrice?: number;
  minimumStock?: number;
  maximumStock?: number;
}) => {
  const { name, sku, description, category, buyingPrice, sellingPrice, minimumStock, maximumStock } = data;

  const connection = await getConnection();
  try {
    await connection.execute(
      'UPDATE products SET name = ?, sku = ?, description = ?, category = ?, buyingPrice = ?, sellingPrice = ?, minimumStock = ?, maximumStock = ? WHERE id = ?',
      [name, sku, description || null, category || null, buyingPrice || 0, sellingPrice || 0, minimumStock || 0, maximumStock || 0, id]
    );
    return { message: 'تم تحديث المنتج بنجاح' };
  } finally {
    connection.release();
  }
};

export const deleteProduct = async (id: string | number) => {
  const connection = await getConnection();
  try {
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    return { message: 'تم حذف المنتج بنجاح' };
  } finally {
    connection.release();
  }
};
