import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceHeader from './components/InvoiceHeader';
import InvoiceLineItemsTable from './components/InvoiceLineItemsTable';
import InvoiceSummary from './components/InvoiceSummary';
import { Invoice, InvoiceLineItem } from './types';
import { CirclePoundSterling, ClipboardList, Copy, CornerLeftDown, CornerRightDown, DollarSign, Download, Percent, Plus, Printer, RefreshCcw, Rotate3d, RotateCcw, Save, Search, Sheet, X } from 'lucide-react';
import ExcelIcon from "../../assets/excel.png"
import BinderIcon from "../../assets/binder.png"
import { useTabStore } from '../../store/tabStore';
import useToast from '../../hooks/useToast';
import ToastContainer from '../../components/Toast';

// localStorage helper functions for invoices
const INVOICES_STORAGE_KEY = 'invoices_data';

const getInvoicesFromStorage = (): Map<string, Partial<Invoice>> => {
  try {
    const data = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return new Map(Object.entries(parsed));
    }
  } catch (error) {
    console.error('Failed to parse invoices from localStorage:', error);
  }
  return new Map();
};

const saveInvoicesToStorage = (invoices: Map<string, Partial<Invoice>>) => {
  try {
    const data = Object.fromEntries(invoices);
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save invoices to localStorage:', error);
  }
};

// In-memory storage for invoices (synced with localStorage)
let invoiceStorage = getInvoicesFromStorage();

export default function SalesInvoice() {
  const navigate = useNavigate();
  const { addTab, switchTab } = useTabStore();
  const { invoiceId } = useParams<{ invoiceId?: string }>();
  const { toasts, removeToast, showError } = useToast();

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

  // Initialize invoice state from storage or create new one
  const getInitialInvoice = useCallback((): Partial<Invoice> => {
    if (invoiceId && invoiceStorage.has(invoiceId)) {
      return invoiceStorage.get(invoiceId)!;
    }

    return {
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
      // Header state fields
      invoice_seq: '1',
      branch_name_seq: 'فرع جدة',
      payment_method_code: '1',
      payment_method_name: 'نقداًَ',
      company_code: 1,
      warehouse_code: '1',
      document_post_status: '',
      document_post_name: 'حجز البضاعة',
      document_type: 'فاتورة مبيعات',
      is_suspended: false,
      branch_code: '1',
      branch: 'فرع جدة',
      account_code: '121001001',
      account_name: 'الصندوق العام',
      employee_code: '1',
      tax_number_1: '',
      tax_number_2: '',
      tax_number_3: '',
      mobile_1: '',
      mobile_2: '',
      // Line items
      line_items: initializeLineItems,
      subtotal: 0,
      discount_fixed: 0,
      discount_percent: 0,
      tax: 0,
      total: 0,
      notes: '',
    };
  }, [invoiceId, initializeLineItems]);

  const [invoice, setInvoice] = useState<Partial<Invoice>>(getInitialInvoice());

  // Reset state when invoiceId changes
  useEffect(() => {
    setInvoice(getInitialInvoice());
  }, [invoiceId, getInitialInvoice]);

  const handleHeaderStateChange = useCallback(
    (fieldName: string, value: any) => {
      setInvoice((prev) => {
        const updated = {
          ...prev,
          [fieldName]: value,
        };
        // Save to storage
        if (invoiceId) {
          invoiceStorage.set(invoiceId, updated);
          saveInvoicesToStorage(invoiceStorage);
        }
        return updated;
      });
    },
    [invoiceId]
  );

  const handleInvoiceFieldChange = useCallback(
    (field: keyof Invoice, value: any) => {
      setInvoice((prev) => {
        const updated = {
          ...prev,
          [field]: value,
        };
        // Save to storage
        if (invoiceId) {
          invoiceStorage.set(invoiceId, updated);
          saveInvoicesToStorage(invoiceStorage);
        }
        return updated;
      });
    },
    [invoiceId]
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

        const updated = {
          ...prev,
          line_items: items,
          subtotal,
          total,
        };

        // Save to storage
        if (invoiceId) {
          invoiceStorage.set(invoiceId, updated);
          saveInvoicesToStorage(invoiceStorage);
        }

        return updated;
      });
    },
    [invoiceId]
  ); const handleAddLineItem = useCallback(() => {
    setInvoice((prev) => {
      const updated = {
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
      };

      // Save to storage
      if (invoiceId) {
        invoiceStorage.set(invoiceId, updated);
        saveInvoicesToStorage(invoiceStorage);
      }

      return updated;
    });
  }, [invoiceId]); const handleRemoveLineItem = useCallback((index: number) => {
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

      const updated = {
        ...prev,
        line_items: items,
        subtotal,
        total,
      };

      // Save to storage
      if (invoiceId) {
        invoiceStorage.set(invoiceId, updated);
        saveInvoicesToStorage(invoiceStorage);
      }

      return updated;
    });
  }, [invoiceId]);

  const handleAddNewInvoice = () => {
    const invoiceId = `invoice-${Date.now()}`;
    const invoicePath = `/invoices/${invoiceId}`;

    addTab({
      id: invoiceId,
      title: 'فاتورة جديدة',
      path: invoicePath,
      icon: '🧾',
    });

    switchTab(invoiceId);
    navigate(invoicePath);
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full">
      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-shrink">
        <button
          onClick={handleAddNewInvoice}
          className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
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
      <InvoiceHeader
        invoice={invoice}
        onFieldChange={handleInvoiceFieldChange}
        onHeaderStateChange={handleHeaderStateChange}
      />

      {/* Line Items Table - Scrollable */}
      <InvoiceLineItemsTable
        items={invoice.line_items || []}
        onItemChange={handleLineItemChange}
        onAddItem={handleAddLineItem}
        onRemoveItem={handleRemoveLineItem}
        onShowError={showError}
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

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
