import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    // Show message for 2 seconds then redirect
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-800 mb-4">404</div>
        <h1 className="text-3xl font-semibold text-gray-700 mb-2">الصفحة غير موجودة</h1>
        <p className="text-gray-600 mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
        <p className="text-gray-500 text-sm">إعادة التوجيه إلى الصفحة الرئيسية...</p>
        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            العودة إلى الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}
