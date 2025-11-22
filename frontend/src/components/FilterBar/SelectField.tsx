import { FilterDefinition } from './types';

interface SelectFieldProps {
  filter: FilterDefinition;
}

export default function SelectField({ filter }: SelectFieldProps) {
  return (
    <select
      value={filter.value || ''}
      onChange={(e) => {
        const value = e.target.value;
        // Handle both string and number values
        filter.onChange(value === "" ? "" : isNaN(Number(value)) ? value : Number(value));
      }}
      disabled={filter.disabled}
      className={filter.className || 'input-field'}
    >
      {filter.options?.map((option) => (
        <option key={`${option.value}-${option.label}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
