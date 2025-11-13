import React from 'react';
import { Account } from './types';

interface AccountTableRowProps {
  account: Account;
  onEdit: (account: Account) => void;
  onToggleStatus: (accountNumber: string) => void;
  getTypeLabel: (typeId: number) => string;
  getReportLabel: (typeId: number) => string;
  getBalanceLabel: (typeId: number) => string;
  getTypeBadgeColor: (typeId: number) => string;
}

export const AccountTableRow: React.FC<AccountTableRowProps> = ({
  account,
  onEdit,
  onToggleStatus,
  getTypeLabel,
  getReportLabel,
  getBalanceLabel,
  getTypeBadgeColor,
}) => {
  return (
    <tr className="border-b hover:bg-gray-100">
      <td className="border border-gray-300 px-2 py-2 text-sm font-mono font-semibold text-blue-600">{account.account_number}</td>
      <td className="border border-gray-300 px-2 py-2 text-sm font-mono text-gray-600">
        {account.parent_account_number ? (
          <span className="bg-gray-100 px-2 py-1 rounded">{account.parent_account_number}</span>
        ) : (
          <span className="text-gray-400 italic">-</span>
        )}
      </td>
      <td className="border border-gray-300 px-2 py-2 text-sm text-gray-700">
        <div>
          <p>{account.name_ar}</p>
        </div>
      </td>
      <td className="border border-gray-300 px-2 py-2 text-sm">
        <span className={`badge ${getTypeBadgeColor(account.account_type_id)}`}>
          {getTypeLabel(account.account_type_id)}
        </span>
      </td>
      <td className="border border-gray-300 px-2 py-2 text-sm text-center">
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded font-semibold text-sm">
          {account.account_level}
        </span>
      </td>
      <td className="border border-gray-300 px-2 py-2 text-sm">
        <span className={`badge ${getTypeBadgeColor(account.report_type_id)}`}>
          {getReportLabel(account.report_type_id)}
        </span>
      </td>
      <td className="border border-gray-300 px-2 py-2 text-sm">
        <span className={`badge ${getTypeBadgeColor(account.balance_type_id)}`}>
          {getBalanceLabel(account.balance_type_id)}
        </span>
      </td>
      <td className="border border-gray-300 px-2 py-2 text-center">
        <button
          onClick={() => onEdit(account)}
          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition mr-2"
        >
          ✏️ تعديل
        </button>
        {account.status === 'active' ? (
          <button
            onClick={() => onToggleStatus(account.account_number)}
            className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition"
          >
            🗑️ تعطيل
          </button>
        ) : (
          <button
            onClick={() => onToggleStatus(account.account_number)}
            className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition"
          >
            ✓ تنشيط
          </button>
        )}
      </td>
    </tr>
  );
};

export default AccountTableRow;
