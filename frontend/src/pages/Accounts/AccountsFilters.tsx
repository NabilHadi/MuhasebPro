import React from 'react';
import { FilterBar, FilterDefinition } from '../../components/FilterBar';

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
  const filters: FilterDefinition[] = [
    {
      id: 'search',
      type: 'text',
      label: 'البحث',
      placeholder: 'ابحث برقم الحساب أو الاسم بالعربية أو الإنجليزية',
      value: searchTerm,
      onChange: setSearchTerm,
      grow: true,
    },
    {
      id: 'status',
      type: 'enum',
      label: 'الحالة',
      value: statusFilter,
      onChange: (val) => setStatusFilter(val as 'all' | 'active' | 'inactive'),
      options: [
        { label: '-- الكل --', value: 'all' },
        { label: 'نشط', value: 'active' },
        { label: 'معطل', value: 'inactive' },
      ],
    },
  ];

  return (
    <FilterBar
      filters={filters}
      onAddClick={onAddNew || (() => { })}
      addButtonLabel="حساب جديد"
      layout="flex"
      containerClassName="gap-3"
    />
  );
};

export default AccountsFilters;
