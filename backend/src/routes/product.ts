import { Router, Request, Response } from 'express';
import * as productController from '../controllers/productController';

const router = Router();

// الحصول على جميع المنتجات
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await productController.getAllProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// إضافة منتج جديد
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await productController.createProduct(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// تحديث منتج
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const result = await productController.updateProduct(req.params.id, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// حذف منتج
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await productController.deleteProduct(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

export default router;
