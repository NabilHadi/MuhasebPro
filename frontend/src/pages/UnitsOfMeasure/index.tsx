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
        <div className='my-4'>
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
        {units.units.length === 0 ? (
          <div className="text-center py-8 p-6">
            <p className="text-gray-500">لا توجد وحدات قياس حتى الآن</p>
          </div>
        ) : (
          <UnitsTable
            units={units.filteredUnits}
            onEdit={units.handleEditUnit}
            onToggleStatus={units.handleToggleUnitStatus}
          />
        )}


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
