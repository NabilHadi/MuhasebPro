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
  if (units.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>لم يتم العثور على وحدات قياس</p>
        </td>
      </tr>
    );
  }

  return (
    <>
      {units.map((unit) => (
        <tr key={unit.id} className="border-b hover:bg-gray-50">
          <td className="px-4 py-3 font-medium">
            <div>
              <p>{unit.name_ar}</p>
              {unit.name_en && (
                <p className="text-sm text-gray-600">{unit.name_en}</p>
              )}
            </div>
          </td>
          <td className="px-4 py-3 font-mono font-semibold text-blue-600">
            {unit.short_name}
          </td>
          <td className="px-4 py-3 text-gray-600">
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
              {unit.category_name_ar ?? 'غير محدد'}
            </span>
          </td>
          <td className="px-4 py-3 text-gray-600">
            {(Number(unit.ratio_to_base) || 0).toFixed(6)}
          </td>
          <td className="px-4 py-3">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                unit.is_base
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {unit.is_base ? 'نعم' : 'لا'}
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(unit)}
                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm font-medium"
              >
                تعديل
              </button>
              <button
                onClick={() => onToggleStatus(unit)}
                className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  unit.is_active
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {unit.is_active ? 'تعطيل' : 'تفعيل'}
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
