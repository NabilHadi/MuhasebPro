

export default function SalesManagement() {

  const handleOpenInvoices = () => {
    // TODO: Add invoices logic later
  };

  const handleOpenCustomers = () => {
    // TODO: Add invoices logic later
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المبيعات</h1>
      </div>

      

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleOpenInvoices}
          className="card hover:shadow-lg transition cursor-pointer p-6 text-center"
        >
          <div className="text-4xl mb-3">🧾</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">الفواتير</h2>
          <p className="text-gray-600 text-sm">إدارة الفواتير والمبيعات</p>
          <p className='text-black mt-2'>(قريبا)</p>

        </button>

        <button
          onClick={handleOpenCustomers}
          className="card hover:shadow-lg transition cursor-pointer p-6 text-center"
        >
          <div className="text-4xl mb-3">👤</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">العملاء</h2>
          <p className="text-gray-600 text-sm">إدارة بيانات العملاء</p>
          <p className='text-black mt-2'>(قريبا)</p>
        </button>
      </div>
    </div>
  );
}
