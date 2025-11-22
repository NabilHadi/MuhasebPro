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
    <div className="p-2 rounded-lg">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          {/* رقم التسلسل */}
          <FormField label="رقم التسلسل *">
            <input
              type="text"
              value={invoice.invoice_number || ''}
              onChange={(e) => onFieldChange('invoice_number', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
              required
            />
          </FormField>

          {/* طريقة الدفع */}
          <FormField label="طريقة الدفع">
            <select
              value={invoice.payment_method || ''}
              onChange={(e) => onFieldChange('payment_method', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
            >
              <option value="">اختر طريقة الدفع</option>
              <option value="نقدا">نقدا</option>
              <option value="شيك">شيك</option>
              <option value="تحويل بنكي">تحويل بنكي</option>
              <option value="بطاقة ائتمان">بطاقة ائتمان</option>
            </select>
          </FormField>

          {/* الشركة */}
          <FormField label="الشركة">
            <input
              type="text"
              value={invoice.company_name || ''}
              onChange={(e) => onFieldChange('company_name', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
            />
          </FormField>

          {/* المخزن */}
          <FormField label="المخزن">
            <input
              type="text"
              value={invoice.warehouse_name || ''}
              onChange={(e) => onFieldChange('warehouse_name', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
            />
          </FormField>

          {/* انزال المستند */}
          <FormField label="انزال المستند">
            <input
              type="text"
              value={''}
              className="w-full focus:outline-none border border-gray-400"
              onChange={(e) => onFieldChange('is_posted', e.target.value)}
            />
          </FormField>

          {/* الرقم الضريبي */}
          <FormField label="الرقم الضريبي">
            <input
              type="text"
              value={invoice.tax_number || ''}
              onChange={(e) => onFieldChange('tax_number', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
            />
          </FormField>

          {/* رقم الجوال */}
          <FormField label="رقم الجوال">
            <input
              type="tel"
              value={invoice.mobile || ''}
              onChange={(e) => onFieldChange('mobile', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
            />
          </FormField>
        </div>

        {/* Right Column */}
        <div className="space-y-3">

          {/* رقم المستند */}
          <FormField label="رقم المستند">
            <input
              type="text"
              value={invoice.document_number || ''}
              onChange={(e) => onFieldChange('document_number', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
            />
          </FormField>

          <div className='flex gap-2 w-full justify-between'>
            {/* التاريخ */}
            <FormField label="التاريخ *">
              <input
                type="date"
                value={invoice.invoice_date || ''}
                onChange={(e) => onFieldChange('invoice_date', e.target.value)}
                className="w-full focus:outline-none border border-gray-400"
                required
              />
            </FormField>

            {/* تاريخ التوريد */}
            <FormField label="تاريخ التوريد">
              <input
                type="date"
                value={invoice.supply_date || ''}
                onChange={(e) => onFieldChange('supply_date', e.target.value)}
                className="w-full focus:outline-none border border-gray-400"
              />
            </FormField>
          </div>


          {/* الفرع */}
          <FormField label="الفرع">
            <input
              type="text"
              value={invoice.branch_name || ''}
              onChange={(e) => onFieldChange('branch_name', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
            />
          </FormField>

          {/* رقم الحساب */}
          <FormField label="رقم الحساب">
            <input
              type="text"
              value={invoice.account_id || ''}
              onChange={(e) => onFieldChange('account_id', e.target.value as any)}
              className="w-full focus:outline-none border border-gray-400"
            />
          </FormField>

          {/* الموظف */}
          <FormField label="الموظف">
            <input
              type="text"
              value={invoice.employee_name || ''}
              onChange={(e) => onFieldChange('employee_name', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
            />
          </FormField>

          {/* اسم العميل */}
          <FormField label="اسم العميل *">
            <input
              type="text"
              value={invoice.customer_name_ar || ''}
              onChange={(e) => onFieldChange('customer_name_ar', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
              required
            />
          </FormField>

          {/* العنوان */}
          <FormField label="العنوان">
            <input
              type="text"
              value={invoice.address || ''}
              onChange={(e) => onFieldChange('address', e.target.value)}
              className="w-full focus:outline-none border border-gray-400"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
