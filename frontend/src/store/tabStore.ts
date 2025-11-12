import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: string;
}

interface TabStore {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Tab) => void;
  removeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  closeAllTabs: () => void;
  getTabs: () => Tab[];
  getActiveTab: () => Tab | null;
}

export const useTabStore = create<TabStore>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,

      addTab: (tab: Tab) => {
        set((state) => {
          const existingTab = state.tabs.find((t) => t.path === tab.path);
          if (existingTab) {
            // If tab already exists, just switch to it
            set({ activeTabId: existingTab.id });
            return state;
          }
          // Add new tab
          return {
            tabs: [...state.tabs, tab],
            activeTabId: tab.id,
          };
        });
      },

      removeTab: (tabId: string) => {
        set((state) => {
          const newTabs = state.tabs.filter((t) => t.id !== tabId);
          let newActiveId = state.activeTabId;

          // If we closed the active tab, switch to another one
          if (state.activeTabId === tabId) {
            newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
          }

          return {
            tabs: newTabs,
            activeTabId: newActiveId,
          };
        });
      },

      switchTab: (tabId: string) => {
        set((state) => {
          const tabExists = state.tabs.find((t) => t.id === tabId);
          if (tabExists) {
            return { activeTabId: tabId };
          }
          return state;
        });
      },

      closeAllTabs: () => {
        set({ tabs: [], activeTabId: null });
      },

      getTabs: () => get().tabs,

      getActiveTab: () => {
        const state = get();
        return state.tabs.find((t) => t.id === state.activeTabId) || null;
      },
    }),
    {
      name: 'tab-store', // persist to localStorage
    }
  )
);
