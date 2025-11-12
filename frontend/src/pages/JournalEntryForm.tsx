import React from 'react';

interface Account {
  id: number;
  account_code: string;
  account_name_ar: string;
}

interface FormLine {
  account_id: string | number;
  debit: string | number;
  credit: string | number;
}

interface FormDataType {
  date: string;
  description: string;
  reference: string;
  lines: FormLine[];
}

interface Props {
  formData: FormDataType;
  accounts: Account[];
  selectedEntry: number | null;
  isBalanced: boolean;
  totalDebit: number;
  totalCredit: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLineChange: (index: number, field: 'account_id' | 'debit' | 'credit', value: string) => void;
  onAddLine: () => void;
  onRemoveLine: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function JournalEntryForm({
  formData,
  accounts,
  selectedEntry,
  isBalanced,
  totalDebit,
  totalCredit,
  onInputChange,
  onLineChange,
  onAddLine,
  onRemoveLine,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className="card mb-8">
      <div className="card-header">
        <h2 className="text-xl font-semibold">
          {selectedEntry ? 'تعديل القيد' : 'إضافة قيد جديد'}
        </h2>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        {/* Header Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="label-field">التاريخ *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={onInputChange}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="label-field">المرجع (اختياري)</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={onInputChange}
              placeholder="مثال: FV001"
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label className="label-field">البيان (اختياري)</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="وصف القيد"
              className="input-field"
            />
          </div>
        </div>

        {/* Lines Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2 text-right">الحساب</th>
                <th className="px-3 py-2 text-left">دين</th>
                <th className="px-3 py-2 text-left">دائن</th>
                <th className="px-3 py-2 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {formData.lines.map((line, index) => (
                <tr key={index} className="border-b">
                  <td className="px-3 py-2">
                    <select
                      value={line.account_id}
                      onChange={(e) => onLineChange(index, 'account_id', e.target.value)}
                      className="input-field text-sm"
                      required
                    >
                      <option value="">-- اختر حساب --</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.account_code} - {account.account_name_ar}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={line.debit}
                      onChange={(e) => onLineChange(index, 'debit', e.target.value)}
                      placeholder="0.00"
                      className="input-field text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={line.credit}
                      onChange={(e) => onLineChange(index, 'credit', e.target.value)}
                      placeholder="0.00"
                      className="input-field text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    {formData.lines.length > 2 && (
                      <button
                        type="button"
                        onClick={() => onRemoveLine(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              <tr className={`font-semibold ${isBalanced ? 'bg-green-50' : 'bg-red-50'}`}>
                <td className="px-3 py-2 text-right">الإجمالي</td>
                <td className="px-3 py-2 text-left">{totalDebit.toFixed(2)}</td>
                <td className="px-3 py-2 text-left">{totalCredit.toFixed(2)}</td>
                <td className="px-3 py-2 text-center">
                  {isBalanced ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✕</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Add Line Button */}
        <button
          type="button"
          onClick={onAddLine}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <span>➕</span>
          <span>إضافة سطر</span>
        </button>

        {/* Form Actions */}
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel} className="btn-secondary">
            إلغاء
          </button>
          <button type="submit" className="btn-primary" disabled={!isBalanced}>
            {selectedEntry ? 'تحديث' : 'إضافة'}
          </button>
        </div>
      </form>
    </div>
  );
}
