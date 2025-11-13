import React, { useEffect } from 'react';
import AccountsForm from './AccountsForm';
import AccountsTable from './AccountsTable';
import AccountsFilters from './AccountsFilters';
import ToastContainer from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import { useAccountsData, useAccountForm, useAccountFilters } from './hooks';
import { useToast } from '../../hooks/useToast';
import { useConfirmModal } from '../../hooks/useConfirmModal';

export default function Accounts() {
  // Toast notifications
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Confirmation modal
  const { isOpen, options, isLoading, confirm, handleConfirm, handleCancel } = useConfirmModal();

  // جلب البيانات
  const {
    accounts,
    mainTypeAccounts,
    accountTypes,
    reportTypes,
    balanceTypes,
    loading,
    error: dataError,
    fetchAccounts,
    fetchMainTypeAccounts,
  } = useAccountsData();

  // إدارة النموذج
  const {
    formData,
    setFormData,
    editingNumber,
    showForm,
    setShowForm,
    success,
    error: formError,
    handleParentAccountChange: handleParentChange,
    handleAddNew: handleAddNewForm,
    handleEdit,
    handleSubmit: handleFormSubmit,
    handleToggleStatus: handleFormToggleStatus,
  } = useAccountForm();

  // إدارة التصفية والبحث
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredAccounts,
    getTypeLabel,
    getReportLabel,
    getBalanceLabel,
    getTypeBadgeColor,
  } = useAccountFilters(accounts, { accountTypes, reportTypes, balanceTypes });

  // دمج الأخطاء
  const error = dataError || formError;

  // عرض الرسائل كـ toasts
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  useEffect(() => {
    if (success) {
      showSuccess(success);
    }
  }, [success, showSuccess]);

  // دوال معالجة الأحداث
  const handleParentAccountChange = (parentNumber: string) => {
    handleParentChange(parentNumber, mainTypeAccounts);
  };

  const handleAddNew = async () => {
    await handleAddNewForm(fetchAccounts, fetchMainTypeAccounts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    await handleFormSubmit(e, fetchAccounts);
  };

  const handleToggleStatus = async (accountNumber: string) => {
    await handleFormToggleStatus(accountNumber, fetchAccounts, confirm);
  };

  // تحديد ما إذا كان نوع الرصيد قابل للتعديل (للحسابات الأساسية فقط)
  const isBalanceTypeEditable = !formData.parent_account_number;

  return (
    <div>
      {/* نموذج الإضافة/التعديل */}
      <AccountsForm
        isOpen={showForm}
        formData={formData}
        setFormData={setFormData}
        editingNumber={editingNumber}
        onSubmit={handleSubmit}
        onCancel={() => setShowForm(false)}
        mainTypeAccounts={mainTypeAccounts}
        accountTypes={accountTypes}
        balanceTypes={balanceTypes}
        onParentAccountChange={handleParentAccountChange}
        getBalanceLabel={getBalanceLabel}
        isBalanceTypeEditable={isBalanceTypeEditable}
      />

      {/* صفحة الحسابات المدمجة */}
      <div className="card-small-padding">
        {/* التصفية والبحث */}
        <AccountsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onAddNew={handleAddNew}
        />

        {/* الجدول */}
        <div className="overflow-x-auto">
          {accounts.length === 0 ? (
            <div className="text-center py-8 p-6">
              <p className="text-gray-500">لا توجد حسابات حتى الآن</p>
            </div>
          ) : (
            <AccountsTable
              accounts={filteredAccounts}
              loading={loading}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              getTypeLabel={getTypeLabel}
              getReportLabel={getReportLabel}
              getBalanceLabel={getBalanceLabel}
              getTypeBadgeColor={getTypeBadgeColor}
            />
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        isDangerous={options.isDangerous}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
