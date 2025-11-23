import { useState, useCallback, useMemo } from 'react';
import InvoiceHeader from './components/InvoiceHeader';
import InvoiceLineItemsTable from './components/InvoiceLineItemsTable';
import InvoiceSummary from './components/InvoiceSummary';
import { Invoice, InvoiceLineItem } from './types';
import { CirclePoundSterling, ClipboardList, Copy, CornerLeftDown, CornerRightDown, DollarSign, Download, Percent, Plus, Printer, RefreshCcw, Rotate3d, RotateCcw, Save, Search, Sheet, X } from 'lucide-react';
import ExcelIcon from "../../assets/excel.png"
import BinderIcon from "../../assets/binder.png"

export default function SalesInvoice() {
  // Memoize the initialization function
  const initializeLineItems = useMemo(() => {
    return Array(25)
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
    <div className="flex-1 flex flex-col w-full h-full">
      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-shrink">
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <Plus size={16} /> اضافة
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <RefreshCcw size={16} /> تعديل
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <X size={16} /> حذف
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <Search size={16} /> عرض
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <CornerRightDown size={16} /> التالي
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <CornerLeftDown size={16} /> السابق
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <Save size={16} /> حفظ
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <Printer size={16} /> طباعة
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <img src={ExcelIcon} alt="Excel" className="w-4 h-4" /> استيراد
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <img src={BinderIcon} alt="Binder" className="w-4 h-4" /> مرفقات
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <Sheet size={16} /> القيد
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <RefreshCcw size={16} /> تحويل
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <Rotate3d size={16} /> العلاقات
        </button>
        <button className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <RotateCcw size={16} /> تراجع
        </button>
      </div>

      <div className='text-sm text-center bg-sky-800 text-white flex-shrink flex justify-between items-center'>
        <div className='flex items-center'>
          <button className="text-sm px-2 py-2 bg-sky-900 font-semibold flex items-center gap-1">
            <Copy size={16} /> نسخ البيانات
          </button>
          <button className="text-sm px-2 py-2 bg-sky-900 font-semibold flex items-center gap-1">
            <ClipboardList size={16} /> لصق البيانات
          </button>
          <button className="text-sm px-2 py-2 bg-sky-900 font-semibold flex items-center gap-1">
            <ClipboardList size={16} /> مردود مبيعات
          </button>
          <button className="text-sm px-2 py-2 bg-sky-900 font-semibold flex items-center gap-1">
            <ClipboardList size={16} /> ترحيل
          </button>
        </div>
        <span className='font-bold'>
          فاتورة مبيعات
        </span>
        <div className='flex items-center'>
          <button className="text-sm px-2 py-2 font-semibold bg-sky-900 flex items-center gap-1">
            <Download size={16} /> حجز البضاعة
          </button>
          <button className="text-sm px-2 py-2 font-semibold bg-sky-900 flex items-center gap-1">
            <CirclePoundSterling size={16} />سند القبض
          </button>
          <button className="text-sm px-2 py-2 font-semibold bg-sky-900 flex items-center gap-1">
            <Percent size={16} />حسابة الخصم
          </button>
          <button className="text-sm px-2 py-2 font-semibold bg-sky-900 flex items-center gap-1">
            <DollarSign size={16} />حاسبة المبلغ
          </button>
        </div>
      </div>

      {/* Invoice Header */}
      <InvoiceHeader invoice={invoice} onFieldChange={handleInvoiceFieldChange} />

      {/* Line Items Table - Scrollable */}
      <InvoiceLineItemsTable
        items={invoice.line_items || []}
        onItemChange={handleLineItemChange}
        onAddItem={handleAddLineItem}
        onRemoveItem={handleRemoveLineItem}
      />

      <div className='p-3 bg-slate-300 flex-shrink text-sm border-t-2 border-gray-400'>
      </div>

      {/* Summary Section */}
      <InvoiceSummary
        subtotal={invoice.subtotal || 0}
        discountFixed={invoice.discount_fixed || 0}
        discountPercent={invoice.discount_percent || 0}
        tax={invoice.tax || 0}
        quantity={invoice.line_items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
        discount={invoice.discount_fixed || 0}
      />

      <div className='p-3 bg-sky-900 flex-shrink text-sm'>
      </div>
    </div>
  );
}
