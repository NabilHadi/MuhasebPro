import { ProductCategory } from '../../types';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  categoryFilter: number | null;
  onCategoryFilterChange: (categoryId: number | null) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive') => void;
  categories: ProductCategory[];
  onAddClick: () => void;
}

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  categories,
  onAddClick,
}: ProductFiltersProps) {
  return (
    <div className="card mb-6 p-4">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button onClick={onAddClick} className="btn-primary flex items-center gap-2">
          <span>➕</span>
          <span>منتج جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* البحث */}
        <div className="form-group">
          <label className="label-field">البحث</label>
          <input
            type="text"
            placeholder="ابحث برمز أو اسم المنتج..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field"
          />
        </div>

        {/* النوع */}
        <div className="form-group">
          <label className="label-field">النوع</label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="input-field"
          >
            <option value="">الكل</option>
            <option value="Stockable">مخزون</option>
            <option value="Service">خدمة</option>
          </select>
        </div>

        {/* الفئة */}
        <div className="form-group">
          <label className="label-field">الفئة</label>
          <select
            value={categoryFilter || ''}
            onChange={(e) => onCategoryFilterChange(e.target.value ? parseInt(e.target.value) : null)}
            className="input-field"
          >
            <option value="">الكل</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name_ar}
              </option>
            ))}
          </select>
        </div>

        {/* الحالة */}
        <div className="form-group">
          <label className="label-field">الحالة</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
            className="input-field"
          >
            <option value="all">الكل</option>
            <option value="active">نشط</option>
            <option value="inactive">معطل</option>
          </select>
        </div>
      </div>
    </div>
  );
}
