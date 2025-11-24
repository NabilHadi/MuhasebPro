import { Invoice } from '../pages/Invoices/types';

const INVOICES_STORAGE_KEY = 'invoices_data';
const INVOICES_METADATA_KEY = 'invoices_metadata';

export interface InvoicesMetadata {
  document_number_sequence: number;
  total_saved_invoices: number;
  last_accessed_invoice_id?: string;
  invoice_index: Record<string, string>; // docNumber -> invoiceId mapping
}

interface SaveResult {
  success: boolean;
  error?: string;
  documentNumber?: string;
  invoiceId?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Initialize or get metadata from localStorage
const getMetadata = (): InvoicesMetadata => {
  try {
    const data = localStorage.getItem(INVOICES_METADATA_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to parse invoices metadata:', error);
  }
  
  return {
    document_number_sequence: 100001,
    total_saved_invoices: 0,
    invoice_index: {},
  };
};

// Save metadata to localStorage
const saveMetadata = (metadata: InvoicesMetadata): void => {
  try {
    localStorage.setItem(INVOICES_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Failed to save invoices metadata:', error);
  }
};

// Get all invoices from localStorage
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

// Save all invoices to localStorage
const saveInvoicesToStorage = (invoices: Map<string, Partial<Invoice>>): void => {
  try {
    const data = Object.fromEntries(invoices);
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save invoices to localStorage:', error);
  }
};

// Validate invoice before saving
const validateInvoice = (invoice: Partial<Invoice>): ValidationResult => {
  const errors: string[] = [];

  if (!invoice.customer_name_ar?.trim()) {
    errors.push('يجب إدخال اسم العميل');
  }

  if (!invoice.invoice_date) {
    errors.push('يجب تحديد تاريخ الفاتورة');
  }

  if (!invoice.account_code?.trim()) {
    errors.push('يجب تحديد الحساب');
  }

  if (!invoice.line_items || invoice.line_items.length === 0) {
    errors.push('يجب إضافة صنف واحد على الأقل');
  } else {
    const hasValidItem = invoice.line_items.some(item => item.quantity > 0);
    if (!hasValidItem) {
      errors.push('يجب أن يكون هناك صنف واحد على الأقل بكمية أكبر من صفر');
    }
  }

  if ((invoice.total ?? 0) <= 0) {
    errors.push('المجموع يجب أن يكون أكبر من صفر');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Build index from invoices
const buildInvoiceIndex = (invoices: Map<string, Partial<Invoice>>): Record<string, string> => {
  const index: Record<string, string> = {};
  invoices.forEach((invoice, invoiceId) => {
    if (invoice.document_number) {
      index[invoice.document_number] = invoiceId;
    }
  });
  return index;
};

// Get sorted array of document numbers
const getSortedDocumentNumbers = (): string[] => {
  const metadata = getMetadata();
  const docNumbers = Object.keys(metadata.invoice_index).sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    return numA - numB;
  });
  return docNumbers;
};

export const useInvoiceStorage = () => {
  // Save invoice with validation
  const saveInvoice = (invoiceId: string, invoice: Partial<Invoice>): SaveResult => {
    const validation = validateInvoice(invoice);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors[0],
      };
    }

    const invoices = getInvoicesFromStorage();
    const metadata = getMetadata();

    // If invoice already has document_number, use it
    let documentNumber = invoice.document_number;

    // If no document_number, generate a new one
    if (!documentNumber) {
      documentNumber = String(metadata.document_number_sequence);
      metadata.document_number_sequence++;
      metadata.total_saved_invoices++;
    }

    // Update invoice with document_number, saved_at, and status
    const updatedInvoice: Partial<Invoice> = {
      ...invoice,
      document_number: documentNumber,
      saved_at: new Date().toISOString(),
      status: 'saved',
    };

    // Store invoice
    invoices.set(invoiceId, updatedInvoice);
    saveInvoicesToStorage(invoices);

    // Update metadata
    metadata.invoice_index[documentNumber] = invoiceId;
    metadata.last_accessed_invoice_id = invoiceId;
    saveMetadata(metadata);

    return {
      success: true,
      documentNumber,
      invoiceId,
    };
  };

  // Get invoice by ID
  const getInvoice = (invoiceId: string): Partial<Invoice> | null => {
    const invoices = getInvoicesFromStorage();
    return invoices.get(invoiceId) ?? null;
  };

  // Get all invoices
  const getAll = (): Map<string, Partial<Invoice>> => {
    return getInvoicesFromStorage();
  };

  // Delete invoice
  const deleteInvoice = (invoiceId: string): void => {
    const invoices = getInvoicesFromStorage();
    const invoice = invoices.get(invoiceId);

    if (invoice && invoice.document_number) {
      const metadata = getMetadata();
      delete metadata.invoice_index[invoice.document_number];
      metadata.total_saved_invoices = Math.max(0, metadata.total_saved_invoices - 1);
      saveMetadata(metadata);
    }

    invoices.delete(invoiceId);
    saveInvoicesToStorage(invoices);
  };

  // Get next invoice ID based on current document number
  const getNextInvoiceId = (currentDocNumber?: string): string | null => {
    if (!currentDocNumber) return null;

    const docNumbers = getSortedDocumentNumbers();
    if (docNumbers.length === 0) return null;

    const currentIndex = docNumbers.indexOf(currentDocNumber);
    if (currentIndex === -1) return null;

    const nextIndex = (currentIndex + 1) % docNumbers.length;
    const nextDocNumber = docNumbers[nextIndex];

    const metadata = getMetadata();
    return metadata.invoice_index[nextDocNumber] ?? null;
  };

  // Get previous invoice ID based on current document number
  const getPreviousInvoiceId = (currentDocNumber?: string): string | null => {
    if (!currentDocNumber) return null;

    const docNumbers = getSortedDocumentNumbers();
    if (docNumbers.length === 0) return null;

    const currentIndex = docNumbers.indexOf(currentDocNumber);
    if (currentIndex === -1) return null;

    const prevIndex = (currentIndex - 1 + docNumbers.length) % docNumbers.length;
    const prevDocNumber = docNumbers[prevIndex];

    const metadata = getMetadata();
    return metadata.invoice_index[prevDocNumber] ?? null;
  };

  // Get sorted document numbers
  const getSortedInvoiceNumbers = (): string[] => {
    return getSortedDocumentNumbers();
  };

  // Search invoices with filters
  interface SearchFilters {
    searchQuery?: string;
    customerFilter?: string;
    statusFilter?: 'all' | 'draft' | 'saved' | 'posted';
    minTotal?: number;
    maxTotal?: number;
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

  const searchInvoices = (filters: SearchFilters): SearchResult[] => {
    const invoices = getInvoicesFromStorage();
    const results: SearchResult[] = [];

    invoices.forEach((invoice, invoiceId) => {
      // Skip if not saved
      if (filters.statusFilter !== 'all' && invoice.status !== filters.statusFilter) {
        return;
      }

      // Search query filter (document_number or customer_name)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesDocNumber = (invoice.document_number ?? '').toLowerCase().includes(query);
        const matchesCustomer = (invoice.customer_name_ar ?? '').toLowerCase().includes(query);

        if (!matchesDocNumber && !matchesCustomer) {
          return;
        }
      }

      // Customer filter
      if (filters.customerFilter && invoice.customer_name_ar !== filters.customerFilter) {
        return;
      }

      // Total range filter
      const total = invoice.total ?? 0;
      if (filters.minTotal !== undefined && total < filters.minTotal) {
        return;
      }
      if (filters.maxTotal !== undefined && total > filters.maxTotal) {
        return;
      }

      // Calculate quantity
      const quantity = (invoice.line_items ?? []).reduce((sum, item) => sum + item.quantity, 0);

      results.push({
        invoiceId,
        document_number: invoice.document_number ?? '',
        invoice_date: invoice.invoice_date ?? '',
        customer_name_ar: invoice.customer_name_ar ?? '',
        account_code: invoice.account_code ?? '',
        account_name: invoice.account_name ?? '',
        mobile: invoice.mobile ?? '',
        total,
        quantity,
        status: invoice.status ?? 'draft',
      });
    });

    // Sort by document_number descending (newest first)
    results.sort((a, b) => {
      const numA = parseInt(a.document_number, 10);
      const numB = parseInt(b.document_number, 10);
      return numB - numA;
    });

    return results;
  };

  // Get invoice by document number
  const getInvoiceByDocumentNumber = (docNumber: string): Partial<Invoice> | null => {
    const metadata = getMetadata();
    const invoiceId = metadata.invoice_index[docNumber];
    if (!invoiceId) return null;
    return getInvoice(invoiceId);
  };

  // Get metadata
  const getMetadataInfo = (): InvoicesMetadata => {
    return getMetadata();
  };

  return {
    saveInvoice,
    getInvoice,
    deleteInvoice,
    getAll,
    getNextInvoiceId,
    getPreviousInvoiceId,
    getSortedInvoiceNumbers,
    searchInvoices,
    getInvoiceByDocumentNumber,
    getMetadata: getMetadataInfo,
  };
};
