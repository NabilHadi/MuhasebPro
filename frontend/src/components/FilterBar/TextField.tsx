import { FilterDefinition } from './types';

interface TextFieldProps {
  filter: FilterDefinition;
}

export default function TextField({ filter }: TextFieldProps) {
  return (
    <input
      type="text"
      placeholder={filter.placeholder || 'ابحث...'}
      value={filter.value || ''}
      onChange={(e) => filter.onChange(e.target.value)}
      disabled={filter.disabled}
      className={filter.className || 'input-field'}
    />
  );
}
