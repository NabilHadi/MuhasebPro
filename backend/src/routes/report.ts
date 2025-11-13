import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';

const router = Router();

// التقارير الأساسية
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    // عدد المنتجات النشطة
    const [productCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM products WHERE is_active = TRUE'
    );

    // عدد فئات المنتجات النشطة
    const [categoryCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM product_categories WHERE is_active = TRUE'
    );

    // عدد الحسابات النشطة
    const [accountCount]: any = await connection.execute(
      "SELECT COUNT(*) as count FROM accounts WHERE status = 'active'"
    );

    // عدد القيود المحاسبية
    const [journalCount]: any = await connection.execute(
      'SELECT COUNT(*) as count FROM journal_entries'
    );

    // إجمالي الدين والدائن من آخر 30 يوم
    const [journalSummary]: any = await connection.execute(
      `SELECT 
        SUM(CASE WHEN jl.debit > 0 THEN jl.debit ELSE 0 END) as totalDebit,
        SUM(CASE WHEN jl.credit > 0 THEN jl.credit ELSE 0 END) as totalCredit
       FROM journal_lines jl
       JOIN journal_entries je ON jl.journal_entry_id = je.id
       WHERE je.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    );

    connection.release();

    res.json({
      productCount: productCount[0]?.count || 0,
      categoryCount: categoryCount[0]?.count || 0,
      accountCount: accountCount[0]?.count || 0,
      journalCount: journalCount[0]?.count || 0,
      totalDebit: journalSummary[0]?.totalDebit || 0,
      totalCredit: journalSummary[0]?.totalCredit || 0,
    });
  } catch (error) {
    console.error('خطأ في لوحة التحكم:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تقرير المنتجات
router.get('/products', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [products]: any = await connection.execute(
      `SELECT p.id, p.product_code, p.product_name_ar, p.product_name_en,
              p.quantity_on_hand, p.cost_price, p.sale_price, p.product_type,
              pc.category_name_ar, p.created_at
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       WHERE p.is_active = TRUE
       ORDER BY p.created_at DESC`
    );
    connection.release();
    res.json(products);
  } catch (error) {
    console.error('خطأ في تقرير المنتجات:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تقرير الفئات
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [categories]: any = await connection.execute(
      `SELECT pc.id, pc.category_name_ar, pc.category_name_en, pc.description,
              COUNT(p.id) as productCount, pc.created_at
       FROM product_categories pc
       LEFT JOIN products p ON pc.id = p.category_id AND p.is_active = TRUE
       WHERE pc.is_active = TRUE
       GROUP BY pc.id
       ORDER BY pc.created_at DESC`
    );
    connection.release();
    res.json(categories);
  } catch (error) {
    console.error('خطأ في تقرير الفئات:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تقرير الحسابات
router.get('/accounts', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [accounts]: any = await connection.execute(
      `SELECT id, account_code, account_name_ar, account_name_en, account_type,
              normal_side, parent_id, is_group, created_at
       FROM chart_of_accounts
       WHERE is_active = TRUE
       ORDER BY account_code ASC`
    );
    connection.release();
    res.json(accounts);
  } catch (error) {
    console.error('خطأ في تقرير الحسابات:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تقرير القيود المحاسبية
router.get('/journals', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [journals]: any = await connection.execute(
      `SELECT je.id, je.date, je.description, je.reference, je.status, je.is_void,
              COUNT(jl.id) as lineCount,
              SUM(jl.debit) as totalDebit,
              SUM(jl.credit) as totalCredit,
              je.created_at
       FROM journal_entries je
       LEFT JOIN journal_lines jl ON je.id = jl.journal_entry_id
       GROUP BY je.id
       ORDER BY je.date DESC, je.id DESC`
    );
    connection.release();
    res.json(journals);
  } catch (error) {
    console.error('خطأ في تقرير القيود:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
