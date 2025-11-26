import { useState, useCallback, useMemo, useEffect } from 'react';
import { Invoice, InvoiceLineItem } from '../types';
import { useInvoiceStorage } from '../../../hooks/useInvoiceStorage';
import { useParams } from 'react-router-dom';

export function useInvoiceState() {
  const { invoiceId } = useParams<{ invoiceId?: string }>();
  const { getInvoice: getInvoiceFromStorage } = useInvoiceStorage();

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
  const getInitialInvoice = useCallback((): Invoice => {
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
  }, [invoiceId, getInvoiceFromStorage, initializeLineItems]);

  const [invoice, setInvoice] = useState<Invoice>(() => getInitialInvoice());
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [phase, setPhase] = useState<'viewing' | 'editing'>('viewing');

  // Reset state when invoiceId changes
  useEffect(() => {
    setInvoice(getInitialInvoice());
    setPhase('viewing');
  }, [invoiceId, getInitialInvoice]);

  const handleHeaderStateChange = useCallback(
    (fieldName: string, value: any) => {
      setInvoice((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    },
    []
  );

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

  return {
    invoice,
    setInvoice,
    showSearchModal,
    setShowSearchModal,
    phase,
    setPhase,
    initializeLineItems,
    getInitialInvoice,
    handleHeaderStateChange,
    handleInvoiceFieldChange,
    handleLineItemChange,
    handleAddLineItem,
    handleRemoveLineItem,
  };
}
