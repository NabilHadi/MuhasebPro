import { Router, Request, Response } from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deactivateCustomer,
  activateCustomer,
  getCustomerTransactionsSummary,
} from '../controllers/customerController';

const router = Router();

// منطق التحقق من معرف العميل
const validateCustomerId = (req: Request, res: Response, next: Function) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'معرف العميل غير صحيح' });
  }
  next();
};

// المسارات

// الحصول على جميع العملاء
router.get('/', async (req, res) => {
  try {
    await getAllCustomers(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// إنشاء عميل جديد
router.post('/', async (req, res) => {
  try {
    await createCustomer(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// الحصول على عميل محدد
router.get('/:id', validateCustomerId, async (req, res) => {
  try {
    await getCustomerById(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// الحصول على ملخص معاملات العميل
router.get('/:id/transactions', validateCustomerId, async (req, res) => {
  try {
    await getCustomerTransactionsSummary(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// تحديث بيانات العميل
router.put('/:id', validateCustomerId, async (req, res) => {
  try {
    await updateCustomer(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// تعطيل العميل
router.patch('/:id/deactivate', validateCustomerId, async (req, res) => {
  try {
    await deactivateCustomer(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// تفعيل العميل
router.patch('/:id/activate', validateCustomerId, async (req, res) => {
  try {
    await activateCustomer(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

export default router;
