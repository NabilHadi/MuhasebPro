import { useState, useRef, useMemo } from 'react';
import { InvoiceLineItem } from '../types';
import { Product } from '../../Products/types';
import ProductSearchModal from './ProductSearchModal';
import InvoiceLineItemRow from './InvoiceLineItemRow';
import apiClient from '../../../services/api';

interface InvoiceLineItemsTableProps {
  items: InvoiceLineItem[];
  onItemChange: (index: number, field: keyof InvoiceLineItem, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onShowError?: (message: string) => void;
  phase: 'viewing' | 'editing';
}

// Map of editable column indices
const COLUMN_INDICES = [1, 3, 4, 5, 6, 7, 12]; // Indices of editable columns in order

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
  onShowError,
  phase,
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

  const searchForProducts = async (query: string, rowIndex: number) => {
    if (!query.trim()) {
      onShowError?.('يرجى ادخال رقم الصنف');
      return;
    }

    try {
      const response = await apiClient.get('/products');
      const allProducts: Product[] = response.data;

      const queryLower = query.toLowerCase();
      const matchingProducts = allProducts.filter((product) => {
        return (
          product.product_code.toLowerCase().includes(queryLower) ||
          product.product_name_ar.toLowerCase().includes(queryLower)
        );
      });

      if (matchingProducts.length === 1) {
        // Auto-select single product
        handleProductSelect(matchingProducts[0], rowIndex);
      } else {
        // Open modal with multiple products
        setSearchLineIndex(rowIndex);
        setSearchQuery(query);
        setSearchModalOpen(true);
      }
    } catch (error) {
      console.error('Error searching for products:', error);
      onShowError?.('خطأ في البحث عن الأصناف');
    }
  };

  const getRefKey = (row: number, col: number) => `${row}-${col}`;


  const focusCell = (row: number, col: number) => {
    const el = inputRefs.current.get(getRefKey(row, col));
    if (!el) return;

    el.focus();



    // Some browsers complain for type="number", so wrap in try/catch
    setTimeout(() => {
      // Move caret to the end of the value
      const len = el.value.length;
      try {
        el.setSelectionRange(len, len);
      } catch {
        /* ignore */
      }
    }, 0);
  };

  const handleArrowNavigation = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => {
    const currentColIdx = COLUMN_INDICES.indexOf(columnIndex);
    const currentRow = displayItems[rowIndex];
    const hasProduct = !!(currentRow?.product_code);
    const nextRow = displayItems[rowIndex + 1];
    const nextRowHasProduct = !!(nextRow?.product_code);

    const focusByIndex = (row: number, colIdx: number) => {
      const col = COLUMN_INDICES[colIdx];
      focusCell(row, col);
    };

    // If row has no product, only allow up arrow navigation
    if (!hasProduct) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (rowIndex > 0) focusCell(rowIndex - 1, columnIndex);
      }
      return;
    }

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        // RTL: Right arrow moves left in the navigation (decrease column index)
        const prevIdx = currentColIdx - 1;
        if (prevIdx >= 0) focusByIndex(rowIndex, prevIdx);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        // RTL: Left arrow moves right in the navigation (increase column index)
        let nextIdx = 0;

        // Skip the "Unit" column (index 1) when moving right from the first editable column
        if (currentColIdx === 0) {
          nextIdx = 2;
        } else {
          nextIdx = currentColIdx + 1;
        }

        if (nextIdx < COLUMN_INDICES.length) focusByIndex(rowIndex, nextIdx);
        break;
      }
      case "Enter": {
        e.preventDefault();
        let nextIdx = 0;
        // Skip the "Unit" column (index 1) when moving right from the first editable column
        if (currentColIdx === 0) nextIdx = 2;
        else nextIdx = currentColIdx + 1;

        if (nextIdx < COLUMN_INDICES.length) {
          focusByIndex(rowIndex, nextIdx);
        } else {
          focusByIndex(rowIndex + 1, 0);
        }
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        // If current row has product and next row doesn't, go to first cell in next row
        if (!nextRowHasProduct && rowIndex + 1 < displayItems.length) {
          focusByIndex(rowIndex + 1, 0);
        } else if (nextRowHasProduct) {
          // If current row has product, allow moving down
          focusCell(rowIndex + 1, columnIndex);
        }
        // If no product in current row, don't allow down arrow
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        // Always allow up arrow
        if (rowIndex > 0) focusCell(rowIndex - 1, columnIndex);
        break;
      }
    }
  };

  const handleProductSelect = (product: Product, lineIndex?: number) => {
    const targetLineIndex = lineIndex !== undefined ? lineIndex : searchLineIndex;

    if (targetLineIndex !== null) {
      // Set product details
      onItemChange(targetLineIndex, 'product_code', product.product_code);
      onItemChange(targetLineIndex, 'product_name_ar', product.product_name_ar);
      onItemChange(targetLineIndex, 'unit', product.unit_name_ar || '');
      onItemChange(targetLineIndex, 'price', product.selling_price || 0);
      onItemChange(targetLineIndex, 'quantity', 1);
      onItemChange(targetLineIndex, 'tax', 15);

      // Auto-add new line if we're on the last line
      if (targetLineIndex === items.length - 1 && items.length < 11) {
        onAddItem();
      }

      // Focus on the price field (next editable field after product code)
      setSearchModalOpen(false);
      setTimeout(() => {
        focusCell(targetLineIndex, 4); // Column 4 is the Quantity field
      }, 0);
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
                onSearchProductCode={searchForProducts}
                phase={phase}
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
