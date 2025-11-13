import { useState } from 'react';
import apiClient from '../../../services/api';

export interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export const useCategories = (
  showSuccess: (msg: string) => void,
  showError: (msg: string) => void,
  confirm?: (opts: { title: string; message: string; isDangerous?: boolean }) => Promise<boolean>
) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [categoryForm, setCategoryForm] = useState({
    name_ar: '',
    name_en: '',
    description: '',
  });
  const [showCategoryConfirmModal, setShowCategoryConfirmModal] = useState(false);
  const [categoryToToggle, setCategoryToToggle] = useState<Category | null>(null);

  const loadCategories = async () => {
    try {
      const response = await apiClient.get('/units-of-measure/categories/list');
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      showError('فشل في تحميل الفئات');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryForm.name_ar.trim()) {
      showError('الاسم بالعربية مطلوب');
      return;
    }

    try {
      if (editingCategoryId) {
        await apiClient.put(`/units-of-measure/categories/${editingCategoryId}`, categoryForm);
        showSuccess('تم تحديث الفئة بنجاح');
      } else {
        await apiClient.post('/units-of-measure/categories', categoryForm);
        showSuccess('تم إنشاء الفئة بنجاح');
      }
      resetCategoryForm();
      loadCategories();
    } catch (error: any) {
      showError(error.response?.data?.message || 'خطأ في حفظ الفئة');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name_ar: category.name_ar,
      name_en: category.name_en,
      description: category.description,
    });
    setShowCategoryForm(true);
  };

  const handleToggleCategoryStatus = async (category: Category) => {
    if (!confirm) {
      setCategoryToToggle(category);
      setShowCategoryConfirmModal(true);
      return;
    }

    const confirmed = await confirm({
      title: 'تأكيد العملية',
      message: `هل تريد ${category.is_active ? 'تعطيل' : 'تفعيل'} الفئة "${category.name_ar}"؟`,
      isDangerous: category.is_active,
    });

    if (confirmed) {
      await confirmToggleCategoryStatus(category);
    }
  };

  const confirmToggleCategoryStatus = async (category?: Category) => {
    const targetCategory = category || categoryToToggle;
    if (!targetCategory) return;

    try {
      if (targetCategory.is_active) {
        await apiClient.patch(`/units-of-measure/categories/${targetCategory.id}/deactivate`);
        showSuccess('تم تعطيل الفئة بنجاح');
      } else {
        await apiClient.patch(`/units-of-measure/categories/${targetCategory.id}/activate`);
        showSuccess('تم تفعيل الفئة بنجاح');
      }
      loadCategories();
    } catch (error: any) {
      showError(error.response?.data?.message || 'خطأ في تحديث حالة الفئة');
    } finally {
      setShowCategoryConfirmModal(false);
      setCategoryToToggle(null);
    }
  };

  const resetCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategoryId(null);
    setCategoryForm({ name_ar: '', name_en: '', description: '' });
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name_ar.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
    cat.name_en?.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  return {
    categories,
    showCategoryForm,
    editingCategoryId,
    categorySearchTerm,
    categoryForm,
    showCategoryConfirmModal,
    categoryToToggle,
    filteredCategories,
    setCategories,
    setShowCategoryForm,
    setEditingCategoryId,
    setCategorySearchTerm,
    setCategoryForm,
    setShowCategoryConfirmModal,
    setCategoryToToggle,
    loadCategories,
    handleSaveCategory,
    handleEditCategory,
    handleToggleCategoryStatus,
    confirmToggleCategoryStatus,
    resetCategoryForm,
  };
};
