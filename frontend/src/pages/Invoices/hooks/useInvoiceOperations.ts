import { useCallback } from 'react';
import { useTabStore } from '../../../store/tabStore';
import { useInvoiceStorage } from '../../../hooks/useInvoiceStorage';
import useToast from '../../../hooks/useToast';
import { Invoice } from '../types';
import { useNavigate } from 'react-router-dom';

interface UseInvoiceOperationsProps {
  invoiceId?: string;
  invoice: Invoice;
  phase: 'viewing' | 'editing';
  setPhase: (phase: 'viewing' | 'editing') => void;
  setInvoice: (invoice: Invoice | ((prev: Invoice) => Invoice)) => void;
  getInitialInvoice: () => Invoice;
  getSortedInvoiceNumbers: () => string[];
}

export function useInvoiceOperations({
  invoiceId,
  invoice,
  phase,
  setPhase,
  setInvoice,
  getInitialInvoice,
  getSortedInvoiceNumbers,
}: UseInvoiceOperationsProps) {
  const { addTab } = useTabStore();
  const { saveInvoice: saveToStorage } = useInvoiceStorage();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  // Simple ID generator for new invoices
  const generateInvoiceId = () => `invoice-${Date.now()}`;

  const handleSaveInvoice = useCallback(() => {
    if (!invoice.document_number) {
      showError('يجب إدخال رقم الفاتورة');
      return;
    }

    const effectiveId = invoiceId ?? generateInvoiceId();

    const result = saveToStorage(effectiveId, invoice);
    if (result.success) {
      showSuccess(`تم حفظ الفاتورة برقم ${result.documentNumber}`);

      // Update tab title with document number
      addTab({
        id: effectiveId,
        title: `فاتورة #${result.documentNumber}`,
        path: `/invoices/${effectiveId}`,
        icon: '🧾',
      });

      // If this was a brand-new invoice (/invoices), move URL to /invoices/:id
      if (!invoiceId) {
        navigate(`/invoices/${effectiveId}`);
      }

      setPhase('viewing');
    } else {
      showError(result.error || 'فشل حفظ الفاتورة');
    }
  }, [invoiceId, invoice, saveToStorage, showSuccess, showError, addTab, navigate, setPhase]);

  const generateDocumentNumber = useCallback(
    (seqNum: number): string => {
      if (isNaN(seqNum) || seqNum <= 0) {
        return '';
      }

      // Get all saved invoice numbers
      const allInvoiceNumbers = getSortedInvoiceNumbers();

      // Filter for invoices with the same seq prefix
      const seqPrefix = String(seqNum);
      const matchingNumbers = allInvoiceNumbers.filter((num) =>
        num.startsWith(seqPrefix)
      );

      let nextDocNumber: string;
      if (matchingNumbers.length === 0) {
        // No invoices with this seq yet, start with seq + '0001'
        nextDocNumber = seqPrefix + '0001';
      } else {
        // Get the highest number with this seq and increment
        const highestMatch = matchingNumbers[matchingNumbers.length - 1];
        const nextNum = parseInt(highestMatch, 10) + 1;
        nextDocNumber = String(nextNum);
      }

      return nextDocNumber;
    },
    [getSortedInvoiceNumbers]
  );

  const handleAddNewInvoice = useCallback(() => {
    const nextDocNumber = generateDocumentNumber(1);

    const base = getInitialInvoice();

    // Initialize a new invoice with the next document number
    const newInvoice: Invoice = {
      ...base,
      document_number: nextDocNumber,
      invoice_number: '',
      invoice_date: new Date().toISOString().split('T')[0],
      supply_date: new Date().toISOString().split('T')[0],

      customer_id: undefined,
      customer_name_ar: '',
      payment_method: '',
      tax_number: '',
      mobile: '',
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
      line_items: (base.line_items || []).map((item, idx) => ({
        ...item,
        line_number: idx + 1,
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
      })),

      subtotal: 0,
      discount_fixed: 0,
      discount_percent: 0,
      tax: 0,
      total: 0,
      notes: '',
    };

    setInvoice(newInvoice);
    setPhase('editing');
  }, [generateDocumentNumber, setInvoice, setPhase, getInitialInvoice]);

  const handleEditInvoice = useCallback(() => {
    setPhase('editing');
  }, [setPhase]);

  const handleUndo = useCallback(() => {
    setInvoice(getInitialInvoice());
    setPhase('viewing');
  }, [setInvoice, getInitialInvoice, setPhase]);

  // Helper to determine if a button is enabled based on phase
  const isButtonEnabled = useCallback(
    (buttonId: string): boolean => {
      const viewingPhaseButtons = [
        'add',
        'edit',
        'delete',
        'show',
        'next',
        'previous',
        'print',
        'import',
        'attachments',
        'entry',
        'convert',
        'relations',
      ];
      const editingPhaseButtons = ['save', 'undo'];

      if (phase === 'viewing') {
        return viewingPhaseButtons.includes(buttonId);
      } else {
        return editingPhaseButtons.includes(buttonId);
      }
    },
    [phase]
  );

  return {
    handleSaveInvoice,
    handleAddNewInvoice,
    handleEditInvoice,
    handleUndo,
    generateDocumentNumber,
    isButtonEnabled,
  };
}
