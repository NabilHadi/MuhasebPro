import { useState } from 'react';
import { Invoice } from '../types';

interface InvoiceHeaderProps {
  invoice: Partial<Invoice>;
  onFieldChange: (field: keyof Invoice, value: any) => void;
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

const FormField = ({ label, children }: FormFieldProps) => (
  <div className="flex items-center gap-3">
    <label className="w-32 flex-shrink-0 text-sm font-semibold text-gray-700">
      {label}
    </label>
    <div className="flex-1">{children}</div>
  </div>
);

export default function InvoiceHeader({ invoice, onFieldChange }: InvoiceHeaderProps) {
  // Local state for form fields
  const [localState, setLocalState] = useState({
    invoice_seq: '1',
    branch_name_seq: 'فرع جدة',
    payment_method_code: '1',
    payment_method_name: 'نقداًَ',
    company_code: 1,
    company_name: 'شركة العامة',
    warehouse_code: '1',
    warehouse_name: 'فرع جدة',
    document_post_status: '',
    document_post_name: 'حجز البضاعة',
    document_number: '100001',
    document_type: 'فاتورة مبيعات',
    is_suspended: false,
    branch_code: '1',
    branch: 'فرع جدة',
    account_code: '121001001',
    account_name: 'الصندوق العام',
    employee_code: '1',
    employee_name: 'موظف جدة 1',
    customer_name_ar: invoice.customer_name_ar || '',
    address: invoice.address || '',
    tax_number_1: invoice.tax_number || '',
    tax_number_2: invoice.tax_number || '',
    tax_number_3: invoice.tax_number || '',
    mobile_1: invoice.mobile || '',
    mobile_2: invoice.mobile || '',
    invoice_date: invoice.invoice_date || '',
    supply_date: invoice.supply_date || '',
  });

  const handleFieldChange = (fieldName: string, value: any) => {
    setLocalState(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Map local field names to invoice fields
    const fieldMap: Record<string, keyof Invoice> = {
      tax_number_1: 'tax_number',
      tax_number_2: 'tax_number',
      tax_number_3: 'tax_number',
      mobile_1: 'mobile',
      mobile_2: 'mobile',
      customer_name_ar: 'customer_name_ar',
      address: 'address',
      invoice_date: 'invoice_date',
      supply_date: 'supply_date',
      employee_name: 'employee_name',
      account_code: 'account_id',
      account_name: 'account_id',
      warehouse_code: 'warehouse_name',
      warehouse_name: 'warehouse_name',
      payment_method_code: 'payment_method',
      payment_method_name: 'payment_method',
      company_code: 'company_name',
      company_name: 'company_name',
      branch_code: 'branch_name',
      branch: 'branch_name',
      employee_code: 'employee_name',
      document_number: 'document_number',
      invoice_seq: 'invoice_number',
      branch_name_seq: 'invoice_number',
    };

    if (fieldMap[fieldName]) {
      onFieldChange(fieldMap[fieldName], value);
    }
  };

  return (
    <div className="flex gap-6 py-2 px-6 text-sm">
      {/* Left Column */}
      <div className="space-y-1 flex-1">
        {/* رقم التسلسل */}
        <FormField label="رقم التسلسل">
          <div className='flex gap-3'>
            <input
              type="text"
              value={localState.invoice_seq}
              onChange={(e) => handleFieldChange('invoice_seq', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
              required
            />
            <input
              type="text"
              value={localState.branch_name_seq}
              onChange={(e) => handleFieldChange('branch_name_seq', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
              required
            />
          </div>
        </FormField>

        {/* طريقة الدفع */}
        <FormField label="طريقة الدفع">
          <div className='flex gap-3'>
            <input
              type="text"
              value={localState.payment_method_code}
              onChange={(e) => handleFieldChange('payment_method_code', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
              required
            />
            <input
              type="text"
              value={localState.payment_method_name}
              onChange={(e) => handleFieldChange('payment_method_name', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
              required
            />
          </div>
        </FormField>

        {/* الشركة */}
        <FormField label="الشركة">
          <div className='flex gap-3'>
            <input
              type="text"
              value={localState.company_code}
              onChange={(e) => handleFieldChange('company_code', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
            />
            <input
              type="text"
              value={localState.company_name}
              onChange={(e) => handleFieldChange('company_name', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
            />
          </div>
        </FormField>

        {/* المخزن */}
        <FormField label="المخزن">
          <div className='flex gap-3'>
            <input
              type="text"
              value={localState.warehouse_code}
              onChange={(e) => handleFieldChange('warehouse_code', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
            />
            <input
              type="text"
              value={localState.warehouse_name}
              onChange={(e) => handleFieldChange('warehouse_name', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
            />
          </div>
        </FormField>

        {/* انزال المستند */}
        <FormField label="انزال المستند">
          <div className='flex gap-3'>
            <input
              type="text"
              value={localState.document_post_status}
              className="w-1/3 p-0.5 focus:outline-none border border-gray-400"
              onChange={(e) => handleFieldChange('document_post_status', e.target.value)}
            />
            <input
              type="text"
              value={localState.document_post_name}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
              onChange={(e) => handleFieldChange('document_post_name', e.target.value)}
            />
          </div>
        </FormField>

        {/* الرقم الضريبي */}
        <FormField label="الرقم الضريبي">
          <div className='flex gap-3'>
            <input
              type="text"
              value={localState.tax_number_1}
              onChange={(e) => handleFieldChange('tax_number_1', e.target.value)}
              className="w-1/3 p-0.5 focus:outline-none border border-gray-400"
            />
            <div className="flex gap-3 w-2/3">
              <input
                type="text"
                value={localState.tax_number_2}
                onChange={(e) => handleFieldChange('tax_number_2', e.target.value)}
                className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
              />
              <input
                type="text"
                value={localState.tax_number_3}
                onChange={(e) => handleFieldChange('tax_number_3', e.target.value)}
                className="w-1/3 p-0.5 focus:outline-none border border-gray-400"
              />
            </div>
          </div>
        </FormField>

        {/* رقم الجوال */}
        <FormField label="رقم الجوال">
          <div className='flex gap-3'>
            <input
              type="tel"
              value={localState.mobile_1}
              onChange={(e) => handleFieldChange('mobile_1', e.target.value)}
              className="w-1/3 p-0.5 focus:outline-none border border-gray-400"
            />
            <input
              type="tel"
              value={localState.mobile_2}
              onChange={(e) => handleFieldChange('mobile_2', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
            />
          </div>
        </FormField>
      </div>

      {/* Right Column */}
      <div className="space-y-1 flex-1">

        {/* رقم المستند */}
        <FormField label="رقم المستند">
          <div className='flex gap-3'>
            <input
              type="text"
              value={localState.document_number}
              onChange={(e) => handleFieldChange('document_number', e.target.value)}
              className="w-1/3 text-center p-0.5 focus:outline-none border border-gray-400"
            />
            <div className="flex gap-3 w-2/3">
              <input
                type="text"
                value={localState.document_type}
                onChange={(e) => handleFieldChange('document_type', e.target.value)}
                className="w-3/5 p-0.5 text-center focus:outline-none border border-gray-400"
              />
              <div className="flex items-center justify-center gap-1 w-2/5 py-0.5 px-1 focus:outline-none border border-gray-400">
                <input
                  type='checkbox'
                  checked={localState.is_suspended}
                  onChange={(e) => handleFieldChange('is_suspended', e.target.checked)}
                />
                <span className='text-[0.8rem] text-sky-900'>
                  تعليق المستند
                </span>
              </div>
            </div>
          </div>
        </FormField>

        {/* التاريخ */}
        <FormField label="التاريخ *">
          <div className='flex gap-3'>
            <input
              type="date"
              value={localState.invoice_date}
              onChange={(e) => handleFieldChange('invoice_date', e.target.value)}
              className="appearance-none custom-date-input w-1/3 text-center focus:outline-none border border-gray-400"
              required
            />

            <div className='flex gap-3 w-2/3'>
              <div className='w-3/5 p-0.5 text-center focus:outline-none border border-gray-400 bg-white'>
                تعليق المستند
              </div>
              <input
                type="date"
                value={localState.supply_date}
                onChange={(e) => handleFieldChange('supply_date', e.target.value)}
                className="appearance-none custom-date-input w-2/5 text-center focus:outline-none border border-gray-400"
              />
            </div>
          </div>
        </FormField>

        {/* الفرع */}
        <FormField label="الفرع">
          <div className='flex gap-3'>
            <input
              type="text"
              value={localState.branch_code}
              onChange={(e) => handleFieldChange('branch_code', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
              required
            />
            <input
              type="text"
              value={localState.branch}
              onChange={(e) => handleFieldChange('branch', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
              required
            />
          </div>
        </FormField>

        {/* رقم الحساب */}
        <FormField label="رقم الحساب">
          <div className='flex gap-3'>
            <input
              type="text"
              value={localState.account_code}
              onChange={(e) => handleFieldChange('account_code', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
              required
            />
            <input
              type="text"
              value={localState.account_name}
              onChange={(e) => handleFieldChange('account_name', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
              required
            />
          </div>
        </FormField>

        {/* الموظف */}
        <FormField label="الموظف">
          <div className='flex gap-3'>
            <input
              type="text"
              value={localState.employee_code}
              onChange={(e) => handleFieldChange('employee_code', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
              required
            />
            <input
              type="text"
              value={localState.employee_name}
              onChange={(e) => handleFieldChange('employee_name', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
              required
            />
          </div>
        </FormField>

        {/* اسم العميل */}
        <FormField label="اسم العميل *">
          <input
            type="text"
            value={localState.customer_name_ar}
            onChange={(e) => handleFieldChange('customer_name_ar', e.target.value)}
            className="w-full p-0.5 focus:outline-none border border-gray-400"
            required
          />
        </FormField>

        {/* العنوان */}
        <FormField label="العنوان">
          <input
            type="text"
            value={localState.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            className="w-full p-0.5 focus:outline-none border border-gray-400"
          />
        </FormField>
      </div>
    </div>
  );
}
