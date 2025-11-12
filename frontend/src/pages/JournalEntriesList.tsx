interface JournalEntry {
  id: number;
  date: string;
  reference: string;
  description: string;
  created_at: string;
  total_debit?: number;
  total_credit?: number;
}

interface Props {
  entries: JournalEntry[];
  loading: boolean;
  onView: (id: number) => void;
}

export default function JournalEntriesList({ entries, loading, onView }: Props) {
  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  if (entries.length === 0) {
    return <div className="text-center py-8 text-gray-500">لا توجد قيود محاسبية</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-lg font-semibold">القيود المحاسبية</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-semibold">التاريخ المحاسبي</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">تاريخ الإنشاء</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">المرجع</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">البيان</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm">{new Date(entry.date).getTime() ? new Date(new Date(entry.date).getTime() - new Date(entry.date).getTimezoneOffset() * 60000)
  .toISOString()
  .split('T')[0] : ''}</td>
                <td className="px-6 py-3 text-sm text-gray-600 ">
                  {new Date(entry.created_at).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })}
                </td>
                <td className="px-6 py-3 text-sm">{entry.reference || '--'}</td>
                <td className="px-6 py-3 text-sm">{entry.description || '--'}</td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => onView(entry.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    عرض
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
