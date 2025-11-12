import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';

const router = Router();

// الحصول على جميع المخازن
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [warehouses]: any = await connection.execute('SELECT * FROM warehouses ORDER BY createdAt DESC');
    connection.release();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// إضافة مخزن جديد
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, location, manager, capacity } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'اسم المخزن والموقع مطلوبة' });
    }

    const connection = await getConnection();
    const result: any = await connection.execute(
      'INSERT INTO warehouses (name, location, manager, capacity) VALUES (?, ?, ?, ?)',
      [name, location, manager, capacity]
    );
    connection.release();

    res.status(201).json({ id: result[0].insertId, message: 'تم إضافة المخزن بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تحديث مخزن
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, location, manager, capacity } = req.body;

    const connection = await getConnection();
    await connection.execute(
      'UPDATE warehouses SET name = ?, location = ?, manager = ?, capacity = ? WHERE id = ?',
      [name, location, manager, capacity, req.params.id]
    );
    connection.release();

    res.json({ message: 'تم تحديث المخزن بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
