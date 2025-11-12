import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';

const router = Router();

// الحصول على جميع الموردين
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [suppliers]: any = await connection.execute('SELECT * FROM suppliers ORDER BY createdAt DESC');
    connection.release();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// إضافة مورد جديد
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, city, country, taxId, paymentTerms } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'اسم المورد مطلوب' });
    }

    const connection = await getConnection();
    const result: any = await connection.execute(
      'INSERT INTO suppliers (name, email, phone, address, city, country, taxId, paymentTerms) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, address, city, country, taxId, paymentTerms]
    );
    connection.release();

    res.status(201).json({ id: result[0].insertId, message: 'تم إضافة المورد بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تحديث مورد
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, city, country, taxId, paymentTerms } = req.body;

    const connection = await getConnection();
    await connection.execute(
      'UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ?, city = ?, country = ?, taxId = ?, paymentTerms = ? WHERE id = ?',
      [name, email, phone, address, city, country, taxId, paymentTerms, req.params.id]
    );
    connection.release();

    res.json({ message: 'تم تحديث المورد بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// حذف مورد
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    await connection.execute('DELETE FROM suppliers WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'تم حذف المورد بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
