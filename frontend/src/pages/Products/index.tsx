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
    cost: 0,
    profit_ratio: 0,
    selling_price: 0,
    main_category_id: null,
    product_group: null,
    classification_1: null,
    classification_2: null,
    classification_3: null,
    classification_4: null,
    classification_5: null,
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
      cost: 0,
      profit_ratio: 0,
      selling_price: 0,
      main_category_id: null,
      product_group: null,
      classification_1: null,
      classification_2: null,
      classification_3: null,
      classification_4: null,
      classification_5: null,
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
      cost: product.cost || 0,
      profit_ratio: product.profit_ratio || 0,
      selling_price: product.selling_price || 0,
      main_category_id: product.main_category_id || null,
      product_group: product.product_group || null,
      classification_1: product.classification_1 || null,
      classification_2: product.classification_2 || null,
      classification_3: product.classification_3 || null,
      classification_4: product.classification_4 || null,
      classification_5: product.classification_5 || null,
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
    <div className='card-small-padding'>

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
      <ProductsTable
        products={products.filteredProducts}
        categories={categories}
        loading={products.loading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

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
