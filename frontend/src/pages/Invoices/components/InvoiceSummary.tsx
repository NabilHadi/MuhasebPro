interface InvoiceSummaryProps {
  subtotal: number;
  discountFixed?: number;
  discountPercent?: number;
  tax: number;
  quantity?: number;
  discount?: number;
}

export default function InvoiceSummary({
  subtotal,
  discountFixed = 0,
  discountPercent = 0,
  tax = 0,
  quantity = 0,
  discount = 0,
}: InvoiceSummaryProps) {
  const amountAfterDiscount = subtotal - discountFixed - (subtotal * discountPercent) / 100;
  const finalTotal = amountAfterDiscount + tax;

  return (
    <div className="p-2 flex w-full gap-2">
      <div className="flex-1 flex flex-col gap-1">
        {/* الضريبة بالمحلي */}
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 font-bold">الضريبة بالمحلي</div>
          <div className="text-center font-bold flex-1 border-2 border-gray-400 bg-green-100">
            {tax.toFixed(2)}
          </div>
        </div>

        {/* النهائي بالمحلي */}
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 font-bold">النهائي بالمحلي</div>
          <div className="text-center font-bold flex-1 border-2 border-gray-400 bg-green-100">
            {finalTotal.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        {/* الصافي */}
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 font-bold ml-[0.3rem]">الصافي </div>
          <div className="text-center font-bold flex-1 border-2 border-gray-400 bg-red-100">
            {amountAfterDiscount.toFixed(2)}
          </div>
        </div>

        {/* الفاتورة */}
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 font-bold">الفاتورة</div>
          <div className="text-center font-bold flex-1 border-2 border-gray-400 bg-red-100">
            {subtotal.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        {/* الخصم */}
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 font-bold ml-[0.2rem]">الخصم</div>
          <div className="text-center font-bold flex-1 border-2 border-gray-400 bg-sky-100">
            {discount.toFixed(2)}
          </div>
        </div>
        {/* الكمية */}
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 font-bold">الكمية</div>
          <div className="text-center font-bold flex-1 border-2 border-gray-400 bg-sky-100">
            {quantity}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        {/* الضريبة */}
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 font-bold">الضريبة</div>
          <div className="text-center font-bold flex-1 border-2 border-gray-400 bg-white">
            {tax.toFixed(2)}
          </div>
        </div>
        {/* النهائي */}
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 font-bold">النهائي</div>
          <div className="text-center font-bold flex-1 border-2 border-gray-400 bg-white">
            {finalTotal.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        {/* خصم اضافي قيمة */}
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 font-bold">خصم اضافي قيمة</div>
          <div className="text-center font-bold flex-1 border-2 border-gray-400 bg-yellow-100">
            {discountFixed}
          </div>
        </div>

        {/* خصم اضافي نسبة */}
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 font-bold ml-[0.1rem]">خصم اضافي نسبة</div>
          <div className="text-center font-bold flex-1 border-2 border-gray-400 bg-yellow-100">
            {discountPercent}
          </div>
        </div>
      </div>
    </div >
  );
}
