import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';

const router = Router();

// الحصول على جميع المشتريات
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [purchases]: any = await connection.execute('SELECT * FROM purchases ORDER BY createdAt DESC');
    connection.release();
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// إضافة فاتورة شراء جديدة
router.post('/', async (req: Request, res: Response) => {
  try {
    const { supplierId, items, totalAmount, notes, status } = req.body;

    if (!supplierId || !items || items.length === 0) {
      return res.status(400).json({ message: 'معرف المورد والمنتجات مطلوبة' });
    }

    const connection = await getConnection();
    const result: any = await connection.execute(
      'INSERT INTO purchases (supplierId, totalAmount, notes, status, invoiceDate) VALUES (?, ?, ?, ?, NOW())',
      [supplierId, totalAmount, notes, status || 'pending']
    );

    const purchaseId = result[0].insertId;

    // إضافة عناصر المشتريات وتحديث المخزون
    for (const item of items) {
      await connection.execute(
        'INSERT INTO purchase_items (purchaseId, productId, quantity, unitPrice, totalPrice) VALUES (?, ?, ?, ?, ?)',
        [purchaseId, item.productId, item.quantity, item.unitPrice, item.totalPrice]
      );

      // تحديث المخزون
      await connection.execute(
        'UPDATE products SET quantity = quantity + ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    connection.release();
    res.status(201).json({ id: purchaseId, message: 'تم إضافة فاتورة الشراء بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
