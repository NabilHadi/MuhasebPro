import { useState, useEffect } from 'react';
import apiClient from '../services/api';

interface Product {
  id: number;
  product_code: string;
  product_name_ar: string;
  quantity_on_hand: number;
  cost_price: number;
  sale_price: number;
  product_type: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">إدارة المنتجات</h1>
      
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : (
        <div className="card">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold">الرمز</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">الاسم</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">النوع</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">الكمية</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">السعر</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">{product.product_code}</td>
                  <td className="px-6 py-3 text-sm">{product.product_name_ar}</td>
                  <td className="px-6 py-3 text-sm">{product.product_type}</td>
                  <td className="px-6 py-3 text-sm text-left">{product.quantity_on_hand}</td>
                  <td className="px-6 py-3 text-sm text-left">{product.sale_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
