import { useState, useEffect } from 'react';
import apiClient from '../services/api';

interface Account {
  id: number;
  account_code: string;
  account_name_ar: string;
}

interface JournalEntry {
  id: number;
  date: string;
  description: string;
  reference: string;
  created_at: string;
}

export default function JournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [viewingEntry, setViewingEntry] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    lines: [
      { account_id: '', debit: '', credit: '' },
      { account_id: '', debit: '', credit: '' },
    ],
  });

  // جلب البيانات
  useEffect(() => {
    fetchEntries();
    fetchAccounts();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/journal-entries');
      setEntries(response.data);
    } catch (err) {
      setError('فشل في جلب القيود');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await apiClient.get('/accounts');
      setAccounts(response.data);
    } catch (err) {
      console.error('خطأ في جلب الحسابات:', err);
    }
  };

  const handleAddNew = () => {
    setSelectedEntry(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      lines: [
        { account_id: '', debit: '', credit: '' },
        { account_id: '', debit: '', credit: '' },
      ],
    });
    setError('');
    setShowForm(true);
  };

  const handleAddLine = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [...prev.lines, { account_id: '', debit: '', credit: '' }],
    }));
  };

  const handleRemoveLine = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLineChange = (
    index: number,
    field: 'account_id' | 'debit' | 'credit',
    value: string
  ) => {
    setFormData((prev) => {
      const newLines = [...prev.lines];
      newLines[index] = {
        ...newLines[index],
        [field]: field === 'account_id' ? value : parseFloat(value) || '',
      };
      return { ...prev, lines: newLines };
    });
  };

  const calculateTotals = () => {
    const totalDebit = formData.lines.reduce((sum, line) => sum + (parseFloat(line.debit?.toString() || '0')), 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + (parseFloat(line.credit?.toString() || '0')), 0);
    return { totalDebit, totalCredit };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // تحقق من أن جميع الأسطر لها حساب
      if (formData.lines.some((line) => !line.account_id)) {
        setError('جميع الأسطر يجب أن تحتوي على حساب');
        return;
      }

      // تحقق من أن كل سطر له قيمة
      if (formData.lines.some((line) => !line.debit && !line.credit)) {
        setError('كل سطر يجب أن يحتوي على قيمة دين أو دائن');
        return;
      }

      const payload = {
        date: formData.date,
        description: formData.description || null,
        reference: formData.reference || null,
        lines: formData.lines.map((line) => ({
          account_id: parseInt(line.account_id?.toString() || '0'),
          debit: parseFloat(line.debit?.toString() || '0'),
          credit: parseFloat(line.credit?.toString() || '0'),
        })),
      };

      if (selectedEntry) {
        // تحديث
        await apiClient.put(`/journal-entries/${selectedEntry}`, payload);
        setSuccess('تم تحديث القيد بنجاح');
      } else {
        // إضافة جديد
        await apiClient.post('/journal-entries', payload);
        setSuccess('تم إضافة القيد بنجاح');
      }

      setShowForm(false);
      setSelectedEntry(null);
      setViewingEntry(null);
      fetchEntries();
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleView = async (id: number) => {
    try {
      const response = await apiClient.get(`/journal-entries/${id}`);
      setViewingEntry(response.data);
    } catch (err) {
      setError('فشل جلب تفاصيل القيد');
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const response = await apiClient.get(`/journal-entries/${id}`);
      setSelectedEntry(id);
      setFormData({
        date: response.data.date,
        description: response.data.description || '',
        reference: response.data.reference || '',
        lines: response.data.lines.map((line: any) => ({
          account_id: line.account_id,
          debit: line.debit || '',
          credit: line.credit || '',
        })),
      });
      setViewingEntry(null);
      setShowForm(true);
    } catch (err) {
      setError('فشل جلب تفاصيل القيد');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا القيد؟')) {
      return;
    }

    try {
      setError('');
      await apiClient.delete(`/journal-entries/${id}`);
      setSuccess('تم حذف القيد بنجاح');
      setViewingEntry(null);
      fetchEntries();
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل حذف القيد');
    }
  };

  const { totalDebit, totalCredit } = calculateTotals();
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">القيود المحاسبية</h1>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <span>➕</span>
          <span>قيد جديد</span>
        </button>
      </div>

      {/* رسائل */}
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}

      {/* عرض القيد */}
      {viewingEntry && (
        <div className="card mb-8">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-xl font-semibold">تفاصيل القيد</h2>
            <button onClick={() => setViewingEntry(null)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">التاريخ</p>
                <p className="font-semibold">{viewingEntry.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">المرجع</p>
                <p className="font-semibold">{viewingEntry.reference || '--'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">البيان</p>
                <p className="font-semibold">{viewingEntry.description || '--'}</p>
              </div>
            </div>

            <table className="w-full mb-6">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold">الحساب</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">الرمز</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">دين</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">دائن</th>
                </tr>
              </thead>
              <tbody>
                {viewingEntry.lines.map((line: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{line.name}</td>
                    <td className="px-6 py-3 text-sm font-mono">{line.code}</td>
                    <td className="px-6 py-3 text-sm text-left">
                      {line.debit > 0 ? line.debit.toFixed(2) : '--'}
                    </td>
                    <td className="px-6 py-3 text-sm text-left">
                      {line.credit > 0 ? line.credit.toFixed(2) : '--'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan={2} className="px-6 py-3 text-right">
                    الإجمالي
                  </td>
                  <td className="px-6 py-3 text-left">
                    {viewingEntry.lines.reduce((sum: number, line: any) => sum + line.debit, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {viewingEntry.lines.reduce((sum: number, line: any) => sum + line.credit, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex gap-2 justify-end">
              <button onClick={() => setViewingEntry(null)} className="btn-secondary">
                إغلاق
              </button>
              <button onClick={() => handleEdit(viewingEntry.id)} className="btn-primary">
                تعديل
              </button>
              <button onClick={() => handleDelete(viewingEntry.id)} className="btn-danger">
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نموذج الإضافة/التعديل */}
      {showForm && (
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="text-xl font-semibold">
              {selectedEntry ? 'تعديل القيد' : 'إضافة قيد جديد'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="label-field">التاريخ *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label-field">المرجع (اختياري)</label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  placeholder="مثال: FV001"
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label className="label-field">البيان (اختياري)</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="وصف القيد"
                  className="input-field"
                />
              </div>
            </div>

            {/* جدول الأسطر */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-2 text-right">الحساب</th>
                    <th className="px-3 py-2 text-left">دين</th>
                    <th className="px-3 py-2 text-left">دائن</th>
                    <th className="px-3 py-2 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.lines.map((line, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-3 py-2">
                        <select
                          value={line.account_id}
                          onChange={(e) => handleLineChange(index, 'account_id', e.target.value)}
                          className="input-field text-sm"
                          required
                        >
                          <option value="">-- اختر حساب --</option>
                          {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.account_code} - {account.account_name_ar}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={line.debit}
                          onChange={(e) => handleLineChange(index, 'debit', e.target.value)}
                          placeholder="0.00"
                          className="input-field text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={line.credit}
                          onChange={(e) => handleLineChange(index, 'credit', e.target.value)}
                          placeholder="0.00"
                          className="input-field text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {formData.lines.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLine(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className={`font-semibold ${isBalanced ? 'bg-green-50' : 'bg-red-50'}`}>
                    <td className="px-3 py-2 text-right">الإجمالي</td>
                    <td className="px-3 py-2 text-left">{totalDebit.toFixed(2)}</td>
                    <td className="px-3 py-2 text-left">{totalCredit.toFixed(2)}</td>
                    <td className="px-3 py-2 text-center">
                      {isBalanced ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✕</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddLine}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <span>➕</span>
              <span>إضافة سطر</span>
            </button>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedEntry(null);
                }}
                className="btn-secondary"
              >
                إلغاء
              </button>
              <button type="submit" className="btn-primary" disabled={!isBalanced}>
                {selectedEntry ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* قائمة القيود */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">لا توجد قيود حتى الآن</p>
        </div>
      ) : (
        <div className="card">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">التاريخ</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">المرجع</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">البيان</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-700">{entry.date}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">{entry.reference || '--'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{entry.description || '--'}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleView(entry.id)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition mr-2"
                    >
                      👁️ عرض
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
