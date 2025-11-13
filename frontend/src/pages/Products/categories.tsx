import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { useConfirmModal } from '../../hooks/useConfirmModal';
import ToastContainer from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import CategoryForm from './components/category/CategoryForm';
import CategorySearch from './components/category/CategorySearch';
import CategoriesTable from './components/category/CategoriesTable';
import { useProductCategories } from './hooks/useProductCategories';
import { CategoryFormData } from './types';

export default function Categories() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryForm, setCategoryForm] = useState<Partial<CategoryFormData>>({
    category_number: 0,
    category_name_ar: '',
    category_name_en: '',
    description: '',
  });

  // Global hooks
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { isOpen, options, handleConfirm, handleCancel, confirm } = useConfirmModal();

  // Categories hook
  const categories = useProductCategories({
    onSuccess: showSuccess,
    onError: showError,
    onConfirm: confirm,
  });

  // Fetch categories on mount
  useEffect(() => {
    categories.fetchCategories();
  }, []);

  // Handle form field changes
  const handleCategoryFormChange = (field: keyof CategoryFormData, value: any) => {
    setCategoryForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form
  const resetCategoryForm = () => {
    setCategoryForm({
      category_number: 0,
      category_name_ar: '',
      category_name_en: '',
      description: '',
    });
    setEditingCategoryId(null);
    setShowCategoryForm(false);
  };

  // Add new category
  const handleAddCategory = () => {
    resetCategoryForm();
    setShowCategoryForm(true);
  };

  // Edit category
  const handleEditCategory = (category: any) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      category_number: category.category_number,
      category_name_ar: category.category_name_ar,
      category_name_en: category.category_name_en,
      description: category.description,
    });
    setShowCategoryForm(true);
  };

  // Save category (create or update)
  const handleSaveCategory = async () => {
    // Validation
    if (!categoryForm.category_number || !categoryForm.category_name_ar?.trim()) {
      showError('رقم الفئة والاسم بالعربية مطلوبان');
      return;
    }

    const success = editingCategoryId
      ? await categories.updateCategory(editingCategoryId, categoryForm as CategoryFormData)
      : await categories.createCategory(categoryForm as CategoryFormData);

    if (success) {
      resetCategoryForm();
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: number) => {
    await categories.deleteCategory(id);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">فئات المنتجات</h1>
        <p className="text-gray-600">إدارة فئات المنتجات في النظام</p>
      </div>

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={showCategoryForm}
        isEditing={editingCategoryId !== null}
        category={categoryForm}
        onFormChange={handleCategoryFormChange}
        onSubmit={handleSaveCategory}
        onCancel={resetCategoryForm}
      />

      {/* Search */}
      <CategorySearch
        searchTerm={categories.searchTerm}
        onSearchChange={categories.setSearchTerm}
        onAddClick={handleAddCategory}
      />

      {/* Categories Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">الفئات ({categories.filteredCategories.length})</h2>
        </div>
        <CategoriesTable
          categories={categories.filteredCategories}
          loading={categories.loading}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
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
