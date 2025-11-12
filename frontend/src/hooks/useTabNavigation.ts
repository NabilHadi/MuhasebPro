import { useNavigate } from 'react-router-dom';
import { useTabStore } from '../store/tabStore';
import { Tab } from '../store/tabStore';

export function useTabNavigation() {
  const navigate = useNavigate();
  const { addTab } = useTabStore();

  const openTab = (tab: Tab) => {
    addTab(tab);
    navigate(tab.path);
  };

  return { openTab };
}
