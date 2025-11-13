import { ProductCategory } from '../../types';

interface CategoriesTableProps {
  categories: ProductCategory[];
  loading: boolean;
  onEdit: (category: ProductCategory) => void;
  onDelete: (id: number) => void;
}

export default function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isActive ? 'نشط' : 'معطل'}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  if (categories.length === 0) {
    return <div className="text-center py-8 text-gray-500">لا توجد فئات</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-right">رقم الفئة</th>
            <th className="border border-gray-300 px-4 py-2 text-right">الاسم (عربي)</th>
            <th className="border border-gray-300 px-4 py-2 text-right">الاسم (إنجليزي)</th>
            <th className="border border-gray-300 px-4 py-2 text-right">الوصف</th>
            <th className="border border-gray-300 px-4 py-2 text-right">الحالة</th>
            <th className="border border-gray-300 px-4 py-2 text-right">التاريخ</th>
            <th className="border border-gray-300 px-4 py-2 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{category.category_number}</td>
              <td className="border border-gray-300 px-4 py-2">{category.category_name_ar}</td>
              <td className="border border-gray-300 px-4 py-2">{category.category_name_en || '--'}</td>
              <td className="border border-gray-300 px-4 py-2 truncate">{category.description || '--'}</td>
              <td className="border border-gray-300 px-4 py-2">{getStatusBadge(category.is_active)}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(category.created_at).toLocaleDateString('ar-EG')}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => onEdit(category)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition mr-2"
                >
                  تعديل
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
