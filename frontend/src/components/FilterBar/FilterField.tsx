import TextField from './TextField';
import SelectField from './SelectField';
import { FilterDefinition } from './types';

interface FilterFieldProps {
  filter: FilterDefinition;
  showLabel?: boolean;
}

export default function FilterField({ filter, showLabel = true }: FilterFieldProps) {
  const growClass = filter.grow ? 'flex-1' : '';
  return (
    <div className={`${growClass} ${filter.className || ''}`}>
      {showLabel && filter.label && (
        <label className="label-field">{filter.label}</label>
      )}
      {filter.type === 'text' && <TextField filter={filter} />}
      {(filter.type === 'select' || filter.type === 'enum') && <SelectField filter={filter} />}
    </div>
  );
}
