import { Request, Response } from 'express';
import { getConnection } from '../config/database';

// الحصول على جميع وحدات القياس
export const getAllUnits = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [units]: any = await connection.execute(
      `SELECT id, name_ar, name_en, short_name, category, ratio_to_base, is_base, is_active, description, created_at
       FROM units_of_measure
       ORDER BY category ASC, name_ar ASC`
    );
    connection.release();
    res.json(units);
  } catch (error) {
    console.error('خطأ في جلب وحدات القياس:', error);
    res.status(500).json({ message: 'فشل في جلب وحدات القياس' });
  }
};

// الحصول على وحدة قياس بواسطة المعرف
export const getUnitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    const [unit]: any = await connection.execute(
      `SELECT id, name_ar, name_en, short_name, category, ratio_to_base, is_base, is_active, description, created_at
       FROM units_of_measure
       WHERE id = ?`,
      [id]
    );
    
    connection.release();

    if (unit.length === 0) {
      return res.status(404).json({ message: 'وحدة القياس غير موجودة' });
    }

    res.json(unit[0]);
  } catch (error) {
    console.error('خطأ في جلب وحدة القياس:', error);
    res.status(500).json({ message: 'فشل في جلب وحدة القياس' });
  }
};

// إنشاء وحدة قياس جديدة
export const createUnit = async (req: Request, res: Response) => {
  try {
    const { name_ar, name_en, short_name, category, ratio_to_base, is_base, description } = req.body;

    if (!name_ar || !name_ar.trim()) {
      return res.status(400).json({ message: 'الاسم بالعربية مطلوب' });
    }

    if (!short_name || !short_name.trim()) {
      return res.status(400).json({ message: 'الاختصار مطلوب' });
    }

    const connection = await getConnection();

    // تحقق من عدم وجود اختصار مكرر
    const [existing]: any = await connection.execute(
      'SELECT id FROM units_of_measure WHERE short_name = ?',
      [short_name.trim().toUpperCase()]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'هذا الاختصار مسجل بالفعل' });
    }

    // إذا كانت وحدة أساسية، تأكد من عدم وجود وحدة أساسية أخرى في نفس الفئة
    if (is_base) {
      const [baseUnit]: any = await connection.execute(
        'SELECT id FROM units_of_measure WHERE category = ? AND is_base = TRUE',
        [category || 'General']
      );

      if (baseUnit.length > 0) {
        connection.release();
        return res.status(409).json({ message: 'توجد وحدة أساسية أخرى في هذه الفئة بالفعل' });
      }
    }

    const [result]: any = await connection.execute(
      `INSERT INTO units_of_measure (name_ar, name_en, short_name, category, ratio_to_base, is_base, is_active, description)
       VALUES (?, ?, ?, ?, ?, ?, TRUE, ?)`,
      [
        name_ar.trim(),
        name_en || null,
        short_name.trim().toUpperCase(),
        category || 'General',
        ratio_to_base || 1.0,
        is_base || false,
        description || null
      ]
    );

    connection.release();

    res.status(201).json({
      id: result.insertId,
      name_ar,
      name_en,
      short_name: short_name.toUpperCase(),
      category: category || 'General',
      ratio_to_base: ratio_to_base || 1.0,
      is_base: is_base || false,
      is_active: true,
      description,
      message: 'تم إنشاء وحدة القياس بنجاح'
    });
  } catch (error) {
    console.error('خطأ في إنشاء وحدة القياس:', error);
    res.status(500).json({ message: 'فشل في إنشاء وحدة القياس' });
  }
};

// تحديث وحدة قياس
export const updateUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name_ar, name_en, short_name, category, ratio_to_base, is_base, description } = req.body;

    if (!name_ar || !name_ar.trim()) {
      return res.status(400).json({ message: 'الاسم بالعربية مطلوب' });
    }

    if (!short_name || !short_name.trim()) {
      return res.status(400).json({ message: 'الاختصار مطلوب' });
    }

    const connection = await getConnection();

    // تحقق من وجود الوحدة
    const [existing]: any = await connection.execute(
      'SELECT id, category FROM units_of_measure WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'وحدة القياس غير موجودة' });
    }

    // تحقق من عدم تكرار الاختصار من قبل وحدة أخرى
    const [duplicate]: any = await connection.execute(
      'SELECT id FROM units_of_measure WHERE short_name = ? AND id != ?',
      [short_name.trim().toUpperCase(), id]
    );

    if (duplicate.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'هذا الاختصار مسجل بالفعل' });
    }

    // إذا كانت وحدة أساسية، تأكد من عدم وجود وحدة أساسية أخرى في نفس الفئة
    if (is_base && category !== existing[0].category) {
      const [baseUnit]: any = await connection.execute(
        'SELECT id FROM units_of_measure WHERE category = ? AND is_base = TRUE AND id != ?',
        [category || 'General', id]
      );

      if (baseUnit.length > 0) {
        connection.release();
        return res.status(409).json({ message: 'توجد وحدة أساسية أخرى في هذه الفئة بالفعل' });
      }
    }

    await connection.execute(
      `UPDATE units_of_measure 
       SET name_ar = ?, name_en = ?, short_name = ?, category = ?, ratio_to_base = ?, is_base = ?, description = ?
       WHERE id = ?`,
      [
        name_ar.trim(),
        name_en || null,
        short_name.trim().toUpperCase(),
        category || 'General',
        ratio_to_base || 1.0,
        is_base || false,
        description || null,
        id
      ]
    );

    connection.release();

    res.json({
      id: parseInt(id),
      name_ar,
      name_en,
      short_name: short_name.toUpperCase(),
      category: category || 'General',
      ratio_to_base: ratio_to_base || 1.0,
      is_base: is_base || false,
      description,
      message: 'تم تحديث وحدة القياس بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تحديث وحدة القياس:', error);
    res.status(500).json({ message: 'فشل في تحديث وحدة القياس' });
  }
};

// تعطيل وحدة قياس
export const deactivateUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    // تحقق من وجود الوحدة
    const [existing]: any = await connection.execute(
      'SELECT id FROM units_of_measure WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'وحدة القياس غير موجودة' });
    }

    // تحقق من استخدام الوحدة في منتجات
    const [products]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM products WHERE unit_id = ? AND is_active = TRUE',
      [id]
    );

    if (products[0].count > 0) {
      connection.release();
      return res.status(409).json({
        message: `لا يمكن تعطيل وحدة مستخدمة في ${products[0].count} منتجات`
      });
    }

    // تحديث حالة النشاط
    await connection.execute(
      'UPDATE units_of_measure SET is_active = FALSE WHERE id = ?',
      [id]
    );

    connection.release();

    res.json({ message: 'تم تعطيل وحدة القياس بنجاح' });
  } catch (error) {
    console.error('خطأ في تعطيل وحدة القياس:', error);
    res.status(500).json({ message: 'فشل في تعطيل وحدة القياس' });
  }
};

// تفعيل وحدة قياس
export const activateUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    // تحقق من وجود الوحدة
    const [existing]: any = await connection.execute(
      'SELECT id FROM units_of_measure WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'وحدة القياس غير موجودة' });
    }

    // تحديث حالة النشاط
    await connection.execute(
      'UPDATE units_of_measure SET is_active = TRUE WHERE id = ?',
      [id]
    );

    connection.release();

    res.json({ message: 'تم تفعيل وحدة القياس بنجاح' });
  } catch (error) {
    console.error('خطأ في تفعيل وحدة القياس:', error);
    res.status(500).json({ message: 'فشل في تفعيل وحدة القياس' });
  }
};
