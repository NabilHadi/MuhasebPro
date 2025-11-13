import { Category } from '../hooks/useCategories';

interface CategoryTabProps {
  showForm: boolean;
  isEditing: boolean;
  formData: {
    name_ar: string;
    name_en: string;
    description: string;
  };
  filteredCategories: Category[];
  searchTerm: string;
  onFormChange: (updates: any) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onFormCancel: () => void;
  onAddClick: () => void;
  onSearchChange: (term: string) => void;
  onCategoryEdit: (category: Category) => void;
  onCategoryToggle: (category: Category) => void;
  CategoryForm: React.ComponentType<any>;
  CategorySearch: React.ComponentType<any>;
  CategoriesGrid: React.ComponentType<any>;
}

export default function CategoryTab({
  showForm,
  isEditing,
  formData,
  filteredCategories,
  searchTerm,
  onFormChange,
  onFormSubmit,
  onFormCancel,
  onAddClick,
  onSearchChange,
  onCategoryEdit,
  onCategoryToggle,
  CategoryForm,
  CategorySearch,
  CategoriesGrid,
}: CategoryTabProps) {
  return (
    <div className="space-y-6">
      <CategoryForm
        isOpen={showForm}
        isEditing={isEditing}
        formData={formData}
        onFormChange={onFormChange}
        onSubmit={onFormSubmit}
        onCancel={onFormCancel}
      />

      {!showForm && (
        <div className="flex gap-2">
          <button onClick={onAddClick} className="btn-primary flex items-center gap-2">
            <span>➕</span>
            <span>إضافة فئة جديدة</span>
          </button>
        </div>
      )}

      {!showForm && (
        <CategorySearch
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      )}

      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CategoriesGrid
            categories={filteredCategories}
            onEdit={onCategoryEdit}
            onToggleStatus={onCategoryToggle}
          />
        </div>
      )}
    </div>
  );
}
