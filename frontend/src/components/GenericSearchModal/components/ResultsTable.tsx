import { ColumnConfig } from '../types';

interface ResultsTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  selectedRowIndex: number;
  onRowSelect: (index: number) => void;
  onRowDoubleClick: (item: T) => void;
  onTableKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  rowKeyField: keyof T;
  loading: boolean;
  error: string | null;
  noResultsMessage?: string;
  emptyStateMessage?: string;
  tableRef: React.RefObject<HTMLDivElement>;
  selectedRowClass?: string;
  hoverRowClass?: string;
  tableHeaderClass?: string;
}

export default function ResultsTable<T>({
  columns,
  data,
  selectedRowIndex,
  onRowSelect,
  onRowDoubleClick,
  onTableKeyDown,
  rowKeyField,
  loading,
  error,
  noResultsMessage = 'لا توجد نتائج',
  tableRef,
  selectedRowClass = 'bg-sky-800 text-white',
  hoverRowClass = 'hover:bg-blue-100',
  tableHeaderClass = 'bg-gray-100 border-b border-gray-200',
}: ResultsTableProps<T>) {
  // Get visible columns
  const visibleColumns = columns.filter((col) => {
    if (typeof col.visible === 'function') return col.visible();
    return col.visible !== false;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        جاري البحث...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        {noResultsMessage}
      </div>
    );
  }

  return (
    <div
      ref={tableRef}
      className="flex-1 overflow-y-auto px-1"
      onKeyDown={onTableKeyDown}
      tabIndex={0}
    >
      <table className="w-full text-sm focus:outline-none">
        <thead className={tableHeaderClass}>
          <tr>
            {visibleColumns.map((col) => (
              <th
                key={String(col.field)}
                className={`px-2 py-1 text-sm font-semibold border border-gray-400 text-${col.headerAlign || 'left'
                  } ${col.width || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const rowKey = String(row[rowKeyField]);
            const isSelected = selectedRowIndex === index;

            return (
              <tr
                key={rowKey}
                data-row-index={index}
                onClick={() => onRowSelect(index)}
                onDoubleClick={() => onRowDoubleClick(row)}
                className={`border-b border-gray-200 cursor-pointer ${isSelected ? selectedRowClass : hoverRowClass
                  }`}
              >
                {visibleColumns.map((col) => {
                  const value = row[col.field];
                  const displayValue = col.formatter
                    ? col.formatter(value, row)
                    : String(value);

                  return (
                    <td
                      key={String(col.field)}
                      className={`px-2 py-1 text-sm border border-gray-400 text-${col.cellAlign || 'left'
                        }`}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
