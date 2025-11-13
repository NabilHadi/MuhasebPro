import React from 'react';

interface AccountsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (status: 'all' | 'active' | 'inactive') => void;
  onAddNew?: () => void;
}

export const AccountsFilters: React.FC<AccountsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onAddNew,
}) => {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex flex-wrap items-center">
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="btn-primary flex items-center gap-2"
          >
            <span>➕</span>
            <span>حساب جديد</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث برقم الحساب أو الاسم بالعربية أو الإنجليزية"
          className="input-field"
        />
      </div>

      {/* Status Filter */}
      <div>
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
  );
};

export default AccountsFilters;
