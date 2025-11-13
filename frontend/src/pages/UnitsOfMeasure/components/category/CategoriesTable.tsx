import { Category } from '../../hooks/useCategories';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

export default function CategoriesTable({
  categories,
  onEdit,
  onToggleStatus,
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                <div className="text-4xl mb-2">📭</div>
                <p>لم يتم العثور على فئات</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="border border-gray-300 px-2 py-1 text-right font-medium text-gray-700">
              الاسم
            </th>
            <th className="border border-gray-300 px-2 py-1 text-right font-medium text-gray-700">
              الوصف
            </th>
            <th className="border border-gray-300 px-2 py-1 text-right font-medium text-gray-700">
              الحالة
            </th>
            <th className="border border-gray-300 px-2 py-1 text-right font-medium text-gray-700">
              تاريخ الإنشاء
            </th>
            <th className="border border-gray-300 px-2 py-1 text-right font-medium text-gray-700">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b hover:bg-gray-50">
              <td className="border border-gray-300 px-2 py-1 font-medium">
                <div>
                  <p>{category.name_ar}</p>
                  {category.name_en && (
                    <p className="text-sm text-gray-600">{category.name_en}</p>
                  )}
                </div>
              </td>
              <td className="border border-gray-300 px-2 py-1 text-gray-600">
                {category.description || '-'}
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${category.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}
                >
                  {category.is_active ? 'نشطة' : 'معطلة'}
                </span>
              </td>
              <td className="border border-gray-300 px-2 py-1 text-gray-600">
                {new Date(category.created_at).toLocaleDateString('ar-EG')}
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm font-medium"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => onToggleStatus(category)}
                    className={`px-3 py-1 rounded hover:opacity-80 transition text-sm font-medium ${category.is_active
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                      }`}
                  >
                    {category.is_active ? 'تعطيل' : 'تفعيل'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
