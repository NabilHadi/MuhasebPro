import { useState } from 'react';
import apiClient from '../../../services/api';
import { ProductCategory, CategoryFormData } from '../types';

interface UseProductCategoriesParams {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onConfirm?: (options: any) => Promise<boolean>;
}

export const useProductCategories = ({
  onSuccess,
  onError,
  onConfirm,
}: UseProductCategoriesParams) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/product-categories');
      setCategories(response.data);
    } catch (err: any) {
      const message = err.response?.data?.error || 'فشل في جلب الفئات';
      onError?.(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.category_name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.category_name_en?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && category.is_active) ||
      (statusFilter === 'inactive' && !category.is_active);

    return matchesSearch && matchesStatus;
  });

  // Create category
  const createCategory = async (formData: CategoryFormData) => {
    try {
      await apiClient.post('/product-categories', formData);
      onSuccess?.('تم إضافة الفئة بنجاح');
      await fetchCategories();
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'فشل في إضافة الفئة';
      onError?.(message);
      return false;
    }
  };

  // Update category
  const updateCategory = async (id: number, formData: CategoryFormData) => {
    try {
      await apiClient.put(`/product-categories/${id}`, formData);
      onSuccess?.('تم تحديث الفئة بنجاح');
      await fetchCategories();
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'فشل في تحديث الفئة';
      onError?.(message);
      return false;
    }
  };

  // Delete category
  const deleteCategory = async (id: number) => {
    try {
      const confirmed = await onConfirm?.({
        title: 'تأكيد الحذف',
        message: 'هل أنت متأكد من حذف هذه الفئة؟',
        isDangerous: true,
      });

      if (!confirmed) return false;

      await apiClient.delete(`/product-categories/${id}`);
      onSuccess?.('تم حذف الفئة بنجاح');
      await fetchCategories();
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'فشل في حذف الفئة';
      onError?.(message);
      return false;
    }
  };

  return {
    // State
    categories,
    filteredCategories,
    loading,
    searchTerm,
    statusFilter,
    // Setters
    setSearchTerm,
    setStatusFilter,
    // Methods
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
