import FilterField from './FilterField';
import { FilterBarProps } from './types';

export default function FilterBar({
  filters,
  onAddClick,
  addButtonLabel = 'إضافة جديد',
  addButtonIcon = '➕',
  layout = filters.length > 2 ? 'grid' : 'flex',
  className = '',
  containerClassName = '',
}: FilterBarProps) {
  const isGrid = layout === 'grid';
  const containerClass = isGrid
    ? `${containerClassName} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(filters.length, 4)} gap-4`
    : `${containerClassName} flex gap-4 flex-wrap items-center`;

  return (
    <div className={`mb-2 p-2 ${className}`}>
      <div className={containerClass}>
        <button onClick={onAddClick} className="btn-primary flex items-center gap-2 h-fit">
          <span>{addButtonIcon}</span>
          <span>{addButtonLabel}</span>
        </button>
        {filters.map((filter) => (
          <FilterField
            key={filter.id}
            filter={filter}
            showLabel={isGrid}
          />
        ))}
      </div>
    </div>
  );
}

export * from './types';
