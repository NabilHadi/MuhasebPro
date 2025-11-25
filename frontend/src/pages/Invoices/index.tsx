import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceHeader from './components/InvoiceHeader';
import InvoiceLineItemsTable from './components/InvoiceLineItemsTable';
import InvoiceSummary from './components/InvoiceSummary';
import InvoiceSearchModal from './components/InvoiceSearchModal';
import { Invoice, InvoiceLineItem } from './types';
import { CirclePoundSterling, ClipboardList, Copy, CornerLeftDown, CornerRightDown, DollarSign, Download, Percent, Plus, Printer, RefreshCcw, Rotate3d, RotateCcw, Save, Search, Sheet, X } from 'lucide-react';
import ExcelIcon from "../../assets/excel.png"
import BinderIcon from "../../assets/binder.png"
import { useTabStore } from '../../store/tabStore';
import useToast from '../../hooks/useToast';
import ToastContainer from '../../components/Toast';
import { useInvoiceStorage } from '../../hooks/useInvoiceStorage';

export default function SalesInvoice() {
  const navigate = useNavigate();
  const { addTab, switchTab } = useTabStore();
  const { invoiceId } = useParams<{ invoiceId?: string }>();
  const { toasts, removeToast, showError, showSuccess } = useToast();
  const { saveInvoice: saveToStorage, getNextInvoiceId, getPreviousInvoiceId, getInvoice: getInvoiceFromStorage, getNextDocumentNumber, documentNumberExists, getSortedInvoiceNumbers } = useInvoiceStorage();

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
  const getInitialInvoice = (): Partial<Invoice> => {
    // Try to load from persistent storage
    if (invoiceId) {
      const storedInvoice = getInvoiceFromStorage(invoiceId);
      if (storedInvoice) {
        return storedInvoice;
      }
    }

    return {
      invoice_number: '',
      invoice_date: '',
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
      // Header state fields - all empty
      invoice_seq: '',
      branch_name_seq: '',
      payment_method_code: '',
      payment_method_name: '',
      company_code: '',
      warehouse_code: '',
      document_post_status: '',
      document_post_name: '',
      document_type: '',
      is_suspended: false,
      branch_code: '',
      branch: '',
      account_code: '',
      account_name: '',
      employee_code: '',
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
  };

  const [invoice, setInvoice] = useState<Partial<Invoice>>(() => getInitialInvoice());
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Reset state when invoiceId changes
  useEffect(() => {
    setInvoice(getInitialInvoice());
  }, [invoiceId]);

  const handleHeaderStateChange = useCallback(
    (fieldName: string, value: any) => {
      setInvoice((prev) => {
        const updated = {
          ...prev,
          [fieldName]: value,
        };
        return updated;
      });
    },
    []
  );

  const handleInvoiceFieldChange = useCallback(
    (field: keyof Invoice, value: any) => {
      setInvoice((prev) => {
        const updated = {
          ...prev,
          [field]: value,
        };
        return updated;
      });
    },
    []
  );

  // Handle Save Invoice
  const handleSaveInvoice = useCallback(() => {
    if (!invoiceId) {
      showError('حدث خطأ: معرف الفاتورة مفقود');
      return;
    }

    // Check if document number already exists in storage
    if (invoice.document_number && documentNumberExists(invoice.document_number)) {
      showError(`رقم الفاتورة ${invoice.document_number} موجود بالفعل في السجلات`);
      return;
    }

    const result = saveToStorage(invoiceId, invoice);
    if (result.success) {
      showSuccess(`تم حفظ الفاتورة برقم ${result.documentNumber}`);
      // Update tab title with document number
      addTab({
        id: invoiceId,
        title: `فاتورة #${result.documentNumber}`,
        path: `/invoices/${invoiceId}`,
        icon: '🧾',
      });
    } else {
      showError(result.error || 'فشل حفظ الفاتورة');
    }
  }, [invoiceId, invoice, saveToStorage, showSuccess, showError, addTab, documentNumberExists]);

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

        return updated;
      });
    },
    []
  );

  const handleAddLineItem = useCallback(() => {
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

      return updated;
    });
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

      const updated = {
        ...prev,
        line_items: items,
        subtotal,
        total,
      };

      return updated;
    });
  }, []);

  const handleAddNewInvoice = useCallback(() => {
    // Get the next document number
    const nextDocNumber = generateDocumentNumber(1);

    // Initialize a new invoice with the next document number
    const newInvoice: Partial<Invoice> = {
      document_number: nextDocNumber,
      invoice_number: '',
      invoice_date: new Date().toISOString().split('T')[0], // Today's date
      customer_id: undefined,
      customer_name_ar: '',
      payment_method: '',
      tax_number: '',
      mobile: '',
      supply_date: new Date().toISOString().split('T')[0], // Today's date
      branch_name: '',
      account_id: undefined,
      address: '',
      // Header state fields
      invoice_seq: '1',
      branch_name_seq: 'فرع جدة',
      payment_method_code: '1',
      payment_method_name: 'نقداًَ',
      company_code: '1',
      company_name: 'شركة العامة',
      warehouse_code: '1',
      warehouse_name: 'فرع جدة',
      document_post_status: '',
      document_post_name: 'حجز بضاعة',
      tax_number_1: '',
      tax_number_2: '',
      tax_number_3: '',
      mobile_1: '',
      mobile_2: '',
      document_type: 'فاتورة مبيعات',
      is_suspended: false,
      branch_code: '1',
      branch: 'فرع جدة',
      account_code: '1210010001',
      account_name: 'الصندوق العام',
      employee_code: '1',
      employee_name: 'موظف جدة 1',
      // Line items and totals
      line_items: initializeLineItems,
      subtotal: 0,
      discount_fixed: 0,
      discount_percent: 0,
      tax: 0,
      total: 0,
      notes: '',
    };

    // Set the current invoice state to the new initialized invoice
    setInvoice(newInvoice);

    // Show success message with the next document number
    showSuccess(`فاتورة جديدة برقم ${nextDocNumber}`);
  }, [getNextDocumentNumber, initializeLineItems, showSuccess]);

  // Handle Next Invoice Navigation
  const handleNextInvoice = useCallback(() => {
    if (!invoice.document_number) {
      showError('يجب حفظ الفاتورة أولاً');
      return;
    }

    const nextInvoiceId = getNextInvoiceId(invoice.document_number);
    if (!nextInvoiceId) {
      showError('لا توجد فواتير محفوظة');
      return;
    }

    switchTab(nextInvoiceId);
    navigate(`/invoices/${nextInvoiceId}`);
  }, [invoice.document_number, getNextInvoiceId, switchTab, navigate, showError]);

  // Handle Previous Invoice Navigation
  const handlePreviousInvoice = useCallback(() => {
    if (!invoice.document_number) {
      showError('يجب حفظ الفاتورة أولاً');
      return;
    }

    const prevInvoiceId = getPreviousInvoiceId(invoice.document_number);
    if (!prevInvoiceId) {
      showError('لا توجد فواتير محفوظة');
      return;
    }

    switchTab(prevInvoiceId);
    navigate(`/invoices/${prevInvoiceId}`);
  }, [invoice.document_number, getPreviousInvoiceId, switchTab, navigate, showError]);

  // Handle Invoice Selection from Modal
  const handleSelectFromSearch = useCallback(
    (selectedInvoiceId: string) => {
      setShowSearchModal(false);
      switchTab(selectedInvoiceId);
      navigate(`/invoices/${selectedInvoiceId}`);
    },
    [switchTab, navigate]
  );

  // Generate next document number based on invoice sequence
  const generateDocumentNumber = useCallback((seqNum: number): string => {
    if (isNaN(seqNum) || seqNum <= 0) {
      return '';
    }

    // Get all saved invoice numbers
    const allInvoiceNumbers = getSortedInvoiceNumbers();

    // Filter for invoices with the same seq prefix
    const seqPrefix = String(seqNum);
    const matchingNumbers = allInvoiceNumbers.filter(num => num.startsWith(seqPrefix));

    let nextDocNumber: string;
    if (matchingNumbers.length === 0) {
      // No invoices with this seq yet, start with seq + '0001'
      nextDocNumber = seqPrefix + '00001';
    } else {
      // Get the highest number with this seq and increment
      const highestMatch = matchingNumbers[matchingNumbers.length - 1];
      const nextNum = parseInt(highestMatch, 10) + 1;
      nextDocNumber = String(nextNum);
    }

    return nextDocNumber;
  }, [getSortedInvoiceNumbers]);

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
        <button
          onClick={() => setShowSearchModal(true)}
          className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <Search size={16} /> عرض
        </button>
        <button
          onClick={handleNextInvoice}
          className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <CornerRightDown size={16} /> التالي
        </button>
        <button
          onClick={handlePreviousInvoice}
          className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
          <CornerLeftDown size={16} /> السابق
        </button>
        <button
          onClick={handleSaveInvoice}
          className="text-sm px-1 py-1 font-semibold hover:bg-gray-200 flex items-center gap-1">
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
        onGenerateDocumentNumber={generateDocumentNumber}
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

      {/* Invoice Search Modal */}
      <InvoiceSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectInvoice={handleSelectFromSearch}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
