/**
 * Interview Store - Zustand State Management
 * 
 * This store manages the complete interview session lifecycle including:
 * - Starting, pausing, resuming, and completing interview sessions
 * - Navigation between questions (next/previous/direct)
 * - Response tracking and persistence
 * - Loading states and error handling
 * - Automatic localStorage persistence for session recovery
 * 
 * Architecture:
 * - Uses Zustand for performant state management
 * - Persist middleware for automatic localStorage sync
 * - TypeScript interfaces for complete type safety
 * - Immutable state updates following best practices
 * 
 * Created: Day 2 - State Management Implementation
 * Author: PM Interview Practice Agent Development Team
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Core Interview Data Types
 * These interfaces define the structure of interview-related data
 */

// Represents a single interview question with metadata
// InterviewQuestion interface now imported from centralized types

// Represents a user's response to an interview question
export interface InterviewResponse {
  id: string; // Unique identifier for the response
  questionId: string; // Links response to specific question
  content: string; // User's actual response text
  timestamp: Date; // When the response was submitted
  duration: number; // Time spent answering in seconds (for analytics)
}

// Represents a complete interview session
export interface InterviewSession {
  id: string; // Unique session identifier
  startTime: Date; // When the interview session began
  endTime?: Date; // When session completed (optional - only set when finished)
  currentQuestionIndex: number; // Current position in question array (0-based)
  questions: InterviewQuestion[]; // Array of questions for this session
  responses: InterviewResponse[]; // Array of user responses (grows as user answers)
  status: 'not-started' | 'in-progress' | 'paused' | 'completed'; // Current session state
}

/**
 * Interview Store Interface
 * Defines all available state and actions for interview management
 */
export interface InterviewStore {
  // Current session state - holds the active interview session
  currentSession: InterviewSession | null; // null when no session active
  isLoading: boolean; // true when performing async operations (API calls, etc.)
  error: string | null; // error message if something goes wrong, null if no error
  
  // Session Lifecycle Actions - manage the interview session flow
  startNewSession: (questions: InterviewQuestion[]) => void; // Initialize new session with question set
  pauseSession: () => void; // Pause current session (user can resume later)
  resumeSession: () => void; // Resume a paused session
  completeSession: () => void; // Mark session as completed with end time
  
  // Response Management Actions - handle user answers
  addResponse: (response: Omit<InterviewResponse, 'id' | 'timestamp'>) => void; // Add user response to current session
  
  // Navigation Actions - move between questions
  nextQuestion: () => void; // Move to next question in sequence
  previousQuestion: () => void; // Move to previous question
  setCurrentQuestion: (index: number) => void; // Jump to specific question by index
  
  // State Management Utilities - control loading and error states
  setLoading: (loading: boolean) => void; // Set loading state for UI feedback
  setError: (error: string | null) => void; // Set error state with message
  clearSession: () => void; // Clear current session and reset state
}

/**
 * Interview Store Implementation
 * 
 * This creates the actual Zustand store with persistence enabled.
 * The store automatically saves state to localStorage and restores it on page reload.
 * 
 * Key Features:
 * - Automatic state persistence with localStorage
 * - Session recovery after page refresh
 * - Type-safe actions and state updates
 * - Immutable state updates (Zustand enforces this)
 * - Unique ID generation using crypto.randomUUID()
 */
export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      // Initial State Values
      currentSession: null, // No active session on initialization
      isLoading: false, // Not loading initially
      error: null, // No errors initially

      /**
       * Start New Interview Session
       * Creates a new session with provided questions and sets status to in-progress
       * @param questions - Array of questions for this interview session
       */

      startNewSession: (questions) => {
        // Create new session object with unique ID and initial state
        const session: InterviewSession = {
          id: crypto.randomUUID(), // Generate unique session identifier
          startTime: new Date(), // Record session start time
          currentQuestionIndex: 0, // Start with first question
          questions, // Store provided questions array
          responses: [], // Initialize empty responses array
          status: 'in-progress' // Set session as active
        };
        
        // Update store state with new session and clear any previous errors
        set({ 
          currentSession: session, 
          error: null, // Clear any previous errors
          isLoading: false // Ensure loading state is false
        });
      },

      /**
       * Pause Current Session
       * Changes session status to paused if currently in progress
       */

      pauseSession: () => {
        const { currentSession } = get(); // Get current state
        // Only pause if there's an active session in progress
        if (currentSession && currentSession.status === 'in-progress') {
          set({
            currentSession: {
              ...currentSession, // Spread existing session data
              status: 'paused' // Change only the status
            }
          });
        }
      },

      /**
       * Resume Paused Session
       * Changes session status back to in-progress if currently paused
       */
      resumeSession: () => {
        const { currentSession } = get(); // Get current state
        // Only resume if there's a paused session
        if (currentSession && currentSession.status === 'paused') {
          set({
            currentSession: {
              ...currentSession, // Spread existing session data
              status: 'in-progress' // Change status back to active
            }
          });
        }
      },

      /**
       * Complete Current Session
       * Marks session as completed and records end time
       */
      completeSession: () => {
        const { currentSession } = get(); // Get current state
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession, // Spread existing session data
              endTime: new Date(), // Record completion time
              status: 'completed' // Mark as completed
            }
          });
        }
      },

      /**
       * Add User Response
       * Adds a new response to the current session's response array
       * @param responseData - Response data without id and timestamp (auto-generated)
       */
      addResponse: (responseData) => {
        const { currentSession } = get(); // Get current state
        if (!currentSession) return; // Exit if no active session

        // Create complete response object with auto-generated fields
        const response: InterviewResponse = {
          id: crypto.randomUUID(), // Generate unique response ID
          timestamp: new Date(), // Record submission time
          ...responseData // Spread provided response data (questionId, content, duration)
        };

        // Update session with new response added to array
        set({
          currentSession: {
            ...currentSession, // Spread existing session data
            responses: [...currentSession.responses, response] // Add new response to array
          }
        });
      },

      /**
       * Navigate to Next Question
       * Increments question index if not at the end of question array
       */

      nextQuestion: () => {
        const { currentSession } = get(); // Get current state
        if (!currentSession) return; // Exit if no active session

        const nextIndex = currentSession.currentQuestionIndex + 1;
        // Only advance if not already at the last question
        if (nextIndex < currentSession.questions.length) {
          set({
            currentSession: {
              ...currentSession, // Spread existing session data
              currentQuestionIndex: nextIndex // Update to next question index
            }
          });
        }
      },

      /**
       * Navigate to Previous Question
       * Decrements question index if not at the beginning of question array
       */
      previousQuestion: () => {
        const { currentSession } = get(); // Get current state
        if (!currentSession) return; // Exit if no active session

        const prevIndex = currentSession.currentQuestionIndex - 1;
        // Only go back if not already at the first question
        if (prevIndex >= 0) {
          set({
            currentSession: {
              ...currentSession, // Spread existing session data
              currentQuestionIndex: prevIndex // Update to previous question index
            }
          });
        }
      },

      /**
       * Jump to Specific Question
       * Sets question index to specified value with bounds checking
       * @param index - Target question index (0-based)
       */
      setCurrentQuestion: (index) => {
        const { currentSession } = get(); // Get current state
        if (!currentSession || index < 0 || index >= currentSession.questions.length) return; // Validate bounds

        set({
          currentSession: {
            ...currentSession, // Spread existing session data
            currentQuestionIndex: index // Set to specified index
          }
        });
      },

      /**
       * Utility Functions for State Management
       * Simple setters for loading and error states
       */
      setLoading: (loading) => set({ isLoading: loading }), // Update loading state
      
      setError: (error) => set({ error }), // Update error state

      /**
       * Clear Session and Reset State
       * Resets all state to initial values
       */
      clearSession: () => set({ 
        currentSession: null, // Clear active session
        error: null, // Clear any errors
        isLoading: false // Reset loading state
      })
    }),
    {
      // Persistence Configuration
      name: 'interview-session', // localStorage key name
      partialize: (state) => ({ 
        currentSession: state.currentSession // Only persist the session data, not loading/error states
      })
    }
  )
);