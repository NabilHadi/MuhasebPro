import { useTabStore } from '../store/tabStore';
import { useNavigate } from 'react-router-dom';

export default function TabBar() {
  const { tabs, activeTabId, removeTab, switchTab } = useTabStore();
  const navigate = useNavigate();

  const handleTabClick = (tabId: string, path: string) => {
    switchTab(tabId);
    navigate(path);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();

    // If closing the active tab, find the next tab to navigate to
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter((t) => t.id !== tabId);

      if (remainingTabs.length > 0) {
        // Navigate to the last remaining tab
        const nextTab = remainingTabs[remainingTabs.length - 1];
        navigate(nextTab.path);
      } else {
        // If no tabs remain, navigate to home
        navigate('/');
      }
    }

    removeTab(tabId);
  };

  return (
    <div className="tab-bar h-8 ">
      <div className="tabs-container">
        {tabs.length > 0 ? (
          tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab ${activeTabId === tab.id ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => handleTabClick(tab.id, tab.path)}
            >
              <span>{tab.icon || '📄'}</span>
              <span className="tab-title">{tab.title}</span>
              <button
                className="tab-close"
                onClick={(e) => handleCloseTab(e, tab.id)}
                title="إغلاق التبويب"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <div className="tab-empty">
            <span className="text-gray-400 text-sm">لا توجد تبويبات مفتوحة</span>
          </div>
        )}
      </div>
    </div>
  );
}
