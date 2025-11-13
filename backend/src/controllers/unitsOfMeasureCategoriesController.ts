import { Request, Response } from 'express';
import { getConnection } from '../config/database';

// الحصول على جميع فئات وحدات القياس
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [categories]: any = await connection.execute(
      `SELECT id, name_ar, name_en, description, is_active, created_at
       FROM units_of_measure_categories
       ORDER BY name_ar ASC`
    );
    connection.release();
    res.json(categories);
  } catch (error) {
    console.error('خطأ في جلب فئات وحدات القياس:', error);
    res.status(500).json({ message: 'فشل في جلب فئات وحدات القياس' });
  }
};

// الحصول على فئة بواسطة المعرف
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    const [category]: any = await connection.execute(
      `SELECT id, name_ar, name_en, description, is_active, created_at
       FROM units_of_measure_categories
       WHERE id = ?`,
      [id]
    );
    
    connection.release();

    if (category.length === 0) {
      return res.status(404).json({ message: 'الفئة غير موجودة' });
    }

    res.json(category[0]);
  } catch (error) {
    console.error('خطأ في جلب الفئة:', error);
    res.status(500).json({ message: 'فشل في جلب الفئة' });
  }
};

// إنشاء فئة جديدة
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name_ar, name_en, description } = req.body;

    if (!name_ar || !name_ar.trim()) {
      return res.status(400).json({ message: 'الاسم بالعربية مطلوب' });
    }

    const connection = await getConnection();

    // تحقق من عدم وجود فئة بنفس الاسم
    const [existing]: any = await connection.execute(
      'SELECT id FROM units_of_measure_categories WHERE name_ar = ?',
      [name_ar.trim()]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'هذه الفئة موجودة بالفعل' });
    }

    const [result]: any = await connection.execute(
      `INSERT INTO units_of_measure_categories (name_ar, name_en, description, is_active)
       VALUES (?, ?, ?, TRUE)`,
      [
        name_ar.trim(),
        name_en || null,
        description || null
      ]
    );

    connection.release();

    res.status(201).json({
      id: result.insertId,
      name_ar,
      name_en,
      description,
      is_active: true,
      message: 'تم إنشاء الفئة بنجاح'
    });
  } catch (error) {
    console.error('خطأ في إنشاء الفئة:', error);
    res.status(500).json({ message: 'فشل في إنشاء الفئة' });
  }
};

// تحديث فئة
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name_ar, name_en, description } = req.body;

    if (!name_ar || !name_ar.trim()) {
      return res.status(400).json({ message: 'الاسم بالعربية مطلوب' });
    }

    const connection = await getConnection();

    // تحقق من وجود الفئة
    const [existing]: any = await connection.execute(
      'SELECT id FROM units_of_measure_categories WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'الفئة غير موجودة' });
    }

    // تحقق من عدم تكرار الاسم من قبل فئة أخرى
    const [duplicate]: any = await connection.execute(
      'SELECT id FROM units_of_measure_categories WHERE name_ar = ? AND id != ?',
      [name_ar.trim(), id]
    );

    if (duplicate.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'هذه الفئة موجودة بالفعل' });
    }

    await connection.execute(
      `UPDATE units_of_measure_categories 
       SET name_ar = ?, name_en = ?, description = ?
       WHERE id = ?`,
      [
        name_ar.trim(),
        name_en || null,
        description || null,
        id
      ]
    );

    connection.release();

    res.json({
      id: parseInt(id),
      name_ar,
      name_en,
      description,
      message: 'تم تحديث الفئة بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تحديث الفئة:', error);
    res.status(500).json({ message: 'فشل في تحديث الفئة' });
  }
};

// تعطيل فئة
export const deactivateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    // تحقق من وجود الفئة
    const [existing]: any = await connection.execute(
      'SELECT id FROM units_of_measure_categories WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'الفئة غير موجودة' });
    }

    // تحقق من استخدام الفئة في وحدات قياس نشطة
    const [units]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM units_of_measure WHERE category_id = ? AND is_active = TRUE',
      [id]
    );

    if (units[0].count > 0) {
      connection.release();
      return res.status(409).json({
        message: `لا يمكن تعطيل فئة تحتوي على ${units[0].count} وحدات نشطة`
      });
    }

    // تحديث حالة النشاط
    await connection.execute(
      'UPDATE units_of_measure_categories SET is_active = FALSE WHERE id = ?',
      [id]
    );

    connection.release();

    res.json({ message: 'تم تعطيل الفئة بنجاح' });
  } catch (error) {
    console.error('خطأ في تعطيل الفئة:', error);
    res.status(500).json({ message: 'فشل في تعطيل الفئة' });
  }
};

// تفعيل فئة
export const activateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    // تحقق من وجود الفئة
    const [existing]: any = await connection.execute(
      'SELECT id FROM units_of_measure_categories WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'الفئة غير موجودة' });
    }

    // تحديث حالة النشاط
    await connection.execute(
      'UPDATE units_of_measure_categories SET is_active = TRUE WHERE id = ?',
      [id]
    );

    connection.release();

    res.json({ message: 'تم تفعيل الفئة بنجاح' });
  } catch (error) {
    console.error('خطأ في تفعيل الفئة:', error);
    res.status(500).json({ message: 'فشل في تفعيل الفئة' });
  }
};
