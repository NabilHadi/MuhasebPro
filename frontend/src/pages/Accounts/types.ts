export interface AccountType {
  id: number;
  name_ar: string;
  name_en: string;
}

export interface ReportType {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
}

export interface BalanceType {
  id: number;
  name_ar: string;
  name_en: string;
}

export interface Account {
  id: number;
  account_number: string;
  parent_account_number: string | null;
  name_ar: string;
  name_en: string;
  account_type_id: number;
  report_type_id: number;
  balance_type_id: number;
  account_type_name_ar: string;
  account_type_name_en: string;
  report_type_name_ar: string;
  report_type_name_en: string;
  balance_type_name_ar: string;
  balance_type_name_en: string;
  account_level: number;
  status: 'active' | 'inactive';
}

export interface FormData {
  account_number: string;
  name_ar: string;
  name_en: string;
  account_type_id: number;
  balance_type_id: number;
  account_level: number;
  parent_account_number: string;
  status: 'active' | 'inactive';
}
