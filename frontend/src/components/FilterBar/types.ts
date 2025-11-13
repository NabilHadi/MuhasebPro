export type FilterFieldType = 'text' | 'select' | 'enum';

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterDefinition {
  id: string;
  type: FilterFieldType;
  label: string;
  placeholder?: string;
  value: any;
  onChange: (value: any) => void;
  options?: FilterOption[];
  className?: string;
  disabled?: boolean;
  grow?: boolean; // Make field flex-grow (for text fields in flex layout)
}

export interface FilterBarProps {
  filters: FilterDefinition[];
  onAddClick: () => void;
  addButtonLabel?: string;
  addButtonIcon?: string;
  layout?: 'flex' | 'grid';
  className?: string;
  containerClassName?: string;
}
