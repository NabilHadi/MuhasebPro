import Modal from '../../../../components/Modal';
import { CategoryFormData } from '../../types';

interface CategoryFormProps {
  isOpen: boolean;
  isEditing: boolean;
  category: Partial<CategoryFormData>;
  onFormChange: (field: keyof CategoryFormData, value: any) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CategoryForm({
  isOpen,
  isEditing,
  category,
  onFormChange,
  onSubmit,
  onCancel,
  isLoading = false,
}: CategoryFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
      onClose={onCancel}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* رقم الفئة */}
        <div className="form-group">
          <label className="label-field">رقم الفئة *</label>
          <input
            type="number"
            value={category.category_number || ''}
            onChange={(e) => onFormChange('category_number', parseInt(e.target.value) || 0)}
            className="input-field"
            placeholder="مثال: 1"
            required
            disabled={isEditing}
          />
        </div>

        {/* الاسم بالعربية */}
        <div className="form-group">
          <label className="label-field">الاسم بالعربية *</label>
          <input
            type="text"
            value={category.category_name_ar || ''}
            onChange={(e) => onFormChange('category_name_ar', e.target.value)}
            className="input-field"
            placeholder="مثال: إلكترونيات"
            required
          />
        </div>

        {/* الاسم بالإنجليزية */}
        <div className="form-group">
          <label className="label-field">الاسم بالإنجليزية</label>
          <input
            type="text"
            value={category.category_name_en || ''}
            onChange={(e) => onFormChange('category_name_en', e.target.value)}
            className="input-field"
            placeholder="Example: Electronics"
          />
        </div>

        {/* الوصف */}
        <div className="form-group">
          <label className="label-field">الوصف</label>
          <textarea
            value={category.description || ''}
            onChange={(e) => onFormChange('description', e.target.value)}
            className="input-field"
            placeholder="وصف الفئة..."
            rows={3}
          />
        </div>

        {/* الأزرار */}
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
            إلغاء
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'جاري...' : isEditing ? 'تحديث' : 'إضافة'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
