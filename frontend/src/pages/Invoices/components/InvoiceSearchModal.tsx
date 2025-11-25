import { useState, useEffect, useRef, useCallback, } from 'react';
import { X } from 'lucide-react';
import { useInvoiceStorage } from '../../../hooks/useInvoiceStorage';

interface InvoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInvoice: (invoiceId: string, documentNumber: string) => void;
}

interface SearchResult {
  invoiceId: string;
  document_number: string;
  invoice_date: string;
  customer_name_ar: string;
  account_code: string;
  account_name: string;
  mobile: string;
  total: number;
  quantity: number;
  status: string;
}

export default function InvoiceSearchModal({
  isOpen,
  onClose,
  onSelectInvoice,
}: InvoiceSearchModalProps) {
  const { searchInvoices } = useInvoiceStorage();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'saved' | 'draft'>('saved');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const [focusOnTable, setFocusOnTable] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const searchResults = searchInvoices({
        searchQuery,
        statusFilter,
      });
      console.log({ searchQuery, statusFilter, searchResults })
      setResults(searchResults);
      setSelectedRowIndex(searchResults.length > 0 ? 0 : -1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, searchInvoices]);

  // Reset on modal open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setStatusFilter('saved');
      setSelectedRowIndex(-1);
      setFocusOnTable(false);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle table keyboard navigation
  const handleTableKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!focusOnTable) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedRowIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedRowIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
      } else if (e.key === 'Enter' && selectedRowIndex >= 0) {
        e.preventDefault();
        const selected = results[selectedRowIndex];
        onSelectInvoice(selected.invoiceId, selected.document_number);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [focusOnTable, selectedRowIndex, results, onSelectInvoice, onClose]
  );

  // Handle search input keyboard
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown' && results.length > 0) {
        e.preventDefault();
        setFocusOnTable(true);
        setSelectedRowIndex(0);
        tableRef.current?.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [results.length, onClose]
  );

  // Auto-scroll to selected row
  useEffect(() => {
    if (focusOnTable && selectedRowIndex >= 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('[data-row-index]');
      if (rows[selectedRowIndex]) {
        rows[selectedRowIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusOnTable, selectedRowIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 flex-shrink-0">
          <h2 className="text-lg font-semibold">عرض الفواتير</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-300 flex-shrink-0 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ابحث برقم الفاتورة أو اسم العميل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'saved' | 'draft')}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="saved">محفوظة</option>
              <option value="draft">مسودة</option>
              <option value="all">الكل</option>
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div
          ref={tableRef}
          className="flex-1 overflow-y-auto"
          onKeyDown={handleTableKeyDown}
          tabIndex={0}
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-sky-100">
              <tr>
                <th className="border border-gray-300 p-2 text-right text-sm font-semibold">
                  رقم الفاتورة
                </th>
                <th className="border border-gray-300 p-2 text-right text-sm font-semibold">
                  التاريخ
                </th>
                <th className="border border-gray-300 p-2 text-right text-sm font-semibold">
                  رقم الحساب
                </th>
                <th className="border border-gray-300 p-2 text-right text-sm font-semibold">
                  اسم الحساب
                </th>
                <th className="border border-gray-300 p-2 text-right text-sm font-semibold">
                  رقم الجوال
                </th>
                <th className="border border-gray-300 p-2 text-right text-sm font-semibold">
                  الكمية
                </th>
                <th className="border border-gray-300 p-2 text-right text-sm font-semibold">
                  المجموع
                </th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    لا توجد فواتير
                  </td>
                </tr>
              ) : (
                results.map((result, index) => (
                  <tr
                    key={result.invoiceId}
                    data-row-index={index}
                    onClick={() => {
                      setSelectedRowIndex(index);
                      setFocusOnTable(true);
                    }}
                    onDoubleClick={() => {
                      onSelectInvoice(result.invoiceId, result.document_number);
                    }}
                    className={`cursor-pointer hover:bg-blue-100 transition ${selectedRowIndex === index
                      ? 'bg-sky-800 text-white'
                      : ''
                      }`}
                  >
                    <td className="border border-gray-300 p-2 text-sm">
                      {result.document_number}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {result.invoice_date}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {result.account_code}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {result.account_name}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {result.mobile}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm text-center">
                      {result.quantity}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm text-left">
                      {result.total.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-300 flex-shrink-0 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-semibold"
          >
            إغلاق
          </button>
          <button
            onClick={() => {
              if (selectedRowIndex >= 0) {
                const selected = results[selectedRowIndex];
                onSelectInvoice(selected.invoiceId, selected.document_number);
              }
            }}
            disabled={selectedRowIndex < 0}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 font-semibold disabled:bg-gray-400"
          >
            فتح
          </button>
        </div>
      </div>
    </div>
  );
}
