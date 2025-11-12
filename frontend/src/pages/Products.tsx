import { useState, useEffect } from 'react';
import apiClient from '../services/api';

interface Account {
  id: number;
  account_code: string;
  account_name_ar: string;
  account_type: string;
}

interface StockMovement {
  id: number;
  product_id: number;
  movement_type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  unit_cost: number;
  total_cost: number;
  reference?: string;
  description?: string;
  movement_date: string;
  related_journal_id?: number;
}

interface Product {
  id: number;
  product_code: string;
  product_name_ar: string;
  product_name_en?: string;
  quantity_on_hand: number;
  cost_price: number;
  sale_price: number;
  product_type: 'Stockable' | 'Service' | 'Consumable';
  reorder_level: number;
  category_id?: number;
  unit_of_measure?: string;
  track_inventory: boolean;
  warehouse_id?: number;
  income_account_id?: number;
  expense_account_id?: number;
  inventory_account_id?: number;
  is_active: boolean;
  description?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewingHistory, setViewingHistory] = useState<number | null>(null);
  const [stockHistory, setStockHistory] = useState<StockMovement[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [formData, setFormData] = useState<Partial<Product> & { quantity_on_hand: number }>({
    product_code: '',
    product_name_ar: '',
    product_name_en: '',
    product_type: 'Stockable',
    quantity_on_hand: 0,
    cost_price: 0,
    sale_price: 0,
    reorder_level: 0,
    unit_of_measure: 'وحدة',
    track_inventory: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchAccounts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('فشل في جلب المنتجات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await apiClient.get('/accounts');
      setAccounts(response.data);
    } catch (err) {
      console.error('خطأ في جلب الحسابات:', err);
    }
  };

  const fetchStockHistory = async (productId: number) => {
    try {
      const response = await apiClient.get(`/stock-movements/product/${productId}`);
      setStockHistory(response.data);
    } catch (err) {
      setError('فشل في جلب سجل المخزون');
      console.error(err);
    }
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setFormData({
      product_code: '',
      product_name_ar: '',
      product_name_en: '',
      product_type: 'Stockable',
      quantity_on_hand: 0,
      cost_price: 0,
      sale_price: 0,
      reorder_level: 0,
      unit_of_measure: 'وحدة',
      track_inventory: true,
      is_active: true,
    });
    setError('');
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleViewHistory = (productId: number) => {
    setViewingHistory(productId);
    fetchStockHistory(productId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');

      if (!formData.product_code || !formData.product_name_ar) {
        setError('رمز المنتج والاسم بالعربية مطلوبان');
        return;
      }

      if (selectedProduct) {
        await apiClient.put(`/products/${selectedProduct.id}`, formData);
        setSuccess('تم تحديث المنتج بنجاح');
      } else {
        await apiClient.post('/products', formData);
        setSuccess('تم إضافة المنتج بنجاح');
      }

      setShowForm(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      return;
    }

    try {
      setError('');
      await apiClient.delete(`/products/${id}`);
      setSuccess('تم حذف المنتج بنجاح');
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل حذف المنتج');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_name_ar.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || product.product_type === filterType;
    return matchesSearch && matchesType;
  });

  const isLowStock = (product: Product) => product.quantity_on_hand < product.reorder_level && product.reorder_level > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المنتجات</h1>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <span>➕</span>
          <span>منتج جديد</span>
        </button>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}

      {/* نموذج الإضافة/التعديل */}
      {showForm && (
        <div className="card mb-8">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-xl font-semibold">{selectedProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* الرمز */}
              <div className="form-group">
                <label className="label-field">رمز المنتج *</label>
                <input
                  type="text"
                  name="product_code"
                  value={formData.product_code}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  disabled={selectedProduct !== null}
                />
              </div>

              {/* الاسم بالعربية */}
              <div className="form-group">
                <label className="label-field">الاسم بالعربية *</label>
                <input
                  type="text"
                  name="product_name_ar"
                  value={formData.product_name_ar}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              {/* الاسم بالإنجليزية */}
              <div className="form-group">
                <label className="label-field">الاسم بالإنجليزية</label>
                <input
                  type="text"
                  name="product_name_en"
                  value={formData.product_name_en || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              {/* النوع */}
              <div className="form-group">
                <label className="label-field">نوع المنتج</label>
                <select name="product_type" value={formData.product_type} onChange={handleInputChange} className="input-field">
                  <option value="Stockable">مخزون</option>
                  <option value="Service">خدمة</option>
                  <option value="Consumable">مستهلك</option>
                </select>
              </div>

              {/* الكمية */}
              <div className="form-group">
                <label className="label-field">الكمية الحالية</label>
                <input
                  type="number"
                  name="quantity_on_hand"
                  value={formData.quantity_on_hand}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>

              {/* سعر التكلفة */}
              <div className="form-group">
                <label className="label-field">سعر التكلفة</label>
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>

              {/* سعر البيع */}
              <div className="form-group">
                <label className="label-field">سعر البيع</label>
                <input
                  type="number"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>

              {/* مستوى إعادة الطلب */}
              <div className="form-group">
                <label className="label-field">مستوى إعادة الطلب</label>
                <input
                  type="number"
                  name="reorder_level"
                  value={formData.reorder_level}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>

              {/* وحدة القياس */}
              <div className="form-group">
                <label className="label-field">وحدة القياس</label>
                <input
                  type="text"
                  name="unit_of_measure"
                  value={formData.unit_of_measure || 'وحدة'}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              {/* حساب المخزون */}
              <div className="form-group">
                <label className="label-field">حساب المخزون</label>
                <select name="inventory_account_id" value={formData.inventory_account_id || ''} onChange={handleInputChange} className="input-field">
                  <option value="">-- اختر حساب --</option>
                  {accounts
                    .filter((a) => a.account_type === 'Asset')
                    .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.account_code} - {account.account_name_ar}
                      </option>
                    ))}
                </select>
              </div>

              {/* حساب الدخل */}
              <div className="form-group">
                <label className="label-field">حساب الدخل</label>
                <select name="income_account_id" value={formData.income_account_id || ''} onChange={handleInputChange} className="input-field">
                  <option value="">-- اختر حساب --</option>
                  {accounts
                    .filter((a) => a.account_type === 'Revenue')
                    .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.account_code} - {account.account_name_ar}
                      </option>
                    ))}
                </select>
              </div>

              {/* حساب المصروف */}
              <div className="form-group">
                <label className="label-field">حساب المصروف</label>
                <select name="expense_account_id" value={formData.expense_account_id || ''} onChange={handleInputChange} className="input-field">
                  <option value="">-- اختر حساب --</option>
                  {accounts
                    .filter((a) => a.account_type === 'Expense')
                    .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.account_code} - {account.account_name_ar}
                      </option>
                    ))}
                </select>
              </div>

              {/* تتبع المخزون */}
              <div className="form-group">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="track_inventory"
                    checked={formData.track_inventory || false}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>تتبع المخزون</span>
                </label>
              </div>

              {/* نشط */}
              <div className="form-group">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active !== false}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span>نشط</span>
                </label>
              </div>
            </div>

            {/* الوصف */}
            <div className="form-group">
              <label className="label-field">الوصف</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                className="input-field"
                rows={3}
                placeholder="وصف المنتج..."
              />
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                إلغاء
              </button>
              <button type="submit" className="btn-primary">
                {selectedProduct ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* عرض سجل المخزون */}
      {viewingHistory !== null && (
        <div className="card mb-8">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-xl font-semibold">سجل الحركات - {products.find((p) => p.id === viewingHistory)?.product_name_ar}</h2>
            <button onClick={() => setViewingHistory(null)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold">التاريخ</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">النوع</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">الكمية</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">سعر الوحدة</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">الإجمالي</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">المرجع</th>
                </tr>
              </thead>
              <tbody>
                {stockHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      لا توجد حركات
                    </td>
                  </tr>
                ) : (
                  stockHistory.map((movement) => (
                    <tr key={movement.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm">
                        {new Date(movement.movement_date).toLocaleDateString('en-CA')}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          movement.movement_type === 'IN'
                            ? 'bg-green-100 text-green-800'
                            : movement.movement_type === 'OUT'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {movement.movement_type === 'IN'
                            ? 'إدخال'
                            : movement.movement_type === 'OUT'
                            ? 'إخراج'
                            : 'تعديل'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-left">{movement.quantity.toFixed(2)}</td>
                      <td className="px-6 py-3 text-sm text-left">{movement.unit_cost.toFixed(2)}</td>
                      <td className="px-6 py-3 text-sm text-left font-semibold">{movement.total_cost.toFixed(2)}</td>
                      <td className="px-6 py-3 text-sm">{movement.reference || '--'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* البحث والتصفية */}
      <div className="card mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label-field">بحث</label>
            <input
              type="text"
              placeholder="ابحث برمز أو اسم المنتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label className="label-field">النوع</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field">
              <option value="">الكل</option>
              <option value="Stockable">مخزون</option>
              <option value="Service">خدمة</option>
              <option value="Consumable">مستهلك</option>
            </select>
          </div>
        </div>
      </div>

      {/* قائمة المنتجات */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">المنتجات ({filteredProducts.length})</h2>
        </div>
        {loading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">لا توجد منتجات</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold">الرمز</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">الاسم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">النوع</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">الكمية</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">سعر التكلفة</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">سعر البيع</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b hover:bg-gray-50 ${isLowStock(product) ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-3 text-sm font-mono">{product.product_code}</td>
                    <td className="px-6 py-3 text-sm">
                      <div>{product.product_name_ar}</div>
                      {isLowStock(product) && (
                        <div className="text-xs text-red-600 font-semibold">⚠️ مخزون منخفض</div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.product_type === 'Stockable'
                          ? 'bg-blue-100 text-blue-800'
                          : product.product_type === 'Service'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {product.product_type === 'Stockable'
                          ? 'مخزون'
                          : product.product_type === 'Service'
                          ? 'خدمة'
                          : 'مستهلك'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-left">
                      {parseFloat(String(product.quantity_on_hand)).toFixed(2)} {product.unit_of_measure}
                    </td>
                    <td className="px-6 py-3 text-sm text-left">{parseFloat(String(product.cost_price)).toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm text-left">{parseFloat(String(product.sale_price)).toFixed(2)}</td>
                    <td className="px-6 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleViewHistory(product.id)}
                        className="inline-block px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        📊 السجل
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="inline-block px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      >
                        ✏️ تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="inline-block px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        🗑️ حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
