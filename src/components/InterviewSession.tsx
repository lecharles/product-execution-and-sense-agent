/**
 * Interview Session Component
 * 
 * Main container for active interview sessions that orchestrates:
 * - Session lifecycle management
 * - Question navigation and display
 * - Response collection and storage
 * - Timer and progress tracking
 * - Session completion handling
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useInterviewStore } from '../stores/interviewStore';
import { useToast } from './ui/use-toast';
import { QuestionDisplay } from './QuestionDisplay';
import { ResponseInput } from './ResponseInput';
import { SessionTimer } from './SessionTimer';
import { SessionProgress } from './SessionProgress';

interface InterviewSessionProps {
  onComplete?: () => void;
  onExit?: () => void;
}

export function InterviewSession({ onComplete, onExit }: InterviewSessionProps) {
  const { 
    currentSession, 
    nextQuestion, 
    previousQuestion, 
    addResponse, 
    completeSession 
  } = useInterviewStore();
  const { toast } = useToast();
  
  const [currentResponse, setCurrentResponse] = useState('');
  const [responseStartTime, setResponseStartTime] = useState<Date>(new Date());

  // Reset response when question changes
  useEffect(() => {
    if (currentSession) {
      // Check if there's an existing response for current question
      const existingResponse = currentSession.responses.find(
        r => r.questionId === currentSession.questions[currentSession.currentQuestionIndex]?.id
      );
      
      if (existingResponse) {
        setCurrentResponse(existingResponse.content);
      } else {
        setCurrentResponse('');
        setResponseStartTime(new Date());
      }
    }
  }, [currentSession?.currentQuestionIndex]);

  if (!currentSession) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">No Active Session</h2>
        <p className="text-muted-foreground mb-6">
          Start a new interview session to begin practicing.
        </p>
        <Button onClick={onExit}>
          <Home className="h-4 w-4 mr-2" />
          Go Home
        </Button>
      </Card>
    );
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const isLastQuestion = currentSession.currentQuestionIndex === currentSession.questions.length - 1;
  const hasResponse = currentResponse.trim().length > 0;
  const isFirstQuestion = currentSession.currentQuestionIndex === 0;

  const handleResponseSubmit = () => {
    if (!hasResponse) return;

    const responseTime = Math.floor((new Date().getTime() - responseStartTime.getTime()) / 1000);
    
    // Add or update response
    addResponse({
      questionId: currentQuestion.id,
      content: currentResponse.trim(),
      duration: responseTime
    });

    toast({
      title: "Response Saved",
      description: "Your answer has been recorded.",
    });

    // Auto-advance to next question
    if (!isLastQuestion) {
      setTimeout(() => {
        nextQuestion();
      }, 500);
    }
  };

  const handleNextQuestion = () => {
    if (hasResponse) {
      handleResponseSubmit();
    } else {
      nextQuestion();
    }
  };

  const handleCompleteSession = () => {
    if (hasResponse) {
      handleResponseSubmit();
    }
    
    completeSession();
    
    toast({
      title: "Session Complete!",
      description: `You've completed ${currentSession.responses.length + (hasResponse ? 1 : 0)} questions.`,
    });

    onComplete?.();
  };

  const handleExit = () => {
    if (currentSession.status === 'in-progress') {
      // Auto-save current response if exists
      if (hasResponse) {
        const responseTime = Math.floor((new Date().getTime() - responseStartTime.getTime()) / 1000);
        addResponse({
          questionId: currentQuestion.id,
          content: currentResponse.trim(),
          duration: responseTime
        });
      }
    }
    
    onExit?.();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleExit}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Session
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Interview Session</h1>
          <p className="text-muted-foreground">
            Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
          </p>
        </div>
        
        <div className="w-24"> {/* Spacer for balance */}</div>
      </div>

      {/* Timer and Progress Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SessionTimer onComplete={handleCompleteSession} />
        <SessionProgress showQuestionNavigation={false} />
      </div>

      {/* Main Question Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Display */}
        <div className="lg:col-span-2">
          <QuestionDisplay question={currentQuestion} />
        </div>

        {/* Progress Sidebar */}
        <div>
          <SessionProgress compact={false} />
        </div>
      </div>

      {/* Response Input */}
      <Card className="p-6">
        <ResponseInput
          value={currentResponse}
          onChange={setCurrentResponse}
          onSubmit={handleResponseSubmit}
          placeholder="Type your response here... Take your time to think through the problem systematically."
          disabled={currentSession.status === 'completed'}
        />
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={isFirstQuestion || currentSession.status === 'completed'}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-3">
          {isLastQuestion ? (
            <Button
              onClick={handleCompleteSession}
              disabled={currentSession.status === 'completed'}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Session
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={currentSession.status === 'completed'}
            >
              {hasResponse ? 'Save & Next' : 'Skip'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Session Status */}
      {currentSession.status === 'paused' && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800 text-center">
            Session is paused. Click Resume on the timer to continue.
          </p>
        </Card>
      )}

      {currentSession.status === 'completed' && (
        <Card className="p-6 bg-green-50 border-green-200 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Session Completed!
          </h3>
          <p className="text-green-700">
            Great job! You've completed {currentSession.responses.length} questions 
            in this interview session.
          </p>
        </Card>
      )}
    </div>
  );
}