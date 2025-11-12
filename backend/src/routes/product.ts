import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';

const router = Router();

// الحصول على جميع المنتجات
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [products]: any = await connection.execute('SELECT * FROM products ORDER BY createdAt DESC');
    connection.release();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// إضافة منتج جديد
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, sku, description, category, buyingPrice, sellingPrice, minimumStock, maximumStock } = req.body;

    if (!name || !sku) {
      return res.status(400).json({ message: 'اسم المنتج والرمز مطلوبة' });
    }

    const connection = await getConnection();
    const result: any = await connection.execute(
      'INSERT INTO products (name, sku, description, category, buyingPrice, sellingPrice, minimumStock, maximumStock, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, sku, description, category, buyingPrice, sellingPrice, minimumStock, maximumStock, 0]
    );
    connection.release();

    res.status(201).json({ id: result[0].insertId, message: 'تم إضافة المنتج بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تحديث منتج
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, sku, description, category, buyingPrice, sellingPrice, minimumStock, maximumStock } = req.body;

    const connection = await getConnection();
    await connection.execute(
      'UPDATE products SET name = ?, sku = ?, description = ?, category = ?, buyingPrice = ?, sellingPrice = ?, minimumStock = ?, maximumStock = ? WHERE id = ?',
      [name, sku, description, category, buyingPrice, sellingPrice, minimumStock, maximumStock, req.params.id]
    );
    connection.release();

    res.json({ message: 'تم تحديث المنتج بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// حذف منتج
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    await connection.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
