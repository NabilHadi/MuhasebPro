import { CirclePoundSterling, ClipboardList, Copy, CornerLeftDown, CornerRightDown, DollarSign, Download, Percent, Plus, Printer, RefreshCcw, Rotate3d, RotateCcw, Save, Search, Sheet, X } from 'lucide-react';
import ExcelIcon from '../../../assets/excel.png';
import BinderIcon from '../../../assets/binder.png';

interface InvoiceActionButtonsProps {
  isButtonEnabled: (buttonId: string) => boolean;
  onAddNewInvoice: () => void;
  onEditInvoice: () => void;
  onShowSearch: () => void;
  onNextInvoice: () => void;
  onPreviousInvoice: () => void;
  onSaveInvoice: () => void;
  onUndo: () => void;
}

export default function InvoiceActionButtons({
  isButtonEnabled,
  onAddNewInvoice,
  onEditInvoice,
  onShowSearch,
  onNextInvoice,
  onPreviousInvoice,
  onSaveInvoice,
  onUndo,
}: InvoiceActionButtonsProps) {
  const buttonClass = (buttonId: string) =>
    `text-sm px-1 py-1 font-semibold flex items-center gap-1 ${isButtonEnabled(buttonId)
      ? 'hover:bg-gray-200 cursor-pointer'
      : 'opacity-50 cursor-not-allowed'
    }`;

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-shrink">
        <button
          onClick={onAddNewInvoice}
          disabled={!isButtonEnabled('add')}
          className={buttonClass('add')}
        >
          <Plus size={16} /> اضافة
        </button>
        <button
          onClick={onEditInvoice}
          disabled={!isButtonEnabled('edit')}
          className={buttonClass('edit')}
        >
          <RefreshCcw size={16} /> تعديل
        </button>
        <button
          disabled={!isButtonEnabled('delete')}
          className={buttonClass('delete')}
        >
          <X size={16} /> حذف
        </button>
        <button
          onClick={onShowSearch}
          disabled={!isButtonEnabled('show')}
          className={buttonClass('show')}
        >
          <Search size={16} /> عرض
        </button>
        <button
          onClick={onNextInvoice}
          disabled={!isButtonEnabled('next')}
          className={buttonClass('next')}
        >
          <CornerRightDown size={16} /> التالي
        </button>
        <button
          onClick={onPreviousInvoice}
          disabled={!isButtonEnabled('previous')}
          className={buttonClass('previous')}
        >
          <CornerLeftDown size={16} /> السابق
        </button>
        <button
          onClick={onSaveInvoice}
          disabled={!isButtonEnabled('save')}
          className={buttonClass('save')}
        >
          <Save size={16} /> حفظ
        </button>
        <button
          disabled={!isButtonEnabled('print')}
          className={buttonClass('print')}
        >
          <Printer size={16} /> طباعة
        </button>
        <button
          disabled={!isButtonEnabled('import')}
          className={buttonClass('import')}
        >
          <img src={ExcelIcon} alt="Excel" className="w-4 h-4" /> استيراد
        </button>
        <button
          disabled={!isButtonEnabled('attachments')}
          className={buttonClass('attachments')}
        >
          <img src={BinderIcon} alt="Binder" className="w-4 h-4" /> مرفقات
        </button>
        <button
          disabled={!isButtonEnabled('entry')}
          className={buttonClass('entry')}
        >
          <Sheet size={16} /> القيد
        </button>
        <button
          disabled={!isButtonEnabled('convert')}
          className={buttonClass('convert')}
        >
          <RefreshCcw size={16} /> تحويل
        </button>
        <button
          disabled={!isButtonEnabled('relations')}
          className={buttonClass('relations')}
        >
          <Rotate3d size={16} /> العلاقات
        </button>
        <button
          onClick={onUndo}
          disabled={!isButtonEnabled('undo')}
          className={buttonClass('undo')}
        >
          <RotateCcw size={16} /> تراجع
        </button>
      </div>

      {/* Secondary Bar */}
      <div className="text-sm text-center bg-sky-800 text-white flex-shrink flex justify-between items-center">
        <div className="flex items-center">
          <button className="text-sm px-2 py-2 bg-sky-900 font-semibold flex items-center gap-1">
            <Copy size={16} /> نسخ البيانات
          </button>
          <button className="text-sm px-2 py-2 bg-sky-900 font-semibold flex items-center gap-1">
            <ClipboardList size={16} /> لصق البيانات
          </button>
          <button className="text-sm px-2 py-2 bg-sky-900 font-semibold flex items-center gap-1">
            <ClipboardList size={16} /> مردود مبيعات
          </button>
          <button className="text-sm px-2 py-2 bg-sky-900 font-semibold flex items-center gap-1">
            <ClipboardList size={16} /> ترحيل
          </button>
        </div>
        <span className="font-bold">فاتورة مبيعات</span>
        <div className="flex items-center">
          <button className="text-sm px-2 py-2 font-semibold bg-sky-900 flex items-center gap-1">
            <Download size={16} /> حجز البضاعة
          </button>
          <button className="text-sm px-2 py-2 font-semibold bg-sky-900 flex items-center gap-1">
            <CirclePoundSterling size={16} />
            سند القبض
          </button>
          <button className="text-sm px-2 py-2 font-semibold bg-sky-900 flex items-center gap-1">
            <Percent size={16} />
            حسابة الخصم
          </button>
          <button className="text-sm px-2 py-2 font-semibold bg-sky-900 flex items-center gap-1">
            <DollarSign size={16} />
            حاسبة المبلغ
          </button>
        </div>
      </div>
    </>
  );
}
