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
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="البحث عن فئة..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onAddClick}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        إضافة فئة
      </button>
    </div>
  );
}
