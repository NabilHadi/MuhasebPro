import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getConnection } from '../config/database';
import { generateToken } from '../config/jwt';

const router = Router();

// تسجيل حساب جديد
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    const connection = await getConnection();
    
    // التحقق من وجود المستخدم
    const [existing]: any = await connection.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'اسم المستخدم أو البريد الإلكتروني موجود بالفعل' });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    await connection.execute(
      'INSERT INTO users (username, email, password, fullName, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, fullName || '', 'user']
    );

    connection.release();
    res.status(201).json({ message: 'تم إنشاء الحساب بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تسجيل الدخول
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'اسم المستخدم وكلمة المرور مطلوبة' });
    }

    const connection = await getConnection();
    
    const [rows]: any = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    

    if (rows.length === 0) {
      connection.release();
      return res.status(401).json({ message: 'بيانات تسجيل الدخول غير صحيحة' });
    }


    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      connection.release();
      return res.status(401).json({ message: 'بيانات تسجيل الدخول غير صحيحة' });
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    connection.release();
    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
