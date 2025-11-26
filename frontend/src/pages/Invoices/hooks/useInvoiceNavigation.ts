import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTabStore } from '../../../store/tabStore';
import { useInvoiceStorage } from '../../../hooks/useInvoiceStorage';
import useToast from '../../../hooks/useToast';

interface UseInvoiceNavigationProps {
  invoiceId?: string;
}

export function useInvoiceNavigation({ invoiceId }: UseInvoiceNavigationProps) {
  const navigate = useNavigate();
  const { switchTab } = useTabStore();
  const { getNextInvoiceId, getPreviousInvoiceId } = useInvoiceStorage();
  const { showError } = useToast();

  const handleNextInvoice = useCallback(() => {
    if (!invoiceId) {
      showError('يجب حفظ الفاتورة أولاً');
      return;
    }

    const nextInvoiceId = getNextInvoiceId(invoiceId);
    if (!nextInvoiceId) {
      showError('لا توجد فاتورة تالية');
      return;
    }

    switchTab(nextInvoiceId);
    navigate(`/invoices/${nextInvoiceId}`);
  }, [invoiceId, getNextInvoiceId, switchTab, navigate, showError]);

  const handlePreviousInvoice = useCallback(() => {
    if (!invoiceId) {
      showError('يجب حفظ الفاتورة أولاً');
      return;
    }

    const prevInvoiceId = getPreviousInvoiceId(invoiceId);
    if (!prevInvoiceId) {
      showError('لا توجد فاتورة سابقة');
      return;
    }

    switchTab(prevInvoiceId);
    navigate(`/invoices/${prevInvoiceId}`);
  }, [invoiceId, getPreviousInvoiceId, switchTab, navigate, showError]);

  const handleSelectFromSearch = useCallback(
    (selectedInvoiceId: string) => {
      switchTab(selectedInvoiceId);
      navigate(`/invoices/${selectedInvoiceId}`);
    },
    [switchTab, navigate]
  );

  return {
    handleNextInvoice,
    handlePreviousInvoice,
    handleSelectFromSearch,
  };
}
