import { Category } from '../../hooks/useCategories';

interface UnitFormProps {
  isOpen: boolean;
  isEditing: boolean;
  categories: Category[];
  formData: {
    name_ar: string;
    name_en: string;
    short_name: string;
    category_id: string;
    ratio_to_base: number;
    is_base: boolean;
    description: string;
  };
  onFormChange: (updates: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function UnitForm({
  isOpen,
  isEditing,
  categories,
  formData,
  onFormChange,
  onSubmit,
  onCancel,
}: UnitFormProps) {
  if (!isOpen) return null;

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الاسم بالعربية *
          </label>
          <input
            type="text"
            value={formData.name_ar}
            onChange={(e) => onFormChange({ name_ar: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="مثال: كيلوجرام"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الاسم بالإنجليزية
          </label>
          <input
            type="text"
            value={formData.name_en}
            onChange={(e) => onFormChange({ name_en: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="مثال: Kilogram"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الاختصار *
          </label>
          <input
            type="text"
            value={formData.short_name}
            onChange={(e) =>
              onFormChange({ short_name: e.target.value.toUpperCase() })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="مثال: KG"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الفئة *
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => onFormChange({ category_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- اختر الفئة --</option>
            {categories
              .filter((c) => c.is_active)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_ar}
                </option>
              ))}
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
            onChange={(e) =>
              onFormChange({
                ratio_to_base: parseFloat(e.target.value) || 1,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_base}
              onChange={(e) => onFormChange({ is_base: e.target.checked })}
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
            onChange={(e) => onFormChange({ description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button type="submit" className="flex-1 btn-primary">
            {isEditing ? 'تحديث الوحدة' : 'حفظ الوحدة'}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 btn-secondary">
            إلغاء
          </button>
        </div>
      </form>
  );
}
