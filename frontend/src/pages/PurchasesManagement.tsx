import { useNavigate } from 'react-router-dom';
import { useTabStore } from '../store/tabStore';

export default function PurchasesManagement() {
  const navigate = useNavigate();
  const { addTab } = useTabStore();

  const handleOpenSuppliers = () => {
    const tabId = `suppliers-${Date.now()}`;
    addTab({
      id: tabId,
      title: 'الموردون',
      path: '/suppliers',
      icon: '🏭',
    });
    navigate('/suppliers');
  };

  const handleOpenPurchases = () => {
    const tabId = `purchases-${Date.now()}`;
    addTab({
      id: tabId,
      title: 'المشتريات',
      path: '/purchases-detail',
      icon: '📥',
    });
    navigate('/purchases-detail');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المشتريات</h1>
      </div>

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleOpenSuppliers}
          className="card hover:shadow-lg transition cursor-pointer p-6 text-center"
        >
          <div className="text-4xl mb-3">🏭</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">الموردون</h2>
          <p className="text-gray-600 text-sm">إدارة الموردين والعقود</p>
        </button>

        <button
          onClick={handleOpenPurchases}
          className="card hover:shadow-lg transition cursor-pointer p-6 text-center"
        >
          <div className="text-4xl mb-3">📥</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">المشتريات</h2>
          <p className="text-gray-600 text-sm">تسجيل والعرض فواتير المشتريات</p>
        </button>
      </div>
    </div>
  );
}
