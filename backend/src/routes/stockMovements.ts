import { Router, Request, Response } from 'express';
import * as stockMovementsController from '../controllers/stockMovementsController';

const router = Router();

// الحصول على جميع حركات المخزون
router.get('/', async (req: Request, res: Response) => {
  try {
    const movements = await stockMovementsController.getAllStockMovements();
    res.json(movements);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// الحصول على حركات مخزون منتج معين
router.get('/product/:productId', async (req: Request, res: Response) => {
  try {
    const movements = await stockMovementsController.getMovementsByProductId(parseInt(req.params.productId));
    res.json(movements);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// إضافة حركة مخزون جديدة
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await stockMovementsController.createStockMovement(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// تحديث حركة مخزون
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const result = await stockMovementsController.updateStockMovement(parseInt(req.params.id), req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// حذف حركة مخزون
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await stockMovementsController.deleteStockMovement(parseInt(req.params.id));
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

export default router;
