import { Router, Request, Response } from 'express';
import {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from '../controllers/warehouseController';

const router = Router();

// Validation middleware
const validateWarehouseId = (req: Request, res: Response, next: Function) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'معرف المخزن غير صحيح' });
  }
  next();
};

// المسارات
router.get('/', async (req: Request, res: Response) => {
  try {
    await getAllWarehouses(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

router.get('/:id', validateWarehouseId, async (req: Request, res: Response) => {
  try {
    await getWarehouseById(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    await createWarehouse(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

router.put('/:id', validateWarehouseId, async (req: Request, res: Response) => {
  try {
    await updateWarehouse(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

router.delete('/:id', validateWarehouseId, async (req: Request, res: Response) => {
  try {
    await deleteWarehouse(req, res);
  } catch (error) {
    console.error('خطأ في المسار:', error);
    res.status(500).json({ message: 'خطأ في السيرفر الداخلي' });
  }
});

export default router;
