import { useEffect, useState } from 'react';
import apiClient from '../services/api';

interface AccountType {
  id: number;
  name_ar: string;
  name_en: string;
}

interface ReportType {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
}

interface BalanceType {
  id: number;
  name_ar: string;
  name_en: string;
}

interface Account {
  id: number;
  account_number: string;
  name_ar: string;
  name_en: string;
  account_type_id: number;
  report_type_id: number;
  balance_type_id: number;
  account_type_name_ar: string;
  account_type_name_en: string;
  report_type_name_ar: string;
  report_type_name_en: string;
  balance_type_name_ar: string;
  balance_type_name_en: string;
  account_level: number;
  status: 'active' | 'inactive';
}

export default function FoundationalAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [balanceTypes, setBalanceTypes] = useState<BalanceType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('active');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [formData, setFormData] = useState({
    account_number: '',
    name_ar: '',
    name_en: '',
    account_type_id: 1,
    report_type_id: 1,
    balance_type_id: 1,
  });

  useEffect(() => {
    loadParentAccounts();
    loadAccountTypes();
    loadReportTypes();
    loadBalanceTypes();
  }, []);

  const loadParentAccounts = async () => {
    try {
      const response = await apiClient.get('/accounts/parent/list');
      console.log(response);
      
      setAccounts(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading parent accounts:', error);
      setAccounts([]);
      setError('فشل في تحميل الحسابات الرئيسية');
    }
  };

  const loadAccountTypes = async () => {
    try {
      // Fetch from database or use mock data
      const mockTypes: AccountType[] = [
        { id: 1, name_ar: 'أساسي', name_en: 'Main' },
        { id: 2, name_ar: 'فرعي', name_en: 'Sub' },
      ];
      setAccountTypes(mockTypes);
    } catch (error) {
      console.error('Error loading account types:', error);
    }
  };

  const loadReportTypes = async () => {
    try {
      // Fetch from database or use mock data
      const mockReports: ReportType[] = [
        { id: 1, code: 'BAL', name_ar: 'الميزانية العمومية', name_en: 'Balance Sheet' },
        { id: 2, code: 'PL', name_ar: 'الأرباح والخسائر', name_en: 'Profit and Loss' },
      ];
      setReportTypes(mockReports);
    } catch (error) {
      console.error('Error loading report types:', error);
    }
  };

  const loadBalanceTypes = async () => {
    try {
      // Fetch from database or use mock data
      const mockBalanceTypes: BalanceType[] = [
        { id: 1, name_ar: 'مدين', name_en: 'Debit' },
        { id: 2, name_ar: 'دائن', name_en: 'Credit' },
      ];
      setBalanceTypes(mockBalanceTypes);
    } catch (error) {
      console.error('Error loading balance types:', error);
    }
  };

  const handleAdd = () => {
    setEditingNumber(null);
    setFormData({
      account_number: '',
      name_ar: '',
      name_en: '',
      account_type_id: 1,
      report_type_id: 1,
      balance_type_id: 1,
    });
    setIsFormOpen(true);
    setShowDetails(false);
  };

  const handleEdit = (account: Account) => {
    setEditingNumber(account.account_number);
    setFormData({
      account_number: account.account_number,
      name_ar: account.name_ar,
      name_en: account.name_en,
      account_type_id: account.account_type_id,
      report_type_id: account.report_type_id,
      balance_type_id: account.balance_type_id,
    });
    setIsFormOpen(true);
    setShowDetails(false);
  };

  const handleView = (account: Account) => {
    setSelectedAccount(account);
    setShowDetails(true);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.account_number.trim()) {
      setError('رقم الحساب مطلوب');
      return;
    }

    if (!formData.name_ar.trim()) {
      setError('الاسم بالعربية مطلوب');
      return;
    }

    try {
      if (editingNumber) {
        await apiClient.put(`/accounts/${editingNumber}`, formData);
        setSuccessMessage('تم تحديث الحساب بنجاح');
      } else {
        await apiClient.post('/accounts', formData);
        setSuccessMessage('تم إنشاء الحساب بنجاح');
      }
      setIsFormOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
      loadParentAccounts();
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطأ في حفظ الحساب');
    }
  };

  const handleStatusToggle = async (account: Account) => {
    try {
      if (account.status === 'active') {
        await apiClient.patch(`/accounts/${account.account_number}/deactivate`);
        setSuccessMessage('تم تعطيل الحساب بنجاح');
      } else {
        await apiClient.patch(`/accounts/${account.account_number}/activate`);
        setSuccessMessage('تم تفعيل الحساب بنجاح');
      }
      setError(null);
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Update the selected account if viewing details
      if (selectedAccount && selectedAccount.account_number === account.account_number) {
        const updatedStatus = account.status === 'active' ? 'inactive' : 'active';
        setSelectedAccount({ ...selectedAccount, status: updatedStatus });
      }
      
      loadParentAccounts();
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطأ في تحديث حالة الحساب');
    }
  };

  const filteredAccounts = accounts.filter((a) => {
    const matchesSearch =
      a.account_number.includes(searchTerm.toUpperCase()) ||
      a.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.name_en?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'active') return matchesSearch && a.status === 'active';
    if (filterStatus === 'inactive') return matchesSearch && a.status === 'inactive';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-red-600 text-xl">⚠️</span>
          <div className="flex-1">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-lg"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-green-600 text-xl">✓</span>
          <div className="flex-1">
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-600 hover:text-green-800 text-lg"
          >
            ✕
          </button>
        </div>
      )}

      {/* Details View */}
      {showDetails && selectedAccount && (
        <div className="card border-2 border-blue-200 bg-blue-50 p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">تفاصيل الحساب</h2>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-600 hover:text-gray-800 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الحساب
              </label>
              <p className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono font-semibold">
                {selectedAccount.account_number}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم بالعربية
              </label>
              <p className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                {selectedAccount.name_ar}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم بالإنجليزية
              </label>
              <p className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                {selectedAccount.name_en || '-'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الحساب
              </label>
              <p className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                {selectedAccount.account_type_name_ar}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع التقرير
              </label>
              <p className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                {selectedAccount.report_type_name_ar}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الرصيد
              </label>
              <p className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                {selectedAccount.balance_type_name_ar}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المستوى
              </label>
              <p className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                {selectedAccount.account_level}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    selectedAccount.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedAccount.status === 'active' ? 'نشط' : 'معطل'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(selectedAccount)}
              className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg transition"
            >
              تعديل
            </button>
            <button
              onClick={() => handleStatusToggle(selectedAccount)}
              className={`flex-1 text-center font-medium py-2 rounded-lg transition ${
                selectedAccount.status === 'active'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {selectedAccount.status === 'active' ? 'تعطيل' : 'تفعيل'}
            </button>
          </div>
        </div>
      )}

      {/* Form Section */}
      {isFormOpen && (
        <div className="card border-2 border-blue-200 bg-blue-50">
          <h2 className="text-2xl font-bold mb-6">
            {editingNumber ? 'تعديل الحساب' : 'إضافة حساب رئيسي جديد'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الحساب *
              </label>
              <input
                type="text"
                value={formData.account_number}
                onChange={(e) =>
                  setFormData({ ...formData, account_number: e.target.value.toUpperCase() })
                }
                disabled={!!editingNumber}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="مثال: 1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم بالعربية *
              </label>
              <input
                type="text"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: الموجودات"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم بالإنجليزية
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: Assets"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الحساب
              </label>
              <select
                value={formData.account_type_id}
                onChange={(e) =>
                  setFormData({ ...formData, account_type_id: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accountTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name_ar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع التقرير
              </label>
              <select
                value={formData.report_type_id}
                onChange={(e) =>
                  setFormData({ ...formData, report_type_id: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {reportTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name_ar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الرصيد
              </label>
              <select
                value={formData.balance_type_id}
                onChange={(e) =>
                  setFormData({ ...formData, balance_type_id: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {balanceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name_ar}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                {editingNumber ? 'تحديث الحساب' : 'حفظ الحساب'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingNumber(null);
                }}
                className="flex-1 btn-secondary"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">حسابات التأسيس</h1>
        <p className="text-gray-500 mt-1">إدارة حسابات التأسيس</p>
      </div>

      {/* Action Buttons */}
      {!isFormOpen && !showDetails && (
        <div className="flex gap-2">
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <span>➕</span>
            <span>إضافة حساب تأسيسي</span>
          </button>
        </div>
      )}

      {/* Search and Filters */}
      {!isFormOpen && !showDetails && (
        <div className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="ابحث برقم الحساب أو الاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحسابات</option>
                <option value="active">الحسابات النشطة</option>
                <option value="inactive">الحسابات المعطلة</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Accounts Table */}
      {!isFormOpen && !showDetails && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">رقم الحساب</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الاسم</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">النوع</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">التقرير</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">نوع الرصيد</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">المستوى</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <tr key={account.account_number} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-semibold text-blue-600">
                        {account.account_number}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <div>
                          <p>{account.name_ar}</p>
                          {account.name_en && (
                            <p className="text-sm text-gray-600">{account.name_en}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {account.account_type_name_ar}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {account.report_type_name_ar}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {account.balance_type_name_ar}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                          {account.account_level}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            account.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {account.status === 'active' ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(account)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
                          >
                            عرض
                          </button>
                          <button
                            onClick={() => handleEdit(account)}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm font-medium"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleStatusToggle(account)}
                            className={`px-3 py-1 rounded text-xs font-medium transition ${
                              account.status === 'active'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {account.status === 'active' ? 'تعطيل' : 'تفعيل'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">📭</div>
                      <p>لم يتم العثور على حسابات رئيسية</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
