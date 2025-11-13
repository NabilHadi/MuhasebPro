import { useState, useEffect } from 'react';
import apiClient from '../../../services/api';
import { Account, AccountType, ReportType, BalanceType } from '../types';

interface UseAccountsDataReturn {
  accounts: Account[];
  mainTypeAccounts: Account[];
  accountTypes: AccountType[];
  reportTypes: ReportType[];
  balanceTypes: BalanceType[];
  loading: boolean;
  error: string;
  setError: (error: string) => void;
  fetchAccounts: () => Promise<void>;
  fetchMainTypeAccounts: () => Promise<void>;
}

export const useAccountsData = (): UseAccountsDataReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [mainTypeAccounts, setMainTypeAccounts] = useState<Account[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [balanceTypes, setBalanceTypes] = useState<BalanceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // جلب البيانات الأولية
  useEffect(() => {
    fetchAccounts();
    fetchMainTypeAccounts();
    fetchAccountTypes();
    fetchReportTypes();
    fetchBalanceTypes();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/accounts');
      setAccounts(response.data);
    } catch (err: any) {
      setError('فشل في جلب الحسابات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMainTypeAccounts = async () => {
    try {
      const response = await apiClient.get('/accounts');
      const mainTypeAccts = response.data.filter((account: Account) => account.account_type_id === 1);
      setMainTypeAccounts(mainTypeAccts);
    } catch (err) {
      console.error('خطأ في جلب الحسابات الرئيسية:', err);
    }
  };

  const fetchAccountTypes = async () => {
    try {
      const mockTypes: AccountType[] = [
        { id: 1, name_ar: 'رئيسي', name_en: 'Main' },
        { id: 2, name_ar: 'فرعي', name_en: 'Sub' },
      ];
      setAccountTypes(mockTypes);
    } catch (err) {
      console.error('خطأ في جلب أنواع الحسابات:', err);
    }
  };

  const fetchReportTypes = async () => {
    try {
      const mockTypes: ReportType[] = [
        { id: 1, code: 'BS', name_ar: 'الميزانية العمومية', name_en: 'Balance Sheet' },
        { id: 2, code: 'PL', name_ar: 'الأرباح والخسائر', name_en: 'Profit and Loss' },
      ];
      setReportTypes(mockTypes);
    } catch (err) {
      console.error('خطأ في جلب أنواع التقارير:', err);
    }
  };

  const fetchBalanceTypes = async () => {
    try {
      const mockTypes: BalanceType[] = [
        { id: 1, name_ar: 'مدين', name_en: 'Debit' },
        { id: 2, name_ar: 'دائن', name_en: 'Credit' },
      ];
      setBalanceTypes(mockTypes);
    } catch (err) {
      console.error('خطأ في جلب أنواع الأرصدة:', err);
    }
  };

  return {
    accounts,
    mainTypeAccounts,
    accountTypes,
    reportTypes,
    balanceTypes,
    loading,
    error,
    setError,
    fetchAccounts,
    fetchMainTypeAccounts,
  };
};
