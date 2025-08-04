/**
 * Session Timer Component
 * 
 * Provides real-time timer display for interview sessions with:
 * - Start/pause/resume functionality
 * - Elapsed time display in human-readable format
 * - Question-specific timing
 * - Visual progress indicators
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { useInterviewStore } from '../stores/interviewStore';

interface SessionTimerProps {
  onComplete?: () => void;
  maxDuration?: number; // Maximum session duration in seconds
  questionTimeLimit?: number; // Time limit per question in seconds
}

export function SessionTimer({ 
  onComplete, 
  maxDuration = 3600, // 1 hour default
  questionTimeLimit = 1200 // 20 minutes per question default
}: SessionTimerProps) {
  const { currentSession, pauseSession, resumeSession, completeSession } = useInterviewStore();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Reset question timer when question changes
  useEffect(() => {
    if (currentSession?.status === 'in-progress') {
      setQuestionStartTime(new Date());
    }
  }, [currentSession?.currentQuestionIndex]);

  if (!currentSession) return null;

  // Calculate elapsed times
  const sessionElapsed = Math.floor((currentTime.getTime() - currentSession.startTime.getTime()) / 1000);
  const questionElapsed = Math.floor((currentTime.getTime() - questionStartTime.getTime()) / 1000);

  // Format time as MM:SS or HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentages
  const sessionProgress = Math.min((sessionElapsed / maxDuration) * 100, 100);
  const questionProgress = Math.min((questionElapsed / questionTimeLimit) * 100, 100);

  // Auto-complete session when max duration reached
  useEffect(() => {
    if (sessionElapsed >= maxDuration && currentSession.status === 'in-progress') {
      completeSession();
      onComplete?.();
    }
  }, [sessionElapsed, maxDuration, currentSession.status, completeSession, onComplete]);

  const handlePauseResume = () => {
    if (currentSession.status === 'in-progress') {
      pauseSession();
    } else if (currentSession.status === 'paused') {
      resumeSession();
    }
  };

  const handleStop = () => {
    completeSession();
    onComplete?.();
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Session Timer</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePauseResume}
            disabled={currentSession.status === 'completed'}
          >
            {currentSession.status === 'in-progress' ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Resume
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleStop}
            disabled={currentSession.status === 'completed'}
          >
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
        </div>
      </div>

      {/* Session Timer */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Session Time</span>
          <span className="font-mono text-lg font-semibold">
            {formatTime(sessionElapsed)}
          </span>
        </div>
        <Progress value={sessionProgress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0:00</span>
          <span>{formatTime(maxDuration)}</span>
        </div>
      </div>

      {/* Question Timer */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Current Question</span>
          <span className="font-mono text-sm">
            {formatTime(questionElapsed)}
          </span>
        </div>
        <Progress 
          value={questionProgress} 
          className={`h-1 ${questionProgress > 80 ? 'text-yellow-500' : ''} ${questionProgress > 95 ? 'text-red-500' : ''}`}
        />
      </div>

      {/* Session Status */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Status:</span>
        <span className={`font-medium capitalize ${
          currentSession.status === 'in-progress' ? 'text-green-600' :
          currentSession.status === 'paused' ? 'text-yellow-600' :
          'text-gray-600'
        }`}>
          {currentSession.status}
        </span>
      </div>

      {/* Question Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Question:</span>
        <span className="font-medium">
          {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
        </span>
      </div>
    </Card>
  );
}