import { useState } from 'react';
import apiClient from '../../../services/api';
import { Account, FormData } from '../types';

interface UseAccountFormReturn {
  formData: FormData;
  setFormData: (data: FormData) => void;
  editingNumber: string | null;
  setEditingNumber: (number: string | null) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  success: string;
  setSuccess: (message: string) => void;
  error: string;
  setError: (error: string) => void;
  handleParentAccountChange: (parentNumber: string, mainTypeAccounts: Account[]) => void;
  handleAddNew: (onFetchAccounts: () => Promise<void>, onFetchMainTypeAccounts: () => Promise<void>) => void;
  handleEdit: (account: Account) => void;
  handleSubmit: (e: React.FormEvent, onFetchAccounts: () => Promise<void>) => Promise<void>;
  handleToggleStatus: (accountNumber: string, onFetchAccounts: () => Promise<void>) => Promise<void>;
  resetForm: () => void;
}

const defaultFormData: FormData = {
  account_number: '',
  name_ar: '',
  name_en: '',
  account_type_id: 1,
  balance_type_id: 1,
  account_level: 1,
  parent_account_number: '',
  status: 'active',
};

export const useAccountForm = (): UseAccountFormReturn => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [editingNumber, setEditingNumber] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleParentAccountChange = (parentNumber: string, mainTypeAccounts: Account[]) => {
    if (!parentNumber) {
      setFormData((prev) => ({
        ...prev,
        parent_account_number: '',
        account_type_id: 1,
      }));
      return;
    }

    const parentAccount = mainTypeAccounts.find(
      (a) => a.account_number === parentNumber
    );

    if (parentAccount) {
      const suggestedChildNumber = parentNumber + '1';
      const childLevel = parentAccount.account_level + 1;
      const childType = 2;
      const childBalanceType = parentAccount.balance_type_id;

      setFormData((prev) => ({
        ...prev,
        parent_account_number: parentNumber,
        account_number: suggestedChildNumber,
        account_level: childLevel,
        account_type_id: childType,
        balance_type_id: childBalanceType,
      }));
    }
  };

  const handleAddNew = async (
    onFetchAccounts: () => Promise<void>,
    onFetchMainTypeAccounts: () => Promise<void>
  ) => {
    setEditingNumber(null);
    setFormData(defaultFormData);
    setError('');
    setSuccess('');
    await onFetchAccounts();
    await onFetchMainTypeAccounts();
    setShowForm(true);
  };

  const handleEdit = (account: Account) => {
    setEditingNumber(account.account_number);
    setFormData({
      account_number: account.account_number,
      name_ar: account.name_ar,
      name_en: account.name_en || '',
      account_type_id: account.account_type_id,
      balance_type_id: account.balance_type_id,
      account_level: account.account_level,
      parent_account_number: account.parent_account_number || '',
      status: account.status,
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent, onFetchAccounts: () => Promise<void>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        account_number: formData.account_number,
        name_ar: formData.name_ar,
        name_en: formData.name_en || null,
        account_type_id: formData.account_type_id,
        report_type_id: 1, // Default to Balance Sheet
        balance_type_id: formData.balance_type_id,
        account_level: formData.account_level,
        parent_account_number: formData.parent_account_number || null,
        status: formData.status,
      };

      if (editingNumber) {
        await apiClient.put(`/accounts/${editingNumber}`, payload);
        setSuccess('تم تحديث الحساب بنجاح');
      } else {
        await apiClient.post('/accounts', payload);
        setSuccess('تم إضافة الحساب بنجاح');
      }

      setShowForm(false);
      setEditingNumber(null);
      setFormData(defaultFormData);
      await onFetchAccounts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleToggleStatus = async (accountNumber: string, onFetchAccounts: () => Promise<void>) => {
    if (!window.confirm('هل أنت متأكد من تغيير حالة هذا الحساب؟')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      // Fetch the account to check its current status
      const response = await apiClient.get(`/accounts/${accountNumber}`);
      const account = response.data;
      
      // Toggle status based on current state
      if (account.status === 'active') {
        await apiClient.patch(`/accounts/${accountNumber}/deactivate`);
        setSuccess('تم تعطيل الحساب بنجاح');
      } else {
        await apiClient.patch(`/accounts/${accountNumber}/activate`);
        setSuccess('تم تنشيط الحساب بنجاح');
      }
      
      await onFetchAccounts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تحديث حالة الحساب');
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingNumber(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  return {
    formData,
    setFormData,
    editingNumber,
    setEditingNumber,
    showForm,
    setShowForm,
    success,
    setSuccess,
    error,
    setError,
    handleParentAccountChange,
    handleAddNew,
    handleEdit,
    handleSubmit,
    handleToggleStatus,
    resetForm,
  };
};
