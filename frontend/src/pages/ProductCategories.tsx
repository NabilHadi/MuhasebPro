import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

interface ProductCategory {
  id: number;
  category_number: number;
  category_name_ar: string;
  category_name_en: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FormData {
  category_number: number;
  category_name_ar: string;
  category_name_en: string;
  description: string;
}

const ProductCategories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    category_number: 0,
    category_name_ar: '',
    category_name_en: '',
    description: '',
  });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/product-categories');
      setCategories(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'فشل جلب الفئات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        // Update category
        await apiClient.put(`/product-categories/${editingId}`, formData);
      } else {
        // Create category
        await apiClient.post('/product-categories', formData);
      }

      // Reset form and refresh list
      setFormData({ category_number: 0, category_name_ar: '', category_name_en: '', description: '' });
      setEditingId(null);
      setIsFormVisible(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ');
    }
  };

  // Handle edit
  const handleEdit = (category: ProductCategory) => {
    setFormData({
      category_number: category.category_number,
      category_name_ar: category.category_name_ar,
      category_name_en: category.category_name_en,
      description: category.description,
    });
    setEditingId(category.id);
    setIsFormVisible(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      try {
        await apiClient.delete(`/product-categories/${id}`);
        fetchCategories();
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.error || 'فشل حذف الفئة');
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ category_number: 0, category_name_ar: '', category_name_en: '', description: '' });
    setEditingId(null);
    setIsFormVisible(false);
    setError('');
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.category_name_ar.includes(searchTerm) || cat.category_name_en.includes(searchTerm)
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">فئات المنتجات</h1>
        <p className="text-gray-600">إدارة فئات المنتجات في النظام</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="البحث عن فئة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {isFormVisible ? 'إلغاء' : 'إضافة فئة'}
        </button>
      </div>

      {isFormVisible && (
        <div className="mb-6 p-6 border border-gray-300 rounded-lg bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الفئة *
              </label>
              <input
                type="number"
                name="category_number"
                value={formData.category_number}
                onChange={handleInputChange}
                placeholder="مثال: 1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الفئة بالعربية *
              </label>
              <input
                type="text"
                name="category_name_ar"
                value={formData.category_name_ar}
                onChange={handleInputChange}
                placeholder="مثال: إلكترونيات"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الفئة بالإنجليزية
              </label>
              <input
                type="text"
                name="category_name_en"
                value={formData.category_name_en}
                onChange={handleInputChange}
                placeholder="Example: Electronics"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="وصف الفئة..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m10-10H2" />
            </svg>
          </div>
          <p className="text-gray-600 mt-2">جاري التحميل...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-right">رقم الفئة</th>
                <th className="border border-gray-300 px-4 py-2 text-right">الاسم (عربي)</th>
                <th className="border border-gray-300 px-4 py-2 text-right">الاسم (إنجليزي)</th>
                <th className="border border-gray-300 px-4 py-2 text-right">الوصف</th>
                <th className="border border-gray-300 px-4 py-2 text-right">التاريخ</th>
                <th className="border border-gray-300 px-4 py-2 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-gray-300 px-4 py-4 text-center text-gray-600">
                    لا توجد فئات
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{category.category_number}</td>
                    <td className="border border-gray-300 px-4 py-2">{category.category_name_ar}</td>
                    <td className="border border-gray-300 px-4 py-2">{category.category_name_en}</td>
                    <td className="border border-gray-300 px-4 py-2 truncate">{category.description}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(category.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition mr-2"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredCategories.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          إجمالي الفئات: <span className="font-bold">{filteredCategories.length}</span>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;
