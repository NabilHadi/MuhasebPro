import DataTable, { TableColumn, TableAction } from '../../../../components/DataTable';
import { Unit } from '../../hooks/useUnits';

interface UnitsTableProps {
  units: Unit[];
  onEdit: (unit: Unit) => void;
  onToggleStatus: (unit: Unit) => void;
}

export default function UnitsTable({
  units,
  onEdit,
  onToggleStatus,
}: UnitsTableProps) {
  const columns: TableColumn<Unit>[] = [
    {
      key: 'name_ar',
      label: 'الاسم',
      render: (_, unit) => (
        <div>
          <p>{unit.name_ar}</p>
          {unit.name_en && <p className="text-sm text-gray-600">{unit.name_en}</p>}
        </div>
      ),
    },
    {
      key: 'short_name',
      label: 'الاختصار',
      render: (name) => <span className="font-mono font-semibold text-blue-600">{name}</span>,
    },
    {
      key: 'category_name_ar',
      label: 'الفئة',
      render: (name) => <span className="px-2 py-1 bg-gray-100 rounded text-xs">{name ?? 'غير محدد'}</span>,
    },
    {
      key: 'ratio_to_base',
      label: 'النسبة',
      render: (ratio) => (Number(ratio) || 0).toFixed(6),
    },
    {
      key: 'is_base',
      label: 'أساسية',
      render: (isBase) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${isBase ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {isBase ? 'نعم' : 'لا'}
        </span>
      ),
    },
  ];

  const actions: TableAction<Unit>[] = [
    {
      label: 'تعديل',
      onClick: onEdit,
      className: 'px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm font-medium',
    },
    {
      label: (unit) => unit.is_active ? 'تعطيل' : 'تفعيل',
      onClick: onToggleStatus,
      className: (unit) =>
        unit.is_active
          ? 'px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium'
          : 'px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm font-medium',
    },
  ];

  return (
    <DataTable
      data={units}
      columns={columns}
      actions={actions}
      emptyMessage="لم يتم العثور على وحدات قياس"
    />
  );
}
