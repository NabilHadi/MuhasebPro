import React from 'react';

interface AccountsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (status: 'all' | 'active' | 'inactive') => void;
}

export const AccountsFilters: React.FC<AccountsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="card mb-6">
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="form-group">
            <label className="label-field">البحث</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث برقم الحساب أو الاسم..."
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">ابحث برقم الحساب أو الاسم بالعربية أو الإنجليزية</p>
          </div>

          {/* Status Filter */}
          <div className="form-group">
            <label className="label-field">الحالة</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="input-field"
            >
              <option value="all">-- الكل --</option>
              <option value="active">نشط</option>
              <option value="inactive">معطل</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsFilters;
