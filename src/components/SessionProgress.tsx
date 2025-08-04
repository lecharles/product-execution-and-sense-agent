/**
 * Session Progress Component
 * 
 * Visual progress indicator for interview sessions showing:
 * - Overall session completion percentage
 * - Question-by-question progress
 * - Navigation between answered questions
 * - Visual indicators for completed vs current questions
 */

import React from 'react';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { useInterviewStore } from '../stores/interviewStore';

interface SessionProgressProps {
  showQuestionNavigation?: boolean;
  compact?: boolean;
}

export function SessionProgress({ 
  showQuestionNavigation = true, 
  compact = false 
}: SessionProgressProps) {
  const { currentSession, setCurrentQuestion } = useInterviewStore();

  if (!currentSession) return null;

  const { questions, responses, currentQuestionIndex } = currentSession;
  const completionPercentage = (responses.length / questions.length) * 100;

  // Get response for each question
  const getQuestionStatus = (questionIndex: number) => {
    const hasResponse = responses.some(r => r.questionId === questions[questionIndex].id);
    if (hasResponse) return 'completed';
    if (questionIndex === currentQuestionIndex) return 'current';
    return 'pending';
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {responses.length} / {questions.length} completed
          </span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Session Progress</h3>
        <span className="text-sm text-muted-foreground">
          {Math.round(completionPercentage)}% Complete
        </span>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <Progress value={completionPercentage} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{responses.length} answered</span>
          <span>{questions.length - responses.length} remaining</span>
        </div>
      </div>

      {/* Question Navigation Grid */}
      {showQuestionNavigation && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Questions</h4>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const status = getQuestionStatus(index);
              return (
                <Button
                  key={question.id}
                  variant={status === 'current' ? 'default' : 'outline'}
                  size="sm"
                  className={`h-10 w-full relative ${
                    status === 'completed' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                    status === 'current' ? 'bg-primary text-primary-foreground' :
                    'bg-background'
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                  disabled={currentSession.status === 'completed'}
                >
                  <div className="flex flex-col items-center gap-1">
                    {status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : status === 'current' ? (
                      <PlayCircle className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs">{index + 1}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Session Statistics */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {responses.length}
          </div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {currentQuestionIndex + 1}
          </div>
          <div className="text-xs text-muted-foreground">Current</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-600">
            {questions.length - responses.length}
          </div>
          <div className="text-xs text-muted-foreground">Remaining</div>
        </div>
      </div>
    </Card>
  );
}