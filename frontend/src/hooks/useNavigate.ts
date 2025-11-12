import { useNavigate as useReactNavigate } from 'react-router-dom';
import { useTabStore } from '../store/tabStore';
import { Tab } from '../store/tabStore';

/**
 * Custom hook that wraps React Router's useNavigate
 * Automatically adds tabs when navigating
 */
export function useNavigate() {
  const navigate = useReactNavigate();
  const { addTab } = useTabStore();

  const navigateTo = (path: string, title: string, icon?: string) => {
    // Generate unique tab ID based on path and timestamp
    const tabId = `${path}-${Date.now()}`;
    
    const newTab: Tab = {
      id: tabId,
      title,
      path,
      icon,
    };

    addTab(newTab);
    navigate(path);
  };

  // Also expose the original navigate for cases where we don't want tabs
  return { navigateTo, navigate };
}
