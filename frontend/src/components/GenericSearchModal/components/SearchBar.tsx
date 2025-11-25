import { FilterConfig } from '../types';

interface SearchBarProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  filters?: FilterConfig[];
  additionalButton?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
}

export default function SearchBar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchKeyDown,
  searchInputRef,
  filters,
  additionalButton,
}: SearchBarProps) {
  return (
    <div className="p-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
      <div className="flex gap-2">
        <input
          ref={searchInputRef}
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={onSearchKeyDown}
          placeholder={searchPlaceholder}
          className="flex-1 px-2 py-1 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
        />

        {/* Filters */}
        {filters && filters.length > 0 && (
          <div className="flex gap-2">
            {filters.map((filter) => (
              <select
                key={filter.id}
                value={String(filter.value)}
                onChange={(e) => filter.onChange(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm rounded"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}

        {/* Additional Button */}
        {additionalButton && (
          <button
            onClick={additionalButton.onClick}
            className="flex justify-center items-center gap-2 px-3 py-1 border border-gray-300 text-sm hover:bg-gray-100 rounded"
          >
            {additionalButton.icon}
            {additionalButton.label}
          </button>
        )}
      </div>
    </div>
  );
}
