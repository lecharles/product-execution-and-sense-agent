import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { ResponseInput } from "@/components/ResponseInput";
import { QuestionSelector } from "@/components/QuestionSelector";
import { SettingsDialog } from "@/components/SettingsDialog";
import { InterviewSession } from "@/components/InterviewSession";
import { SessionHistory } from "@/components/SessionHistory";
import { SessionTimer } from "@/components/SessionTimer";
import { SessionProgress } from "@/components/SessionProgress";
import { useInterviewStore, InterviewSession as SessionType } from "@/stores/interviewStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { Settings, Play, Pause, RotateCcw, SkipForward, ArrowLeft, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { 
    currentSession, 
    isLoading, 
    pauseSession, 
    resumeSession, 
    nextQuestion, 
    previousQuestion,
    addResponse,
    completeSession 
  } = useInterviewStore();
  
  const { } = useSettingsStore();
  
  // State for UI management
  const [activeTab, setActiveTab] = useState(currentSession ? 'session' : 'setup');
  const [response, setResponse] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Update active tab based on session state
  useEffect(() => {
    if (currentSession && activeTab === 'setup') {
      setActiveTab('session');
    }
  }, [currentSession, activeTab]);

  const handleSessionCreated = () => {
    setActiveTab('session');
  };

  const handleSessionComplete = () => {
    setActiveTab('history');
  };

  const handleSessionExit = () => {
    setActiveTab('setup');
  };

  const handleSessionResume = (session: SessionType) => {
    // Resume session logic would be handled by the store
    setActiveTab('session');
  };

  const handleSubmitResponse = () => {
    if (response.trim() && currentSession) {
      addResponse({
        questionId: currentSession.questions[currentSession.currentQuestionIndex].id,
        content: response.trim(),
        duration: 0
      });
      setResponse("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">PM Interview Practice</h1>
              <span className="text-sm text-muted-foreground">
                Master your Product Manager interviews
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('history')}
              >
                <History className="h-4 w-4 mr-1" />
                History
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Question Setup</TabsTrigger>
              <TabsTrigger value="session" disabled={!currentSession}>
                Active Session
              </TabsTrigger>
              <TabsTrigger value="history">Session History</TabsTrigger>
            </TabsList>

            {/* Question Setup Tab */}
            <TabsContent value="setup" className="space-y-6">
              <div className="max-w-6xl mx-auto">
                <QuestionSelector onSessionCreated={handleSessionCreated} />
              </div>
            </TabsContent>

            {/* Active Session Tab */}
            <TabsContent value="session" className="space-y-6">
              <InterviewSession 
                onComplete={handleSessionComplete}
                onExit={handleSessionExit}
              />
            </TabsContent>

            {/* Session History Tab */}
            <TabsContent value="history" className="space-y-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Interview History</h2>
                  <p className="text-muted-foreground">
                    Review your past sessions and track your progress
                  </p>
                </div>
                <SessionHistory 
                  onSessionResume={handleSessionResume}
                  showActions={true}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Settings Dialog */}
      <SettingsDialog 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
};

export default Index;