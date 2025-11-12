import { useEffect, useState } from 'react';
import apiClient from '../services/api';
import { Supplier } from '../types';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await apiClient.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Failed to load suppliers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/suppliers', formData);
      setFormData({});
      setShowForm(false);
      loadSuppliers();
    } catch (error) {
      console.error('Failed to add supplier', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">الموردون</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          + إضافة مورد جديد
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="اسم المورد"
                className="input-field"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="input-field"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                className="input-field"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="المدينة"
                className="input-field"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <textarea
              placeholder="العنوان"
              className="input-field"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <button type="submit" className="btn-primary w-full">
              حفظ المورد
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="p-3">اسم المورد</th>
                <th className="p-3">البريد الإلكتروني</th>
                <th className="p-3">الهاتف</th>
                <th className="p-3">المدينة</th>
                <th className="p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="table-row">
                  <td className="p-3">{supplier.name}</td>
                  <td className="p-3">{supplier.email}</td>
                  <td className="p-3">{supplier.phone}</td>
                  <td className="p-3">{supplier.city}</td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:text-blue-800 ml-2">تعديل</button>
                    <button className="text-red-600 hover:text-red-800">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
