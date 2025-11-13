import DataTable, { TableColumn, TableAction } from '../../../../components/DataTable';
import { ProductCategory } from '../../types';

interface CategoriesTableProps {
  categories: ProductCategory[];
  loading: boolean;
  onEdit: (category: ProductCategory) => void;
  onDelete: (id: number) => void;
}

export default function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isActive ? 'نشط' : 'معطل'}
      </span>
    );
  };

  const columns: TableColumn<ProductCategory>[] = [
    {
      key: 'category_number',
      label: 'رقم الفئة',
    },
    {
      key: 'category_name_ar',
      label: 'الاسم (عربي)',
    },
    {
      key: 'category_name_en',
      label: 'الاسم (إنجليزي)',
      render: (name) => name || '--',
    },
    {
      key: 'description',
      label: 'الوصف',
      render: (desc) => desc || '--',
    },
    {
      key: 'is_active',
      label: 'الحالة',
      render: (isActive) => getStatusBadge(isActive),
    },
    {
      key: 'created_at',
      label: 'التاريخ',
      render: (date) => new Date(date).toLocaleDateString('ar-EG'),
    },
  ];

  const actions: TableAction<ProductCategory>[] = [
    {
      label: 'تعديل',
      onClick: onEdit,
      className: 'px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition mr-2',
    },
    {
      label: 'حذف',
      onClick: (category) => onDelete(category.id),
      className: 'px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition',
    },
  ];

  return (
    <DataTable
      data={categories}
      columns={columns}
      actions={actions}
      loading={loading}
      emptyMessage="لا توجد فئات"
    />
  );
}
