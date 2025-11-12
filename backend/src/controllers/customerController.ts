import { Request, Response } from 'express';
import { getConnection } from '../config/database';

// الحصول على جميع العملاء
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [customers]: any = await connection.execute(
      `SELECT id, name, email, phone, address, city, country, tax_id, 
              credit_limit, opening_balance, is_active, created_at, updated_at
       FROM customers
       ORDER BY name ASC`
    );
    connection.release();
    res.json(customers);
  } catch (error) {
    console.error('خطأ في جلب العملاء:', error);
    res.status(500).json({ message: 'فشل في جلب العملاء' });
  }
};

// الحصول على عميل بواسطة المعرف
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    const [customer]: any = await connection.execute(
      `SELECT id, name, email, phone, address, city, country, tax_id,
              credit_limit, opening_balance, is_active, created_at, updated_at
       FROM customers
       WHERE id = ?`,
      [id]
    );
    
    connection.release();

    if (customer.length === 0) {
      return res.status(404).json({ message: 'العميل غير موجود' });
    }

    res.json(customer[0]);
  } catch (error) {
    console.error('خطأ في جلب العميل:', error);
    res.status(500).json({ message: 'فشل في جلب العميل' });
  }
};

// إنشاء عميل جديد
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, city, country, tax_id, credit_limit, opening_balance } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'الاسم مطلوب' });
    }

    const connection = await getConnection();

    // تحقق من وجود عميل بنفس البريد الإلكتروني
    if (email) {
      const [existingEmail]: any = await connection.execute(
        'SELECT id FROM customers WHERE email = ?',
        [email]
      );
      if (existingEmail.length > 0) {
        connection.release();
        return res.status(409).json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' });
      }
    }

    const [result]: any = await connection.execute(
      `INSERT INTO customers (name, email, phone, address, city, country, tax_id, credit_limit, opening_balance, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [name, email || null, phone || null, address || null, city || null, country || null, 
       tax_id || null, credit_limit || 0, opening_balance || 0]
    );

    connection.release();

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      phone,
      address,
      city,
      country,
      tax_id,
      credit_limit,
      opening_balance,
      is_active: true,
      message: 'تم إنشاء العميل بنجاح'
    });
  } catch (error) {
    console.error('خطأ في إنشاء العميل:', error);
    res.status(500).json({ message: 'فشل في إنشاء العميل' });
  }
};

// تحديث بيانات العميل
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, country, tax_id, credit_limit, opening_balance } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'الاسم مطلوب' });
    }

    const connection = await getConnection();

    // تحقق من وجود العميل
    const [existing]: any = await connection.execute(
      'SELECT id FROM customers WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'العميل غير موجود' });
    }

    // تحقق من عدم استخدام البريد من قبل عميل آخر
    if (email) {
      const [duplicate]: any = await connection.execute(
        'SELECT id FROM customers WHERE email = ? AND id != ?',
        [email, id]
      );
      if (duplicate.length > 0) {
        connection.release();
        return res.status(409).json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' });
      }
    }

    await connection.execute(
      `UPDATE customers 
       SET name = ?, email = ?, phone = ?, address = ?, city = ?, country = ?, tax_id = ?, credit_limit = ?, opening_balance = ?
       WHERE id = ?`,
      [name, email || null, phone || null, address || null, city || null, country || null, 
       tax_id || null, credit_limit || 0, opening_balance || 0, id]
    );

    connection.release();

    res.json({
      id: parseInt(id),
      name,
      email,
      phone,
      address,
      city,
      country,
      tax_id,
      credit_limit,
      opening_balance,
      message: 'تم تحديث العميل بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تحديث العميل:', error);
    res.status(500).json({ message: 'فشل في تحديث العميل' });
  }
};

// تعطيل العميل (حذف ناعم)
export const deactivateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    // تحقق من وجود العميل
    const [existing]: any = await connection.execute(
      'SELECT id FROM customers WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'العميل غير موجود' });
    }

    // تحديث حالة النشاط (تعطيل)
    await connection.execute(
      'UPDATE customers SET is_active = FALSE WHERE id = ?',
      [id]
    );

    connection.release();

    res.json({ message: 'تم تعطيل العميل بنجاح' });
  } catch (error) {
    console.error('خطأ في تعطيل العميل:', error);
    res.status(500).json({ message: 'فشل في تعطيل العميل' });
  }
};

// تفعيل العميل
export const activateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    // تحقق من وجود العميل
    const [existing]: any = await connection.execute(
      'SELECT id FROM customers WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'العميل غير موجود' });
    }

    // تحديث حالة النشاط (تفعيل)
    await connection.execute(
      'UPDATE customers SET is_active = TRUE WHERE id = ?',
      [id]
    );

    connection.release();

    res.json({ message: 'تم تفعيل العميل بنجاح' });
  } catch (error) {
    console.error('خطأ في تفعيل العميل:', error);
    res.status(500).json({ message: 'فشل في تفعيل العميل' });
  }
};

// الحصول على ملخص معاملات العميل
export const getCustomerTransactionsSummary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    // تحقق من وجود العميل
    const [customer]: any = await connection.execute(
      'SELECT id FROM customers WHERE id = ?',
      [id]
    );

    if (customer.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'العميل غير موجود' });
    }

    // احصل على المبيعات
    const [sales]: any = await connection.execute(
      `SELECT COUNT(*) as count, SUM(totalAmount) as total
       FROM sales
       WHERE customerId = ? AND status != 'cancelled'`,
      [id]
    );

    // احصل على المدفوعات
    const [payments]: any = await connection.execute(
      `SELECT COUNT(*) as count, SUM(amount) as total
       FROM payments
       WHERE relatedType = 'sale' AND relatedId IN (SELECT id FROM sales WHERE customerId = ?)`,
      [id]
    );

    // احصل على آخر 5 معاملات
    const [recentTransactions]: any = await connection.execute(
      `SELECT id, invoiceNumber, totalAmount, status, invoiceDate
       FROM sales
       WHERE customerId = ?
       ORDER BY invoiceDate DESC
       LIMIT 5`,
      [id]
    );

    connection.release();

    res.json({
      totalSales: sales[0]?.count || 0,
      totalSalesAmount: sales[0]?.total || 0,
      totalPayments: payments[0]?.count || 0,
      totalPaidAmount: payments[0]?.total || 0,
      outstandingBalance: (sales[0]?.total || 0) - (payments[0]?.total || 0),
      recentTransactions
    });
  } catch (error) {
    console.error('خطأ في جلب ملخص المعاملات:', error);
    res.status(500).json({ message: 'فشل في جلب ملخص المعاملات' });
  }
};
