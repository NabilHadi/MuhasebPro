import { useState, useRef, useMemo } from 'react';
import { InvoiceLineItem } from '../types';
import { Product } from '../../Products/types';
import ProductSearchModal from './ProductSearchModal';
import InvoiceLineItemRow from './InvoiceLineItemRow';

interface InvoiceLineItemsTableProps {
  items: InvoiceLineItem[];
  onItemChange: (index: number, field: keyof InvoiceLineItem, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

// Map of editable column indices
const COLUMN_INDICES = [1, 3, 4, 5, 6, 7, 11, 12]; // Indices of editable columns in order

const EMPTY_LINE_ITEM: InvoiceLineItem = {
  product_code: '',
  product_name_ar: '',
  unit: '',
  quantity: 0,
  price: 0,
  discount_amount: 0,
  discount_percent: 0,
  total_discount: 0,
  net_amount: 0,
  tax: 0,
  total: 0,
  notes: '',
};

export default function InvoiceLineItemsTable({
  items,
  onItemChange,
  onAddItem,
}: InvoiceLineItemsTableProps) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchLineIndex, setSearchLineIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const handleCellClick = (index: number, currentValue: string) => {
    setSearchLineIndex(index);
    setSearchQuery(currentValue);
    setSearchModalOpen(true);
  };

  const getRefKey = (row: number, col: number) => `${row}-${col}`;
  const focusCell = (row: number, col: number) => {
    inputRefs.current.get(getRefKey(row, col))?.focus();
  };

  const handleArrowNavigation = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => {
    const currentColIdx = COLUMN_INDICES.indexOf(columnIndex);

    const focusByIndex = (row: number, colIdx: number) => {
      const col = COLUMN_INDICES[colIdx];
      focusCell(row, col);
    };

    switch (e.key) {
      case "Enter":
      case "ArrowLeft": {
        e.preventDefault();
        const nextIdx = currentColIdx + 1;
        if (nextIdx < COLUMN_INDICES.length) {
          focusByIndex(rowIndex, nextIdx);
        } else if (e.key === 'Enter') {
          focusByIndex(rowIndex + 1, 0);
        }
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        const prevIdx = currentColIdx - 1;
        if (prevIdx >= 0) focusByIndex(rowIndex, prevIdx);
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        focusCell(rowIndex + 1, columnIndex);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (rowIndex > 0) focusCell(rowIndex - 1, columnIndex);
        break;
      }
    }
  };

  const handleProductSelect = (product: Product) => {
    if (searchLineIndex !== null) {
      // Set product details
      onItemChange(searchLineIndex, 'product_code', product.product_code);
      onItemChange(searchLineIndex, 'product_name_ar', product.product_name_ar);
      onItemChange(searchLineIndex, 'unit', product.unit_name_ar || '');
      onItemChange(searchLineIndex, 'price', product.selling_price || 0);
      onItemChange(searchLineIndex, 'quantity', 1);
      onItemChange(searchLineIndex, 'tax', 15);

      // Auto-add new line if we're on the last line
      if (searchLineIndex === items.length - 1 && items.length < 11) {
        onAddItem();
      }
    }
    setSearchModalOpen(false);
  };

  // Ensure we always have 11 rows visible
  const displayItems = useMemo(() => {
    if (items.length >= 11) return items;
    const fillers = Array.from({ length: 11 - items.length }, () => EMPTY_LINE_ITEM);
    return [...items, ...fillers];
  }, [items]);

  return (
    <>
      <div className="bg-white shadow overflow-x-auto flex-1">
        {/* Table Header */}
        <table className="w-full cursor-text">
          <colgroup>
            {/* ID */}
            <col style={{ width: '3%' }} />
            {/* Product Code */}
            <col style={{ width: '10%' }} />
            {/* Product Name */}
            <col style={{ width: '20%' }} />
            {/* Unit */}
            <col style={{ width: '4%' }} />
            {/* Quantity */}
            <col style={{ width: '4%' }} />
            {/* Price */}
            <col style={{ width: '4%' }} />
            {/* Discount Amount */}
            <col style={{ width: '5%' }} />
            {/* Discount Percent */}
            <col style={{ width: '4%' }} />
            {/* Total Discounts */}
            <col style={{ width: '5%' }} />
            {/* Net Amount */}
            <col style={{ width: '4%' }} />
            {/* Tax */}
            <col style={{ width: '5%' }} />
            {/* Total */}
            <col style={{ width: '6%' }} />
            {/* Notes */}
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr className="bg-sky-900 text-white sticky top-0 z-10">
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">م.س</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">رقم الصنف</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">اسم الصنف</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">الوحدة</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">الكمية</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">السعر</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">خصم مبلغ</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">خصم %</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">خصومات</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">الصافي</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">الضريبة</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">الإجمالي</th>
              <th className="p-2 text-center text-xs font-semibold whitespace-nowrap">ملاحظة</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((item, index) => (
              <InvoiceLineItemRow
                key={index}
                item={item}
                index={index}
                isEmptyRow={index >= items.length}
                onItemChange={onItemChange}
                handleArrowNavigation={handleArrowNavigation}
                inputRefs={inputRefs}
                onOpenProductSearch={handleCellClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Search Modal */}
      {searchModalOpen && (
        <ProductSearchModal
          initialQuery={searchQuery}
          onSelect={handleProductSelect}
          onClose={() => setSearchModalOpen(false)}
        />
      )}
    </>
  );
}
