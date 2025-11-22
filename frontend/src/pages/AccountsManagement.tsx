import ManagementButtons, { ManagementButton } from '../components/ManagementButtons';

export default function AccountsManagement() {
  const buttons: ManagementButton[] = [
    {
      id: 'foundational-accounts',
      icon: '🏦',
      title: 'حسابات التأسيس',
      description: 'إدارة حسابات التأسيس',
      path: '/accounts/foundational',
      tabTitle: 'حسابات التأسيس',
    },
    {
      id: 'accounts',
      icon: '🏦',
      title: 'الحسابات',
      description: 'إدارة الحسابات والمخطط المحاسبي',
      path: '/accounts',
      tabTitle: 'الحسابات',
    },
    {
      id: 'journal-entries',
      icon: '📝',
      title: 'القيود المحاسبية',
      description: 'تسجيل والعرض القيود المحاسبية',
      path: '/journal-entries',
      tabTitle: 'القيود المحاسبية',
      isDisabled: true,
    },
  ];

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الحسابات</h1>
      </div>

      {/* Quick Access Buttons */}
      <ManagementButtons buttons={buttons} columns={3} />
    </div>
  );
}
