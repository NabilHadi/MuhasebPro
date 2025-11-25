import React from 'react';

// Column Configuration
export interface ColumnConfig<T> {
  field: keyof T;
  label: string;
  width?: string;
  formatter?: (value: any, row: T) => React.ReactNode;
  visible?: boolean | (() => boolean);
  align?: 'left' | 'center' | 'right';
}

// Filter Configuration
export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'radio';
  options: { value: string | number; label: string }[];
  value: string | number | string[] | number[];
  onChange: (value: any) => void;
}

// Button Configuration
export interface ButtonConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean | (() => boolean);
  style?: 'primary' | 'secondary' | 'danger';
  position?: 'left' | 'center' | 'right';
}

// Footer Control Configuration
export interface FooterControlConfig {
  id: string;
  type: 'checkbox' | 'select';
  label: string;
  value: any;
  onChange: (value: any) => void;
  options?: { value: string | number; label: string }[];
}

// Keyboard Shortcuts
export interface KeyboardShortcuts {
  focusSearch?: string;
  focusTable?: string;
  confirmSelection?: string;
  cancel?: string;
  nextRow?: string;
  prevRow?: string;
}

// Main Props
export interface GenericSearchModalProps<T> {
  // Control
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: T, ...extraData: any[]) => void;

  // Display
  title: string;
  noResultsMessage?: string;
  emptyStateMessage?: string;

  // Search Configuration
  searchPlaceholder: string;
  onSearch: (query: string, filters: Record<string, any>) => Promise<T[]>;
  debounceMs?: number;

  // Filter Configuration
  filters?: FilterConfig[];

  // Table Configuration
  columns: ColumnConfig<T>[];
  rowKeyField: keyof T;

  // Keyboard & Interaction
  selectFirstByDefault?: boolean;
  shortcuts?: KeyboardShortcuts;

  // Footer Configuration
  acceptButtonLabel?: string;
  closeButtonLabel?: string;
  footerControls?: FooterControlConfig[];

  // Styling
  selectedRowClass?: string;
  hoverRowClass?: string;
  tableHeaderClass?: string;
}
