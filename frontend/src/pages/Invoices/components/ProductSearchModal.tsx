import { useState, useEffect } from 'react';
import { Product } from '../../Products/types';

interface ProductSearchModalProps {
  initialQuery: string;
  onSelect: (product: Product) => void;
  onClose: () => void;
}

export default function ProductSearchModal({
  initialQuery,
  onSelect,
  onClose,
}: ProductSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock products list - In real implementation, this would come from an API
  const mockProducts: Product[] = [
    {
      id: 1,
      product_code: 'PRD-001',
      product_name_ar: 'كمبيوتر محمول',
      selling_price: 5000,
      unit_name_ar: 'قطعة',
      product_type: 'Stockable',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      product_code: 'PRD-002',
      product_name_ar: 'فأرة كمبيوتر',
      selling_price: 50,
      unit_name_ar: 'قطعة',
      product_type: 'Stockable',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      product_code: 'PRD-003',
      product_name_ar: 'لوحة مفاتيح',
      selling_price: 150,
      unit_name_ar: 'قطعة',
      product_type: 'Stockable',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 4,
      product_code: 'PRD-004',
      product_name_ar: 'شاشة',
      selling_price: 1200,
      unit_name_ar: 'قطعة',
      product_type: 'Stockable',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const handleSearch = async (query?: string) => {
    const queryToSearch = query !== undefined ? query : searchQuery;

    if (!queryToSearch.trim()) {
      setFilteredProducts([]);
      setHasSearched(true);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const queryLower = queryToSearch.toLowerCase();
    // Search in both code AND name simultaneously
    const results = mockProducts.filter((product) => {
      return (
        product.product_code.toLowerCase().includes(queryLower) ||
        product.product_name_ar.toLowerCase().includes(queryLower)
      );
    });

    setFilteredProducts(results);
    setLoading(false);
  };

  // Auto-search when modal opens with initial query
  useEffect(() => {
    if (initialQuery.trim()) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold">البحث عن الصنف</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ابحث برقم أو اسم الصنف..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={() => handleSearch()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              {loading ? 'جاري البحث...' : 'بحث'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {!hasSearched && (
            <div className="p-6 text-center text-gray-500">
              ابحث برقم أو اسم الصنف
            </div>
          )}

          {hasSearched && loading && (
            <div className="p-6 text-center text-gray-500">
              جاري البحث...
            </div>
          )}

          {hasSearched && !loading && filteredProducts.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              لم يتم العثور على نتائج
            </div>
          )}

          {hasSearched && !loading && filteredProducts.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-2 text-right text-sm font-semibold">رقم الصنف</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold">اسم الصنف</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold">السعر</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold">الوحدة</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => onSelect(product)}
                    className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-sm">{product.product_code}</td>
                    <td className="px-4 py-3 text-sm">{product.product_name_ar}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      {product.selling_price?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {product.unit_name_ar || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
