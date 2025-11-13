import ManagementButtons, { ManagementButton } from '../components/ManagementButtons';

export default function PurchasesManagement() {
  const buttons: ManagementButton[] = [
    {
      id: 'suppliers',
      icon: '🏭',
      title: 'الموردون',
      description: 'إدارة الموردين والعقود',
      path: '/suppliers',
      tabTitle: 'الموردون',
      isDisabled: true,
    },
    {
      id: 'purchases',
      icon: '📥',
      title: 'المشتريات',
      description: 'تسجيل والعرض فواتير المشتريات',
      path: '/purchases-detail',
      tabTitle: 'المشتريات',
      isDisabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المشتريات</h1>
      </div>

      {/* Quick Access Buttons */}
      <ManagementButtons buttons={buttons} columns={2} />
    </div>
  );
}
