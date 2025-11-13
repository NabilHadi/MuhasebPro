import { FilterBar, FilterDefinition } from '../../../../components/FilterBar';

interface CategorySearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddClick: () => void;
}

export default function CategorySearch({
  searchTerm,
  onSearchChange,
  onAddClick,
}: CategorySearchProps) {
  const filters: FilterDefinition[] = [
    {
      id: 'search',
      type: 'text',
      label: 'البحث',
      placeholder: 'ابحث عن الفئات...',
      value: searchTerm,
      onChange: onSearchChange,
    },
  ];

  return (
    <FilterBar
      filters={filters}
      onAddClick={onAddClick}
      addButtonLabel="إضافة فئة جديدة"
      layout="flex"
      containerClassName="gap-2 my-4"
    />
  );
}
