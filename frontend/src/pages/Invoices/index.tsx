import { useState, useCallback, useMemo } from 'react';
import InvoiceHeader from './components/InvoiceHeader';
import InvoiceLineItemsTable from './components/InvoiceLineItemsTable';
import InvoiceSummary from './components/InvoiceSummary';
import { Invoice, InvoiceLineItem } from './types';

export default function SalesInvoice() {
  // Memoize the initialization function
  const initializeLineItems = useMemo(() => {
    return Array(11)
      .fill(null)
      .map((_, index) => ({
        line_number: index + 1,
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
      }));
  }, []);

  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    invoice_number: '1000001',
    invoice_date: new Date().toISOString().split('T')[0],
    customer_id: undefined,
    customer_name_ar: '',
    payment_method: '',
    company_name: '',
    warehouse_name: '',
    tax_number: '',
    mobile: '',
    document_number: '',
    supply_date: '',
    branch_name: '',
    account_id: undefined,
    employee_name: '',
    address: '',
    line_items: initializeLineItems,
    subtotal: 0,
    discount_fixed: 0,
    discount_percent: 0,
    tax: 0,
    total: 0,
    notes: '',
  });

  const handleInvoiceFieldChange = useCallback(
    (field: keyof Invoice, value: any) => {
      setInvoice((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleLineItemChange = useCallback(
    (index: number, field: keyof InvoiceLineItem, value: any) => {
      setInvoice((prev) => {
        const items = [...(prev.line_items || [])];
        items[index] = {
          ...items[index],
          [field]: value,
        };

        // Recalculate totals
        const subtotal = items.reduce((sum, item) => {
          return sum + item.quantity * item.price;
        }, 0);

        const total =
          subtotal -
          (prev.discount_fixed || 0) -
          (subtotal * (prev.discount_percent || 0)) / 100 +
          (prev.tax || 0);

        return {
          ...prev,
          line_items: items,
          subtotal,
          total,
        };
      });
    },
    []
  );

  const handleAddLineItem = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      line_items: [
        ...(prev.line_items || []),
        {
          line_number: (prev.line_items?.length || 0) + 1,
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
        },
      ],
    }));
  }, []);

  const handleRemoveLineItem = useCallback((index: number) => {
    setInvoice((prev) => {
      const items = prev.line_items?.filter((_, i) => i !== index) || [];

      // Recalculate totals
      const subtotal = items.reduce((sum, item) => {
        return sum + item.quantity * item.price;
      }, 0);

      const total =
        subtotal -
        (prev.discount_fixed || 0) -
        (subtotal * (prev.discount_percent || 0)) / 100 +
        (prev.tax || 0);

      return {
        ...prev,
        line_items: items,
        subtotal,
        total,
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button className="px-1 py-1 font-semibold hover:bg-gray-200">
            💾 حفظ
          </button>
          <button className="px-1 py-1 font-semibold hover:bg-gray-200">
            🖨️ طباعة
          </button>
          <button className="px-1 py-1 font-semibold hover:bg-gray-200">
            ✖️ إلغاء
          </button>
        </div>

        <div className='text-center p-1 bg-sky-900 text-white'>
          فاتورة مبيعات
        </div>
        {/* Invoice Header */}
        <InvoiceHeader invoice={invoice} onFieldChange={handleInvoiceFieldChange} />

        {/* Line Items Table */}
        <InvoiceLineItemsTable
          items={invoice.line_items || []}
          onItemChange={handleLineItemChange}
          onAddItem={handleAddLineItem}
          onRemoveItem={handleRemoveLineItem}
        />

        {/* Summary Section */}
        <InvoiceSummary
          subtotal={invoice.subtotal || 0}
          discountFixed={invoice.discount_fixed || 0}
          discountPercent={invoice.discount_percent || 0}
          tax={invoice.tax || 0}
          quantity={invoice.line_items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
          discount={invoice.discount_fixed || 0}
        />

        <div className='p-3 bg-sky-900'>
        </div>
      </div>
    </div>
  );
}
