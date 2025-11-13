import { Router, Request, Response } from 'express';
import {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deactivateUnit,
  activateUnit,
} from '../controllers/unitsOfMeasureController';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deactivateCategory,
  activateCategory,
} from '../controllers/unitsOfMeasureCategoriesController';

const router = Router();

// منطق التحقق من معرف الوحدة
const validateUnitId = (req: Request, res: Response, next: Function) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'معرف الوحدة غير صحيح' });
  }
  next();
};

// مسارات الفئات
// الحصول على جميع الفئات
router.get('/categories/list', async (req, res) => {
  try {
    await getAllCategories(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// إنشاء فئة جديدة
router.post('/categories', async (req, res) => {
  try {
    await createCategory(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// الحصول على فئة محددة
router.get('/categories/:id', validateUnitId, async (req, res) => {
  try {
    await getCategoryById(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// تحديث فئة
router.put('/categories/:id', validateUnitId, async (req, res) => {
  try {
    await updateCategory(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// تعطيل فئة
router.patch('/categories/:id/deactivate', validateUnitId, async (req, res) => {
  try {
    await deactivateCategory(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// تفعيل فئة
router.patch('/categories/:id/activate', validateUnitId, async (req, res) => {
  try {
    await activateCategory(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

// مسارات الوحدات
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
