import { useState, useMemo } from 'react';
import { Account, AccountType, ReportType, BalanceType } from '../types';

interface UseAccountFiltersReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (status: 'all' | 'active' | 'inactive') => void;
  filteredAccounts: Account[];
  getTypeLabel: (typeId: number) => string;
  getReportLabel: (typeId: number) => string;
  getBalanceLabel: (typeId: number) => string;
  getTypeBadgeColor: (typeId: number) => string;
}

interface FilterContext {
  accountTypes: AccountType[];
  reportTypes: ReportType[];
  balanceTypes: BalanceType[];
}

export const useAccountFilters = (
  accounts: Account[],
  context: FilterContext
): UseAccountFiltersReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      // Filter by status
      if (statusFilter !== 'all' && account.status !== statusFilter) {
        return false;
      }

      // Filter by search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesNumber = account.account_number.toLowerCase().includes(term);
        const matchesNameAr = account.name_ar.toLowerCase().includes(term);
        const matchesNameEn = account.name_en?.toLowerCase().includes(term) || false;

        if (!matchesNumber && !matchesNameAr && !matchesNameEn) {
          return false;
        }
      }

      return true;
    });
  }, [accounts, searchTerm, statusFilter]);

  const getTypeLabel = (typeId: number) => {
    const type = context.accountTypes.find(t => t.id === typeId);
    return type?.name_ar || 'غير معروف';
  };

  const getReportLabel = (typeId: number) => {
    const type = context.reportTypes.find(t => t.id === typeId);
    return type?.name_ar || 'غير معروف';
  };

  const getBalanceLabel = (typeId: number) => {
    const type = context.balanceTypes.find(t => t.id === typeId);
    return type?.name_ar || 'غير معروف';
  };

  const getTypeBadgeColor = (typeId: number) => {
    const colors = ['badge-blue', 'badge-green'];
    return colors[(typeId - 1) % colors.length];
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredAccounts,
    getTypeLabel,
    getReportLabel,
    getBalanceLabel,
    getTypeBadgeColor,
  };
};
