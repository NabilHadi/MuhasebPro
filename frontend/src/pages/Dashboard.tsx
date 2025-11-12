import { useEffect, useState } from 'react';
import apiClient from '../services/api';
import { DashboardStats, Product } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadStats();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/reports/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats', error);
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
        <div className="text-left">
          <div className="text-3xl font-bold text-blue-600">{formatTime(currentTime)}</div>
          <p className="text-sm text-gray-500">التوقيت المحلي</p>
        </div>
      </div>

      {/* Main Stats Cards - muted palette */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales Card */}
        <div className="card border border-gray-100 bg-white hover:shadow-md transition-shadow">
          <div className="flex-between mb-3">
            <div className="text-2xl">💰</div>
            <div className="rounded-full px-3 py-1 text-xs bg-gray-100 text-gray-700">اليوم</div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">إجمالي المبيعات</h3>
          <p className="text-xl font-semibold text-gray-800 mb-0">{formatCurrency(stats?.totalSalesToday || 0)}</p>
          <div className="text-xs text-gray-500 mt-2">📈 مقارنة بالماضي</div>
        </div>

        {/* Purchases Card */}
        <div className="card border border-gray-100 bg-white hover:shadow-md transition-shadow">
          <div className="flex-between mb-3">
            <div className="text-2xl">🛒</div>
            <div className="rounded-full px-3 py-1 text-xs bg-gray-100 text-gray-700">اليوم</div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">إجمالي المشتريات</h3>
          <p className="text-xl font-semibold text-gray-800 mb-0">{formatCurrency(stats?.totalPurchasesToday || 0)}</p>
          <div className="text-xs text-gray-500 mt-2">📊 مقارنة بالماضي</div>
        </div>

        {/* Products Card */}
        <div className="card border border-gray-100 bg-white hover:shadow-md transition-shadow">
          <div className="flex-between mb-3">
            <div className="text-2xl">📦</div>
            <div className="rounded-full px-3 py-1 text-xs bg-gray-100 text-gray-700">إجمالي</div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">عدد المنتجات</h3>
          <p className="text-xl font-semibold text-gray-800 mb-0">{stats?.productCount || 0}</p>
          <div className="text-xs text-gray-500 mt-2">متوفر: {stats?.productCount ? Math.floor(stats.productCount * 0.85) : 0}</div>
        </div>

        {/* Low Stock Card */}
        <div className="card border border-gray-100 bg-white hover:shadow-md transition-shadow">
          <div className="flex-between mb-3">
            <div className="text-2xl">⚠️</div>
            <div className="rounded-full px-3 py-1 text-xs bg-gray-100 text-gray-700">تحذير</div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">تحذيرات المخزون</h3>
          <p className="text-xl font-semibold text-gray-800 mb-0">{stats?.lowStockProducts?.length || 0}</p>
          <div className="text-xs text-gray-500 mt-2">🔔 يوصى بإعادة الطلب</div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl mb-2">👥</div>
          <p className="text-gray-600 text-sm">العملاء</p>
          <p className="text-xl font-bold text-gray-800">0</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl mb-2">🏢</div>
          <p className="text-gray-600 text-sm">الموردين</p>
          <p className="text-xl font-bold text-gray-800">0</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl mb-2">📝</div>
          <p className="text-gray-600 text-sm">فواتير اليوم</p>
          <p className="text-xl font-bold text-gray-800">0</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl mb-2">💵</div>
          <p className="text-gray-600 text-sm">الأرباح المتوقعة</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(0)}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="card">
          <div className="flex-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">⚠️ منتجات بمخزون منخفض</h2>
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
              <span className="badge-danger">{stats.lowStockProducts.length} منتج</span>
            )}
          </div>
          
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.lowStockProducts.map((product: Product) => (
                <div key={product.id} className="flex-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">الرمز: {product.sku}</p>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-red-600">{product.quantity}</div>
                    <div className="text-xs text-gray-500">الحد: {product.minimumStock}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">✅</div>
              <p>جميع المنتجات بمخزون كافٍ</p>
            </div>
          )}
        </div>

        {/* Recent Activity / Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ إجراءات سريعة</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-primary flex items-center justify-center gap-2 py-3">
                <span>➕</span>
                <span>فاتورة بيع</span>
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 py-3">
                <span>🛒</span>
                <span>فاتورة شراء</span>
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 py-3">
                <span>👤</span>
                <span>عميل جديد</span>
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 py-3">
                <span>📦</span>
                <span>منتج جديد</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 حالة النظام</h2>
            <div className="space-y-3">
              <div className="flex-between">
                <span className="text-gray-600">حالة الاتصال</span>
                <span className="badge-success">متصل 🟢</span>
              </div>
              <div className="flex-between">
                <span className="text-gray-600">قاعدة البيانات</span>
                <span className="badge-success">نشط ✅</span>
              </div>
              <div className="flex-between">
                <span className="text-gray-600">آخر نسخ احتياطي</span>
                <span className="text-sm text-gray-500">منذ ساعتين</span>
              </div>
              <div className="flex-between">
                <span className="text-gray-600">مساحة التخزين</span>
                <span className="text-sm text-gray-500">78% متاح</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
