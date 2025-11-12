import { getConnection } from '../config/database';
import * as stockMovementsController from './stockMovementsController';

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
  quantity_on_hand?: number;
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
    quantity_on_hand = 0,
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
        product_type, track_inventory, quantity_on_hand, cost_price, sale_price, reorder_level,
        warehouse_id, income_account_id, expense_account_id, inventory_account_id,
        description, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_code,
        product_name_ar,
        product_name_en || null,
        category_id || null,
        unit_of_measure || 'وحدة',
        product_type || 'Stockable',
        track_inventory !== undefined ? track_inventory : true,
        quantity_on_hand || 0,
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

    const productId = result[0].insertId;

    // If quantity_on_hand > 0, create stock movement and journal entry
    if (quantity_on_hand > 0 && product_type === 'Stockable' && inventory_account_id) {
      try {
        await stockMovementsController.createStockMovement({
          product_id: productId,
          warehouse_id: warehouse_id || undefined,
          movement_type: 'IN',
          reference: `OPEN-${product_code}`,
          description: `رصيد افتتاحي - ${product_name_ar}`,
          quantity: quantity_on_hand,
          unit_cost: cost_price || 0,
          movement_date: new Date().toISOString().split('T')[0],
          autoCreateJournal: true,
          inventory_account_id,
          adjustment_account_id: undefined,
        });
      } catch (error: any) {
        console.error('خطأ في إنشاء حركة المخزون الافتتاحية:', error);
        // Continue even if journal creation fails
      }
    }

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
    unit_of_measure?: string;
    product_type?: 'Stockable' | 'Service' | 'Consumable';
    track_inventory?: boolean;
    quantity_on_hand?: number;
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
    quantity_on_hand,
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
        'SELECT id FROM products WHERE product_code = ? AND id != ?',
        [product_code, id]
      );

      if (existing.length > 0) {
        throw new Error('رمز المنتج مستخدم بالفعل');
      }
    }

    // Handle quantity adjustment if quantity_on_hand changed
    const quantityDiff = (quantity_on_hand !== undefined ? quantity_on_hand : currentProduct.quantity_on_hand) - currentProduct.quantity_on_hand;

    await connection.execute(
      `UPDATE products SET
        product_code = ?, product_name_ar = ?, product_name_en = ?, category_id = ?,
        unit_of_measure = ?, product_type = ?, track_inventory = ?, quantity_on_hand = ?,
        cost_price = ?, sale_price = ?, reorder_level = ?, warehouse_id = ?,
        income_account_id = ?, expense_account_id = ?, inventory_account_id = ?,
        is_active = ?, description = ?
      WHERE id = ?`,
      [
        product_code,
        product_name_ar,
        product_name_en || null,
        category_id || null,
        unit_of_measure || 'وحدة',
        product_type || 'Stockable',
        track_inventory !== undefined ? track_inventory : true,
        quantity_on_hand !== undefined ? quantity_on_hand : currentProduct.quantity_on_hand,
        cost_price !== undefined ? cost_price : currentProduct.cost_price,
        sale_price !== undefined ? sale_price : currentProduct.sale_price,
        reorder_level !== undefined ? reorder_level : currentProduct.reorder_level,
        warehouse_id !== undefined ? warehouse_id : currentProduct.warehouse_id,
        income_account_id !== undefined ? income_account_id : currentProduct.income_account_id,
        expense_account_id !== undefined ? expense_account_id : currentProduct.expense_account_id,
        inventory_account_id !== undefined ? inventory_account_id : currentProduct.inventory_account_id,
        is_active !== undefined ? is_active : currentProduct.is_active,
        description || currentProduct.description,
        id,
      ]
    );

    // If quantity changed, create adjustment stock movement and journal
    if (quantityDiff !== 0 && currentProduct.product_type === 'Stockable' && inventory_account_id !== undefined) {
      try {
        await stockMovementsController.createStockMovement({
          product_id: parseInt(id.toString()),
          warehouse_id: warehouse_id !== undefined ? warehouse_id : currentProduct.warehouse_id,
          movement_type: 'ADJUSTMENT',
          reference: `ADJ-${product_code}`,
          description: `تعديل مخزون - ${product_name_ar}`,
          quantity: quantityDiff,
          unit_cost: cost_price !== undefined ? cost_price : currentProduct.cost_price,
          movement_date: new Date().toISOString().split('T')[0],
          autoCreateJournal: true,
          inventory_account_id: inventory_account_id !== undefined ? inventory_account_id : currentProduct.inventory_account_id,
          adjustment_account_id: expense_account_id !== undefined ? expense_account_id : currentProduct.expense_account_id,
        });
      } catch (error: any) {
        console.error('خطأ في إنشاء حركة المخزون:', error);
        // Continue even if journal creation fails
      }
    }

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
