import { useMemo, useCallback } from 'react';
import { useInvoiceStorage } from '../../../hooks/useInvoiceStorage';
import { GenericSearchModal, ColumnConfig } from '../../../components/GenericSearchModal';

interface InvoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInvoice: (invoiceId: string, documentNumber: string) => void;
}

interface InvoiceSearchResult {
  invoiceId: string;
  document_number: string;
  invoice_date: string;
  customer_name_ar: string;
  account_code: string;
  account_name: string;
  mobile: string;
  total: number;
  quantity: number;
  status: 'saved' | 'draft' | 'posted';
}

export default function InvoiceSearchModal({
  isOpen,
  onClose,
  onSelectInvoice,
}: InvoiceSearchModalProps) {
  const { searchInvoices } = useInvoiceStorage();

  // Columns configuration
  const columns: ColumnConfig<InvoiceSearchResult>[] = useMemo(
    () => [
      {
        field: 'document_number',
        label: 'رقم الفاتورة',
      },
      {
        field: 'invoice_date',
        label: 'التاريخ',
      },
      {
        field: 'account_code',
        label: 'رقم الحساب',
      },
      {
        field: 'account_name',
        label: 'اسم الحساب',
      },
      {
        field: 'mobile',
        label: 'رقم الجوال',
      },
      {
        field: 'quantity',
        label: 'الكمية',
        align: 'center',
      },
      {
        field: 'total',
        label: 'المجموع',
        align: 'left',
        formatter: (value: number) => value.toFixed(2),
      },
    ],
    []
  );

  // Async search function
  const handleSearch = useCallback(
    async (query: string, filters: Record<string, any>): Promise<InvoiceSearchResult[]> => {
      const statusFilter = (filters.status || 'saved') as 'all' | 'saved' | 'draft';
      return searchInvoices({
        searchQuery: query,
        statusFilter,
      }) as InvoiceSearchResult[];
    },
    [searchInvoices]
  );

  // Handle selection
  const handleSelect = useCallback(
    (invoice: InvoiceSearchResult) => {
      onSelectInvoice(invoice.invoiceId, invoice.document_number);
    },
    [onSelectInvoice]
  );

  return (
    <GenericSearchModal<InvoiceSearchResult>
      isOpen={isOpen}
      onClose={onClose}
      onSelect={handleSelect}
      title="عرض الفواتير"
      searchPlaceholder="ابحث برقم الفاتورة أو اسم العميل..."
      onSearch={handleSearch}
      debounceMs={300}
      columns={columns}
      rowKeyField="invoiceId"
      selectFirstByDefault={true}
      acceptButtonLabel="فتح"
      closeButtonLabel="إغلاق"
      noResultsMessage="لا توجد فواتير"
      emptyStateMessage="ابدأ بالبحث عن فاتورة"
      filters={[
        {
          id: 'status',
          label: 'الحالة',
          type: 'select',
          options: [
            { value: 'saved', label: 'محفوظة' },
            { value: 'draft', label: 'مسودة' },
            { value: 'all', label: 'الكل' },
          ],
          value: 'saved',
          onChange: () => {}, // Handled through search callback
        },
      ]}
    />
  );
}
