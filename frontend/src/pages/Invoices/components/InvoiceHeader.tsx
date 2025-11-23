import { Invoice } from '../types';

interface InvoiceHeaderProps {
  invoice: Partial<Invoice>;
  onFieldChange: (field: keyof Invoice, value: any) => void;
}

export default function InvoiceHeader({ invoice, onFieldChange }: InvoiceHeaderProps) {
  const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-3">
      <label className="w-32 flex-shrink-0 text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <div className="flex gap-6 py-2 px-6 text-sm">
      {/* Left Column */}
      <div className="space-y-1 flex-1">
        {/* رقم التسلسل */}
        <FormField label="رقم التسلسل">
          <div className='flex gap-3'>
            <input
              type="text"
              value={'1'}
              onChange={(e) => onFieldChange('invoice_number', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
              required
            />
            <input
              type="text"
              value={'فرع جدة'}
              onChange={(e) => onFieldChange('invoice_number', e.target.value)}
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
              value={'1'}
              onChange={(e) => onFieldChange('payment_method', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
              required
            />
            <input
              type="text"
              value={'نقداًَ'}
              onChange={(e) => onFieldChange('payment_method', e.target.value)}
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
              value={1}
              onChange={(e) => onFieldChange('company_name', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
            />
            <input
              type="text"
              value={'شركة العامة'}
              onChange={(e) => onFieldChange('company_name', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
            />
          </div>
        </FormField>

        {/* المخزن */}
        <FormField label="المخزن">
          <div className='flex gap-3'>
            <input
              type="text"
              value={'1'}
              onChange={(e) => onFieldChange('warehouse_name', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
            />
            <input
              type="text"
              value={'فرع جدة'}
              onChange={(e) => onFieldChange('warehouse_name', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
            />
          </div>
        </FormField>

        {/* انزال المستند */}
        <FormField label="انزال المستند">
          <div className='flex gap-3'>
            <input
              type="text"
              value={''}
              className="w-1/3 p-0.5 focus:outline-none border border-gray-400"
              onChange={(e) => onFieldChange('is_posted', e.target.value)}
            />
            <input
              type="text"
              value={'حجز البضاعة'}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
              onChange={(e) => onFieldChange('is_posted', e.target.value)}
            />
          </div>
        </FormField>

        {/* الرقم الضريبي */}
        <FormField label="الرقم الضريبي">
          <div className='flex gap-3'>
            <input
              type="text"
              value={invoice.tax_number || ''}
              onChange={(e) => onFieldChange('tax_number', e.target.value)}
              className="w-1/3 p-0.5 focus:outline-none border border-gray-400"
            />
            <div className="flex gap-3 w-2/3">
              <input
                type="text"
                value={invoice.tax_number || ''}
                onChange={(e) => onFieldChange('tax_number', e.target.value)}
                className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
              />
              <input
                type="text"
                value={invoice.tax_number || ''}
                onChange={(e) => onFieldChange('tax_number', e.target.value)}
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
              value={invoice.mobile || ''}
              onChange={(e) => onFieldChange('mobile', e.target.value)}
              className="w-1/3 p-0.5 focus:outline-none border border-gray-400"
            />
            <input
              type="tel"
              value={invoice.mobile || ''}
              onChange={(e) => onFieldChange('mobile', e.target.value)}
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
              value={'100001'}
              onChange={(e) => onFieldChange('document_number', e.target.value)}
              className="w-1/3 text-center p-0.5 focus:outline-none border border-gray-400"
            />
            <div className="flex gap-3 w-2/3">
              <input
                type="text"
                value={'فاتورة مبيعات'}
                onChange={(e) => onFieldChange('document_number', e.target.value)}
                className="w-3/5 p-0.5 text-center focus:outline-none border border-gray-400"
              />
              <div className="flex items-center justify-center gap-1 w-2/5 py-0.5 px-1 focus:outline-none border border-gray-400">
                <input type='checkbox' />
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
              value={invoice.invoice_date || ''}
              onChange={(e) => onFieldChange('invoice_date', e.target.value)}
              className="appearance-none custom-date-input w-1/3 text-center focus:outline-none border border-gray-400"
              required
            />

            <div className='flex gap-3 w-2/3'>
              <div className='w-3/5 p-0.5 text-center focus:outline-none border border-gray-400 bg-white'>
                تعليق المستند
              </div>
              <input
                type="date"
                value={invoice.supply_date || ''}
                onChange={(e) => onFieldChange('supply_date', e.target.value)}
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
              value={'1'}
              onChange={(e) => onFieldChange('branch_name', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
              required
            />
            <input
              type="text"
              value={'فرع جدة'}
              onChange={(e) => onFieldChange('branch_name', e.target.value)}
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
              value={'121001001'}
              onChange={(e) => onFieldChange('account_id', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
              required
            />
            <input
              type="text"
              value={'الصندوق العام'}
              onChange={(e) => onFieldChange('account_id', e.target.value)}
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
              value={'1'}
              onChange={(e) => onFieldChange('employee_name', e.target.value)}
              className="w-1/3 p-0.5 text-center focus:outline-none border border-gray-400"
              required
            />
            <input
              type="text"
              value={'موظف جدة 1'}
              onChange={(e) => onFieldChange('employee_name', e.target.value)}
              className="w-2/3 p-0.5 focus:outline-none border border-gray-400"
              required
            />
          </div>
        </FormField>

        {/* اسم العميل */}
        <FormField label="اسم العميل *">
          <input
            type="text"
            value={invoice.customer_name_ar || ''}
            onChange={(e) => onFieldChange('customer_name_ar', e.target.value)}
            className="w-full p-0.5 focus:outline-none border border-gray-400"
            required
          />
        </FormField>

        {/* العنوان */}
        <FormField label="العنوان">
          <input
            type="text"
            value={invoice.address || ''}
            onChange={(e) => onFieldChange('address', e.target.value)}
            className="w-full p-0.5 focus:outline-none border border-gray-400"
          />
        </FormField>
      </div>
    </div>
  );
}
