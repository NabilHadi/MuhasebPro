import { Router, Request, Response } from 'express';
import {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deactivateUnit,
  activateUnit,
} from '../controllers/unitsOfMeasureController';

const router = Router();

// منطق التحقق من معرف الوحدة
const validateUnitId = (req: Request, res: Response, next: Function) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'معرف الوحدة غير صحيح' });
  }
  next();
};

// المسارات

// الحصول على جميع وحدات القياس
router.get('/', async (req, res) => {
  try {
    await getAllUnits(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// إنشاء وحدة قياس جديدة
router.post('/', async (req, res) => {
  try {
    await createUnit(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// الحصول على وحدة قياس محددة
router.get('/:id', validateUnitId, async (req, res) => {
  try {
    await getUnitById(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// تحديث وحدة قياس
router.put('/:id', validateUnitId, async (req, res) => {
  try {
    await updateUnit(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// تعطيل وحدة قياس
router.patch('/:id/deactivate', validateUnitId, async (req, res) => {
  try {
    await deactivateUnit(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// تفعيل وحدة قياس
router.patch('/:id/activate', validateUnitId, async (req, res) => {
  try {
    await activateUnit(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

export default router;
