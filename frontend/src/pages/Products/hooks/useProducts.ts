import { useState } from 'react';
import apiClient from '../../../services/api';
import { Product, ProductFormData } from '../types';

interface UseProductsParams {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onConfirm?: (options: any) => Promise<boolean>;
}

export const useProducts = ({ onSuccess, onError, onConfirm }: UseProductsParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<number | "">("");
  const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'inactive'>('');

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (err: any) {
      const message = err.response?.data?.error || 'فشل في جلب المنتجات';
      onError?.(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_name_ar.toLowerCase().includes(searchTerm.toLowerCase());
    console.log("typeFilter:", typeFilter);
    const matchesType = typeFilter === '' || product.product_type === typeFilter;
    const matchesCategory = categoryFilter === "" || product.category_id === categoryFilter;
    const matchesStatus =
      statusFilter === '' ||
      (statusFilter === 'active' && product.is_active) ||
      (statusFilter === 'inactive' && !product.is_active);

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  // Create product
  const createProduct = async (formData: ProductFormData) => {
    try {
      await apiClient.post('/products', formData);
      onSuccess?.('تم إضافة المنتج بنجاح');
      await fetchProducts();
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'فشل في إضافة المنتج';
      onError?.(message);
      return false;
    }
  };

  // Update product
  const updateProduct = async (id: number, formData: ProductFormData) => {
    try {
      await apiClient.put(`/products/${id}`, formData);
      onSuccess?.('تم تحديث المنتج بنجاح');
      await fetchProducts();
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'فشل في تحديث المنتج';
      onError?.(message);
      return false;
    }
  };

  // Delete product
  const deleteProduct = async (id: number) => {
    try {
      const confirmed = await onConfirm?.({
        title: 'تأكيد الحذف',
        message: 'هل أنت متأكد من حذف هذا المنتج؟',
        isDangerous: true,
      });

      if (!confirmed) return false;

      await apiClient.delete(`/products/${id}`);
      onSuccess?.('تم حذف المنتج بنجاح');
      await fetchProducts();
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'فشل في حذف المنتج';
      onError?.(message);
      return false;
    }
  };

  return {
    // State
    products,
    filteredProducts,
    loading,
    searchTerm,
    typeFilter,
    categoryFilter,
    statusFilter,
    // Setters
    setSearchTerm,
    setTypeFilter,
    setCategoryFilter,
    setStatusFilter,
    // Methods
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
