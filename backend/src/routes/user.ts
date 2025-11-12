import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';
import { roleMiddleware } from '../middleware/auth';

const router = Router();

// الحصول على جميع المستخدمين
router.get('/', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [users]: any = await connection.execute('SELECT id, username, email, fullName, role, createdAt FROM users');
    connection.release();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// الحصول على المستخدم الحالي
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [user]: any = await connection.execute(
      'SELECT id, username, email, fullName, role FROM users WHERE id = ?',
      [req.user?.userId]
    );
    connection.release();
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تحديث دور المستخدم
router.put('/:id/role', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!role) {
      return res.status(400).json({ message: 'الدور مطلوب' });
    }

    const connection = await getConnection();
    await connection.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    connection.release();

    res.json({ message: 'تم تحديث دور المستخدم بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
