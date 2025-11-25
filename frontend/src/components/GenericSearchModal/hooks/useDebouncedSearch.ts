import { useState, useRef, useCallback } from 'react';

export const useDebouncedSearch = <T,>(
  onSearch: (query: string, filters: Record<string, any>) => Promise<T[]>,
  debounceMs: number = 300
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const performSearch = useCallback(
    async (query: string, filters: Record<string, any>) => {
      setLoading(true);
      setError(null);
      try {
        const data = await onSearch(query, filters);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
        setError('خطأ في البحث');
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [onSearch]
  );

  const debouncedSearch = useCallback(
    (query: string, filters: Record<string, any>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        performSearch(query, filters);
      }, debounceMs);
    },
    [debounceMs, performSearch]
  );

  return {
    searchQuery,
    setSearchQuery,
    results,
    setResults,
    loading,
    error,
    debouncedSearch,
    performSearch,
  };
};
