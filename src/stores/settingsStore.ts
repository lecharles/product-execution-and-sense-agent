import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSettings {
  // AI Configuration
  openaiApiKey?: string;
  selectedModel: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
  
  // Interview Preferences
  defaultQuestionCount: number;
  defaultTimeLimit: number; // in minutes
  autoAdvance: boolean;
  showTimer: boolean;
  
  // UI Preferences
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  
  // Difficulty & Categories
  preferredDifficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  enabledCategories: string[];
}

export interface SettingsStore {
  settings: UserSettings;
  isLoading: boolean;
  
  // Actions
  updateSettings: (updates: Partial<UserSettings>) => void;
  updateApiKey: (apiKey: string) => void;
  updateModel: (model: UserSettings['selectedModel']) => void;
  updateTheme: (theme: UserSettings['theme']) => void;
  toggleCategory: (category: string) => void;
  resetSettings: () => void;
  setLoading: (loading: boolean) => void;
}

const defaultSettings: UserSettings = {
  selectedModel: 'gpt-4',
  defaultQuestionCount: 5,
  defaultTimeLimit: 30,
  autoAdvance: false,
  showTimer: true,
  theme: 'system',
  fontSize: 'medium',
  soundEnabled: true,
  preferredDifficulty: 'mixed',
  enabledCategories: ['product-sense', 'analytical', 'technical', 'behavioral', 'strategy']
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates }
        }));
      },

      updateApiKey: (apiKey) => {
        set((state) => ({
          settings: { ...state.settings, openaiApiKey: apiKey }
        }));
      },

      updateModel: (model) => {
        set((state) => ({
          settings: { ...state.settings, selectedModel: model }
        }));
      },

      updateTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme }
        }));
      },

      toggleCategory: (category) => {
        const { settings } = get();
        const enabledCategories = settings.enabledCategories.includes(category)
          ? settings.enabledCategories.filter(c => c !== category)
          : [...settings.enabledCategories, category];
        
        set((state) => ({
          settings: { ...state.settings, enabledCategories }
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },

      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'user-settings'
    }
  )
);