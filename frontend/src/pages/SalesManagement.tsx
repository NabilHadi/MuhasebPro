

import { useNavigate } from 'react-router-dom';
import ManagementButtons, { ManagementButton } from '../components/ManagementButtons';
import { useTabStore } from '../store/tabStore';

export default function SalesManagement() {
  const navigate = useNavigate();
  const { addTab, switchTab } = useTabStore();

  const handleOpenInvoice = () => {
    // Generate a unique ID for the new invoice tab
    const invoiceId = `invoice-${Date.now()}`;
    const invoicePath = `/invoices/${invoiceId}`;

    // Add a new tab for this invoice
    addTab({
      id: invoiceId,
      title: 'فاتورة جديدة',
      path: invoicePath,
      icon: '🧾',
    });

    // Switch to the new tab
    switchTab(invoiceId);

    // Navigate to the invoice
    navigate(invoicePath);
  };

  const buttons: ManagementButton[] = [
    {
      id: 'invoices',
      icon: '🧾',
      title: 'الفواتير',
      description: 'إدارة الفواتير والمبيعات',
      path: '/invoices',
      tabTitle: 'الفواتير',
      onClick: handleOpenInvoice,
    },
    {
      id: 'customers',
      icon: '👤',
      title: 'العملاء',
      description: 'إدارة بيانات العملاء',
      path: '/customers',
      tabTitle: 'العملاء',
      isDisabled: true,
    },
  ];

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المبيعات</h1>
      </div>

      {/* Quick Access Buttons */}
      <ManagementButtons buttons={buttons} columns={2} />
    </div>
  );
}
