import DataTable, { TableColumn, TableAction } from '../../../../components/DataTable';
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

  const columns: TableColumn<Product>[] = [
    {
      key: 'product_code',
      label: 'الرمز',
      align: 'right',
    },
    {
      key: 'product_name_ar',
      label: 'الاسم',
      render: (_, product) => (
        <div>
          <div>{product.product_name_ar}</div>
          {product.product_name_en && <div className="text-xs text-gray-500">{product.product_name_en}</div>}
        </div>
      ),
    },
    {
      key: 'cost',
      label: 'التكلفة',
      render: (cost) => {
        return cost ? Number(cost).toFixed(2) : '--'
      },
      align: 'center',
    },
    {
      key: 'profit_ratio',
      label: 'نسبة الربح %',
      render: (ratio) => ratio ? Number(ratio).toFixed(2) : '--',
      align: 'center',
    },
    {
      key: 'selling_price',
      label: 'سعر البيع',
      render: (price) => price ? Number(price).toFixed(2) : '--',
      align: 'center',
    },
    {
      key: 'product_group',
      label: 'المجموعة',
      render: (group) => group || '--',
    },
    {
      key: 'classification_1',
      label: 'التصنيف 1',
      render: (classification) => classification || '--',
    },
    {
      key: 'category_id',
      label: 'الفئة',
      render: (categoryId) => getCategoryName(categoryId),
    },
    {
      key: 'product_type',
      label: 'النوع',
      render: (type) => getTypeBadge(type),
    },
    {
      key: 'is_active',
      label: 'الحالة',
      render: (isActive) => getStatusBadge(isActive),
    },
  ];

  const actions: TableAction<Product>[] = [
    {
      label: 'تعديل',
      icon: '✏️',
      onClick: onEdit,
      className: 'px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600',
    },
    {
      label: 'حذف',
      icon: '🗑️',
      onClick: (product) => onDelete(product.id),
      className: 'px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600',
    },
  ];

  return (
    <DataTable
      data={products}
      columns={columns}
      actions={actions}
      loading={loading}
      emptyMessage="لا توجد منتجات"
    />
  );
}
