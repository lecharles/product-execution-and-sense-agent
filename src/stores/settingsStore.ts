/**
 * Settings Store - User Preferences and Configuration Management
 * 
 * This store manages all user preferences and application configuration including:
 * - OpenAI API key and model selection
 * - Interview preferences (question count, time limits, difficulty)
 * - UI preferences (theme, font size, sound settings)
 * - Category preferences and filtering options
 * - Complete settings persistence across browser sessions
 * 
 * Architecture:
 * - Zustand store with full persistence enabled
 * - Type-safe settings interface with sensible defaults
 * - Individual update methods for different setting types
 * - Category toggle functionality for flexible interview customization
 * 
 * Created: Day 2 - State Management Implementation
 * Author: PM Interview Practice Agent Development Team
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * User Settings Interface
 * Defines all configurable user preferences and application settings
 */
export interface UserSettings {
  // AI Configuration Settings
  openaiApiKey?: string; // Optional OpenAI API key for AI-powered features
  selectedModel: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo'; // AI model selection for responses
  
  // Interview Experience Preferences
  defaultQuestionCount: number; // Default number of questions per interview session
  defaultTimeLimit: number; // Default time limit per question in minutes
  autoAdvance: boolean; // Whether to automatically advance to next question after time limit
  showTimer: boolean; // Whether to display countdown timer during questions
  
  // User Interface Preferences
  theme: 'light' | 'dark' | 'system'; // UI theme preference
  fontSize: 'small' | 'medium' | 'large'; // Text size preference for accessibility
  soundEnabled: boolean; // Whether to play sound notifications
  
  // Interview Content Preferences
  preferredDifficulty: 'easy' | 'medium' | 'hard' | 'mixed'; // Default difficulty level selection
  enabledCategories: string[]; // Array of enabled question categories for filtering
}

/**
 * Settings Store Interface
 * Defines all available actions for managing user settings
 */
export interface SettingsStore {
  settings: UserSettings; // Current user settings object
  isLoading: boolean; // Loading state for async settings operations
  
  // Settings Management Actions
  updateSettings: (updates: Partial<UserSettings>) => void; // Update multiple settings at once
  updateApiKey: (apiKey: string) => void; // Specifically update OpenAI API key
  updateModel: (model: UserSettings['selectedModel']) => void; // Update AI model selection
  updateTheme: (theme: UserSettings['theme']) => void; // Update UI theme
  toggleCategory: (category: string) => void; // Toggle specific question category on/off
  resetSettings: () => void; // Reset all settings to defaults
  setLoading: (loading: boolean) => void; // Set loading state
}

/**
 * Default Settings Configuration
 * These are the initial/fallback values used when no user preferences exist
 */
const defaultSettings: UserSettings = {
  selectedModel: 'gpt-4', // Use highest quality model by default
  defaultQuestionCount: 5, // Moderate session length for good practice
  defaultTimeLimit: 30, // 30 minutes per question - standard PM interview timing
  autoAdvance: false, // Let user control pacing by default
  showTimer: true, // Show timer to help with time management practice
  theme: 'system', // Respect user's OS theme preference
  fontSize: 'medium', // Standard readable text size
  soundEnabled: true, // Enable helpful audio feedback
  preferredDifficulty: 'mixed', // Include all difficulty levels for comprehensive practice
  enabledCategories: ['product-sense', 'analytical', 'technical', 'behavioral', 'strategy'] // All categories enabled by default
};

/**
 * Settings Store Implementation
 * 
 * Creates the Zustand store with complete persistence for user preferences.
 * All settings are automatically saved to localStorage and restored on app startup.
 */

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // Initial State
      settings: defaultSettings, // Start with default configuration
      isLoading: false, // Not loading initially

      /**
       * Update Multiple Settings
       * Allows updating multiple settings properties at once
       * @param updates - Partial settings object with properties to update
       */
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates } // Merge updates with existing settings
        }));
      },

      /**
       * Update OpenAI API Key
       * Specifically handles API key updates with proper security considerations
       * @param apiKey - The OpenAI API key string
       */
      updateApiKey: (apiKey) => {
        set((state) => ({
          settings: { ...state.settings, openaiApiKey: apiKey } // Update only the API key
        }));
      },

      /**
       * Update AI Model Selection
       * Changes the selected OpenAI model for interview interactions
       * @param model - Selected AI model identifier
       */
      updateModel: (model) => {
        set((state) => ({
          settings: { ...state.settings, selectedModel: model } // Update only the model selection
        }));
      },

      /**
       * Update UI Theme
       * Changes the application theme preference
       * @param theme - Theme selection (light/dark/system)
       */
      updateTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme } // Update only the theme setting
        }));
      },

      /**
       * Toggle Question Category
       * Adds or removes a category from the enabled categories list
       * @param category - Category identifier to toggle
       */

      toggleCategory: (category) => {
        const { settings } = get(); // Get current settings state
        
        // Determine new enabled categories array based on current state
        const enabledCategories = settings.enabledCategories.includes(category)
          ? settings.enabledCategories.filter(c => c !== category) // Remove if present
          : [...settings.enabledCategories, category]; // Add if not present
        
        // Update settings with new categories array
        set((state) => ({
          settings: { ...state.settings, enabledCategories }
        }));
      },

      /**
       * Reset All Settings to Defaults
       * Restores all settings to their initial default values
       */
      resetSettings: () => {
        set({ settings: defaultSettings }); // Replace settings with defaults
      },

      /**
       * Set Loading State
       * Updates the loading indicator for async operations
       * @param loading - Boolean loading state
       */
      setLoading: (loading) => set({ isLoading: loading }) // Update loading state
    }),
    {
      // Persistence Configuration
      name: 'user-settings' // localStorage key for settings persistence
      // Note: No partialize needed - we want to persist all settings
    }
  )
);