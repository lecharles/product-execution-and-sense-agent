# Technical Specifications - PM Interview Practice Agent

## 🎯 Current Implementation Status: Day 2 Complete

### ✅ Completed Implementation (Day 2)
- **State Management Architecture**
  - `interviewStore.ts` - Complete Zustand store for interview sessions
  - `settingsStore.ts` - User settings and preferences management
  - Persistent state with localStorage integration
  - Interview lifecycle management (start, pause, resume, complete)
  - Question navigation and response tracking
- **Error Handling**
  - `ErrorBoundary.tsx` - React error boundary component
  - Error boundary integration in App.tsx
  - Development error details and production-safe fallbacks

### ✅ Previously Completed (Day 1)
- `QuestionDisplay.tsx` - Enhanced question display with badges and styling
- `ResponseInput.tsx` - Input component with character count and shortcuts
- `LoadingStates.tsx` - Skeleton and loading components
- Enhanced button variants (success, premium)
- Updated design system with new CSS variables

### 🔧 Next Implementation (Day 3)
- Question category management system
- Question database schema design
- Category-based filtering interface
- Difficulty level selection component

## System Architecture

### Frontend Architecture (Current)
```
src/
├── components/           # Reusable UI components ✅
│   ├── ui/              # shadcn/ui base components ✅
│   ├── QuestionDisplay.tsx    # ✅ Day 1
│   ├── ResponseInput.tsx      # ✅ Day 1  
│   ├── LoadingStates.tsx      # ✅ Day 1
│   ├── ErrorBoundary.tsx      # ✅ Day 2 - NEW
│   ├── InterviewChat.tsx      # ✅ Enhanced Day 1
│   └── SettingsDialog.tsx     # ✅ Existing
├── stores/             # ✅ Day 2 - State management (Zustand)
│   ├── interviewStore.ts      # ✅ Day 2 - NEW
│   └── settingsStore.ts       # ✅ Day 2 - NEW
├── pages/              # Route components ✅
├── hooks/              # Custom React hooks ✅
├── lib/                # Utilities & services ✅
└── assets/             # Static assets ✅
```

### Backend Architecture (Future)
```
backend/
├── api/                # REST API endpoints
├── services/           # Business logic services
├── models/             # Data models
├── middleware/         # Express middleware
├── utils/              # Helper functions
├── config/             # Configuration files
└── tests/              # Test suites
```

## Core Features Specifications

### 1. Interview Session Management

#### Data Models
```typescript
interface InterviewSession {
  id: string
  userId: string
  type: 'product-sense' | 'execution' | 'strategy' | 'design'
  difficulty: 'junior' | 'senior' | 'principal'
  status: 'active' | 'completed' | 'paused'
  startTime: Date
  endTime?: Date
  currentQuestion: string
  responses: InterviewResponse[]
  score?: InterviewScore
  feedback?: string
}

interface InterviewResponse {
  id: string
  question: string
  response: string
  timestamp: Date
  duration: number
  aiAnalysis?: ResponseAnalysis
}

interface InterviewScore {
  overall: number
  categories: {
    clarity: number
    structure: number
    insight: number
    execution: number
  }
  feedback: string[]
  improvements: string[]
}
```

#### API Endpoints
```typescript
// Session Management
POST   /api/sessions          // Create new session
GET    /api/sessions/:id      // Get session details
PUT    /api/sessions/:id      // Update session
DELETE /api/sessions/:id      // Delete session
POST   /api/sessions/:id/complete  // Complete session

// Responses
POST   /api/sessions/:id/responses  // Submit response
GET    /api/sessions/:id/responses  // Get all responses
PUT    /api/responses/:id          // Update response
```

### 2. AI Integration Layer

#### Service Architecture
```typescript
interface AIService {
  generateQuestion(context: InterviewContext): Promise<Question>
  analyzeResponse(response: string, question: string): Promise<ResponseAnalysis>
  provideFeedback(session: InterviewSession): Promise<SessionFeedback>
  generateFollowUp(response: string): Promise<string>
}

interface InterviewContext {
  type: InterviewType
  difficulty: DifficultyLevel
  previousQuestions: string[]
  userProfile?: UserProfile
}

interface ResponseAnalysis {
  score: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  followUpQuestions: string[]
}
```

#### AI Prompt Templates
```typescript
const PROMPT_TEMPLATES = {
  productSense: {
    junior: "You are conducting a PM interview for a junior candidate...",
    senior: "You are conducting a PM interview for a senior candidate...",
    principal: "You are conducting a PM interview for a principal candidate..."
  },
  execution: {
    // Similar structure for execution questions
  }
}
```

### 3. State Management ✅ IMPLEMENTED (Day 2)

#### Store Structure (Zustand) - COMPLETED
```typescript
// ✅ IMPLEMENTED: interviewStore.ts
interface InterviewStore {
  currentSession: InterviewSession | null
  isLoading: boolean
  error: string | null
  
  // Session lifecycle actions
  startNewSession: (questions: InterviewQuestion[]) => void
  pauseSession: () => void
  resumeSession: () => void
  completeSession: () => void
  
  // Response and navigation actions
  addResponse: (response: Omit<InterviewResponse, 'id' | 'timestamp'>) => void
  nextQuestion: () => void
  previousQuestion: () => void
  setCurrentQuestion: (index: number) => void
  
  // State management
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearSession: () => void
}

// ✅ IMPLEMENTED: settingsStore.ts
interface SettingsStore {
  settings: UserSettings
  isLoading: boolean
  
  // Settings management actions
  updateSettings: (updates: Partial<UserSettings>) => void
  updateApiKey: (apiKey: string) => void
  updateModel: (model: UserSettings['selectedModel']) => void
  updateTheme: (theme: UserSettings['theme']) => void
  toggleCategory: (category: string) => void
  resetSettings: () => void
  setLoading: (loading: boolean) => void
}

// ✅ IMPLEMENTED: Persistent storage with zustand/middleware
// Both stores use persist middleware for localStorage integration
```

### 4. Performance Optimization

#### Code Splitting Strategy
```typescript
// Route-based splitting
const InterviewPage = lazy(() => import('./pages/Interview'))
const AnalyticsPage = lazy(() => import('./pages/Analytics'))
const ProfilePage = lazy(() => import('./pages/Profile'))

// Component-based splitting
const InterviewChat = lazy(() => import('./components/InterviewChat'))
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'))
```

#### Caching Strategy
```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
})

// API response caching
const CACHE_CONFIG = {
  questions: '1h',
  userProfile: '24h',
  sessionHistory: '5m',
  analytics: '15m'
}
```

## Database Schema (Future Implementation)

### PostgreSQL Tables
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Interview sessions
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  score JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Interview responses
CREATE TABLE interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id),
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  ai_analysis JSONB,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Questions bank
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security Specifications

### Authentication & Authorization
```typescript
// JWT token structure
interface JWTPayload {
  userId: string
  email: string
  role: 'user' | 'admin'
  iat: number
  exp: number
}

// API security middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

### Data Privacy
- All API keys stored encrypted
- Session data anonymized for analytics
- GDPR compliance for EU users
- Data retention policies implemented

## Testing Strategy

### Frontend Testing
```typescript
// Component testing with React Testing Library
describe('InterviewChat', () => {
  it('should submit response when enter is pressed', async () => {
    render(<InterviewChat />)
    const input = screen.getByRole('textbox')
    
    await user.type(input, 'My response')
    await user.keyboard('{Enter}')
    
    expect(mockSubmitResponse).toHaveBeenCalledWith('My response')
  })
})

// Integration testing with MSW
const handlers = [
  rest.post('/api/sessions', (req, res, ctx) => {
    return res(ctx.json({ id: 'session-1', status: 'active' }))
  })
]
```

### Performance Testing
- Lighthouse CI integration
- Bundle size monitoring
- Core Web Vitals tracking
- Load testing with Artillery

## Deployment & Infrastructure

### Build Configuration
```typescript
// Vite configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['clsx', 'tailwind-merge']
        }
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})
```

### Environment Configuration
```bash
# Development
VITE_API_URL=http://localhost:3001
VITE_ENVIRONMENT=development

# Production
VITE_API_URL=https://api.pminterviews.com
VITE_ENVIRONMENT=production
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## Monitoring & Analytics

### Error Tracking
- Sentry integration for error monitoring
- Performance monitoring
- User session recordings (privacy-compliant)

### Business Metrics
- Interview completion rates
- User engagement metrics
- AI response quality metrics
- Performance benchmarks