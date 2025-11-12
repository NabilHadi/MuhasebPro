import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';

const router = Router();

// التقارير الأساسية
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    // إجمالي المبيعات
    const [totalSales]: any = await connection.execute(
      'SELECT SUM(totalAmount) as total FROM sales WHERE DATE(invoiceDate) = CURDATE()'
    );

    // إجمالي المشتريات
    const [totalPurchases]: any = await connection.execute(
      'SELECT SUM(totalAmount) as total FROM purchases WHERE DATE(invoiceDate) = CURDATE()'
    );

    // عدد المنتجات
    const [productCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM products'
    );

    // المنتجات بمخزون منخفض
    const [lowStock]: any = await connection.execute(
      'SELECT * FROM products WHERE quantity <= minimumStock'
    );

    connection.release();

    res.json({
      totalSalesToday: totalSales[0]?.total || 0,
      totalPurchasesToday: totalPurchases[0]?.total || 0,
      productCount: productCount[0]?.count || 0,
      lowStockProducts: lowStock,
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تقرير المبيعات
router.get('/sales', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [sales]: any = await connection.execute(
      `SELECT s.*, c.name as customerName, 
              SUM(si.quantity) as itemCount 
       FROM sales s 
       LEFT JOIN customers c ON s.customerId = c.id 
       LEFT JOIN sale_items si ON s.id = si.saleId 
       GROUP BY s.id 
       ORDER BY s.invoiceDate DESC`
    );
    connection.release();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تقرير المشتريات
router.get('/purchases', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [purchases]: any = await connection.execute(
      `SELECT p.*, s.name as supplierName, 
              SUM(pi.quantity) as itemCount 
       FROM purchases p 
       LEFT JOIN suppliers s ON p.supplierId = s.id 
       LEFT JOIN purchase_items pi ON p.id = pi.purchaseId 
       GROUP BY p.id 
       ORDER BY p.invoiceDate DESC`
    );
    connection.release();
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
