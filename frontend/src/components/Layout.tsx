import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TabBar from './TabBar';
import { useTabStore } from '../store/tabStore';

export default function Layout() {
  const { tabs, activeTabId, addTab, switchTab } = useTabStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync URL when tabs load on page refresh
  useEffect(() => {
    if (tabs.length === 0 && location.pathname !== '/login') {
      // No tabs - create default dashboard tab
      addTab({
        id: 'dashboard-default',
        title: 'القائمة الرئيسية',
        path: '/',
        icon: '📊',
      });
    } else if (tabs.length > 0 && activeTabId) {
      // Tabs exist - navigate to active tab's path
      const activeTab = tabs.find((t) => t.id === activeTabId);
      if (activeTab && location.pathname !== activeTab.path) {
        navigate(activeTab.path);
      }
    }
  }, []); // Only run on mount

  // Sync tab when URL changes (when user navigates via browser back/forward)
  useEffect(() => {
    if (tabs.length > 0) {
      const matchingTab = tabs.find((t) => t.path === location.pathname);
      if (matchingTab && activeTabId !== matchingTab.id) {
        switchTab(matchingTab.id);
      }
    }
  }, [location.pathname, tabs, activeTabId, switchTab]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TabBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
