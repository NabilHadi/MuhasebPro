import { useState } from 'react';
import { InvoiceLineItem } from '../types';
import { Product } from '../../Products/types';
import ProductSearchModal from './ProductSearchModal';

interface InvoiceLineItemsTableProps {
  items: InvoiceLineItem[];
  onItemChange: (index: number, field: keyof InvoiceLineItem, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export default function InvoiceLineItemsTable({
  items,
  onItemChange,
  onAddItem,
}: InvoiceLineItemsTableProps) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchLineIndex, setSearchLineIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const calculateLineItemTotals = (item: InvoiceLineItem) => {
    const subtotal = item.quantity * item.price;
    const discountAmount = item.discount_amount || 0;
    const discountPercentAmount = (subtotal * (item.discount_percent || 0)) / 100;
    const totalDiscounts = discountAmount + discountPercentAmount;
    const netAmount = subtotal - totalDiscounts;
    const taxPercent = item.tax || 0;
    const tax = (netAmount * taxPercent) / 100;
    const total = netAmount + tax;

    return {
      subtotal,
      discountAmount,
      discountPercentAmount,
      totalDiscounts,
      netAmount,
      tax,
      total,
    };
  };

  const handleCellClick = (index: number, currentValue: string) => {
    setSearchLineIndex(index);
    setSearchQuery(currentValue);
    setSearchModalOpen(true);
  };

  const handleProductSelect = (product: Product) => {
    if (searchLineIndex !== null) {
      // Set product details
      onItemChange(searchLineIndex, 'product_code', product.product_code);
      onItemChange(searchLineIndex, 'product_name_ar', product.product_name_ar);
      onItemChange(searchLineIndex, 'unit', product.unit_name_ar || '');
      onItemChange(searchLineIndex, 'price', product.selling_price || 0);
      onItemChange(searchLineIndex, 'quantity', 1);

      // Auto-add new line if we're on the last line
      if (searchLineIndex === items.length - 1 && items.length < 11) {
        onAddItem();
      }
    }
    setSearchModalOpen(false);
  };

  // Ensure we always have 11 rows visible
  const displayItems = items.length < 11
    ? [...items, ...Array(11 - items.length).fill(null).map(() => ({
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
    } as InvoiceLineItem))]
    : items;


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
            {displayItems.map((item, index) => {
              const isEmptyRow = index >= items.length;
              const totals = calculateLineItemTotals(item);

              return (
                <tr key={index} className={"border-b border-gray-200 hover:bg-gray-50"}>
                  {/* Line Number */}
                  <td className="p-0 text-center text-gray-400 bg-sky-100 border-2">
                    {index + 1}
                  </td>

                  {/* Product Code - Clickable with Search */}
                  <td className="p-0 hover:bg-blue-100 border-2">
                    <input
                      type="text"
                      value={item.product_code}
                      onChange={(e) => onItemChange(index, 'product_code', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.code === 'F9') {
                          e.preventDefault();
                          handleCellClick(index, item.product_code);
                        }
                      }}
                      className="w-full h-full px-2 text-xs focus:outline-none border-0"
                      disabled={isEmptyRow}
                    />
                  </td>

                  {/* Product Name - Clickable with Search */}
                  <td className="p-0 hover:bg-blue-100 border-2">
                    <input
                      type="text"
                      value={item.product_name_ar}
                      onChange={(e) => onItemChange(index, 'product_name_ar', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.code === 'F9') {
                          e.preventDefault();
                          handleCellClick(index, item.product_name_ar);
                        }
                      }}
                      className="w-full h-full px-2 text-xs focus:outline-none border-0"
                      disabled={isEmptyRow}
                    />
                  </td>

                  {/* Unit */}
                  <td className="p-0 border-2">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => onItemChange(index, 'unit', e.target.value)}
                      className="w-full h-full px-2 text-xs focus:outline-none border-0"
                      disabled={isEmptyRow}
                    />
                  </td>

                  {/* Quantity */}
                  <td className="p-0 border-2">
                    <input
                      type="number"
                      value={item.product_code || item.product_name_ar ? (item.quantity || 0) : (item.quantity || '')}
                      onChange={(e) => onItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full h-full px-2 text-xs text-center focus:outline-none border-0"
                      disabled={isEmptyRow}
                    />
                  </td>

                  {/* Price */}
                  <td className="p-0 border-2">
                    <input
                      type="number"
                      value={item.product_code || item.product_name_ar ? (item.price || 0) : (item.price || '')}
                      onChange={(e) => onItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full h-full px-2 text-xs text-center focus:outline-none border-0"
                      disabled={isEmptyRow}
                    />
                  </td>

                  {/* Discount Amount */}
                  <td className="p-0 border-2">
                    <input
                      type="number"
                      value={item.product_code || item.product_name_ar ? (item.discount_amount || 0) : (item.discount_amount ? item.discount_amount : '')}
                      onChange={(e) => onItemChange(index, 'discount_amount', parseFloat(e.target.value) || 0)}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full h-full px-2 text-xs text-center focus:outline-none border-0"
                      disabled={isEmptyRow}
                    />
                  </td>

                  {/* Discount Percent */}
                  <td className="p-0 border-2">
                    <input
                      type="number"
                      value={item.product_code || item.product_name_ar ? (item.discount_percent || 0) : (item.discount_percent ? item.discount_percent : '')}
                      onChange={(e) => onItemChange(index, 'discount_percent', parseFloat(e.target.value) || 0)}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full h-full px-2 text-xs text-center focus:outline-none border-0"
                      min="0"
                      max="100"
                      disabled={isEmptyRow}
                    />
                  </td>

                  {/* Total Discounts */}
                  <td className="p-0 border-2 text-center">
                    {item.product_code || item.product_name_ar ? totals.totalDiscounts.toFixed(2) : ''}
                  </td>

                  {/* Net Amount */}
                  <td className="p-0 border-2 text-center">
                    {item.product_code || item.product_name_ar ? totals.netAmount.toFixed(2) : ''}
                  </td>

                  {/* Tax */}
                  <td className="p-0 border-2 text-center">
                    <input
                      type="number"
                      value={item.product_code || item.product_name_ar ? (item.tax || 0) : (item.tax ? item.tax : '')}
                      onChange={(e) => onItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full h-full px-2 text-xs text-center focus:outline-none border-0"
                      disabled={isEmptyRow}
                    />
                  </td>

                  {/* Total */}
                  <td className="p-0 border-2 text-center">
                    {item.product_code || item.product_name_ar ? totals.total.toFixed(2) : ''}
                  </td>

                  {/* Notes */}
                  <td className="p-0 border-2 text-center">
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={(e) => onItemChange(index, 'notes', e.target.value)}
                      className="w-full h-full px-2 text-xs focus:outline-none border-0"
                      disabled={isEmptyRow}
                    />
                  </td>
                </tr>
              );
            })}
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
