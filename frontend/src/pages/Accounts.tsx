import { useState, useEffect } from 'react';
import apiClient from '../services/api';

interface Account {
  id: number;
  account_code: string;
  account_name_ar: string;
  account_name_en?: string;
  account_type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  normal_side: 'مدين' | 'دائن';
  parent_id: number | null;
  is_group: boolean;
  is_active: boolean;
  description?: string;
}

interface FormData {
  account_code: string;
  account_name_ar: string;
  account_name_en: string;
  account_type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  normal_side: 'مدين' | 'دائن';
  parent_id: string;
  is_group: boolean;
  description: string;
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [parentAccounts, setParentAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    account_code: '',
    account_name_ar: '',
    account_name_en: '',
    account_type: 'Asset',
    normal_side: 'مدين',
    parent_id: '',
    is_group: false,
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // جلب الحسابات
  useEffect(() => {
    fetchAccounts();
    fetchParentAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/accounts');
      setAccounts(response.data);
    } catch (err: any) {
      setError('فشل في جلب الحسابات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParentAccounts = async () => {
    try {
      const response = await apiClient.get('/accounts/parent/list');
      setParentAccounts(response.data);
    } catch (err) {
      console.error('خطأ في جلب الحسابات الرئيسية:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      account_code: '',
      account_name_ar: '',
      account_name_en: '',
      account_type: 'Asset',
      normal_side: 'مدين',
      parent_id: '',
      is_group: false,
      description: '',
    });
    setError('');
    setShowForm(true);
  };

  const handleEdit = (account: Account) => {
    setEditingId(account.id);
    setFormData({
      account_code: account.account_code,
      account_name_ar: account.account_name_ar,
      account_name_en: account.account_name_en || '',
      account_type: account.account_type,
      normal_side: account.normal_side,
      parent_id: account.parent_id?.toString() || '',
      is_group: account.is_group,
      description: account.description || '',
    });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        account_code: formData.account_code,
        account_name_ar: formData.account_name_ar,
        account_name_en: formData.account_name_en || null,
        account_type: formData.account_type,
        normal_side: formData.normal_side,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        is_group: formData.is_group,
        description: formData.description || null,
      };

      if (editingId) {
        // تحديث
        await apiClient.put(`/accounts/${editingId}`, payload);
        setSuccess('تم تحديث الحساب بنجاح');
      } else {
        // إضافة جديد
        await apiClient.post('/accounts', payload);
        setSuccess('تم إضافة الحساب بنجاح');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        account_code: '',
        account_name_ar: '',
        account_name_en: '',
        account_type: 'Asset',
        normal_side: 'مدين',
        parent_id: '',
        is_group: false,
        description: '',
      });
      fetchAccounts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await apiClient.delete(`/accounts/${id}`);
      setSuccess('تم حذف الحساب بنجاح');
      fetchAccounts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل حذف الحساب');
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      Asset: 'أصل',
      Liability: 'خصم',
      Equity: 'حقوق ملكية',
      Revenue: 'إيراد',
      Expense: 'مصروف',
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      Asset: 'badge-blue',
      Liability: 'badge-red',
      Equity: 'badge-green',
      Revenue: 'badge-emerald',
      Expense: 'badge-orange',
    };
    return colors[type] || 'badge-gray';
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
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="text-xl font-semibold">
              {editingId ? 'تعديل الحساب' : 'إضافة حساب جديد'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label-field">رمز الحساب *</label>
                <input
                  type="text"
                  name="account_code"
                  value={formData.account_code}
                  onChange={handleInputChange}
                  placeholder="مثال: 1001"
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label-field">اسم الحساب (عربي) *</label>
                <input
                  type="text"
                  name="account_name_ar"
                  value={formData.account_name_ar}
                  onChange={handleInputChange}
                  placeholder="مثال: الصندوق"
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label-field">اسم الحساب (إنجليزي)</label>
                <input
                  type="text"
                  name="account_name_en"
                  value={formData.account_name_en}
                  onChange={handleInputChange}
                  placeholder="Example: Cash"
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label className="label-field">النوع *</label>
                <select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="Asset">أصل</option>
                  <option value="Liability">خصم</option>
                  <option value="Equity">حقوق ملكية</option>
                  <option value="Revenue">إيراد</option>
                  <option value="Expense">مصروف</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label-field">الجانب العادي *</label>
                <select
                  name="normal_side"
                  value={formData.normal_side}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="مدين">مدين (Debit)</option>
                  <option value="دائن">دائن (Credit)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label-field">حساب رئيسي (اختياري)</label>
                <select
                  name="parent_id"
                  value={formData.parent_id}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">-- بدون حساب رئيسي --</option>
                  {parentAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.account_code} - {account.account_name_ar}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_group"
                  name="is_group"
                  checked={formData.is_group}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_group: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="is_group" className="label-field mb-0">هذا حساب رئيسي (مجموعة)</label>
              </div>
              <div className="form-group">
                <label className="label-field">الوصف (اختياري)</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="وصف تفصيلي للحساب"
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                إلغاء
              </button>
              <button type="submit" className="btn-primary">
                {editingId ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* جدول الحسابات */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">لا توجد حسابات حتى الآن</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الرمز</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الاسم</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">النوع</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الجانب</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">{account.account_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{account.account_name_ar}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`badge ${getTypeBadgeColor(account.account_type)}`}>
                      {getTypeLabel(account.account_type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{account.normal_side}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEdit(account)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition mr-2"
                    >
                      ✏️ تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition"
                    >
                      🗑️ حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
