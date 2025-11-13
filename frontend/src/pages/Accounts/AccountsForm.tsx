import React from 'react';
import { FormData, AccountType, Account } from './types';

interface AccountsFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  editingNumber: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  mainTypeAccounts: Account[];
  accountTypes: AccountType[];
  onParentAccountChange: (parentNumber: string) => void;
  getBalanceLabel: (typeId: number) => string;
}

export const AccountsForm: React.FC<AccountsFormProps> = ({
  formData,
  setFormData,
  editingNumber,
  onSubmit,
  onCancel,
  mainTypeAccounts,
  accountTypes,
  onParentAccountChange,
  getBalanceLabel,
}) => {
  return (
    <div className="card mb-8">
      <div className="card-header">
        <h2 className="text-xl font-semibold">
          {editingNumber ? 'تعديل الحساب' : 'إضافة حساب جديد'}
        </h2>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Parent Account Selection */}
          <div className="form-group md:col-span-2">
            <label className="label-field">حساب الأب (اختياري) - اختر أولاً</label>
            <select
              value={formData.parent_account_number}
              onChange={(e) => onParentAccountChange(e.target.value)}
              className="input-field"
            >
              <option value="">-- حساب رئيسي (تأسيسي) --</option>
              {mainTypeAccounts.map((account) => (
                <option key={account.account_number} value={account.account_number}>
                  {account.account_number} - {account.name_ar}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Auto-Generated Account Number (Now Editable) */}
          <div className="form-group">
            <label className="label-field">رقم الحساب *</label>
            <input
              type="text"
              value={formData.account_number}
              onChange={(e) => setFormData({ ...formData, account_number: e.target.value.toUpperCase() })}
              disabled={!!editingNumber}
              placeholder="مثال: 1000"
              className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <p className="text-xs text-gray-500 mt-1">يتم اقتراح رقم الحساب تلقائياً، ويمكنك تعديله</p>
          </div>

          {/* Step 3: Account Level (Auto-Calculated) */}
          <div className="form-group">
            <label className="label-field">مستوى الحساب</label>
            <input
              type="number"
              value={formData.account_level}
              disabled={true}
              className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">يتم حسابه تلقائياً</p>
          </div>

          {/* Step 4: Arabic Name */}
          <div className="form-group">
            <label className="label-field">الاسم بالعربية *</label>
            <input
              type="text"
              value={formData.name_ar}
              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
              placeholder="مثال: الموجودات"
              className="input-field"
              required
            />
          </div>

          {/* Step 5: English Name */}
          <div className="form-group">
            <label className="label-field">الاسم بالإنجليزية</label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              placeholder="Example: Assets"
              className="input-field"
            />
          </div>

          {/* Step 6: Account Type */}
          <div className="form-group">
            <label className="label-field">نوع الحساب *</label>
            <select
              value={formData.account_type_id}
              onChange={(e) =>
                setFormData({ ...formData, account_type_id: parseInt(e.target.value) })
              }
              className="input-field"
              required
            >
              {accountTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name_ar}
                </option>
              ))}
            </select>
          </div>

          {/* Balance Type (Auto-Inferred) */}
          <div className="form-group">
            <label className="label-field">نوع الرصيد</label>
            <div className="input-field bg-gray-100 flex items-center">
              {getBalanceLabel(formData.balance_type_id)}
            </div>
            <p className="text-xs text-gray-500 mt-1">يتم استرجاعه من الحساب الأب</p>
          </div>

          {/* Step 7: Status */}
          <div className="form-group">
            <label className="label-field">الحالة *</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">نشط</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">معطل</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            إلغاء
          </button>
          <button type="submit" className="btn-primary">
            {editingNumber ? 'تحديث' : 'إضافة'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountsForm;
