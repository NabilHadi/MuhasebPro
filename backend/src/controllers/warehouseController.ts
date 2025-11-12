import { Request, Response } from 'express';
import { getConnection } from '../config/database';

// الحصول على جميع المخازن
export const getAllWarehouses = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [warehouses]: any = await connection.execute(
      `SELECT id, name, location, manager, type, capacity, is_active, created_at, updated_at
       FROM warehouses
       WHERE is_active = TRUE
       ORDER BY name ASC`
    );
    connection.release();
    res.json(warehouses);
  } catch (error) {
    console.error('خطأ في جلب المخازن:', error);
    res.status(500).json({ message: 'فشل في جلب المخازن' });
  }
};

// الحصول على مخزن بواسطة المعرف
export const getWarehouseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [warehouse]: any = await connection.execute(
      `SELECT id, name, location, manager, type, capacity, is_active, created_at, updated_at
       FROM warehouses
       WHERE id = ? AND is_active = TRUE`,
      [id]
    );
    connection.release();

    if (warehouse.length === 0) {
      return res.status(404).json({ message: 'المخزن غير موجود' });
    }

    res.json(warehouse[0]);
  } catch (error) {
    console.error('خطأ في جلب المخزن:', error);
    res.status(500).json({ message: 'فشل في جلب المخزن' });
  }
};

// إنشاء مخزن جديد
export const createWarehouse = async (req: Request, res: Response) => {
  try {
    const { name, location, manager, type, capacity } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'الاسم والنوع مطلوبان' });
    }

    const connection = await getConnection();
    
    // تحقق من وجود مخزن بنفس الاسم
    const [existing]: any = await connection.execute(
      'SELECT id FROM warehouses WHERE name = ? AND is_active = TRUE',
      [name]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'مخزن بهذا الاسم موجود بالفعل' });
    }

    const [result]: any = await connection.execute(
      `INSERT INTO warehouses (name, location, manager, type, capacity, is_active)
       VALUES (?, ?, ?, ?, ?, TRUE)`,
      [name, location || null, manager || null, type, capacity || 0]
    );

    connection.release();

    res.status(201).json({
      id: result.insertId,
      name,
      location,
      manager,
      type,
      capacity,
      is_active: true,
      message: 'تم إنشاء المخزن بنجاح'
    });
  } catch (error) {
    console.error('خطأ في إنشاء المخزن:', error);
    res.status(500).json({ message: 'فشل في إنشاء المخزن' });
  }
};

// تحديث المخزن
export const updateWarehouse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location, manager, type, capacity } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'الاسم والنوع مطلوبان' });
    }

    const connection = await getConnection();

    // تحقق من وجود المخزن
    const [existing]: any = await connection.execute(
      'SELECT id FROM warehouses WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'المخزن غير موجود' });
    }

    // تحقق من أن الاسم لم يتم استخدامه من قبل مخزن آخر
    const [duplicate]: any = await connection.execute(
      'SELECT id FROM warehouses WHERE name = ? AND id != ? AND is_active = TRUE',
      [name, id]
    );

    if (duplicate.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'اسم المخزن موجود بالفعل' });
    }

    await connection.execute(
      `UPDATE warehouses 
       SET name = ?, location = ?, manager = ?, type = ?, capacity = ?
       WHERE id = ?`,
      [name, location || null, manager || null, type, capacity || 0, id]
    );

    connection.release();

    res.json({
      id: parseInt(id),
      name,
      location,
      manager,
      type,
      capacity,
      message: 'تم تحديث المخزن بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تحديث المخزن:', error);
    res.status(500).json({ message: 'فشل في تحديث المخزن' });
  }
};

// حذف المخزن (حذف ناعم)
export const deleteWarehouse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    // تحقق من وجود المخزن
    const [existing]: any = await connection.execute(
      'SELECT id FROM warehouses WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'المخزن غير موجود' });
    }

    // تحقق مما إذا كان المخزن يحتوي على منتجات مرتبطة به
    const [linkedProducts]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM products WHERE warehouse_id = ? AND is_active = TRUE',
      [id]
    );

    if (linkedProducts[0].count > 0) {
      connection.release();
      return res.status(409).json({ 
        message: `لا يمكن حذف مخزن مرتبط بـ ${linkedProducts[0].count} منتجات` 
      });
    }

    // حذف ناعم
    await connection.execute(
      'UPDATE warehouses SET is_active = FALSE WHERE id = ?',
      [id]
    );

    connection.release();

    res.json({ message: 'تم حذف المخزن بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف المخزن:', error);
    res.status(500).json({ message: 'فشل في حذف المخزن' });
  }
};
