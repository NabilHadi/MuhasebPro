import React from 'react';
import { Account } from './types';
import AccountTableRow from './AccountTableRow';

interface AccountsTableProps {
  accounts: Account[];
  loading: boolean;
  onEdit: (account: Account) => void;
  onToggleStatus: (accountNumber: string) => void;
  getTypeLabel: (typeId: number) => string;
  getReportLabel: (typeId: number) => string;
  getBalanceLabel: (typeId: number) => string;
  getTypeBadgeColor: (typeId: number) => string;
}

export const AccountsTable: React.FC<AccountsTableProps> = ({
  accounts,
  loading,
  onEdit,
  onToggleStatus,
  getTypeLabel,
  getReportLabel,
  getBalanceLabel,
  getTypeBadgeColor,
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">لا يوجد حسابات تطابق معايير البحث</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">رقم الحساب</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">حساب الأب</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الاسم</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">النوع</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">المستوى</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">التقرير</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">نوع الرصيد</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <AccountTableRow
              key={account.account_number}
              account={account}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              getTypeLabel={getTypeLabel}
              getReportLabel={getReportLabel}
              getBalanceLabel={getBalanceLabel}
              getTypeBadgeColor={getTypeBadgeColor}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;
