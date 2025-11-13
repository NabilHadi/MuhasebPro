interface CategorySearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddClick: () => void;
}

export default function CategorySearch({
  searchTerm,
  onSearchChange,
  onAddClick,
}: CategorySearchProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <button
          onClick={onAddClick}
          className="btn-primary flex items-center gap-2"
        >
          <span>➕</span>
          <span>إضافة فئة جديدة</span>
        </button>
      <input
        type="text"
        placeholder="ابحث عن الفئات..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
