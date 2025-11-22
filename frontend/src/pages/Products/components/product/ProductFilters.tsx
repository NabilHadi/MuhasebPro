import { FilterBar, FilterDefinition } from '../../../../components/FilterBar';
import { ProductCategory } from '../../types';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  categoryFilter: number | "";
  onCategoryFilterChange: (categoryId: number | "") => void;
  statusFilter: '' | 'active' | 'inactive';
  onStatusFilterChange: (status: '' | 'active' | 'inactive') => void;
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
  const filters: FilterDefinition[] = [
    {
      id: 'search',
      type: 'text',
      label: 'البحث',
      placeholder: 'ابحث برمز أو اسم المنتج...',
      value: searchTerm,
      onChange: onSearchChange,
      grow: true,
    },
    {
      id: 'type',
      type: 'enum',
      label: 'النوع',
      value: typeFilter,
      onChange: onTypeFilterChange,
      options: [
        { label: 'الكل', value: '' },
        { label: 'مخزون', value: 'Stockable' },
        { label: 'خدمة', value: 'Service' },
      ],
    },
    {
      id: 'category',
      type: 'select',
      label: 'الفئة',
      value: categoryFilter || '',
      onChange: (val) => {
        return onCategoryFilterChange(val ? parseInt(val) : "");
      },
      options: [
        { label: 'الكل', value: "" },
        ...categories.map((cat) => ({
          label: cat.category_name_ar,
          value: cat.id,
        })),
      ],
    },
    {
      id: 'status',
      type: 'enum',
      label: 'الحالة',
      value: statusFilter,
      onChange: (val) => onStatusFilterChange(val as '' | 'active' | 'inactive'),
      options: [
        { label: 'الكل', value: '' },
        { label: 'نشط', value: 'active' },
        { label: 'معطل', value: 'inactive' },
      ],
    },
  ];

  return (
    <FilterBar
      filters={filters}
      onAddClick={onAddClick}
      addButtonLabel="منتج جديد"
      layout="flex"
    />
  );
}
