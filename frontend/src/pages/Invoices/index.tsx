import { useParams } from 'react-router-dom';
import InvoiceHeader from './components/InvoiceHeader';
import InvoiceLineItemsTable from './components/InvoiceLineItemsTable';
import InvoiceSummary from './components/InvoiceSummary';
import InvoiceSearchModal from './components/InvoiceSearchModal';
import InvoiceActionButtons from './components/InvoiceActionButtons';
import useToast from '../../hooks/useToast';
import ToastContainer from '../../components/Toast';
import { useInvoiceStorage } from '../../hooks/useInvoiceStorage';
import { useInvoiceState } from './hooks/useInvoiceState';
import { useInvoiceOperations } from './hooks/useInvoiceOperations';
import { useInvoiceNavigation } from './hooks/useInvoiceNavigation';

export default function SalesInvoice() {
  const { invoiceId } = useParams<{ invoiceId?: string }>();
  const { toasts, removeToast, showError } = useToast();
  const { getSortedInvoiceNumbers } = useInvoiceStorage();

  // Use extracted hooks for state management
  const {
    invoice,
    setInvoice,
    phase,
    setPhase,
    showSearchModal,
    setShowSearchModal,
    handleHeaderStateChange,
    handleInvoiceFieldChange,
    handleLineItemChange,
    handleAddLineItem,
    handleRemoveLineItem,
    getInitialInvoice,
  } = useInvoiceState();

  // Use extracted hooks for operations
  const {
    handleSaveInvoice,
    handleAddNewInvoice,
    handleEditInvoice,
    handleUndo,
    generateDocumentNumber,
    isButtonEnabled,
  } = useInvoiceOperations({
    invoiceId,
    invoice,
    phase,
    setPhase,
    setInvoice,
    getInitialInvoice,
    getSortedInvoiceNumbers,
  });

  // Use extracted hooks for navigation
  const {
    handleNextInvoice,
    handlePreviousInvoice,
    handleSelectFromSearch,
  } = useInvoiceNavigation({
    invoice,
  });

  return (
    <div className="flex-1 flex flex-col w-full h-full">
      <InvoiceActionButtons
        isButtonEnabled={isButtonEnabled}
        onAddNewInvoice={handleAddNewInvoice}
        onEditInvoice={handleEditInvoice}
        onShowSearch={() => setShowSearchModal(true)}
        onNextInvoice={handleNextInvoice}
        onPreviousInvoice={handlePreviousInvoice}
        onSaveInvoice={handleSaveInvoice}
        onUndo={handleUndo}
      />

      {/* Invoice Header */}
      <InvoiceHeader
        invoice={invoice}
        onFieldChange={handleInvoiceFieldChange}
        onHeaderStateChange={handleHeaderStateChange}
        onGenerateDocumentNumber={generateDocumentNumber}
        phase={phase}
      />

      {/* Line Items Table - Scrollable */}
      <InvoiceLineItemsTable
        items={invoice.line_items || []}
        onItemChange={handleLineItemChange}
        onAddItem={handleAddLineItem}
        onRemoveItem={handleRemoveLineItem}
        onShowError={showError}
        phase={phase}
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
