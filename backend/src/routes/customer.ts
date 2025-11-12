import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';

const router = Router();

// الحصول على جميع العملاء
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [customers]: any = await connection.execute('SELECT * FROM customers ORDER BY createdAt DESC');
    connection.release();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// إضافة عميل جديد
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, city, country, taxId, creditLimit } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'اسم العميل مطلوب' });
    }

    const connection = await getConnection();
    const result: any = await connection.execute(
      'INSERT INTO customers (name, email, phone, address, city, country, taxId, creditLimit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, address, city, country, taxId, creditLimit || 0]
    );
    connection.release();

    res.status(201).json({ id: result[0].insertId, message: 'تم إضافة العميل بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تحديث عميل
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, city, country, taxId, creditLimit } = req.body;

    const connection = await getConnection();
    await connection.execute(
      'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, city = ?, country = ?, taxId = ?, creditLimit = ? WHERE id = ?',
      [name, email, phone, address, city, country, taxId, creditLimit, req.params.id]
    );
    connection.release();

    res.json({ message: 'تم تحديث العميل بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// حذف عميل
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    await connection.execute('DELETE FROM customers WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'تم حذف العميل بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
