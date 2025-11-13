import { Product, ProductCategory } from '../../types';

interface ProductsTableProps {
  products: Product[];
  categories: ProductCategory[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductsTable({
  products,
  categories,
  loading,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const getCategoryName = (categoryId: number | null | undefined) => {
    if (!categoryId) return '--';
    return categories.find((c) => c.id === categoryId)?.category_name_ar || '--';
  };

  const getTypeBadge = (type: string) => {
    const badgeClasses = {
      Stockable: 'bg-blue-100 text-blue-800',
      Service: 'bg-purple-100 text-purple-800',
    };
    const labels = {
      Stockable: 'مخزون',
      Service: 'خدمة',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClasses[type as keyof typeof badgeClasses] || 'bg-gray-100'}`}>
        {labels[type as keyof typeof labels] || type}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isActive ? 'نشط' : 'معطل'}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-8 text-gray-500">لا توجد منتجات</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-right text-sm font-semibold">الرمز</th>
            <th className="px-6 py-3 text-right text-sm font-semibold">الاسم</th>
            <th className="px-6 py-3 text-right text-sm font-semibold">الفئة</th>
            <th className="px-6 py-3 text-right text-sm font-semibold">النوع</th>
            <th className="px-6 py-3 text-right text-sm font-semibold">الحالة</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-3 text-sm font-mono">{product.product_code}</td>
              <td className="px-6 py-3 text-sm">
                <div>{product.product_name_ar}</div>
                {product.product_name_en && <div className="text-xs text-gray-500">{product.product_name_en}</div>}
              </td>
              <td className="px-6 py-3 text-sm">{getCategoryName(product.category_id)}</td>
              <td className="px-6 py-3 text-sm">{getTypeBadge(product.product_type)}</td>
              <td className="px-6 py-3 text-sm">{getStatusBadge(product.is_active)}</td>
              <td className="px-6 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="inline-block px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                >
                  ✏️ تعديل
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="inline-block px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  🗑️ حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
