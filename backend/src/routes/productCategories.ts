import { Router, Request, Response } from 'express';
import * as productCategoriesController from '../controllers/productCategoriesController';

const router = Router();

// Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await productCategoriesController.getAllProductCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'خطأ في جلب الفئات' });
  }
});

// Get category by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await productCategoriesController.getProductCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (error: any) {
    res.status(404).json({ error: error.message || 'الفئة غير موجودة' });
  }
});

// Create new category
router.post('/', async (req: Request, res: Response) => {
  try {
    const { category_name_ar, category_name_en, description } = req.body;

    const result = await productCategoriesController.createProductCategory({
      category_name_ar,
      category_name_en,
      description,
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'خطأ في إضافة الفئة' });
  }
});

// Update category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { category_name_ar, category_name_en, description, is_active } = req.body;

    const result = await productCategoriesController.updateProductCategory(req.params.id, {
      category_name_ar,
      category_name_en,
      description,
      is_active,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'خطأ في تحديث الفئة' });
  }
});

// Delete category (soft delete)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await productCategoriesController.deleteProductCategory(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'خطأ في حذف الفئة' });
  }
});

export default router;
