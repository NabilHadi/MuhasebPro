import ManagementButtons, { ManagementButton } from '../components/ManagementButtons';

export default function InventoryManagement() {
  const buttons: ManagementButton[] = [
    {
      id: 'units-of-measure',
      icon: '📏',
      title: 'وحدات القياس',
      description: 'إدارة وحدات القياس والتحويلات',
      path: '/units-of-measure',
      tabTitle: 'وحدات القياس',
    },
    {
      id: 'units-of-measure-categories',
      icon: '📂📏',
      title: 'فئات وحدات القياس',
      description: 'إدارة فئات وحدات القياس',
      path: '/units-of-measure/categories',
      tabTitle: 'فئات وحدات القياس',
    },
    {
      id: 'products',
      icon: '📦',
      title: 'المنتجات',
      description: 'إدارة المنتجات والأصناف',
      path: '/products',
      tabTitle: 'المنتجات',
      isDisabled: true,
    },
    {
      id: 'product-categories',
      icon: '📦🏷️',
      title: 'فئات المنتجات',
      description: 'إدارة فئات وتصنيفات المنتجات',
      path: '/product-categories',
      tabTitle: 'فئات المنتجات',
      isDisabled: true,
    },
    {
      id: 'warehouses',
      icon: '🏢',
      title: 'المخازن',
      description: 'إدارة المخازن',
      path: '/warehouses',
      tabTitle: 'المخازن',
      isDisabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المخزون</h1>
      </div>

      {/* Quick Access Buttons */}
      <ManagementButtons buttons={buttons} columns={3} />
    </div>
  );
}
