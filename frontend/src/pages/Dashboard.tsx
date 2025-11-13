import { useEffect, useState } from 'react';
import apiClient from '../services/api';
import { useTabNavigation } from '../hooks/useTabNavigation';

interface DashboardStats {
  productCount: number;
  categoryCount: number;
  accountCount: number;
  journalCount: number;
  totalDebit: number;
  totalCredit: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { openTab } = useTabNavigation();

  useEffect(() => {
    loadStats();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadStats = async () => {
    try {
      const dashboardRes = await apiClient.get('/reports/dashboard');
      setStats(dashboardRes.data);
    } catch (error) {
      console.error('Failed to load stats', error);
      // Set defaults
      setStats({
        productCount: 0,
        categoryCount: 0,
        accountCount: 0,
        journalCount: 0,
        totalDebit: 0,
        totalCredit: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { 
      style: 'currency', 
      currency: 'SAR' 
    }).format(amount);
  };

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

  if (loading) {
    return (
      <div className="flex-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ إجراءات سريعة</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => openTab({
                id: 'products-tab',
                title: 'المنتجات',
                path: '/products',
                icon: '📦',
              })} className="btn-primary flex items-center justify-center gap-2 py-3 hover:shadow-md transition">
                <span>📦</span>
                <span>المنتجات</span>
              </button>
              <button onClick={() => openTab({
                id: 'categories-tab',
                title: 'الفئات',
                path: '/product-categories',
                icon: '🏷️',
              })} className="btn-secondary flex items-center justify-center gap-2 py-3 hover:shadow-md transition">
                <span>🏷️</span>
                <span>الفئات</span>
              </button>
              <button onClick={() => openTab({
                id: 'accounts-tab',
                title: 'الحسابات',
                path: '/accounts',
                icon: '🏦',
              })} className="btn-secondary flex items-center justify-center gap-2 py-3 hover:shadow-md transition">
                <span>🏦</span>
                <span>الحسابات</span>
              </button>
              <button onClick={() => openTab({
                id: 'journals-tab',
                title: 'القيود',
                path: '/journal-entries',
                icon: '📝',
              })} className="btn-secondary flex items-center justify-center gap-2 py-3 hover:shadow-md transition">
                <span>📝</span>
                <span>القيود</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
