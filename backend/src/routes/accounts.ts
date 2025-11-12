import { Router, Request, Response } from 'express';
import * as accountsController from '../controllers/accountsController';

const router = Router();

// الحصول على جميع الحسابات
router.get('/', async (req: Request, res: Response) => {
  try {
    const accounts = await accountsController.getAllAccounts();
    res.json(accounts);
  } catch (error: any) {
    console.error('خطأ في جلب الحسابات:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// الحصول على حساب واحد
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const account = await accountsController.getAccountById(req.params.id);
    res.json(account);
  } catch (error: any) {
    if (error.message.includes('غير موجود')) {
      return res.status(404).json({ message: error.message });
    }
    console.error('خطأ في جلب الحساب:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// إضافة حساب جديد
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await accountsController.createAccount(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message.includes('مطلوبة') || error.message.includes('مستخدم')) {
      return res.status(400).json({ message: error.message });
    }
    console.error('خطأ في إضافة الحساب:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// تحديث حساب
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const result = await accountsController.updateAccount(req.params.id, req.body);
    res.json(result);
  } catch (error: any) {
    if (error.message.includes('مطلوبة') || error.message.includes('مستخدم') || error.message.includes('غير موجود')) {
      const statusCode = error.message.includes('غير موجود') ? 404 : 400;
      return res.status(statusCode).json({ message: error.message });
    }
    console.error('خطأ في تحديث الحساب:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// حذف حساب (تعطيل الحساب)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await accountsController.deleteAccount(req.params.id);
    res.json(result);
  } catch (error: any) {
    if (error.message.includes('غير موجود')) {
      return res.status(404).json({ message: error.message });
    }
    console.error('خطأ في حذف الحساب:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// الحصول على الحسابات الرئيسية فقط (group accounts)
router.get('/parent/list', async (req: Request, res: Response) => {
  try {
    const accounts = await accountsController.getParentAccounts();
    res.json(accounts);
  } catch (error: any) {
    console.error('خطأ في جلب الحسابات الرئيسية:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

export default router;
