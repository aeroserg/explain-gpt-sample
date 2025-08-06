import { create } from 'zustand';

type SettingsTab = 'account' | 'subscription';
type SubscriptionView = 'active' | 'available';

interface UIState {
  isSettingsModalOpen: boolean;
  settingsModalActiveTab: SettingsTab;
  subscriptionSettingsView: SubscriptionView;
  openSettingsModal: (tab?: SettingsTab, view?: SubscriptionView) => void;
  closeSettingsModal: () => void;
  setSettingsModalActiveTab: (tab: SettingsTab) => void;
  setSubscriptionSettingsView: (view: SubscriptionView) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSettingsModalOpen: false,
  settingsModalActiveTab: 'account',
  subscriptionSettingsView: 'active',
  openSettingsModal: (tab = 'account', view = 'active') => set({ 
    isSettingsModalOpen: true, 
    settingsModalActiveTab: tab,
    subscriptionSettingsView: tab === 'subscription' ? view : 'active'
  }),
  closeSettingsModal: () => set({ 
    isSettingsModalOpen: false, 
    subscriptionSettingsView: 'active' 
  }),
  setSettingsModalActiveTab: (tab) => set({ settingsModalActiveTab: tab }),
  setSubscriptionSettingsView: (view) => set({ subscriptionSettingsView: view }),
})); 