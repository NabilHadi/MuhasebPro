import { useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { useConfirmModal } from '../../hooks/useConfirmModal';
import { useCategories } from './hooks/useCategories';
import { ToastContainer } from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import CategoryForm from './components/category/CategoryForm';
import CategorySearch from './components/category/CategorySearch';
import CategoriesTable from './components/category/CategoriesTable';

export default function UnitsOfMeasureCategories() {
    const { toasts, showSuccess, showError, removeToast } = useToast();
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirmModal();
    const categories = useCategories(showSuccess, showError, confirm);

    useEffect(() => {
        categories.loadCategories();
    }, []);

    return (
        <div>
            <ToastContainer toasts={toasts} onClose={removeToast} />

            {/* Category Form Modal */}
            <Modal
                isOpen={categories.showCategoryForm}
                title={categories.editingCategoryId ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                onClose={categories.resetCategoryForm}
                size="lg"
            >
                <CategoryForm
                    isOpen={true}
                    isEditing={!!categories.editingCategoryId}
                    formData={categories.categoryForm}
                    onFormChange={(updates: Record<string, any>) =>
                        categories.setCategoryForm({ ...categories.categoryForm, ...updates })
                    }
                    onSubmit={categories.handleSaveCategory}
                    onCancel={categories.resetCategoryForm}
                />
            </Modal>

            <div className="card">
                {/* Search and Add Button */}
                <CategorySearch
                    searchTerm={categories.categorySearchTerm}
                    onSearchChange={categories.setCategorySearchTerm}
                    onAddClick={() => categories.setShowCategoryForm(true)}
                />
                
                {/* Categories Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    الاسم
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    الوصف
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    الحالة
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    تاريخ الإنشاء
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <CategoriesTable
                                categories={categories.filteredCategories}
                                onEdit={categories.handleEditCategory}
                                onToggleStatus={categories.handleToggleCategoryStatus}
                            />
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={isOpen}
                title={options.title}
                message={options.message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                isDangerous={options.isDangerous}
            />
        </div>
    );
}
