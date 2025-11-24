import { InvoiceLineItem } from '../types';

interface InvoiceLineItemsTableProps {
  items: InvoiceLineItem[];
  onItemChange: (index: number, field: keyof InvoiceLineItem, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export interface InvoiceLineItemRowProps {
  item: InvoiceLineItem;
  index: number;
  isEmptyRow: boolean;
  onItemChange: InvoiceLineItemsTableProps['onItemChange'];
  handleArrowNavigation: (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => void;
  inputRefs: React.MutableRefObject<Map<string, HTMLInputElement>>;
  onOpenProductSearch: (index: number, currentValue: string) => void;
}

export const calculateLineItemTotals = (item: InvoiceLineItem) => {
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

const numberInputClass =
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full h-full bg-transparent px-2 text-xs text-center focus:outline-none border-0 focus:bg-yellow-100";

export default function InvoiceLineItemRow({
  item,
  index,
  isEmptyRow,
  onItemChange,
  handleArrowNavigation,
  inputRefs,
  onOpenProductSearch,
}: InvoiceLineItemRowProps) {
  const hasProduct = !!(item.product_code);
  const totals = calculateLineItemTotals(item);

  return (
    <tr className={"border-b border-gray-200 hover:bg-sky-100 focus-within:bg-sky-100"}>
      {/* Line Number */}
      <td className="p-0 text-center text-gray-400 bg-sky-100 border-2 border-gray-300">
        {index + 1}
      </td>

      {/* Product Code - Clickable with Search */}
      <td className="p-0 border-2 border-gray-300">
        <input
          ref={(el) => {
            if (el) inputRefs.current.set(`${index}-1`, el);
          }}
          type="text"
          value={item.product_code}
          onChange={(e) => onItemChange(index, 'product_code', e.target.value)}
          onKeyDown={(e) => {
            if (e.code === 'F9') {
              e.preventDefault();
              onOpenProductSearch(index, item.product_code);
            } else {
              handleArrowNavigation(e, index, 1);
            }
          }}
          className="w-full h-full bg-transparent px-2 text-xs focus:outline-none border-0 focus:bg-yellow-100"
          disabled={isEmptyRow}
        />
      </td>

      {/* Product Name */}
      <td className="p-1 bg-sky-50 text-xs border-2 border-gray-300">
        {hasProduct ? item.product_name_ar : ''}
      </td>

      {/* Unit */}
      <td className="p-0 border-2 border-gray-300">
        <input
          ref={(el) => {
            if (el) inputRefs.current.set(`${index}-3`, el);
          }}
          type="text"
          value={hasProduct ? item.unit : ''}
          onChange={(e) => onItemChange(index, 'unit', e.target.value)}
          onKeyDown={(e) => handleArrowNavigation(e, index, 3)}
          className="w-full h-full bg-transparent px-2 text-xs focus:outline-none border-0 focus:bg-yellow-100"
          disabled={isEmptyRow}
        />
      </td>

      {/* Quantity */}
      <td className="p-0 border-2 border-gray-300">
        <input
          ref={(el) => {
            if (el) inputRefs.current.set(`${index}-4`, el);
          }}
          type="number"
          value={hasProduct ? (item.quantity || 0) : ''}
          onChange={(e) => onItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
          onKeyDown={(e) => handleArrowNavigation(e, index, 4)}
          className={numberInputClass}
          disabled={isEmptyRow}
        />
      </td>

      {/* Price */}
      <td className="p-0 border-2 border-gray-300">
        <input
          ref={(el) => {
            if (el) inputRefs.current.set(`${index}-5`, el);
          }}
          type="number"
          value={hasProduct ? (item.price || 0) : ''}
          onChange={(e) => onItemChange(index, 'price', parseFloat(e.target.value) || 0)}
          onKeyDown={(e) => handleArrowNavigation(e, index, 5)}
          className={numberInputClass}
          disabled={isEmptyRow}
        />
      </td>

      {/* Discount Amount */}
      <td className="p-0 border-2 border-gray-300">
        <input
          ref={(el) => {
            if (el) inputRefs.current.set(`${index}-6`, el);
          }}
          type="number"
          value={hasProduct ? (item.discount_amount || 0) : ''}
          onChange={(e) => onItemChange(index, 'discount_amount', parseFloat(e.target.value) || 0)}
          onKeyDown={(e) => handleArrowNavigation(e, index, 6)}
          className={numberInputClass}
          disabled={isEmptyRow}
        />
      </td>

      {/* Discount Percent */}
      <td className="p-0 border-2 border-gray-300">
        <input
          ref={(el) => {
            if (el) inputRefs.current.set(`${index}-7`, el);
          }}
          type="number"
          value={hasProduct ? (item.discount_percent || 0) : ''}
          onChange={(e) => onItemChange(index, 'discount_percent', parseFloat(e.target.value) || 0)}
          onKeyDown={(e) => handleArrowNavigation(e, index, 7)}
          className={numberInputClass}
          min="0"
          max="100"
          disabled={isEmptyRow}
        />
      </td>

      {/* Total Discounts */}
      <td className="p-0 border-2 bg-sky-50 border-gray-300 text-center text-sm">
        {hasProduct ? totals.totalDiscounts.toFixed(2) : ''}
      </td>

      {/* Net Amount */}
      <td className="p-0 border-2 bg-sky-50 border-gray-300 text-center text-sm">
        {hasProduct ? totals.netAmount.toFixed(2) : ''}
      </td>

      {/* Tax */}
      <td className="p-0 border-2 bg-sky-50 border-gray-300 text-center text-sm">
        {hasProduct ? totals.tax.toFixed(2) : ''}
      </td>

      {/* Total */}
      <td className="p-0 border-2 border-gray-300 text-center text-sm">
        <input
          ref={(el) => {
            if (el) inputRefs.current.set(`${index}-11`, el);
          }}
          type="number"
          value={hasProduct ? totals.total : ''}
          onChange={(e) => {
            const newTotal = parseFloat(e.target.value) || 0;
            const currentTotal = totals.total;
            const difference = newTotal - currentTotal;
            const newPrice = item.quantity > 0 ? item.price + (difference / item.quantity) : item.price;
            onItemChange(index, 'price', Math.max(0, newPrice));
            onItemChange(index, 'total', newTotal);
          }}
          onKeyDown={(e) => handleArrowNavigation(e, index, 11)}
          className={numberInputClass}
          disabled={isEmptyRow}
        />
      </td>

      {/* Notes */}
      <td className="p-0 border-2 border-gray-300 text-center text-sm">
        <input
          ref={(el) => {
            if (el) inputRefs.current.set(`${index}-12`, el);
          }}
          type="text"
          value={hasProduct ? (item.notes || '') : ''}
          onChange={(e) => onItemChange(index, 'notes', e.target.value)}
          onKeyDown={(e) => handleArrowNavigation(e, index, 12)}
          className="w-full h-full px-2 text-xs focus:outline-none border-0"
          disabled={isEmptyRow}
        />
      </td>
    </tr>
  );
}
