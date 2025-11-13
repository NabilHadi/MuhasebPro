import { useNavigate } from 'react-router-dom';
import { useTabStore } from '../store/tabStore';

export interface ManagementButton {
  id: string;
  icon: string;
  title: string;
  description: string;
  path: string;
  tabTitle: string;
  isDisabled?: boolean;
}

interface ManagementButtonsProps {
  buttons: ManagementButton[];
  columns?: number;
}

export default function ManagementButtons({
  buttons,
  columns = 3,
}: ManagementButtonsProps) {
  const navigate = useNavigate();
  const { addTab } = useTabStore();

  const handleButtonClick = (button: ManagementButton) => {
    if (button.isDisabled) return;

    const tabId = `${button.id}-${Date.now()}`;
    addTab({
      id: tabId,
      title: button.tabTitle,
      path: button.path,
      icon: button.icon,
    });
    navigate(button.path);
  };

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns] || 'md:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => handleButtonClick(button)}
          disabled={button.isDisabled}
          className={`card hover:shadow-lg transition cursor-pointer p-3 text-center ${button.isDisabled ? 'opacity-60 cursor-not-allowed' : ''
            }`}
        >
          <div className="flex items-center  gap-2 mb-1">
            <span className="text-2xl">{button.icon}</span>
            <h2 className="text-lg font-semibold text-gray-800">
              {button.title}
            </h2>
          </div>
          <p className="text-gray-600 text-xs">{button.description}</p>
          {button.isDisabled && (
            <p className="text-black text-xs mt-1">(قريبا)</p>
          )}
        </button>
      ))}
    </div>
  );
}
