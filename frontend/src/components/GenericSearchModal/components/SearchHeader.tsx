import { X } from 'lucide-react';

interface SearchHeaderProps {
  title: string;
  onClose: () => void;
}

export default function SearchHeader({ title, onClose }: SearchHeaderProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 border-b border-gray-200 flex-shrink-0">
      <h2 className="text-sm font-semibold">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
      >
        <X size={16} />
      </button>
    </div>
  );
}
