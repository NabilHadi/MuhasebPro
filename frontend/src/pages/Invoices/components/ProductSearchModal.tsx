import { useState, useEffect } from 'react';
import { Product } from '../../Products/types';
import apiClient from '../../../services/api';
import { Check, Shapes, X } from 'lucide-react';

interface ProductSearchModalProps {
  initialQuery: string;
  onSelect: (product: Product) => void;
  onClose: () => void;
  selectFirstRowByDefault?: boolean;
}

export default function ProductSearchModal({
  initialQuery,
  onSelect,
  onClose,
  selectFirstRowByDefault = true,
}: ProductSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [hideZeroQuantity, setHideZeroQuantity] = useState(false);
  const [showCostColumn, setShowCostColumn] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const handleSearch = async (query?: string) => {
    const queryToSearch = query !== undefined ? query : searchQuery;

    setLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const response = await apiClient.get('/products');
      const fetchedProducts: Product[] = response.data;

      // Extract unique categories and groups for filters
      const uniqueCategories = Array.from(new Set(
        fetchedProducts.map(p => p.category_name_ar).filter((x): x is string => !!x)
      )).sort();
      const uniqueGroups = Array.from(new Set(
        fetchedProducts.map(p => p.product_group).filter((x): x is string => !!x)
      )).sort();

      setCategories(uniqueCategories);
      setGroups(uniqueGroups);

      // Apply filters
      let results = fetchedProducts;

      if (queryToSearch.trim()) {
        const queryLower = queryToSearch.toLowerCase();
        results = results.filter((product) => {
          return (
            product.product_code.toLowerCase().includes(queryLower) ||
            product.product_name_ar.toLowerCase().includes(queryLower)
          );
        });
      }

      if (selectedCategory) {
        results = results.filter(p => p.category_name_ar === selectedCategory);
      }

      if (selectedGroup) {
        results = results.filter(p => p.product_group === selectedGroup);
      }

      setFilteredProducts(results);

      // Auto-select first row if requested and results exist
      if (selectFirstRowByDefault && results.length > 0) {
        setSelectedRowId(results[0].id);
      } else {
        setSelectedRowId(null);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('خطأ في تحميل الأصناف');
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when modal opens with initial query
  useEffect(() => {
    if (initialQuery.trim()) {
      handleSearch(initialQuery);
    } else {
      handleSearch('');
    }
  }, [initialQuery]);

  // Re-filter when category or group changes
  useEffect(() => {
    if (hasSearched) {
      handleSearch(searchQuery);
    }
  }, [selectedCategory, selectedGroup]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleTableKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selectedProduct = filteredProducts.find(p => p.id === selectedRowId);
      if (selectedProduct) {
        onSelect(selectedProduct);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white absolute top-12 rounded-lg shadow-lg w-full max-w-[70%] min-h-[80vh] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between py-2 px-3 border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            <X size={16} />
          </button>
          <h2 className="text-sm">نافذة البحث عن الاصناف</h2>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ابحث برقم أو اسم الصنف..."
              className="flex-1 px-2  border border-gray-300 focus:outline-none  text-sm"
              autoFocus
            />
            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-2  border border-gray-300 focus:outline-none text-sm"
              >
                <option value="">القسم</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="flex-1 px-2  border border-gray-300  focus:outline-none text-sm"
              >
                <option value="">المجموعة</option>
                {groups.map((grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>

              <button className='flex justify-center items-center gap-2'>
                <Shapes size={16} /> التصنيفات
              </button>
            </div>
          </div>

        </div>
        {/* Results */}
        <div className="flex-1 overflow-y-auto px-1">
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

          {hasSearched && error && (
            <div className="p-6 text-center text-red-500">
              {error}
            </div>
          )}

          {hasSearched && !loading && !error && filteredProducts.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              لم يتم العثور على نتائج
            </div>
          )}

          {hasSearched && !loading && filteredProducts.length > 0 && (
            <table className="w-full text-sm" onKeyDown={handleTableKeyDown}>
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-2 py-1 text-center text-sm font-semibold border border-gray-400">رقم الصنف</th>
                  <th className="px-2 py-1 text-center text-sm font-semibold border border-gray-400">اسم الصنف</th>
                  <th className="px-2 py-1 text-center text-sm font-semibold border border-gray-400">كمية متاحة</th>
                  <th className="px-2 py-1 text-center text-sm font-semibold border border-gray-400">سعر البيع</th>
                  {showCostColumn && (
                    <th className="px-2 py-1 text-center text-sm font-semibold border border-gray-400">سعر التكلفة</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredProducts
                  .filter(() => !hideZeroQuantity)
                  .map((product) => (
                    <tr
                      key={product.id}
                      onClick={() => setSelectedRowId(product.id)}
                      onDoubleClick={() => onSelect(product)}
                      className={`border-b border-gray-200 cursor-pointer transition-colors ${selectedRowId === product.id
                        ? 'bg-sky-800 hover:bg-sky-900 text-white'
                        : 'hover:bg-blue-100'
                        }`}
                    >
                      <td className="px-2 py-1 text-sm border border-gray-400">{product.product_code}</td>
                      <td className="px-2 py-1 text-sm border border-gray-400">{product.product_name_ar}</td>
                      <td className="px-2 py-1 text-sm text-center border border-gray-400">
                        {'0'}
                      </td>
                      <td className="px-2 py-1 text-sm text-center border border-gray-400">
                        {product.selling_price ? Number(product.selling_price).toFixed(2) : '-'}
                      </td>
                      {showCostColumn && (
                        <td className="px-2 py-1 text-sm text-center border border-gray-400">
                          {product.cost ? Number(product.cost).toFixed(2) : '-'}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="py-2 px-3 border-t border-gray-500 bg-gray-50 flex justify-between items-center">
          {/* Right: Checkboxes */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCostColumn}
                onChange={(e) => setShowCostColumn(e.target.checked)}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm">إظهار سعر التكلفة</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hideZeroQuantity}
                onChange={(e) => setHideZeroQuantity(e.target.checked)}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm">اخفاء الكميات الصفرية</span>
            </label>
          </div>

          {/* Middle: Accept and Cancel Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                const selectedProduct = filteredProducts.find(p => p.id === selectedRowId);
                if (selectedProduct) {
                  onSelect(selectedProduct);
                }
              }}
              className="flex items-center justify-center gap-2 font-bold px-6 py-1 bg-gray-200 border-2 border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedRowId === null}
            >
              <Check size={18} /> موافق
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 font-bold px-6 py-1 bg-gray-200 border-2 border-gray-300 text-sm"
            >
              <X size={16} /> إلغاء الأمر
            </button>
          </div>

          {/* Left: Empty Select Fields */}
          <div className="flex gap-2">
            <select className="px-2 min-w-36 border border-gray-300 focus:outline-none text-sm bg-white">
              <option value="">المخزن</option>
            </select>
            <select className="px-2 min-w-36 border border-gray-300 focus:outline-none text-sm bg-white">
              <option value=""></option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
