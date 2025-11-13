import React from 'react';
import { Account } from './types';

interface AccountTableRowProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (accountNumber: string) => void;
  getTypeLabel: (typeId: number) => string;
  getReportLabel: (typeId: number) => string;
  getBalanceLabel: (typeId: number) => string;
  getTypeBadgeColor: (typeId: number) => string;
}

export const AccountTableRow: React.FC<AccountTableRowProps> = ({
  account,
  onEdit,
  onDelete,
  getTypeLabel,
  getReportLabel,
  getBalanceLabel,
  getTypeBadgeColor,
}) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-6 py-4 text-sm font-mono font-semibold text-blue-600">{account.account_number}</td>
      <td className="px-6 py-4 text-sm font-mono text-gray-600">
        {account.parent_account_number ? (
          <span className="bg-gray-100 px-2 py-1 rounded">{account.parent_account_number}</span>
        ) : (
          <span className="text-gray-400 italic">-</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        <div>
          <p>{account.name_ar}</p>
          {account.name_en && (
            <p className="text-xs text-gray-600">{account.name_en}</p>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        <span className={`badge ${getTypeBadgeColor(account.account_type_id)}`}>
          {getTypeLabel(account.account_type_id)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-center">
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded font-semibold text-sm">
          {account.account_level}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        <span className={`badge ${getTypeBadgeColor(account.report_type_id)}`}>
          {getReportLabel(account.report_type_id)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        <span className={`badge ${getTypeBadgeColor(account.balance_type_id)}`}>
          {getBalanceLabel(account.balance_type_id)}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => onEdit(account)}
          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition mr-2"
        >
          ✏️ تعديل
        </button>
        <button
          onClick={() => onDelete(account.account_number)}
          className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition"
        >
          🗑️ تعطيل
        </button>
      </td>
    </tr>
  );
};

export default AccountTableRow;
