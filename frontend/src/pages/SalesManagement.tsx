

import ManagementButtons, { ManagementButton } from '../components/ManagementButtons';

export default function SalesManagement() {
  const buttons: ManagementButton[] = [
    {
      id: 'invoices',
      icon: '🧾',
      title: 'الفواتير',
      description: 'إدارة الفواتير والمبيعات',
      path: '/invoices',
      tabTitle: 'الفواتير',
      isDisabled: true,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المبيعات</h1>
      </div>

      {/* Quick Access Buttons */}
      <ManagementButtons buttons={buttons} columns={2} />
    </div>
  );
}
