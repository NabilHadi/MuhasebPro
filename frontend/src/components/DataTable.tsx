import React from 'react';

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

export interface TableAction<T> {
  label: string | ((row: T) => string);
  icon?: string;
  onClick: (row: T) => void;
  className?: string | ((row: T) => string);
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  keyField?: string;
  rowClassName?: (row: T) => string;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = 'لا توجد بيانات',
  keyField = 'id',
  rowClassName,
}: DataTableProps<T>) {
  const getAlignClass = (align?: 'left' | 'right' | 'center') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'left':
        return 'text-left';
      case 'right':
      default:
        return 'text-right';
    }
  };

  const getHeaderClass = (align?: 'left' | 'right' | 'center') => {
    return `border border-gray-300 px-4 py-2 font-medium text-gray-700 ${getAlignClass(align)}`;
  };

  const getCellClass = (align?: 'left' | 'right' | 'center') => {
    return `border border-gray-300 px-4 py-2 ${getAlignClass(align)}`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={getHeaderClass(column.align)} style={{ width: column.width }}>
                {column.label}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className={getHeaderClass('center')}>الإجراءات</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row[keyField]}
              className={`border-b hover:bg-gray-50 ${rowClassName?.(row) || ''}`}
            >
              {columns.map((column) => (
                <td
                  key={`${row[keyField]}-${column.key}`}
                  className={getCellClass(column.align)}
                  style={{ width: column.width }}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className={getCellClass('center')}>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {actions.map((action, idx) => {
                      const label = typeof action.label === 'function' ? action.label(row) : action.label;
                      const buttonClass = typeof action.className === 'function' ? action.className(row) : action.className;
                      return (
                        <button
                          key={idx}
                          onClick={() => action.onClick(row)}
                          className={
                            buttonClass ||
                            'px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition'
                          }
                        >
                          {action.icon && <span>{action.icon} </span>}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
