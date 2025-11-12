interface JournalLine {
  id: number;
  account_id: number;
  account_code: string;
  account_name_ar: string;
  debit: number | string;
  credit: number | string;
}

interface ViewingEntryType {
  id: number;
  date: string;
  reference: string;
  description: string;
  lines: JournalLine[];
}

interface Props {
  viewingEntry: ViewingEntryType;
  onClose: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function JournalEntryView({ viewingEntry, onClose, onEdit, onDelete }: Props) {
  if (!viewingEntry) return null;

  const totalDebit = viewingEntry.lines.reduce((sum: number, line) => sum + parseFloat(String(line.debit) || '0'), 0);
  const totalCredit = viewingEntry.lines.reduce((sum: number, line) => sum + parseFloat(String(line.credit) || '0'), 0);

  console.log(viewingEntry.date);
  

  return (
    <div className="card mb-8">
      <div className="card-header flex justify-between items-center">
        <h2 className="text-xl font-semibold">تفاصيل القيد</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <div className="p-6">
        {/* Entry Header Info */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">التاريخ</p>
            <p className="font-semibold">{new Date(viewingEntry.date).getTime() ? new Date(new Date(viewingEntry.date).getTime() - new Date(viewingEntry.date).getTimezoneOffset() * 60000)
  .toISOString()
  .split('T')[0] : ''}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">المرجع</p>
            <p className="font-semibold">{viewingEntry.reference || '--'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">البيان</p>
            <p className="font-semibold">{viewingEntry.description || '--'}</p>
          </div>
        </div>

        {/* Lines Table */}
        <table className="w-full mb-6">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-semibold">الحساب</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">الرمز</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">دين</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">دائن</th>
            </tr>
          </thead>
          <tbody>
            {viewingEntry.lines.map((line, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm">{line.account_name_ar}</td>
                <td className="px-6 py-3 text-sm font-mono">{line.account_code}</td>
                <td className="px-6 py-3 text-sm text-left">
                  {parseFloat(String(line.debit)) > 0 ? parseFloat(String(line.debit)).toFixed(2) : '--'}
                </td>
                <td className="px-6 py-3 text-sm text-left">
                  {parseFloat(String(line.credit)) > 0 ? parseFloat(String(line.credit)).toFixed(2) : '--'}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td colSpan={2} className="px-6 py-3 text-right">
                الإجمالي
              </td>
              <td className="px-6 py-3 text-left">{totalDebit.toFixed(2)}</td>
              <td className="px-6 py-3 text-left">{totalCredit.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-secondary">
            إغلاق
          </button>
          <button onClick={() => onEdit(viewingEntry.id)} className="btn-primary">
            تعديل
          </button>
          <button onClick={() => onDelete(viewingEntry.id)} className="btn-danger">
            عكس
          </button>
        </div>
      </div>
    </div>
  );
}
