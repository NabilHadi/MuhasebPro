interface TabsProps {
  activeTab: 'units' | 'categories';
  onTabChange: (tab: 'units' | 'categories') => void;
}

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex gap-4 border-b">
      <button
        onClick={() => onTabChange('units')}
        className={`px-6 py-3 font-medium transition-colors border-b-2 ${
          activeTab === 'units'
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-gray-800'
        }`}
      >
        وحدات القياس
      </button>
      <button
        onClick={() => onTabChange('categories')}
        className={`px-6 py-3 font-medium transition-colors border-b-2 ${
          activeTab === 'categories'
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-gray-800'
        }`}
      >
        انواع وحدات القياس
      </button>
    </div>
  );
}
