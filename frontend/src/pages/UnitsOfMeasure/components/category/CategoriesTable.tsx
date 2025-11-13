import DataTable, { TableColumn, TableAction } from '../../../../components/DataTable';
import { Category } from '../../hooks/useCategories';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

export default function CategoriesTable({
  categories,
  onEdit,
  onToggleStatus,
}: CategoriesTableProps) {
  const columns: TableColumn<Category>[] = [
    {
      key: 'name_ar',
      label: 'الاسم',
      render: (_, category) => (
        <div>
          <p>{category.name_ar}</p>
          {category.name_en && <p className="text-sm text-gray-600">{category.name_en}</p>}
        </div>
      ),
    },
    {
      key: 'description',
      label: 'الوصف',
      render: (desc) => desc || '-',
    },
    {
      key: 'is_active',
      label: 'الحالة',
      render: (isActive) => (
        <span className={`px-3 py-1 rounded text-sm font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isActive ? 'نشطة' : 'معطلة'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'تاريخ الإنشاء',
      render: (date) => new Date(date).toLocaleDateString('ar-EG'),
    },
  ];

  const actions: TableAction<Category>[] = [
    {
      label: 'تعديل',
      onClick: onEdit,
      className: 'px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm font-medium',
    },
    {
      label: (category) => category.is_active ? 'تعطيل' : 'تفعيل',
      onClick: onToggleStatus,
      className: (category) =>
        category.is_active
          ? 'px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium'
          : 'px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm font-medium',
    },
  ];

  return (
    <DataTable
      data={categories}
      columns={columns}
      actions={actions}
      emptyMessage="لم يتم العثور على فئات"
    />
  );
}
