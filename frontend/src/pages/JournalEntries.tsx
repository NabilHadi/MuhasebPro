import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import JournalEntryForm from './JournalEntryForm';
import JournalEntryView from './JournalEntryView';
import JournalEntriesList from './JournalEntriesList';

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
  total_debit?: number;
  total_credit?: number;
}

interface FormDataType {
  date: string;
  description: string;
  reference: string;
  lines: Array<{
    account_id: string | number;
    debit: string | number;
    credit: string | number;
  }>;
}

export default function JournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);
  const [viewingEntry, setViewingEntry] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<FormDataType>({
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
      console.log(response);
      
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
        <JournalEntryView
          viewingEntry={viewingEntry}
          onClose={() => setViewingEntry(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* نموذج الإضافة/التعديل */}
      {showForm && (
        <JournalEntryForm
          formData={formData}
          accounts={accounts}
          selectedEntry={selectedEntry}
          isBalanced={isBalanced}
          totalDebit={totalDebit}
          totalCredit={totalCredit}
          onInputChange={handleInputChange}
          onLineChange={handleLineChange}
          onAddLine={handleAddLine}
          onRemoveLine={handleRemoveLine}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedEntry(null);
          }}
        />
      )}

      {/* قائمة القيود */}
      <JournalEntriesList entries={entries} loading={loading} onView={handleView} />
    </div>
  );
}
