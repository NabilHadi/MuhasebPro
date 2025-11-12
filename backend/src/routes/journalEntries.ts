import { Router, Request, Response } from 'express';
import * as journalEntriesController from '../controllers/journalEntriesController';

const router = Router();

// الحصول على جميع القيود المحاسبية
router.get('/', async (req: Request, res: Response) => {
  try {
    const entries = await journalEntriesController.getAllJournalEntries();
    res.json(entries);
  } catch (error: any) {
    console.error('خطأ في جلب القيود:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// الحصول على قيد محاسبي مع تفاصيله
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const entry = await journalEntriesController.getJournalEntryById(req.params.id);
    res.json(entry);
  } catch (error: any) {
    if (error.message.includes('غير موجود')) {
      return res.status(404).json({ message: error.message });
    }
    console.error('خطأ في جلب القيد:', error);
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

// إضافة قيد محاسبي جديد (مع تفاصيله)
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await journalEntriesController.createJournalEntry(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('خطأ في إضافة القيد:', error);
    res.status(error.message.includes('مطلوبة') || error.message.includes('عدم توازن') ? 400 : 500).json({
      message: error.message || 'خطأ في السيرفر',
    });
  }
});

// تحديث قيد محاسبي
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const result = await journalEntriesController.updateJournalEntry(req.params.id, req.body);
    res.json(result);
  } catch (error: any) {
    console.error('خطأ في تحديث القيد:', error);
    if (error.message.includes('غير موجود')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(error.message.includes('مطلوبة') || error.message.includes('عدم توازن') ? 400 : 500).json({
      message: error.message || 'خطأ في السيرفر',
    });
  }
});

// حذف قيد محاسبي
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await journalEntriesController.deleteJournalEntry(req.params.id);
    res.json(result);
  } catch (error: any) {
    console.error('خطأ في حذف القيد:', error);
    if (error.message.includes('غير موجود')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'خطأ في السيرفر' });
  }
});

export default router;
