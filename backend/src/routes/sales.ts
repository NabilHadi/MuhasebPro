import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';

const router = Router();

// الحصول على جميع فواتير المبيعات
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [sales]: any = await connection.execute(
      'SELECT s.id, s.invoiceNumber, s.customerId, c.name as customerName, s.totalAmount, s.discount, s.tax, s.status, s.invoiceDate FROM sales s LEFT JOIN customers c ON s.customerId = c.id ORDER BY s.invoiceDate DESC'
    );
    connection.release();
    res.json(sales);
  } catch (error) {
    console.error('خطأ في جلب المبيعات:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// الحصول على فاتورة مبيعات واحدة مع التفاصيل
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    
    // الحصول على بيانات الفاتورة
    const [sales]: any = await connection.execute(
      'SELECT s.*, c.name as customerName, c.email, c.phone, c.address FROM sales s LEFT JOIN customers c ON s.customerId = c.id WHERE s.id = ?',
      [req.params.id]
    );

    if (sales.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'الفاتورة غير موجودة' });
    }

    // الحصول على عناصر الفاتورة
    const [items]: any = await connection.execute(
      'SELECT si.*, p.name as productName, p.sku FROM sale_items si LEFT JOIN products p ON si.productId = p.id WHERE si.saleId = ?',
      [req.params.id]
    );

    connection.release();
    res.json({ ...sales[0], items });
  } catch (error) {
    console.error('خطأ في جلب الفاتورة:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// إضافة فاتورة بيع جديدة
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customerId, items, totalAmount, discount, tax, notes, status } = req.body;

    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ message: 'معرف العميل والمنتجات مطلوبة' });
    }

    const connection = await getConnection();

    // التحقق من وجود العميل
    const [customer]: any = await connection.execute('SELECT id FROM customers WHERE id = ?', [customerId]);
    if (customer.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'العميل غير موجود' });
    }

    // إنشاء رقم فاتورة فريد
    const invoiceNumber = `INV-${Date.now()}`;

    // إدراج فاتورة البيع
    const result: any = await connection.execute(
      'INSERT INTO sales (invoiceNumber, customerId, totalAmount, discount, tax, notes, status, invoiceDate) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [invoiceNumber, customerId, totalAmount, discount || 0, tax || 0, notes || null, status || 'pending']
    );

    const saleId = result[0].insertId;

    // إضافة عناصر المبيعات وتحديث المخزون
    for (const item of items) {
      // التحقق من وجود المنتج
      const [product]: any = await connection.execute(
        'SELECT quantity FROM products WHERE id = ?',
        [item.productId]
      );

      if (product.length === 0) {
        connection.release();
        return res.status(404).json({ message: `المنتج برقم ${item.productId} غير موجود` });
      }

      // التحقق من توفر الكمية
      if (product[0].quantity < item.quantity) {
        connection.release();
        return res.status(400).json({ message: `الكمية المتاحة من المنتج أقل من المطلوبة` });
      }

      // إدراج عنصر البيع
      await connection.execute(
        'INSERT INTO sale_items (saleId, productId, quantity, unitPrice, totalPrice) VALUES (?, ?, ?, ?, ?)',
        [saleId, item.productId, item.quantity, item.unitPrice, item.totalPrice]
      );

      // تحديث المخزون
      await connection.execute(
        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    connection.release();
    res.status(201).json({ 
      id: saleId, 
      invoiceNumber,
      message: 'تم إنشاء فاتورة البيع بنجاح' 
    });
  } catch (error) {
    console.error('خطأ في إضافة فاتورة البيع:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تحديث فاتورة المبيعات
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const connection = await getConnection();

    // التحقق من وجود الفاتورة
    const [sale]: any = await connection.execute('SELECT id FROM sales WHERE id = ?', [req.params.id]);
    if (sale.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'الفاتورة غير موجودة' });
    }

    // تحديث الفاتورة
    await connection.execute(
      'UPDATE sales SET status = ?, notes = ? WHERE id = ?',
      [status || 'pending', notes || null, req.params.id]
    );

    connection.release();
    res.json({ message: 'تم تحديث الفاتورة بنجاح' });
  } catch (error) {
    console.error('خطأ في تحديث الفاتورة:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// حذف فاتورة المبيعات
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    // التحقق من وجود الفاتورة
    const [sale]: any = await connection.execute('SELECT id FROM sales WHERE id = ?', [req.params.id]);
    if (sale.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'الفاتورة غير موجودة' });
    }

    // الحصول على عناصر الفاتورة لاستعادة المخزون
    const [items]: any = await connection.execute(
      'SELECT productId, quantity FROM sale_items WHERE saleId = ?',
      [req.params.id]
    );

    // استعادة المخزون
    for (const item of items) {
      await connection.execute(
        'UPDATE products SET quantity = quantity + ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // حذف عناصر الفاتورة أولاً
    await connection.execute('DELETE FROM sale_items WHERE saleId = ?', [req.params.id]);

    // حذف الفاتورة
    await connection.execute('DELETE FROM sales WHERE id = ?', [req.params.id]);

    connection.release();
    res.json({ message: 'تم حذف الفاتورة بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف الفاتورة:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
