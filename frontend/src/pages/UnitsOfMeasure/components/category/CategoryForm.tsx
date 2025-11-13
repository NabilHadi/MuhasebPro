interface CategoryFormProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: {
    name_ar: string;
    name_en: string;
    description: string;
  };
  onFormChange: (updates: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function CategoryForm({
  isOpen,
  isEditing,
  formData,
  onFormChange,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
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
            placeholder="مثال: الوزن"
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
            placeholder="مثال: Weight"
          />
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
            {isEditing ? 'تحديث الفئة' : 'حفظ الفئة'}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 btn-secondary">
            إلغاء
          </button>
        </div>
      </form>
  );
}
