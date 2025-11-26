import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTabStore } from '../../../store/tabStore';
import { useInvoiceStorage } from '../../../hooks/useInvoiceStorage';
import useToast from '../../../hooks/useToast';
import { Invoice } from '../types';

interface UseInvoiceNavigationProps {
  invoice: Invoice;
}

export function useInvoiceNavigation({ invoice }: UseInvoiceNavigationProps) {
  const navigate = useNavigate();
  const { switchTab } = useTabStore();
  const { getNextInvoiceId, getPreviousInvoiceId } = useInvoiceStorage();
  const { showError } = useToast();

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
