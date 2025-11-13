import { Router, Request, Response } from 'express';
import * as accountsController from '../controllers/accountsController';

const router = Router();

// Middleware to validate account number
const validateAccountNumber = (req: Request, res: Response, next: Function) => {
  if (!req.params.accountNumber || typeof req.params.accountNumber !== 'string') {
    return res.status(400).json({ message: 'رقم الحساب غير صحيح' });
  }
  next();
};

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

// الحصول على حساب واحد بناءً على رقم الحساب
router.get('/:accountNumber', validateAccountNumber, async (req: Request, res: Response) => {
  try {
    const account = await accountsController.getAccountById(req.params.accountNumber);
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
    if (error.message.includes('مطلوبة') || error.message.includes('مستخدم') || error.message.includes('موجود')) {
      return res.status(400).json({ message: error.message });
    }
    console.error('خطأ في إضافة الحساب:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// تحديث حساب
router.put('/:accountNumber', validateAccountNumber, async (req: Request, res: Response) => {
  try {
    const result = await accountsController.updateAccount(req.params.accountNumber, req.body);
    res.json(result);
  } catch (error: any) {
    if (error.message.includes('مطلوبة') || error.message.includes('مستخدم') || error.message.includes('موجود') || error.message.includes('غير موجود')) {
      const statusCode = error.message.includes('غير موجود') ? 404 : 400;
      return res.status(statusCode).json({ message: error.message });
    }
    console.error('خطأ في تحديث الحساب:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// تعطيل حساب
router.patch('/:accountNumber/deactivate', validateAccountNumber, async (req: Request, res: Response) => {
  try {
    const result = await accountsController.deactivateAccount(req.params.accountNumber);
    res.json(result);
  } catch (error: any) {
    if (error.message.includes('غير موجود')) {
      return res.status(404).json({ message: error.message });
    }
    console.error('خطأ في تعطيل الحساب:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// تفعيل حساب
router.patch('/:accountNumber/activate', validateAccountNumber, async (req: Request, res: Response) => {
  try {
    const result = await accountsController.activateAccount(req.params.accountNumber);
    res.json(result);
  } catch (error: any) {
    if (error.message.includes('غير موجود')) {
      return res.status(404).json({ message: error.message });
    }
    console.error('خطأ في تفعيل الحساب:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// الحصول على الحسابات الرئيسية فقط (Parent accounts)
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
