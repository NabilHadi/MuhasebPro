import { useEffect, useState } from 'react';
import apiClient from '../services/api';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  tax_id: string;
  credit_limit: number;
  opening_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TransactionSummary {
  totalSales: number;
  totalSalesAmount: number;
  totalPayments: number;
  totalPaidAmount: number;
  outstandingBalance: number;
  recentTransactions: any[];
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('active');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [transactionsSummary, setTransactionsSummary] = useState<TransactionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    tax_id: '',
    credit_limit: 0,
    opening_balance: 0,
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await apiClient.get('/customers');
      setCustomers(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
      setError('فشل في تحميل العملاء');
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setSelectedCustomer(null);
    setTransactionsSummary(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      tax_id: '',
      credit_limit: 0,
      opening_balance: 0,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setSelectedCustomer(customer);
    setTransactionsSummary(null);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      country: customer.country,
      tax_id: customer.tax_id,
      credit_limit: customer.credit_limit,
      opening_balance: customer.opening_balance,
    });
    setIsFormOpen(true);
  };

  const handleViewDetails = async (customer: Customer) => {
    try {
      setSelectedCustomer(customer);
      setIsFormOpen(false);
      const response = await apiClient.get(`/customers/${customer.id}/transactions`);
      setTransactionsSummary(response.data);
      setError(null);
    } catch (error: any) {
      console.error('Error loading transaction summary:', error);
      setError(error.response?.data?.message || 'فشل في تحميل ملخص المعاملات');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.name.trim() || (!formData.email.trim() && !formData.phone.trim())) {
      setError('الاسم والبريد الإلكتروني أو الهاتف مطلوبان');
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`/customers/${editingId}`, formData);
        setSuccessMessage('تم تحديث العميل بنجاح');
      } else {
        await apiClient.post('/customers', formData);
        setSuccessMessage('تم إنشاء العميل بنجاح');
      }
      setIsFormOpen(false);
      setSelectedCustomer(null);
      setTransactionsSummary(null);
      setTimeout(() => setSuccessMessage(null), 3000);
      loadCustomers();
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطأ في حفظ العميل');
    }
  };

  const handleStatusToggle = async (customer: Customer) => {
    try {
      if (customer.is_active) {
        await apiClient.patch(`/customers/${customer.id}/deactivate`);
        setSuccessMessage('تم تعطيل العميل بنجاح');
      } else {
        await apiClient.patch(`/customers/${customer.id}/activate`);
        setSuccessMessage('تم تفعيل العميل بنجاح');
      }
      setError(null);
      setTimeout(() => setSuccessMessage(null), 3000);
      loadCustomers();
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطأ في تحديث حالة العميل');
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.city?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterActive === 'active') return matchesSearch && c.is_active;
    if (filterActive === 'inactive') return matchesSearch && !c.is_active;
    return matchesSearch;
  });

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

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

      {/* Customer Details View */}
      {selectedCustomer && !isFormOpen && transactionsSummary && (
        <div className="card border-2 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">تفاصيل العميل</h2>
              <p className="text-gray-600 mt-1">{selectedCustomer.name}</p>
            </div>
            <button
              onClick={() => {
                setSelectedCustomer(null);
                setTransactionsSummary(null);
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-800">المعلومات الأساسية</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">الاسم:</span>
                  <p className="text-gray-800">{selectedCustomer.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">البريد الإلكتروني:</span>
                  <p className="text-gray-800">{selectedCustomer.email || '-'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">الهاتف:</span>
                  <p className="text-gray-800">{selectedCustomer.phone || '-'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">رقم الضريبة:</span>
                  <p className="text-gray-800">{selectedCustomer.tax_id || '-'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">الحد الائتماني:</span>
                  <p className="text-gray-800">{selectedCustomer.credit_limit.toFixed(2)} ر.س</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-800">العنوان</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">العنوان:</span>
                  <p className="text-gray-800">{selectedCustomer.address || '-'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">المدينة:</span>
                  <p className="text-gray-800">{selectedCustomer.city || '-'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">الدولة:</span>
                  <p className="text-gray-800">{selectedCustomer.country || '-'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">الحالة:</span>
                  <p className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                    selectedCustomer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedCustomer.is_active ? 'نشط' : 'معطل'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">ملخص المعاملات</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded p-4 border border-gray-200">
                <p className="text-gray-600 text-sm">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-blue-600">{transactionsSummary.totalSales}</p>
              </div>
              <div className="bg-white rounded p-4 border border-gray-200">
                <p className="text-gray-600 text-sm">قيمة المبيعات</p>
                <p className="text-2xl font-bold text-blue-600">{transactionsSummary.totalSalesAmount.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded p-4 border border-gray-200">
                <p className="text-gray-600 text-sm">المدفوع</p>
                <p className="text-2xl font-bold text-green-600">{transactionsSummary.totalPaidAmount.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded p-4 border border-gray-200">
                <p className="text-gray-600 text-sm">الرصيد المستحق</p>
                <p className={`text-2xl font-bold ${transactionsSummary.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {transactionsSummary.outstandingBalance.toFixed(2)}
                </p>
              </div>
            </div>

            {transactionsSummary.recentTransactions.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 mb-3">آخر 5 معاملات</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-right font-medium">رقم الفاتورة</th>
                        <th className="px-3 py-2 text-right font-medium">المبلغ</th>
                        <th className="px-3 py-2 text-right font-medium">الحالة</th>
                        <th className="px-3 py-2 text-right font-medium">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsSummary.recentTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2">{tx.invoiceNumber}</td>
                          <td className="px-3 py-2">{tx.totalAmount.toFixed(2)}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              tx.status === 'paid' ? 'bg-green-100 text-green-800' :
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tx.status === 'paid' ? 'مدفوع' : tx.status === 'pending' ? 'معلق' : 'ملغى'}
                            </span>
                          </td>
                          <td className="px-3 py-2">{new Date(tx.invoiceDate).toLocaleDateString('ar-SA')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t pt-4 mt-6">
            <button
              onClick={() => handleEdit(selectedCustomer)}
              className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-medium"
            >
              تعديل
            </button>
            <button
              onClick={() => {
                setSelectedCustomer(null);
                setTransactionsSummary(null);
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Form Section */}
      {isFormOpen && (
        <div className="card border-2 border-blue-200 bg-blue-50">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? 'تعديل العميل' : 'إضافة عميل جديد'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الهاتف
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الضريبة
              </label>
              <input
                type="text"
                value={formData.tax_id}
                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الدولة
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الائتماني
              </label>
              <input
                type="number"
                value={formData.credit_limit}
                onChange={(e) => setFormData({ ...formData, credit_limit: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الرصيد الافتتاحي
              </label>
              <input
                type="number"
                value={formData.opening_balance}
                onChange={(e) => setFormData({ ...formData, opening_balance: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                {editingId ? 'تحديث العميل' : 'حفظ العميل'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingId(null);
                  setSelectedCustomer(null);
                  setTransactionsSummary(null);
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
        <h1 className="text-3xl font-bold text-gray-800">العملاء</h1>
        <p className="text-gray-500 mt-1">إدارة معلومات العملاء والمبيعات</p>
      </div>

      {/* Action Buttons */}
      {!isFormOpen && !selectedCustomer && (
        <div className="flex gap-2">
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <span>➕</span>
            <span>إضافة عميل جديد</span>
          </button>
        </div>
      )}

      {/* Search and Filters */}
      {!isFormOpen && !selectedCustomer && (
        <div className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد أو الهاتف أو المدينة..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterActive}
                onChange={(e) => {
                  setFilterActive(e.target.value as 'all' | 'active' | 'inactive');
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع العملاء</option>
                <option value="active">العملاء النشطون</option>
                <option value="inactive">العملاء المعطلون</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Customers Table */}
      {!isFormOpen && !selectedCustomer && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الاسم</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الهاتف</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">المدينة</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{customer.name}</td>
                      <td className="px-4 py-3 text-gray-600">{customer.email || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{customer.phone || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{customer.city || '-'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleStatusToggle(customer)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition ${
                            customer.is_active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {customer.is_active ? 'نشط' : 'معطل'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(customer)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
                          >
                            التفاصيل
                          </button>
                          <button
                            onClick={() => handleEdit(customer)}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm font-medium"
                          >
                            تعديل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">📭</div>
                      <p>لم يتم العثور على عملاء</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                عرض {(currentPage - 1) * itemsPerPage + 1} إلى{' '}
                {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} من {filteredCustomers.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 transition"
                >
                  السابق
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded transition ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 transition"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
