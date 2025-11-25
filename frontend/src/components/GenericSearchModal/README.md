# GenericSearchModal - Reusable Search Component

## Overview
A fully featured, highly configurable search modal component that eliminates code duplication across the application. Powers ProductSearchModal and InvoiceSearchModal with ~65-70% code reduction.

## Features
- ✅ Dynamic column configuration with formatters and conditional visibility
- ✅ Flexible filter system (select, checkbox, radio)
- ✅ Keyboard navigation (arrows, Enter, F9, Escape)
- ✅ Mouse and keyboard selection support
- ✅ Debounced async search
- ✅ Customizable footer buttons and controls
- ✅ Auto-scroll to selected row
- ✅ TypeScript generics for any data type

## Quick Start

```tsx
import { GenericSearchModal, ColumnConfig } from './components/GenericSearchModal';

// Define columns
const columns: ColumnConfig<MyType>[] = [
  {
    field: 'id',
    label: 'ID',
    align: 'center',
  },
  {
    field: 'name',
    label: 'Name',
    formatter: (value) => value.toUpperCase(),
  },
  {
    field: 'price',
    label: 'Price',
    visible: showPriceColumn, // Conditionally visible
    formatter: (value) => `$${value.toFixed(2)}`,
  },
];

// Define async search
const handleSearch = async (query: string, filters: Record<string, any>) => {
  const results = await apiClient.get('/items', { params: { query, ...filters } });
  return results.data;
};

// Render modal
<GenericSearchModal
  isOpen={isOpen}
  onClose={handleClose}
  onSelect={(item) => console.log('Selected:', item)}
  title="Search Items"
  searchPlaceholder="Enter search query..."
  onSearch={handleSearch}
  columns={columns}
  rowKeyField="id"
/>
```

## Props Interface

### Required Props
```typescript
isOpen: boolean                    // Control modal visibility
onClose: () => void               // Close callback
onSelect: (item: T) => void       // Selection callback
title: string                      // Modal title
searchPlaceholder: string          // Search input placeholder
onSearch: (query: string, filters: Record<string, any>) => Promise<T[]>
columns: ColumnConfig<T>[]        // Column definitions
rowKeyField: keyof T              // Field used as row key
```

### Optional Props
```typescript
debounceMs?: number               // Search debounce (default: 300ms)
selectFirstByDefault?: boolean    // Auto-select first row (default: true)
noResultsMessage?: string         // "No results" message
emptyStateMessage?: string        // Empty state message
acceptButtonLabel?: string        // Accept button text (default: "موافق")
closeButtonLabel?: string         // Close button text (default: "إلغاء")
filters?: FilterConfig[]           // Filter configurations
footerControls?: FooterControlConfig[]  // Footer controls
selectedRowClass?: string         // Custom selected row styling
hoverRowClass?: string            // Custom hover styling
tableHeaderClass?: string         // Custom header styling
```

## Configuration Types

### ColumnConfig<T>
```typescript
interface ColumnConfig<T> {
  field: keyof T;                 // Field name from data object
  label: string;                  // Column header label
  width?: string;                 // Optional width (Tailwind class)
  align?: 'left' | 'center' | 'right';  // Text alignment
  formatter?: (value: any, row: T) => React.ReactNode;  // Value formatter
  visible?: boolean | (() => boolean);  // Show/hide column
}
```

### FilterConfig
```typescript
interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'radio';
  options: { value: string | number; label: string }[];
  value: string | number | string[] | number[];
  onChange: (value: any) => void;
}
```

### FooterControlConfig
```typescript
interface FooterControlConfig {
  id: string;
  type: 'checkbox' | 'select';
  label: string;
  value: any;
  onChange: (value: any) => void;
  options?: { value: string | number; label: string }[];  // For select type
}
```

## Keyboard Shortcuts
| Key | Behavior |
|-----|----------|
| Arrow Down | Next row / Move to table from search |
| Arrow Up | Previous row |
| Enter | Select highlighted row |
| Escape | Close modal |
| F9 | Toggle focus between search and table |

## Real-World Examples

### ProductSearchModal (150 lines, was 405)
Demonstrates:
- Conditional column visibility
- Footer checkboxes for options
- Custom formatters for currency values
- Async API calls

### InvoiceSearchModal (117 lines, was 271)
Demonstrates:
- Filter dropdown configuration
- Row type casting
- Custom selection payload handling
- Status-based filtering

## Reusable Hooks

### useRowSelection<T>
Manages row navigation and selection state.
```typescript
const { selectedRowIndex, nextRow, prevRow, selectRow, resetSelection } = 
  useRowSelection(rowKeyField, selectFirstByDefault);
```

### useDebouncedSearch<T>
Handles debounced async search with loading/error states.
```typescript
const { searchQuery, results, loading, error, debouncedSearch } = 
  useDebouncedSearch(onSearch, debounceMs);
```

## Styling

Default styling uses ProductSearchModal pattern:
- **Selected Row**: `bg-sky-800 text-white`
- **Hover**: `hover:bg-blue-100`
- **Modal**: Fixed overlay with proper z-index
- **Table**: Full width with border structure

All styling can be customized via props.

## Migration Path

### Before (Old Pattern)
- 400+ lines per modal
- Duplicate keyboard navigation logic
- Duplicate row selection logic
- Duplicate debounce logic
- Hard to maintain consistency

### After (GenericSearchModal)
- 100-150 lines per modal
- All logic centralized
- Consistent UX across all modals
- Single source of truth for features
- Easy to add new search modals

## Performance Notes
- Debounced search: 300ms default (configurable)
- Row selection: O(1) direct array access
- Auto-scroll: Efficient DOM queries
- Columns rendering: Memoized to prevent re-renders
- Filters: Propagate to search function efficiently

## Future Enhancements
- [ ] Multi-select support
- [ ] Custom row renderer
- [ ] Column resizing
- [ ] Sort by column
- [ ] Pagination support
- [ ] Export selected rows
