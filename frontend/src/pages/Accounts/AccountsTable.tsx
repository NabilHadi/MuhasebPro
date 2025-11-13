import DataTable, { TableColumn, TableAction } from '../../components/DataTable';
import { Account } from './types';

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
  const columns: TableColumn<Account>[] = [
    {
      key: 'account_number',
      label: 'رقم الحساب',
    },
    {
      key: 'parent_account_number',
      label: 'حساب الأب',
      render: (parent) => parent || '--',
    },
    {
      key: 'name_ar',
      label: 'الاسم',
      render: (_, account) => (
        <div>
          <p>{account.name_ar}</p>
          {account.name_en && <p className="text-sm text-gray-600">{account.name_en}</p>}
        </div>
      ),
    },
    {
      key: 'account_type_id',
      label: 'النوع',
      render: (typeId) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeBadgeColor(typeId)}`}>
          {getTypeLabel(typeId)}
        </span>
      ),
    },
    {
      key: 'account_level',
      label: 'المستوى',
    },
    {
      key: 'report_type_id',
      label: 'التقرير',
      render: (typeId) => getReportLabel(typeId),
    },
    {
      key: 'balance_type_id',
      label: 'نوع الرصيد',
      render: (typeId) => getBalanceLabel(typeId),
    },
  ];

  const actions: TableAction<Account>[] = [
    {
      label: 'تعديل',
      onClick: onEdit,
      className: 'px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition',
    },
    {
      label: (account) => account.status === 'active' ? 'تعطيل' : 'تفعيل',
      onClick: (account) => onToggleStatus(account.account_number),
      className: (account) =>
        account.status === 'active'
          ? 'px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
          : 'px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition',
    },
  ];

  return (
    <DataTable
      data={accounts}
      columns={columns}
      actions={actions}
      loading={loading}
      emptyMessage="لا يوجد حسابات تطابق معايير البحث"
    />
  );
};

export default AccountsTable;
