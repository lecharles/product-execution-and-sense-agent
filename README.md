# PM Interview Practice Agent

An AI-powered platform for practicing Product Management interviews with real-time feedback and comprehensive analytics.

## 🚀 Current Status - Day 2 Complete!

### ✅ Completed Features (Day 2)
- **State Management & Core Architecture**
  - Zustand stores for interview sessions and user settings
  - Persistent state management with local storage
  - Interview session lifecycle management (start, pause, resume, complete)
  - Settings management (API keys, preferences, themes)
  - Error boundary component for robust error handling
  - Enhanced App.tsx with error boundary integration

### ✅ Previously Completed (Day 1)
- **Enhanced Interview Interface Components**
  - `QuestionDisplay` component with category badges and difficulty indicators
  - `ResponseInput` component with character count and submission shortcuts
  - Improved loading states and skeleton components
  - Enhanced button variants (success, premium)
  - Toast notifications for user feedback
  - Polished component interactions

### 🎯 Next Up (Day 3)
- Question Categories & Selection Interface
- Question database schema design
- Category-based question filtering
- Difficulty level selection system

## 📋 Development Plan
Following a structured 20-day implementation plan:
- **Week 1**: Foundation & Basic UI Components *(Current)*
- **Week 2**: State Management & Core Features
- **Week 3**: Authentication & User Management
- **Week 4**: AI Integration & Advanced Features

## 🛠 Technologies Used

This project is built with:
- **Frontend**: React, TypeScript, Vite
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand (Day 2)
- **AI Integration**: OpenAI GPT-4
- **Routing**: React Router DOM

## 🏗 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── QuestionDisplay.tsx # Interview question display
│   ├── ResponseInput.tsx   # Enhanced input with character count
│   ├── LoadingStates.tsx   # Loading and skeleton components
│   ├── ErrorBoundary.tsx   # Error handling component
│   └── InterviewChat.tsx   # Main chat interface
├── stores/                 # Zustand state management
│   ├── interviewStore.ts   # Interview session state
│   └── settingsStore.ts    # User settings state
├── pages/                  # Route components
├── hooks/                  # Custom React hooks
└── lib/                    # Utilities & services
```

## 🚀 Getting Started

**Use Lovable** (Recommended)

Visit the [Lovable Project](https://lovable.dev/projects/5cf11b93-5fd7-46ae-bac9-3755eaa3dd95) and start prompting.

**Local Development**

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

## 📊 Project Documentation

- `DAILY_IMPLEMENTATION_PLAN.md` - 20-day feature roadmap
- `ROADMAP.md` - Project phases and milestones
- `TECHNICAL_SPECS.md` - Technical architecture details
- `GITHUB_ISSUES.md` - GitHub issues for project management

## 🔧 Configuration

1. Set up your OpenAI API key in Settings
2. Configure interview preferences
3. Start practicing!

## 📈 Deployment

Simply open [Lovable](https://lovable.dev/projects/5cf11b93-5fd7-46ae-bac9-3755eaa3dd95) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
