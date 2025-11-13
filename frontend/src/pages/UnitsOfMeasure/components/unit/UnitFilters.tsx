import { Category } from '../../hooks/useCategories';

interface UnitFiltersProps {
  searchTerm: string;
  categoryFilter: number | 'all';
  statusFilter: 'all' | 'active' | 'inactive';
  categories: Category[];
  onSearchChange: (term: string) => void;
  onCategoryFilterChange: (filter: number | 'all') => void;
  onStatusFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  onAddClick: () => void;
}

export default function UnitFilters({
  searchTerm,
  categoryFilter,
  statusFilter,
  categories,
  onSearchChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onAddClick,
}: UnitFiltersProps) {
  return (
    <div>
      <div className="flex item-center gap-3">
        <div className="flex justify-between items-center">
        <button
          onClick={onAddClick}
          className="h-full btn-primary flex items-center gap-2"
        >
          <span>➕</span>
          <span>إضافة وحدة جديدة</span>
        </button>
      </div>
        <div className='flex-1'>
          <input
            type="text"
            placeholder="ابحث بالاسم أو الاختصار..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 h-full w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) =>
              onCategoryFilterChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
            }
            className="w-full h-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع الفئات</option>
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
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')
            }
            className="w-full h-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع الوحدات</option>
            <option value="active">الوحدات النشطة</option>
            <option value="inactive">الوحدات المعطلة</option>
          </select>
        </div>
      </div>
    </div>
  );
}
