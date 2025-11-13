import { FilterBar, FilterDefinition } from '../../../../components/FilterBar';
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
  const filters: FilterDefinition[] = [
    {
      id: 'search',
      type: 'text',
      label: 'البحث',
      placeholder: 'ابحث بالاسم أو الاختصار...',
      value: searchTerm,
      onChange: onSearchChange,
      grow: true,
    },
    {
      id: 'category',
      type: 'select',
      label: 'الفئة',
      value: categoryFilter === 'all' ? 'all' : categoryFilter,
      onChange: (val) => onCategoryFilterChange(val === 'all' ? 'all' : parseInt(val)),
      options: [
        { label: 'جميع الفئات', value: 'all' },
        ...categories
          .filter((c) => c.is_active)
          .map((cat) => ({
            label: cat.name_ar,
            value: cat.id,
          })),
      ],
    },
    {
      id: 'status',
      type: 'enum',
      label: 'الحالة',
      value: statusFilter,
      onChange: (val) => onStatusFilterChange(val as 'all' | 'active' | 'inactive'),
      options: [
        { label: 'جميع الوحدات', value: 'all' },
        { label: 'الوحدات النشطة', value: 'active' },
        { label: 'الوحدات المعطلة', value: 'inactive' },
      ],
    },
  ];

  return (
    <FilterBar
      filters={filters}
      onAddClick={onAddClick}
      addButtonLabel="إضافة وحدة جديدة"
      layout="flex"
      containerClassName="gap-3"
    />
  );
}
