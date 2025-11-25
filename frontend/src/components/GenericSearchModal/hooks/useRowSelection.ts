import { useState, useCallback } from 'react';

export const useRowSelection = <T,>(
  _rowKeyField: keyof T,
  selectFirstByDefault: boolean = true
) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);

  const selectRow = useCallback((index: number, totalRows: number) => {
    if (totalRows === 0) {
      setSelectedRowIndex(-1);
    } else if (index < 0) {
      setSelectedRowIndex(totalRows - 1); // wrap to end
    } else if (index >= totalRows) {
      setSelectedRowIndex(0); // wrap to start
    } else {
      setSelectedRowIndex(index);
    }
  }, []);

  const nextRow = useCallback((totalRows: number) => {
    setSelectedRowIndex((prev) => {
      if (totalRows === 0) return -1;
      const next = prev + 1;
      return next >= totalRows ? 0 : next;
    });
  }, []);

  const prevRow = useCallback((totalRows: number) => {
    setSelectedRowIndex((prev) => {
      if (totalRows === 0) return -1;
      const prev_val = prev - 1;
      return prev_val < 0 ? totalRows - 1 : prev_val;
    });
  }, []);

  const resetSelection = useCallback((totalRows: number) => {
    if (selectFirstByDefault && totalRows > 0) {
      setSelectedRowIndex(0);
    } else {
      setSelectedRowIndex(-1);
    }
  }, [selectFirstByDefault]);

  return {
    selectedRowIndex,
    setSelectedRowIndex,
    selectRow,
    nextRow,
    prevRow,
    resetSelection,
  };
};
