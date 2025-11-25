import { useMemo, useState, useCallback, useEffect } from 'react';
import { Product } from '../../Products/types';
import apiClient from '../../../services/api';
import { GenericSearchModal, ColumnConfig, FooterControlConfig, FilterConfig } from '../../../components/GenericSearchModal';

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
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [hideZeroQuantity, setHideZeroQuantity] = useState(false);
  const [showCostColumn, setShowCostColumn] = useState(false);

  // Fetch categories and groups for filters
  useEffect(() => {
    let cancelled = false;
    async function fetchCategoriesAndGroups() {
      try {
        const response = await apiClient.get('/products');
        if (cancelled) return;

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

        setFilters([
          {
            id: 'categories',
            label: 'الفئة',
            type: 'select',
            value: '',
            onChange: () => { },
            options: uniqueCategories.map((c) => ({ label: c, value: c })),
          },
          {
            id: 'groups',
            label: 'المجموعة',
            type: 'select',
            value: '',
            onChange: () => { },
            options: uniqueGroups.map((g) => ({ label: g, value: g })),
          }
        ])



      } catch (err) {
        if (cancelled) return;
        console.error('Error fetching products:', err);
        throw new Error('خطأ في تحميل الأصناف');
      }
    }
    fetchCategoriesAndGroups();

    return () => {
      cancelled = true;
    };
  }, []);

  // Columns configuration with dynamic visibility
  const columns: ColumnConfig<Product>[] = useMemo(
    () => [
      {
        field: 'product_code',
        label: 'رقم الصنف',
        width: 'w-[20%]',
        headerAlign: 'center',
        cellAlign: 'right',
      },
      {
        field: 'product_name_ar',
        label: 'اسم الصنف',
        width: 'w-[40%]',
        headerAlign: 'center',
        cellAlign: 'right',
      },
      {
        field: 'product_quantity',
        label: 'الكمية',
        width: 'w-[20%]',
        headerAlign: 'center',
        cellAlign: 'center',
      },
      {
        field: 'selling_price',
        label: 'سعر البيع',
        headerAlign: 'center',
        cellAlign: 'center',
        formatter: (value: any) => (value ? Number(value).toFixed(2) : '-'),
      },
      {
        field: 'cost',
        label: 'سعر التكلفة',
        headerAlign: 'center',
        cellAlign: 'center',
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

        const fetchedProductsWithQuantity = fetchedProducts.map((product) => ({
          ...product,
          product_quantity: product.product_quantity ?? '0',
        }));


        // Filter products based on search query and filters
        let results = fetchedProductsWithQuantity;

        if (query.trim()) {
          const q = query.toLowerCase();
          results = results.filter(
            (p) =>
              p.product_code.toLowerCase().includes(q) ||
              p.product_name_ar.toLowerCase().includes(q)
          );
        }

        if (filters.categories) {
          results = results.filter((p) => p.category_name_ar === filters.categories);
        }

        if (filters.groups) {
          results = results.filter((p) => p.product_group === filters.groups);
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
      initialQuery={initialQuery}
      isOpen={true}
      onClose={onClose}
      onSelect={onSelect}
      title="نافذة البحث عن الاصناف"
      searchPlaceholder="ابحث برقم أو اسم الصنف..."
      onSearch={handleSearch}
      debounceMs={300}
      columns={columns}
      filters={filters}
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
