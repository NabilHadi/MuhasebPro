import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats] = useState({
    productCount: 156,
    categoryCount: 12,
    accountCount: 48,
    journalCount: 2843,
    totalDebit: 1250000,
    totalCredit: 1250000,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 p-2">
      {/* Header with Date & Time */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">القائمة الرئيسية</h1>
          <p className="text-gray-500">{formatDate(currentTime)}</p>
        </div>
        <div className="text-left w-[10rem]">
          <div className="text-3xl font-bold text-blue-600">{formatTime(currentTime)}</div>
          <p className="text-sm text-gray-500">التوقيت المحلي</p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Card */}
        <div className="card border border-gray-100 bg-white hover:shadow-md transition-shadow">
          <div className="flex-between mb-3">
            <div className="text-2xl">📦</div>
            <div className="rounded-full px-3 py-1 text-xs bg-blue-100 text-blue-700">إجمالي</div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">عدد المنتجات</h3>
          <p className="text-2xl font-bold text-blue-600">{stats?.productCount || 0}</p>
          <div className="text-xs text-gray-500 mt-2">المنتجات النشطة</div>
        </div>

        {/* Categories Card */}
        <div className="card border border-gray-100 bg-white hover:shadow-md transition-shadow">
          <div className="flex-between mb-3">
            <div className="text-2xl">🏷️</div>
            <div className="rounded-full px-3 py-1 text-xs bg-green-100 text-green-700">إجمالي</div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">عدد الفئات</h3>
          <p className="text-2xl font-bold text-green-600">{stats?.categoryCount || 0}</p>
          <div className="text-xs text-gray-500 mt-2">فئات النشطة</div>
        </div>

        {/* Accounts Card */}
        <div className="card border border-gray-100 bg-white hover:shadow-md transition-shadow">
          <div className="flex-between mb-3">
            <div className="text-2xl">🏦</div>
            <div className="rounded-full px-3 py-1 text-xs bg-purple-100 text-purple-700">إجمالي</div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">عدد الحسابات</h3>
          <p className="text-2xl font-bold text-purple-600">{stats?.accountCount || 0}</p>
          <div className="text-xs text-gray-500 mt-2">حسابات نشطة</div>
        </div>

        {/* Journal Entries Card */}
        <div className="card border border-gray-100 bg-white hover:shadow-md transition-shadow">
          <div className="flex-between mb-3">
            <div className="text-2xl">📝</div>
            <div className="rounded-full px-3 py-1 text-xs bg-orange-100 text-orange-700">إجمالي</div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">عدد القيود</h3>
          <p className="text-2xl font-bold text-orange-600">{stats?.journalCount || 0}</p>
          <div className="text-xs text-gray-500 mt-2">قيود محاسبية</div>
        </div>
      </div>
    </div>
  );
}
