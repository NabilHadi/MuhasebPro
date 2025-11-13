import AccountsFilters from './AccountsFilters';
import AccountsForm from './AccountsForm';
import AccountsTable from './AccountsTable';
import { useAccountsData, useAccountForm, useAccountFilters } from './hooks';

export default function Accounts() {
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
    handleDelete: handleFormDelete,
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

  const handleDelete = async (accountNumber: string) => {
    await handleFormDelete(accountNumber, fetchAccounts);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">الحسابات</h1>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center gap-2"
        >
          <span>➕</span>
          <span>حساب جديد</span>
        </button>
      </div>

      {/* رسائل */}
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success mb-4">
          {success}
        </div>
      )}

      {/* نموذج الإضافة/التعديل */}
      {showForm && (
        <AccountsForm
          formData={formData}
          setFormData={setFormData}
          editingNumber={editingNumber}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          mainTypeAccounts={mainTypeAccounts}
          accountTypes={accountTypes}
          onParentAccountChange={handleParentAccountChange}
          getBalanceLabel={getBalanceLabel}
        />
      )}

      {/* جدول الحسابات */}
      <AccountsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {accounts.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">لا توجد حسابات حتى الآن</p>
        </div>
      ) : (
        <AccountsTable
          accounts={filteredAccounts}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getTypeLabel={getTypeLabel}
          getReportLabel={getReportLabel}
          getBalanceLabel={getBalanceLabel}
          getTypeBadgeColor={getTypeBadgeColor}
        />
      )}
    </div>
  );
}
