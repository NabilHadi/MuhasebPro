import { Router, Request, Response } from 'express';
import { getConnection } from '../config/database';
import { roleMiddleware } from '../middleware/auth';

const router = Router();

// الحصول على بيانات الشركة
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const [company]: any = await connection.execute('SELECT * FROM company LIMIT 1');
    connection.release();
    res.json(company[0] || {});
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// تحديث بيانات الشركة
router.put('/', roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
    const { name, commercialRegister, taxId, phone, email, address, city, country, logo } = req.body;

    const connection = await getConnection();
    
    // التحقق من وجود بيانات الشركة
    const [existing]: any = await connection.execute('SELECT id FROM company LIMIT 1');

    if (existing.length > 0) {
      // تحديث
      await connection.execute(
        `UPDATE company SET name = ?, commercialRegister = ?, taxId = ?, phone = ?, 
         email = ?, address = ?, city = ?, country = ?, logo = ? WHERE id = 1`,
        [name, commercialRegister, taxId, phone, email, address, city, country, logo]
      );
    } else {
      // إدراج
      await connection.execute(
        `INSERT INTO company (name, commercialRegister, taxId, phone, email, address, city, country, logo) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, commercialRegister, taxId, phone, email, address, city, country, logo]
      );
    }

    connection.release();
    res.json({ message: 'تم تحديث بيانات الشركة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

export default router;
