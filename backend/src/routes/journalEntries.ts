import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';

const router = Router();

// الحصول على جميع القيود المحاسبية
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [entries]: any = await connection.execute(
      'SELECT * FROM journal_entries ORDER BY date DESC'
    );
    connection.release();
    res.json(entries);
  } catch (error) {
    console.error('خطأ في جلب القيود:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// الحصول على قيد محاسبي مع تفاصيله
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    // جلب القيد الرئيسي
    const [entries]: any = await connection.execute(
      'SELECT * FROM journal_entries WHERE id = ?',
      [req.params.id]
    );

    if (entries.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'القيد غير موجود' });
    }

    // جلب تفاصيل القيد مع معلومات الحساب
    const [lines]: any = await connection.execute(
      `SELECT jl.id, jl.account_id, jl.debit, jl.credit, a.code, a.name, a.type
       FROM journal_lines jl
       JOIN accounts a ON jl.account_id = a.id
       WHERE jl.journal_entry_id = ?
       ORDER BY jl.id`,
      [req.params.id]
    );

    connection.release();

    res.json({
      ...entries[0],
      lines,
    });
  } catch (error) {
    console.error('خطأ في جلب القيد:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// إضافة قيد محاسبي جديد (مع تفاصيله)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { date, description, reference, lines } = req.body;

    // التحقق من المدخلات
    if (!date || !lines || lines.length === 0) {
      return res.status(400).json({ message: 'التاريخ والتفاصيل مطلوبة' });
    }

    // التحقق من أن مجموع الدين = مجموع الدائن
    const totalDebit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.debit) || 0), 0);
    const totalCredit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.credit) || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return res.status(400).json({
        message: `عدم توازن: الدين (${totalDebit}) ≠ الدائن (${totalCredit})`,
      });
    }

    const connection = await getConnection();

    try {
      // بدء معاملة
      await connection.beginTransaction();

      // إدراج القيد الرئيسي
      const [result]: any = await connection.execute(
        'INSERT INTO journal_entries (date, description, reference) VALUES (?, ?, ?)',
        [date, description || null, reference || null]
      );

      const entryId = result.insertId;

      // إدراج تفاصيل القيد
      for (const line of lines) {
        if (!line.account_id || (parseFloat(line.debit) === 0 && parseFloat(line.credit) === 0)) {
          throw new Error('كل تفصيل يجب أن يحتوي على حساب وقيمة');
        }

        await connection.execute(
          'INSERT INTO journal_lines (journal_entry_id, account_id, debit, credit) VALUES (?, ?, ?, ?)',
          [entryId, line.account_id, parseFloat(line.debit) || 0, parseFloat(line.credit) || 0]
        );
      }

      // تأكيد المعاملة
      await connection.commit();
      connection.release();

      res.status(201).json({
        id: entryId,
        message: 'تم إضافة القيد بنجاح',
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('خطأ في إضافة القيد:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// تحديث قيد محاسبي
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { date, description, reference, lines } = req.body;

    // التحقق من المدخلات
    if (!date || !lines || lines.length === 0) {
      return res.status(400).json({ message: 'التاريخ والتفاصيل مطلوبة' });
    }

    // التحقق من التوازن
    const totalDebit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.debit) || 0), 0);
    const totalCredit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.credit) || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return res.status(400).json({
        message: `عدم توازن: الدين (${totalDebit}) ≠ الدائن (${totalCredit})`,
      });
    }

    const connection = await getConnection();

    try {
      // التحقق من أن القيد موجود
      const [entry]: any = await connection.execute(
        'SELECT id FROM journal_entries WHERE id = ?',
        [req.params.id]
      );

      if (entry.length === 0) {
        connection.release();
        return res.status(404).json({ message: 'القيد غير موجود' });
      }

      await connection.beginTransaction();

      // تحديث القيد الرئيسي
      await connection.execute(
        'UPDATE journal_entries SET date = ?, description = ?, reference = ? WHERE id = ?',
        [date, description || null, reference || null, req.params.id]
      );

      // حذف التفاصيل القديمة
      await connection.execute('DELETE FROM journal_lines WHERE journal_entry_id = ?', [req.params.id]);

      // إدراج التفاصيل الجديدة
      for (const line of lines) {
        if (!line.account_id || (parseFloat(line.debit) === 0 && parseFloat(line.credit) === 0)) {
          throw new Error('كل تفصيل يجب أن يحتوي على حساب وقيمة');
        }

        await connection.execute(
          'INSERT INTO journal_lines (journal_entry_id, account_id, debit, credit) VALUES (?, ?, ?, ?)',
          [req.params.id, line.account_id, parseFloat(line.debit) || 0, parseFloat(line.credit) || 0]
        );
      }

      await connection.commit();
      connection.release();

      res.json({ message: 'تم تحديث القيد بنجاح' });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error: any) {
    console.error('خطأ في تحديث القيد:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// حذف قيد محاسبي
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    try {
      // التحقق من أن القيد موجود
      const [entry]: any = await connection.execute(
        'SELECT id FROM journal_entries WHERE id = ?',
        [req.params.id]
      );

      if (entry.length === 0) {
        connection.release();
        return res.status(404).json({ message: 'القيد غير موجود' });
      }

      await connection.beginTransaction();

      // حذف التفاصيل
      await connection.execute('DELETE FROM journal_lines WHERE journal_entry_id = ?', [req.params.id]);

      // حذف القيد الرئيسي
      await connection.execute('DELETE FROM journal_entries WHERE id = ?', [req.params.id]);

      await connection.commit();
      connection.release();

      res.json({ message: 'تم حذف القيد بنجاح' });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('خطأ في حذف القيد:', error);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
