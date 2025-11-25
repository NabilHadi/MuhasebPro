import { useState, useEffect, useRef, useCallback } from 'react';
import { GenericSearchModalProps } from './types';
import { SearchHeader, SearchBar, ResultsTable, Footer } from './components';
import { useRowSelection, useDebouncedSearch } from './hooks';

export default function GenericSearchModal<T>({
  initialQuery,
  isOpen,
  onClose,
  onSelect,
  title,
  searchPlaceholder,
  onSearch,
  debounceMs = 300,
  filters,
  columns,
  rowKeyField,
  selectFirstByDefault = true,
  noResultsMessage = 'لا توجد نتائج',
  emptyStateMessage = 'ابدأ بالبحث',
  acceptButtonLabel = 'موافق',
  closeButtonLabel = 'إلغاء',
  footerControls,
  selectedRowClass = 'bg-sky-800 text-white',
  hoverRowClass = 'hover:bg-blue-100',
  tableHeaderClass = 'bg-gray-100 border-b border-gray-200',
}: GenericSearchModalProps<T>) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [focusedElement, setFocusedElement] = useState<'search' | 'table'>('search');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const { searchQuery, setSearchQuery, results, loading, error, debouncedSearch } =
    useDebouncedSearch(onSearch, debounceMs);

  const { selectedRowIndex, nextRow, prevRow, resetSelection } = useRowSelection(
    selectFirstByDefault
  );

  // Initialize filter values
  useEffect(() => {
    if (filters) {
      const initial: Record<string, any> = {};
      filters.forEach((f) => {
        initial[f.id] = f.value;
      });
      setFilterValues(initial);
    }
  }, [filters]);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery);
      setFocusedElement('search');
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, setSearchQuery, resetSelection]);

  // Perform search when query or filters change
  useEffect(() => {
    debouncedSearch(searchQuery, filterValues);
  }, [searchQuery, filterValues, debouncedSearch, resetSelection]);

  useEffect(() => {
    resetSelection(results.length);
  }, [results])

  // Auto-scroll selected row into view
  useEffect(() => {
    if (focusedElement === 'table' && selectedRowIndex >= 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('[data-row-index]');
      if (rows[selectedRowIndex]) {
        (rows[selectedRowIndex] as HTMLElement).scrollIntoView({
          behavior: 'instant',
          block: 'nearest',
        });
      }
    }
  }, [focusedElement, selectedRowIndex]);

  // Global keyboard listener for Enter key
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedRowIndex >= 0) {
        e.preventDefault();
        const selected = results[selectedRowIndex];
        onSelect(selected);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, selectedRowIndex, results, onSelect]);

  // Handle search input keyboard events
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown' && results.length > 0) {
        e.preventDefault();
        setFocusedElement('table');
        tableRef.current?.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [results.length, onClose]
  );

  // Handle table keyboard events
  const handleTableKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'F9' || e.code === 'F9') {
        e.preventDefault();
        setFocusedElement('search');
        searchInputRef.current?.focus();
        return;
      }

      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextRow(results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        prevRow(results.length);
      }
    },
    [results.length, nextRow, prevRow, onClose]
  );

  // Handle row selection
  const handleRowSelect = useCallback((_index: number) => {
    setFocusedElement('table');
  }, []);

  // Handle row double click
  const handleRowDoubleClick = useCallback(
    (item: T) => {
      onSelect(item);
    },
    [onSelect]
  );

  // Handle accept button
  const handleAccept = useCallback(() => {
    if (selectedRowIndex >= 0) {
      const selected = results[selectedRowIndex];
      onSelect(selected);
    }
  }, [selectedRowIndex, results, onSelect]);

  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-10/12 h-5/6 flex flex-col">
        <SearchHeader title={title} onClose={onClose} />

        <SearchBar
          searchPlaceholder={searchPlaceholder}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchKeyDown={handleSearchKeyDown}
          searchInputRef={searchInputRef}
          filters={
            filters
              ? filters.map((f) => ({
                ...f,
                value: filterValues[f.id] || f.value,
                onChange: (val) => handleFilterChange(f.id, val),
              }))
              : undefined
          }
        />

        <ResultsTable
          columns={columns}
          data={results}
          selectedRowIndex={selectedRowIndex}
          onRowSelect={handleRowSelect}
          onRowDoubleClick={handleRowDoubleClick}
          onTableKeyDown={handleTableKeyDown}
          rowKeyField={rowKeyField}
          loading={loading}
          error={error}
          noResultsMessage={noResultsMessage}
          emptyStateMessage={emptyStateMessage}
          tableRef={tableRef}
          selectedRowClass={selectedRowClass}
          hoverRowClass={hoverRowClass}
          tableHeaderClass={tableHeaderClass}
        />

        <Footer
          acceptButtonLabel={acceptButtonLabel}
          closeButtonLabel={closeButtonLabel}
          onAccept={handleAccept}
          onClose={onClose}
          isAcceptDisabled={selectedRowIndex < 0}
          footerControls={footerControls}
        />
      </div>
    </div>
  );
}
