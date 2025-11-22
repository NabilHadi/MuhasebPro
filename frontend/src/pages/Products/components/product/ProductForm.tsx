import React, { useCallback } from 'react';
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

  const FormField = useCallback(
    ({ label, children }: { label: string; children: React.ReactNode }) => (
      <div className="flex items-center gap-4">
        <label className="w-32 flex-shrink-0 font-semibold">{label}</label>
        <div className="flex-1">{children}</div>
      </div>
    ),
    []
  );

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'تعديل صنف' : 'إضافة صنف جديد'}
      onClose={onCancel}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-3">
          {/* رقم الصنف */}
          <FormField label="رقم الصنف *">
            <input
              type="text"
              value={product.product_code || ''}
              onChange={(e) => onFormChange('product_code', e.target.value)}
              className="input-field"
              placeholder="مثال: PROD-001"
              required
              disabled={isEditing}
            />
          </FormField>

          {/* الاسم العربي */}
          <FormField label="الاسم العربي *">
            <input
              type="text"
              value={product.product_name_ar || ''}
              onChange={(e) => onFormChange('product_name_ar', e.target.value)}
              className="input-field"
              placeholder="مثال: منتج بالعربية"
              required
            />
          </FormField>

          {/* الاسم الانجليزي */}
          <FormField label="الاسم الاجنبي">
            <input
              type="text"
              value={product.product_name_en || ''}
              onChange={(e) => onFormChange('product_name_en', e.target.value)}
              className="input-field"
              placeholder="Example: Product Name"
            />
          </FormField>

          <div className='flex gap-2'>
            {/* تكلفة الصنف */}
            <FormField label="تكلفة الصنف">
              <input
                type="number"
                step="0.01"
                value={product.cost || 0}
                onChange={(e) => onFormChange('cost', parseFloat(e.target.value) || 0)}
                className="input-field"
                placeholder="0.00"
              />
            </FormField>
            {/* نسبة الارباح */}
            <FormField label="نسبة الارباح (%)">
              <input
                type="number"
                step="0.01"
                value={product.profit_ratio || 0}
                onChange={(e) => onFormChange('profit_ratio', parseFloat(e.target.value) || 0)}
                className="input-field"
                placeholder="0.00"
              />
            </FormField>
          </div>



          {/* سعر البيع */}
          <FormField label="سعر البيع">
            <input
              type="number"
              step="0.01"
              value={product.selling_price || 0}
              onChange={(e) => onFormChange('selling_price', parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="0.00"
            />
          </FormField>

          {/* القسم الاساسي */}
          <FormField label="القسم الاساسي">
            <select
              value={product.main_category_id || ''}
              onChange={(e) => onFormChange('main_category_id', e.target.value ? parseInt(e.target.value) : null)}
              className="input-field"
            >
              <option value="">-- اختر قسم --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name_ar}
                </option>
              ))}
            </select>
          </FormField>

          {/* مجموعة الصنف */}
          <FormField label="مجموعة الصنف">
            <input
              type="text"
              value={product.product_group || ''}
              onChange={(e) => onFormChange('product_group', e.target.value)}
              className="input-field"
              placeholder="مثال: مجموعة أ"
            />
          </FormField>

          {/* التصنيف الأول */}
          <FormField label="التصنيف الأول">
            <input
              type="text"
              value={product.classification_1 || ''}
              onChange={(e) => onFormChange('classification_1', e.target.value)}
              className="input-field"
              placeholder="التصنيف الأول"
            />
          </FormField>

          {/* التصنيف الثاني */}
          <FormField label="التصنيف الثاني">
            <input
              type="text"
              value={product.classification_2 || ''}
              onChange={(e) => onFormChange('classification_2', e.target.value)}
              className="input-field"
              placeholder="التصنيف الثاني"
            />
          </FormField>

          {/* التصنيف الثالث */}
          <FormField label="التصنيف الثالث">
            <input
              type="text"
              value={product.classification_3 || ''}
              onChange={(e) => onFormChange('classification_3', e.target.value)}
              className="input-field"
              placeholder="التصنيف الثالث"
            />
          </FormField>

          {/* التصنيف الرابع */}
          <FormField label="التصنيف الرابع">
            <input
              type="text"
              value={product.classification_4 || ''}
              onChange={(e) => onFormChange('classification_4', e.target.value)}
              className="input-field"
              placeholder="التصنيف الرابع"
            />
          </FormField>

          {/* التصنيف الخامس */}
          <FormField label="التصنيف الخامس">
            <input
              type="text"
              value={product.classification_5 || ''}
              onChange={(e) => onFormChange('classification_5', e.target.value)}
              className="input-field"
              placeholder="التصنيف الخامس"
            />
          </FormField>

          {/* وحدة الصنف */}
          <FormField label="وحدة الصنف">
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
          </FormField>
        </div>

        {/* الوصف - كامل العرض
        <div className="pt-2 border-t">
          <FormField label="الوصف">
            <textarea
              value={product.description || ''}
              onChange={(e) => onFormChange('description', e.target.value)}
              className="input-field"
              placeholder="وصف المنتج..."
              rows={3}
            />
          </FormField>
        </div> */}

        {/* الأزرار */}
        <div className="flex gap-2 justify-center pt-4 border-t">
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
            إلغاء
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'جاري...' : isEditing ? 'تحديث' : 'حفظ البيانات'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
