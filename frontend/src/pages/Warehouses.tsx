import { useEffect, useState } from 'react';
import apiClient from '../services/api';

interface Warehouse {
  id: number;
  name: string;
  location: string;
  manager: string;
  type: 'Main' | 'Branch' | 'Transit';
  capacity: number;
  is_active: boolean;
  created_at: string;
}

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    manager: '',
    type: 'Main' as 'Main' | 'Branch' | 'Transit',
    capacity: 0,
  });

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      const response = await apiClient.get('/warehouses');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error loading warehouses:', error);
      setWarehouses([]);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '', location: '', manager: '', type: 'Main', capacity: 0 });
    setIsFormOpen(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingId(warehouse.id);
    setFormData({
      name: warehouse.name,
      location: warehouse.location,
      manager: warehouse.manager,
      type: warehouse.type,
      capacity: warehouse.capacity,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.name.trim()) {
      setError('يرجى إدخال اسم المخزن');
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`/warehouses/${editingId}`, formData);
        setSuccessMessage('تم تحديث المخزن بنجاح');
      } else {
        await apiClient.post('/warehouses', formData);
        setSuccessMessage('تم إنشاء المخزن بنجاح');
      }
      setIsFormOpen(false);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      loadWarehouses();
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطأ في حفظ المخزن');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المخزن؟')) return;
    setError(null);
    setSuccessMessage(null);

    try {
      await apiClient.delete(`/warehouses/${id}`);
      setSuccessMessage('تم حذف المخزن بنجاح');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      loadWarehouses();
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطأ في حذف المخزن');
    }
  };

  const filteredWarehouses = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeColors: { [key: string]: string } = {
    Main: 'bg-blue-100 text-blue-800',
    Branch: 'bg-green-100 text-green-800',
    Transit: 'bg-yellow-100 text-yellow-800',
  };

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

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">المخازن</h1>
        <p className="text-gray-500 mt-1">إدارة مواقع المخازن والتخزين</p>
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <div className="card border-2 border-blue-200 bg-blue-50">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? 'تعديل المخزن' : 'إضافة مخزن جديد'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المخزن *
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
                الموقع
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المدير
              </label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النوع *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Main">رئيسي</option>
                <option value="Branch">فرعي</option>
                <option value="Transit">عابر</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السعة
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 items-end">
              <button type="submit" className="flex-1 btn-primary">
                {editingId ? 'تحديث المخزن' : 'حفظ المخزن'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingId(null);
                  setFormData({ name: '', location: '', manager: '', type: 'Main', capacity: 0 });
                }}
                className="flex-1 btn-secondary"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Action Buttons */}
      {!isFormOpen && (
        <div className="flex gap-2">
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <span>➕</span>
            <span>إضافة مخزن جديد</span>
          </button>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <input
          type="text"
          placeholder="ابحث عن المخازن..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWarehouses.length > 0 ? (
          filteredWarehouses.map((warehouse) => (
            <div key={warehouse.id} className="card border border-gray-200 hover:shadow-lg transition">
              <div className="flex-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">{warehouse.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${typeColors[warehouse.type]}`}>
                  {warehouse.type}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                {warehouse.location && (
                  <p className="text-gray-700">
                    <span className="font-medium">الموقع:</span> {warehouse.location}
                  </p>
                )}
                {warehouse.manager && (
                  <p className="text-gray-700">
                    <span className="font-medium">المدير:</span> {warehouse.manager}
                  </p>
                )}
                {warehouse.capacity > 0 && (
                  <p className="text-gray-700">
                    <span className="font-medium">السعة:</span> {warehouse.capacity}
                  </p>
                )}
              </div>

              <div className="flex gap-2 border-t pt-3">
                <button
                  onClick={() => handleEdit(warehouse)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(warehouse.id)}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
                >
                  حذف
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>لم يتم العثور على مخازن</p>
          </div>
        )}
      </div>
    </div>
  );
}
