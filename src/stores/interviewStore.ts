import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InterviewQuestion {
  id: string;
  content: string;
  category: 'product-sense' | 'analytical' | 'technical' | 'behavioral' | 'strategy';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in minutes
}

export interface InterviewResponse {
  id: string;
  questionId: string;
  content: string;
  timestamp: Date;
  duration: number; // time spent in seconds
}

export interface InterviewSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  status: 'not-started' | 'in-progress' | 'paused' | 'completed';
}

export interface InterviewStore {
  // Current session state
  currentSession: InterviewSession | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startNewSession: (questions: InterviewQuestion[]) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  addResponse: (response: Omit<InterviewResponse, 'id' | 'timestamp'>) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setCurrentQuestion: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
}

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      isLoading: false,
      error: null,

      startNewSession: (questions) => {
        const session: InterviewSession = {
          id: crypto.randomUUID(),
          startTime: new Date(),
          currentQuestionIndex: 0,
          questions,
          responses: [],
          status: 'in-progress'
        };
        
        set({ 
          currentSession: session, 
          error: null,
          isLoading: false 
        });
      },

      pauseSession: () => {
        const { currentSession } = get();
        if (currentSession && currentSession.status === 'in-progress') {
          set({
            currentSession: {
              ...currentSession,
              status: 'paused'
            }
          });
        }
      },

      resumeSession: () => {
        const { currentSession } = get();
        if (currentSession && currentSession.status === 'paused') {
          set({
            currentSession: {
              ...currentSession,
              status: 'in-progress'
            }
          });
        }
      },

      completeSession: () => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              endTime: new Date(),
              status: 'completed'
            }
          });
        }
      },

      addResponse: (responseData) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const response: InterviewResponse = {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          ...responseData
        };

        set({
          currentSession: {
            ...currentSession,
            responses: [...currentSession.responses, response]
          }
        });
      },

      nextQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const nextIndex = currentSession.currentQuestionIndex + 1;
        if (nextIndex < currentSession.questions.length) {
          set({
            currentSession: {
              ...currentSession,
              currentQuestionIndex: nextIndex
            }
          });
        }
      },

      previousQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const prevIndex = currentSession.currentQuestionIndex - 1;
        if (prevIndex >= 0) {
          set({
            currentSession: {
              ...currentSession,
              currentQuestionIndex: prevIndex
            }
          });
        }
      },

      setCurrentQuestion: (index) => {
        const { currentSession } = get();
        if (!currentSession || index < 0 || index >= currentSession.questions.length) return;

        set({
          currentSession: {
            ...currentSession,
            currentQuestionIndex: index
          }
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),

      clearSession: () => set({ 
        currentSession: null, 
        error: null, 
        isLoading: false 
      })
    }),
    {
      name: 'interview-session',
      partialize: (state) => ({ 
        currentSession: state.currentSession 
      })
    }
  )
);