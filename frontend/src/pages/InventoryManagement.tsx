import { useNavigate } from 'react-router-dom';
import { useTabStore } from '../store/tabStore';

export default function InventoryManagement() {
  const navigate = useNavigate();
  const { addTab } = useTabStore();

  const handleOpenProducts = () => {
    const tabId = `products-${Date.now()}`;
    addTab({
      id: tabId,
      title: 'المنتجات',
      path: '/products',
      icon: '📦',
    });
    navigate('/products');
  };

  const handleOpenCategories = () => {
    const tabId = `product-categories-${Date.now()}`;
    addTab({
      id: tabId,
      title: 'فئات المنتجات',
      path: '/product-categories',
      icon: '🏷️',
    });
    navigate('/product-categories');
  };

  // const handleOpenWarehouses = () => {
  //   const tabId = `warehouses-${Date.now()}`;
  //   addTab({
  //     id: tabId,
  //     title: 'المستودعات',
  //     path: '/warehouses',
  //     icon: '🏢',
  //   });
  //   navigate('/warehouses');
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المخزون</h1>
      </div>

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleOpenProducts}
          className="card hover:shadow-lg transition cursor-pointer p-6 text-center"
        >
          <div className="text-4xl mb-3">📦</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">المنتجات</h2>
          <p className="text-gray-600 text-sm">إدارة المنتجات والأصناف </p>
        </button>

        <button
          onClick={handleOpenCategories}
          className="card hover:shadow-lg transition cursor-pointer p-6 text-center"
        >
          <div className="text-4xl mb-3">🏷️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">فئات المنتجات</h2>
          <p className="text-gray-600 text-sm">إدارة فئات وتصنيفات المنتجات</p>
        </button>

        <button
          // onClick={handleOpenWarehouses}
          className="card hover:shadow-lg transition cursor-pointer p-6 text-center"
        >
          <div className="text-4xl mb-3">🏢</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">المستودعات</h2>
          <p className="text-gray-600 text-sm">إدارة المستودعات والأرصدة</p>
          <p className='text-black mt-2'>(قريبا)</p>
        </button>
      </div>
    </div>
  );
}
