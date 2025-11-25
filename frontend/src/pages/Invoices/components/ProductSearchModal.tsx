import { useMemo, useState, useCallback } from 'react';
import { Product } from '../../Products/types';
import apiClient from '../../../services/api';
import { GenericSearchModal, ColumnConfig, FooterControlConfig } from '../../../components/GenericSearchModal';

interface ProductSearchModalProps {
  initialQuery: string;
  onSelect: (product: Product) => void;
  onClose: () => void;
  selectFirstRowByDefault?: boolean;
}

export default function ProductSearchModal({
  initialQuery: _initialQuery,
  onSelect,
  onClose,
  selectFirstRowByDefault = true,
}: ProductSearchModalProps) {
  const [_allProducts, setAllProducts] = useState<Product[]>([]);
  const [_categories, setCategories] = useState<string[]>([]);
  const [_groups, setGroups] = useState<string[]>([]);
  const [hideZeroQuantity, setHideZeroQuantity] = useState(false);
  const [showCostColumn, setShowCostColumn] = useState(false);

  // Columns configuration with dynamic visibility
  const columns: ColumnConfig<Product>[] = useMemo(
    () => [
      {
        field: 'product_code',
        label: 'رقم الصنف',
        width: 'w-20',
      },
      {
        field: 'product_name_ar',
        label: 'اسم الصنف',
        width: 'w-40',
      },
      {
        field: 'selling_price',
        label: 'سعر البيع',
        align: 'center',
        formatter: (value: any) => (value ? Number(value).toFixed(2) : '-'),
      },
      {
        field: 'cost',
        label: 'سعر التكلفة',
        align: 'center',
        visible: showCostColumn,
        formatter: (value: any) => (value ? Number(value).toFixed(2) : '-'),
      },
    ],
    [showCostColumn]
  );

  // Footer controls configuration
  const footerControls: FooterControlConfig[] = useMemo(
    () => [
      {
        id: 'showCost',
        type: 'checkbox',
        label: 'إظهار سعر التكلفة',
        value: showCostColumn,
        onChange: setShowCostColumn,
      },
      {
        id: 'hideZeroQty',
        type: 'checkbox',
        label: 'إخفاء الكميات الصفرية',
        value: hideZeroQuantity,
        onChange: setHideZeroQuantity,
      },
    ],
    [hideZeroQuantity, showCostColumn]
  );

  // Async search function
  const handleSearch = useCallback(
    async (query: string, filters: Record<string, any>) => {
      try {
        const response = await apiClient.get('/products');
        const fetchedProducts: Product[] = response.data;

        // Update categories and groups on first fetch
        const uniqueCategories = Array.from(
          new Set(
            fetchedProducts
              .map((p) => p.category_name_ar)
              .filter((x): x is string => !!x)
          )
        ).sort();
        const uniqueGroups = Array.from(
          new Set(
            fetchedProducts.map((p) => p.product_group).filter((x): x is string => !!x)
          )
        ).sort();

        setCategories(uniqueCategories);
        setGroups(uniqueGroups);
        setAllProducts(fetchedProducts);

        // Filter products based on search query and filters
        let results = fetchedProducts;

        if (query.trim()) {
          const q = query.toLowerCase();
          results = results.filter(
            (p) =>
              p.product_code.toLowerCase().includes(q) ||
              p.product_name_ar.toLowerCase().includes(q)
          );
        }

        if (filters.category) {
          results = results.filter((p) => p.category_name_ar === filters.category);
        }

        if (filters.group) {
          results = results.filter((p) => p.product_group === filters.group);
        }

        return results;
      } catch (err) {
        console.error('Error fetching products:', err);
        throw new Error('خطأ في تحميل الأصناف');
      }
    },
    [hideZeroQuantity]
  );

  return (
    <GenericSearchModal
      isOpen={true}
      onClose={onClose}
      onSelect={onSelect}
      title="نافذة البحث عن الاصناف"
      searchPlaceholder="ابحث برقم أو اسم الصنف..."
      onSearch={handleSearch}
      debounceMs={300}
      columns={columns}
      rowKeyField="id"
      selectFirstByDefault={selectFirstRowByDefault}
      acceptButtonLabel="موافق"
      closeButtonLabel="إلغاء الأمر"
      footerControls={footerControls}
      noResultsMessage="لم يتم العثور على نتائج"
      emptyStateMessage="ابحث برقم أو اسم الصنف"
    />
  );
}
