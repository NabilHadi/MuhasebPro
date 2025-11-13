import { useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { useConfirmModal } from '../../hooks/useConfirmModal';
import { useUnits } from './hooks/useUnits';
import { useCategories } from './hooks/useCategories';
import { ToastContainer } from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import UnitForm from './components/unit/UnitForm';
import UnitFilters from './components/unit/UnitFilters';
import UnitsTable from './components/unit/UnitsTable';
import Pagination from './components/Pagination';

export default function UnitsOfMeasurePage() {
    const { toasts, showSuccess, showError, removeToast } = useToast();
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirmModal();
    const categories = useCategories(showSuccess, showError, confirm);
    const units = useUnits(categories.categories, showSuccess, showError, confirm);

    useEffect(() => {
        categories.loadCategories();
        units.loadUnits();
    }, []);

    return (
        <div>
            <ToastContainer toasts={toasts} onClose={removeToast} />

            {/* Unit Form Modal */}
            <Modal
                isOpen={units.showUnitForm}
                title={units.editingUnitId ? 'تعديل الوحدة' : 'إضافة وحدة جديدة'}
                onClose={units.resetUnitForm}
                size="lg"
            >
                <UnitForm
                    isOpen={true}
                    isEditing={!!units.editingUnitId}
                    categories={categories.categories}
                    formData={units.unitForm}
                    onFormChange={(updates) =>
                        units.setUnitForm({ ...units.unitForm, ...updates })
                    }
                    onSubmit={units.handleSaveUnit}
                    onCancel={units.resetUnitForm}
                />
            </Modal>

            <div className="card-small-padding">

                {/* Filters */}
                <div className='py-2'>
                    <UnitFilters
                        searchTerm={units.unitSearchTerm}
                        categoryFilter={units.unitCategoryFilter}
                        statusFilter={units.unitFilterActive}
                        categories={categories.categories}
                        onSearchChange={(term) => {
                            units.setUnitSearchTerm(term);
                            units.setUnitCurrentPage(1);
                        }}
                        onCategoryFilterChange={(filter) => {
                            units.setUnitCategoryFilter(filter);
                            units.setUnitCurrentPage(1);
                        }}
                        onStatusFilterChange={(filter) => {
                            units.setUnitFilterActive(filter);
                            units.setUnitCurrentPage(1);
                        }}
                        onAddClick={() => units.setShowUnitForm(true)}
                    />
                </div>

                {/* Units Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    الاسم
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    الاختصار
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    الفئة
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    النسبة
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    أساسية
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <UnitsTable
                                units={units.paginatedUnits}
                                onEdit={units.handleEditUnit}
                                onToggleStatus={units.handleToggleUnitStatus}
                            />
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={units.unitCurrentPage}
                    totalPages={units.unitTotalPages}
                    itemsPerPage={10}
                    totalItems={units.filteredUnits.length}
                    onPageChange={units.setUnitCurrentPage}
                />
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
