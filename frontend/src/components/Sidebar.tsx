import { useNavigate as useReactNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useReactNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (href: string) => {
    // Direct navigation to management page without creating a tab
    // (sidebar stays visible, so no need to duplicate in tab bar)
    navigate(href);
  };

  const menuItems = [
    { label: 'القائمة الرئيسية', href: '/', icon: '📊' },
    { label: 'ادارة المخزون', href: '/inventory-management', icon: '📦' },
    { label: 'ادارة المشتريات', href: '/purchases-management', icon: '📥' },
    { label: 'ادارة المبيعات', href: '/sales-management', icon: '🛒' },
    { label: 'ادارة الحسابات', href: '/accounts-management', icon: '🏦' },
  ];
  
  return (
    <aside className="w-64 bg-color text-white shadow-lg flex flex-col ">
      <div className="p-6">
        <h2 className="text-2xl font-bold">محاسب برو</h2>
        <p className="text-blue-200 text-sm mt-2">نظام المحاسبة المتكامل</p>
      </div>

      <nav className='flex-1 border-t border-[#506f8c]'>
        {menuItems.map((item) => (
          <button
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-slate-800 transition rounded-lg text-left border-none bg-transparent cursor-pointer"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>


      <div className="p-4 border-t border-[#506f8c] flex flex-col space-y-2">
        <p className="text-sm text-blue-200">المستخدم الحالي</p>
        <p className="font-semibold">{user?.fullName}</p>
        <p className="text-xs text-blue-200">الدور: {user?.role}</p>
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            تسجيل الخروج
          </button>
      </div>
    </aside>
  );
}
