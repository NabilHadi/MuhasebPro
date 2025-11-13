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

  return (
    <table className="w-full">

      <thead className="bg-gray-100 border-b">
        <tr>
          <th className="border border-gray-300 px-2 py-2 text-right font-medium text-gray-700">
            الاسم
          </th>
          <th className="border border-gray-300 px-2 py-2 text-right font-medium text-gray-700">
            الاختصار
          </th>
          <th className="border border-gray-300 px-2 py-2 text-right font-medium text-gray-700">
            الفئة
          </th>
          <th className="border border-gray-300 px-2 py-2 text-right font-medium text-gray-700">
            النسبة
          </th>
          <th className="border border-gray-300 px-2 py-2 text-right font-medium text-gray-700">
            أساسية
          </th>
          <th className="border border-gray-300 px-2 py-2 text-right font-medium text-gray-700">
            الإجراءات
          </th>
        </tr>
      </thead>
      <tbody>
        {units.map((unit) => (
          <tr key={unit.id} className="border-b hover:bg-gray-50">
            <td className="border border-gray-300 px-2 py-1 font-medium">
              <div>
                <p>{unit.name_ar}</p>
                {unit.name_en && (
                  <p className="text-sm text-gray-600">{unit.name_en}</p>
                )}
              </div>
            </td>
            <td className="border border-gray-300 px-2 py-1 font-mono font-semibold text-blue-600">
              {unit.short_name}
            </td>
            <td className="border border-gray-300 px-2 py-1 text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                {unit.category_name_ar ?? 'غير محدد'}
              </span>
            </td>
            <td className="border border-gray-300 px-2 py-1 text-gray-600">
              {(Number(unit.ratio_to_base) || 0).toFixed(6)}
            </td>
            <td className="border border-gray-300 px-2 py-1">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${unit.is_base
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {unit.is_base ? 'نعم' : 'لا'}
              </span>
            </td>
            <td className="border border-gray-300 px-2 py-1">
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(unit)}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm font-medium"
                >
                  تعديل
                </button>
                <button
                  onClick={() => onToggleStatus(unit)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${unit.is_active
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
      </tbody>
    </table>

  );
}
