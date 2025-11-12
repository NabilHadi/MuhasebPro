import { useNavigate } from 'react-router-dom';
import { useTabStore } from '../store/tabStore';

export default function AccountsManagement() {
  const navigate = useNavigate();
  const { addTab } = useTabStore();

  const handleOpenAccounts = () => {
    const tabId = `accounts-${Date.now()}`;
    addTab({
      id: tabId,
      title: 'الحسابات',
      path: '/accounts',
      icon: '🏦',
    });
    navigate('/accounts');
  };

  const handleOpenJournalEntries = () => {
    const tabId = `journal-entries-${Date.now()}`;
    addTab({
      id: tabId,
      title: 'القيود المحاسبية',
      path: '/journal-entries',
      icon: '📝',
    });
    navigate('/journal-entries');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الحسابات</h1>
      </div>

      

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleOpenAccounts}
          className="card hover:shadow-lg transition cursor-pointer p-6 text-center"
        >
          <div className="text-4xl mb-3">🏦</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">الحسابات</h2>
          <p className="text-gray-600 text-sm">إدارة الحسابات والمخطط المحاسبي</p>
        </button>

        <button
          onClick={handleOpenJournalEntries}
          className="card hover:shadow-lg transition cursor-pointer p-6 text-center"
        >
          <div className="text-4xl mb-3">📝</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">القيود المحاسبية</h2>
          <p className="text-gray-600 text-sm">تسجيل والعرض القيود المحاسبية</p>
        </button>
      </div>
    </div>
  );
}
