import { useEffect, useState } from 'react';
import apiClient from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { useConfirmModal } from '../../hooks/useConfirmModal';
import ToastContainer from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import ProductForm from './components/product/ProductForm';
import ProductFilters from './components/product/ProductFilters';
import ProductsTable from './components/product/ProductsTable';
import { useProducts } from './hooks/useProducts';
import { Product, ProductCategory, Unit, ProductFormData } from './types';

export default function Products() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<Partial<ProductFormData>>({
    product_code: '',
    product_name_ar: '',
    product_name_en: '',
    category_id: null,
    unit_id: null,
    product_type: 'Stockable',
    is_active: true,
    description: '',
  });

  // Global hooks
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { isOpen, options, handleConfirm, handleCancel, confirm } = useConfirmModal();

  // Products hook
  const products = useProducts({
    onSuccess: showSuccess,
    onError: showError,
    onConfirm: confirm,
  });

  // Fetch initial data
  useEffect(() => {
    products.fetchProducts();
    fetchCategories();
    fetchUnits();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/product-categories');
      setCategories(response.data);
    } catch (err) {
      console.error('خطأ في جلب الفئات:', err);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await apiClient.get('/units-of-measure');
      setUnits(response.data);
    } catch (err) {
      console.error('خطأ في جلب الوحدات:', err);
    }
  };

  // Handle form field changes
  const handleProductFormChange = (field: keyof ProductFormData, value: any) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form
  const resetProductForm = () => {
    setProductForm({
      product_code: '',
      product_name_ar: '',
      product_name_en: '',
      category_id: null,
      unit_id: null,
      product_type: 'Stockable',
      is_active: true,
      description: '',
    });
    setEditingProductId(null);
    setShowProductForm(false);
  };

  // Add new product
  const handleAddProduct = () => {
    resetProductForm();
    setShowProductForm(true);
  };

  // Edit product
  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      product_code: product.product_code,
      product_name_ar: product.product_name_ar,
      product_name_en: product.product_name_en || '',
      category_id: product.category_id || null,
      unit_id: product.unit_id || null,
      product_type: product.product_type,
      is_active: product.is_active,
      description: product.description || '',
    });
    setShowProductForm(true);
  };

  // Save product (create or update)
  const handleSaveProduct = async () => {
    // Validation
    if (!productForm.product_code?.trim() || !productForm.product_name_ar?.trim()) {
      showError('رمز المنتج والاسم بالعربية مطلوبان');
      return;
    }

    const success = editingProductId
      ? await products.updateProduct(editingProductId, productForm as ProductFormData)
      : await products.createProduct(productForm as ProductFormData);

    if (success) {
      resetProductForm();
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    await products.deleteProduct(id);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المنتجات</h1>
      </div>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={showProductForm}
        isEditing={editingProductId !== null}
        product={productForm}
        onFormChange={handleProductFormChange}
        onSubmit={handleSaveProduct}
        onCancel={resetProductForm}
        categories={categories}
        units={units}
      />

      {/* Filters */}
      <ProductFilters
        searchTerm={products.searchTerm}
        onSearchChange={products.setSearchTerm}
        typeFilter={products.typeFilter}
        onTypeFilterChange={products.setTypeFilter}
        categoryFilter={products.categoryFilter}
        onCategoryFilterChange={products.setCategoryFilter}
        statusFilter={products.statusFilter}
        onStatusFilterChange={products.setStatusFilter}
        categories={categories}
        onAddClick={handleAddProduct}
      />

      {/* Products Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">المنتجات ({products.filteredProducts.length})</h2>
        </div>
        <ProductsTable
          products={products.filteredProducts}
          categories={categories}
          loading={products.loading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>

      {/* Global Components */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <ConfirmModal
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        isDangerous={options.isDangerous}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
