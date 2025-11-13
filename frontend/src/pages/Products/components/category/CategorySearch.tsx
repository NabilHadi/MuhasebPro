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
      placeholder: 'البحث عن فئة...',
      value: searchTerm,
      onChange: onSearchChange,
      grow: true,
    },
  ];

  return (
    <FilterBar
      filters={filters}
      onAddClick={onAddClick}
      addButtonLabel="إضافة فئة"
      layout="flex"
      containerClassName="gap-4"
    />
  );
}
