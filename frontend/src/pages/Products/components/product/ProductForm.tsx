import React from 'react';
import Modal from '../../../../components/Modal';
import { ProductFormData, ProductCategory, Unit } from '../../types';

interface ProductFormProps {
  isOpen: boolean;
  isEditing: boolean;
  product: Partial<ProductFormData>;
  onFormChange: (field: keyof ProductFormData, value: any) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  categories: ProductCategory[];
  units: Unit[];
  isLoading?: boolean;
}

export default function ProductForm({
  isOpen,
  isEditing,
  product,
  onFormChange,
  onSubmit,
  onCancel,
  categories,
  units,
  isLoading = false,
}: ProductFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      onClose={onCancel}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* رمز المنتج */}
          <div className="form-group">
            <label className="label-field">رمز المنتج *</label>
            <input
              type="text"
              value={product.product_code || ''}
              onChange={(e) => onFormChange('product_code', e.target.value)}
              className="input-field"
              placeholder="مثال: PROD-001"
              required
              disabled={isEditing}
            />
          </div>

          {/* الاسم بالعربية */}
          <div className="form-group">
            <label className="label-field">الاسم بالعربية *</label>
            <input
              type="text"
              value={product.product_name_ar || ''}
              onChange={(e) => onFormChange('product_name_ar', e.target.value)}
              className="input-field"
              placeholder="مثال: منتج بالعربية"
              required
            />
          </div>

          {/* الاسم بالإنجليزية */}
          <div className="form-group">
            <label className="label-field">الاسم بالإنجليزية</label>
            <input
              type="text"
              value={product.product_name_en || ''}
              onChange={(e) => onFormChange('product_name_en', e.target.value)}
              className="input-field"
              placeholder="Example: Product Name"
            />
          </div>

          {/* نوع المنتج */}
          <div className="form-group">
            <label className="label-field">نوع المنتج *</label>
            <select
              value={product.product_type || 'Stockable'}
              onChange={(e) => onFormChange('product_type', e.target.value as 'Stockable' | 'Service')}
              className="input-field"
              required
            >
              <option value="Stockable">مخزون</option>
              <option value="Service">خدمة</option>
            </select>
          </div>

          {/* الفئة */}
          <div className="form-group">
            <label className="label-field">فئة المنتج</label>
            <select
              value={product.category_id || ''}
              onChange={(e) => onFormChange('category_id', e.target.value ? parseInt(e.target.value) : null)}
              className="input-field"
            >
              <option value="">-- اختر فئة --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name_ar}
                </option>
              ))}
            </select>
          </div>

          {/* وحدة القياس */}
          <div className="form-group">
            <label className="label-field">وحدة القياس</label>
            <select
              value={product.unit_id || ''}
              onChange={(e) => onFormChange('unit_id', e.target.value ? parseInt(e.target.value) : null)}
              className="input-field"
            >
              <option value="">-- اختر وحدة --</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name_ar} ({unit.short_name})
                </option>
              ))}
            </select>
          </div>

          {/* نشط */}
          <div className="form-group">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={product.is_active !== false}
                onChange={(e) => onFormChange('is_active', e.target.checked)}
                className="w-4 h-4"
              />
              <span>نشط</span>
            </label>
          </div>
        </div>

        {/* الوصف */}
        <div className="form-group">
          <label className="label-field">الوصف</label>
          <textarea
            value={product.description || ''}
            onChange={(e) => onFormChange('description', e.target.value)}
            className="input-field"
            placeholder="وصف المنتج..."
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
