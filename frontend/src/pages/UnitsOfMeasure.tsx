import { useEffect, useState } from 'react';
import apiClient from '../services/api';

interface Unit {
  id: number;
  name_ar: string;
  name_en: string;
  short_name: string;
  category: string;
  ratio_to_base: number;
  is_base: boolean;
  is_active: boolean;
  description: string;
  created_at: string;
}

export default function UnitsOfMeasure() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('active');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    short_name: '',
    category: 'General',
    ratio_to_base: 1,
    is_base: false,
    description: '',
  });

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      const response = await apiClient.get('/units-of-measure');
      setUnits(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading units:', error);
      setUnits([]);
      setError('فشل في تحميل وحدات القياس');
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name_ar: '',
      name_en: '',
      short_name: '',
      category: 'General',
      ratio_to_base: 1,
      is_base: false,
      description: '',
    });
    setIsFormOpen(true);
  };

  const handleEdit = (unit: Unit) => {
    setEditingId(unit.id);
    setFormData({
      name_ar: unit.name_ar,
      name_en: unit.name_en,
      short_name: unit.short_name,
      category: unit.category,
      ratio_to_base: unit.ratio_to_base,
      is_base: unit.is_base,
      description: unit.description,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.name_ar.trim()) {
      setError('الاسم بالعربية مطلوب');
      return;
    }

    if (!formData.short_name.trim()) {
      setError('الاختصار مطلوب');
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`/units-of-measure/${editingId}`, formData);
        setSuccessMessage('تم تحديث الوحدة بنجاح');
      } else {
        await apiClient.post('/units-of-measure', formData);
        setSuccessMessage('تم إنشاء الوحدة بنجاح');
      }
      setIsFormOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
      loadUnits();
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطأ في حفظ الوحدة');
    }
  };

  const handleStatusToggle = async (unit: Unit) => {
    try {
      if (unit.is_active) {
        await apiClient.patch(`/units-of-measure/${unit.id}/deactivate`);
        setSuccessMessage('تم تعطيل الوحدة بنجاح');
      } else {
        await apiClient.patch(`/units-of-measure/${unit.id}/activate`);
        setSuccessMessage('تم تفعيل الوحدة بنجاح');
      }
      setError(null);
      setTimeout(() => setSuccessMessage(null), 3000);
      loadUnits();
    } catch (error: any) {
      setError(error.response?.data?.message || 'خطأ في تحديث حالة الوحدة');
    }
  };

  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.short_name.includes(searchTerm.toUpperCase()) ||
      u.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterActive === 'active') return matchesSearch && u.is_active;
    if (filterActive === 'inactive') return matchesSearch && !u.is_active;
    return matchesSearch;
  });

  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

 

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

      {/* Form Section */}
      {isFormOpen && (
        <div className="card border-2 border-blue-200 bg-blue-50">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? 'تعديل وحدة القياس' : 'إضافة وحدة قياس جديدة'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم بالعربية *
              </label>
              <input
                type="text"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: قطعة"
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
                placeholder="مثال: Piece"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاختصار *
              </label>
              <input
                type="text"
                value={formData.short_name}
                onChange={(e) => setFormData({ ...formData, short_name: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: PCS"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الفئة
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="General">عام</option>
                <option value="Weight">وزن</option>
                <option value="Length">طول</option>
                <option value="Volume">حجم</option>
                <option value="Area">مساحة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نسبة التحويل إلى الوحدة الأساسية
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.ratio_to_base}
                onChange={(e) => setFormData({ ...formData, ratio_to_base: parseFloat(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_base}
                  onChange={(e) => setFormData({ ...formData, is_base: e.target.checked })}
                  className="w-4 h-4"
                />
                وحدة أساسية
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                {editingId ? 'تحديث الوحدة' : 'حفظ الوحدة'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingId(null);
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
        <h1 className="text-3xl font-bold text-gray-800">وحدات القياس</h1>
        <p className="text-gray-500 mt-1">إدارة وحدات القياس والتحويلات</p>
      </div>

      {/* Action Buttons */}
      {!isFormOpen && (
        <div className="flex gap-2">
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <span>➕</span>
            <span>إضافة وحدة جديدة</span>
          </button>
        </div>
      )}

      {/* Search and Filters */}
      {!isFormOpen && (
        <div className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="ابحث بالاسم أو الاختصار أو الفئة..."
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
                <option value="all">جميع الوحدات</option>
                <option value="active">الوحدات النشطة</option>
                <option value="inactive">الوحدات المعطلة</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Units Table */}
      {!isFormOpen && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الاسم</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الاختصار</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الفئة</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">النسبة</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">أساسية</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUnits.length > 0 ? (
                  paginatedUnits.map((unit) => (
                    <tr key={unit.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        <div>
                          <p>{unit.name_ar}</p>
                          {unit.name_en && <p className="text-sm text-gray-600">{unit.name_en}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-blue-600">{unit.short_name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {unit.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{(Number(unit.ratio_to_base) || 0).toFixed(6)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          unit.is_base ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {unit.is_base ? 'نعم' : 'لا'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(unit)}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm font-medium"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleStatusToggle(unit)}
                            className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                              unit.is_active
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {unit.is_active ? 'تعطيل' : 'تفعيل'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      <div className="text-4xl mb-2">📭</div>
                      <p>لم يتم العثور على وحدات قياس</p>
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
                {Math.min(currentPage * itemsPerPage, filteredUnits.length)} من {filteredUnits.length}
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
