import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { ResponseInput } from "@/components/ResponseInput";
import { QuestionSelector } from "@/components/QuestionSelector";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useInterviewStore } from "@/stores/interviewStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { Settings, Play, Pause, RotateCcw, SkipForward, ArrowLeft } from "lucide-react";

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
  
  // State for showing question selector
  const [showQuestionSelector, setShowQuestionSelector] = useState(!currentSession);
  const [response, setResponse] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Update showQuestionSelector based on session state
  useEffect(() => {
    setShowQuestionSelector(!currentSession);
  }, [currentSession]);

  const handleSessionCreated = () => {
    setShowQuestionSelector(false);
  };
  
  const handleBackToSelector = () => {
    if (currentSession) {
      completeSession();
    }
    setShowQuestionSelector(true);
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
              {currentSession && !showQuestionSelector && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToSelector}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  New Session
                </Button>
              )}
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
        {showQuestionSelector ? (
          // Question Selector Interface
          <div className="max-w-6xl mx-auto">
            <QuestionSelector onSessionCreated={handleSessionCreated} />
          </div>
        ) : currentSession ? (
          // Active session - show interview interface
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Session Controls */}
            <div className="flex items-center justify-between bg-card border rounded-lg px-4 py-3">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousQuestion}
                    disabled={currentSession.currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={nextQuestion}
                    disabled={currentSession.currentQuestionIndex === currentSession.questions.length - 1}
                  >
                    <SkipForward className="h-4 w-4 mr-1" />
                    Next
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {currentSession.status === 'in-progress' ? (
                  <Button variant="outline" size="sm" onClick={pauseSession}>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={resumeSession}>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </Button>
                )}
                
                <Button variant="outline" size="sm" onClick={() => setResponse("")}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Question Display */}
            <QuestionDisplay 
              question={currentSession.questions[currentSession.currentQuestionIndex]}
            />

            {/* Response Input */}
            <ResponseInput
              value={response}
              onChange={setResponse}
              onSubmit={handleSubmitResponse}
              disabled={currentSession.status === 'paused'}
              placeholder="Share your thoughts and approach to this question..."
            />
          </div>
        ) : (
          // Fallback loading state
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
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