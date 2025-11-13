import { useState } from 'react';
import apiClient from '../../../services/api';
import { Category } from './useCategories';

export interface Unit {
  id: number;
  name_ar: string;
  name_en: string;
  short_name: string;
  category_id: number;
  category_name_ar?: string;
  category_name_en?: string;
  ratio_to_base: number;
  is_base: boolean;
  is_active: boolean;
  description: string;
  created_at: string;
}

const itemsPerPage = 10;

export const useUnits = (
  _categories: Category[],
  showSuccess: (msg: string) => void,
  showError: (msg: string) => void,
  confirm?: (opts: { title: string; message: string; isDangerous?: boolean }) => Promise<boolean>
) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);
  const [unitSearchTerm, setUnitSearchTerm] = useState('');
  const [unitCategoryFilter, setUnitCategoryFilter] = useState<number | 'all'>('all');
  const [unitFilterActive, setUnitFilterActive] = useState<'all' | 'active' | 'inactive'>('active');
  const [unitCurrentPage, setUnitCurrentPage] = useState(1);
  const [showUnitConfirmModal, setShowUnitConfirmModal] = useState(false);
  const [unitToToggle, setUnitToToggle] = useState<Unit | null>(null);
  const [unitForm, setUnitForm] = useState({
    name_ar: '',
    name_en: '',
    short_name: '',
    category_id: '',
    ratio_to_base: 1,
    is_base: false,
    description: '',
  });

  const loadUnits = async () => {
    try {
      const response = await apiClient.get('/units-of-measure');
      setUnits(response.data);
    } catch (error) {
      console.error('Error loading units:', error);
      showError('فشل في تحميل وحدات القياس');
    }
  };

  const handleSaveUnit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!unitForm.name_ar.trim()) {
      showError('الاسم بالعربية مطلوب');
      return;
    }

    if (!unitForm.short_name.trim()) {
      showError('الاختصار مطلوب');
      return;
    }

    if (!unitForm.category_id) {
      showError('الفئة مطلوبة');
      return;
    }

    try {
      const payload = {
        ...unitForm,
        category_id: parseInt(unitForm.category_id),
      };

      if (editingUnitId) {
        await apiClient.put(`/units-of-measure/${editingUnitId}`, payload);
        showSuccess('تم تحديث الوحدة بنجاح');
      } else {
        await apiClient.post('/units-of-measure', payload);
        showSuccess('تم إنشاء الوحدة بنجاح');
      }
      resetUnitForm();
      loadUnits();
    } catch (error: any) {
      showError(error.response?.data?.message || 'خطأ في حفظ الوحدة');
    }
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnitId(unit.id);
    setUnitForm({
      name_ar: unit.name_ar,
      name_en: unit.name_en,
      short_name: unit.short_name,
      category_id: unit.category_id.toString(),
      ratio_to_base: unit.ratio_to_base,
      is_base: unit.is_base,
      description: unit.description,
    });
    setShowUnitForm(true);
  };

  const handleToggleUnitStatus = async (unit: Unit) => {
    if (!confirm) {
      setUnitToToggle(unit);
      setShowUnitConfirmModal(true);
      return;
    }

    const confirmed = await confirm({
      title: 'تأكيد العملية',
      message: `هل تريد ${unit.is_active ? 'تعطيل' : 'تفعيل'} الوحدة "${unit.name_ar}"؟`,
      isDangerous: unit.is_active,
    });

    if (confirmed) {
      await confirmToggleUnitStatus(unit);
    }
  };

  const confirmToggleUnitStatus = async (unit?: Unit) => {
    const targetUnit = unit || unitToToggle;
    if (!targetUnit) return;

    try {
      if (targetUnit.is_active) {
        await apiClient.patch(`/units-of-measure/${targetUnit.id}/deactivate`);
        showSuccess('تم تعطيل الوحدة بنجاح');
      } else {
        await apiClient.patch(`/units-of-measure/${targetUnit.id}/activate`);
        showSuccess('تم تفعيل الوحدة بنجاح');
      }
      loadUnits();
    } catch (error: any) {
      showError(error.response?.data?.message || 'خطأ في تحديث حالة الوحدة');
    } finally {
      setShowUnitConfirmModal(false);
      setUnitToToggle(null);
    }
  };

  const resetUnitForm = () => {
    setShowUnitForm(false);
    setEditingUnitId(null);
    setUnitForm({
      name_ar: '',
      name_en: '',
      short_name: '',
      category_id: '',
      ratio_to_base: 1,
      is_base: false,
      description: '',
    });
  };

  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.name_ar.toLowerCase().includes(unitSearchTerm.toLowerCase()) ||
      u.name_en?.toLowerCase().includes(unitSearchTerm.toLowerCase()) ||
      u.short_name.toUpperCase().includes(unitSearchTerm.toUpperCase()) ||
      u.category_name_ar?.toLowerCase().includes(unitSearchTerm.toLowerCase());

    const matchesCategory = unitCategoryFilter === 'all' || u.category_id === unitCategoryFilter;

    const matchesStatus =
      unitFilterActive === 'all' ||
      (unitFilterActive === 'active' && u.is_active) ||
      (unitFilterActive === 'inactive' && !u.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const paginatedUnits = filteredUnits.slice(
    (unitCurrentPage - 1) * itemsPerPage,
    unitCurrentPage * itemsPerPage
  );

  const unitTotalPages = Math.ceil(filteredUnits.length / itemsPerPage);

  return {
    units,
    showUnitForm,
    editingUnitId,
    unitSearchTerm,
    unitCategoryFilter,
    unitFilterActive,
    unitCurrentPage,
    showUnitConfirmModal,
    unitToToggle,
    unitForm,
    filteredUnits,
    paginatedUnits,
    unitTotalPages,
    setUnits,
    setShowUnitForm,
    setEditingUnitId,
    setUnitSearchTerm,
    setUnitCategoryFilter,
    setUnitFilterActive,
    setUnitCurrentPage,
    setShowUnitConfirmModal,
    setUnitToToggle,
    setUnitForm,
    loadUnits,
    handleSaveUnit,
    handleEditUnit,
    handleToggleUnitStatus,
    confirmToggleUnitStatus,
    resetUnitForm,
  };
};
