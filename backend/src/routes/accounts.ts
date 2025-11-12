import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';

const router = Router();

// الحصول على جميع الحسابات
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [accounts]: any = await connection.execute(
      'SELECT id, account_code, account_name_ar, account_name_en, account_type, normal_side, is_group, is_active FROM chart_of_accounts WHERE is_active = TRUE ORDER BY account_code ASC'
    );
    connection.release();
    res.json(accounts);
  } catch (error) {
    console.error('خطأ في جلب الحسابات:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// الحصول على حساب واحد
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [accounts]: any = await connection.execute(
      'SELECT * FROM chart_of_accounts WHERE id = ?',
      [req.params.id]
    );
    connection.release();

    if (accounts.length === 0) {
      return res.status(404).json({ message: 'الحساب غير موجود' });
    }

    res.json(accounts[0]);
  } catch (error) {
    console.error('خطأ في جلب الحساب:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// إضافة حساب جديد
router.post('/', async (req: Request, res: Response) => {
  try {
    const { account_code, account_name_ar, account_name_en, account_type, normal_side, parent_id, is_group, description } = req.body;

    // التحقق من المدخلات
    if (!account_code || !account_name_ar || !account_type || !normal_side) {
      return res.status(400).json({ message: 'الرمز والاسم والنوع والجانب العادي مطلوبة' });
    }

    // التحقق من أن الرمز فريد
    const connection = await getConnection();
    const [existing]: any = await connection.execute(
      'SELECT id FROM chart_of_accounts WHERE account_code = ?',
      [account_code]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'رمز الحساب مستخدم بالفعل' });
    }

    // إدراج الحساب الجديد
    const result: any = await connection.execute(
      'INSERT INTO chart_of_accounts (account_code, account_name_ar, account_name_en, account_type, normal_side, parent_id, is_group, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [account_code, account_name_ar, account_name_en || null, account_type, normal_side, parent_id || null, is_group || false, description || null]
    );
    connection.release();

    res.status(201).json({
      id: result[0].insertId,
      message: 'تم إضافة الحساب بنجاح',
    });
  } catch (error) {
    console.error('خطأ في إضافة الحساب:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تحديث حساب
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { account_code, account_name_ar, account_name_en, account_type, normal_side, parent_id, is_group, description, is_active } = req.body;

    // التحقق من المدخلات
    if (!account_code || !account_name_ar || !account_type || !normal_side) {
      return res.status(400).json({ message: 'الرمز والاسم والنوع والجانب العادي مطلوبة' });
    }

    const connection = await getConnection();

    // التحقق من أن الحساب موجود
    const [account]: any = await connection.execute(
      'SELECT id FROM chart_of_accounts WHERE id = ?',
      [req.params.id]
    );

    if (account.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'الحساب غير موجود' });
    }

    // التحقق من أن الرمز فريد (إن تغير)
    const [existing]: any = await connection.execute(
      'SELECT id FROM chart_of_accounts WHERE account_code = ? AND id != ?',
      [account_code, req.params.id]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'رمز الحساب مستخدم بالفعل' });
    }

    // تحديث الحساب
    await connection.execute(
      'UPDATE chart_of_accounts SET account_code = ?, account_name_ar = ?, account_name_en = ?, account_type = ?, normal_side = ?, parent_id = ?, is_group = ?, description = ?, is_active = ? WHERE id = ?',
      [account_code, account_name_ar, account_name_en || null, account_type, normal_side, parent_id || null, is_group || false, description || null, is_active !== undefined ? is_active : true, req.params.id]
    );
    connection.release();

    res.json({ message: 'تم تحديث الحساب بنجاح' });
  } catch (error) {
    console.error('خطأ في تحديث الحساب:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// حذف حساب (تعطيل الحساب)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    // التحقق من أن الحساب موجود
    const [account]: any = await connection.execute(
      'SELECT id FROM chart_of_accounts WHERE id = ?',
      [req.params.id]
    );

    if (account.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'الحساب غير موجود' });
    }

    // تعطيل الحساب (soft delete) بدلاً من حذفه نهائياً
    await connection.execute(
      'UPDATE chart_of_accounts SET is_active = FALSE WHERE id = ?',
      [req.params.id]
    );
    connection.release();

    res.json({ message: 'تم تعطيل الحساب بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف الحساب:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// الحصول على الحسابات الرئيسية فقط (group accounts)
router.get('/parent/list', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [accounts]: any = await connection.execute(
      'SELECT id, account_code, account_name_ar, account_name_en, account_type FROM chart_of_accounts WHERE is_group = TRUE AND is_active = TRUE ORDER BY account_code ASC'
    );
    connection.release();
    res.json(accounts);
  } catch (error) {
    console.error('خطأ في جلب الحسابات الرئيسية:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
