/**
 * Session History Component
 * 
 * Displays and manages completed interview sessions with:
 * - List of past sessions with metadata
 * - Session resume capability for incomplete sessions
 * - Session export functionality
 * - Session deletion and management
 */

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Download, 
  Eye, 
  MoreVertical, 
  Play, 
  Trash2,
  FileText,
  TrendingUp
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useInterviewStore, InterviewSession } from '../stores/interviewStore';
import { useToast } from './ui/use-toast';

interface SessionHistoryProps {
  onSessionResume?: (session: InterviewSession) => void;
  onSessionView?: (session: InterviewSession) => void;
  showActions?: boolean;
  limit?: number;
}

export function SessionHistory({ 
  onSessionResume, 
  onSessionView, 
  showActions = true,
  limit
}: SessionHistoryProps) {
  const { currentSession } = useInterviewStore();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<InterviewSession[]>(() => {
    // Load sessions from localStorage
    const stored = localStorage.getItem('interview-sessions-history');
    return stored ? JSON.parse(stored) : [];
  });

  // Save session to history when completed
  React.useEffect(() => {
    if (currentSession?.status === 'completed') {
      const existingIndex = sessions.findIndex(s => s.id === currentSession.id);
      let updatedSessions;
      
      if (existingIndex >= 0) {
        // Update existing session
        updatedSessions = [...sessions];
        updatedSessions[existingIndex] = currentSession;
      } else {
        // Add new session
        updatedSessions = [currentSession, ...sessions];
      }
      
      setSessions(updatedSessions);
      localStorage.setItem('interview-sessions-history', JSON.stringify(updatedSessions));
    }
  }, [currentSession, sessions]);

  // Sort and limit sessions
  const displaySessions = useMemo(() => {
    const sorted = [...sessions].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }, [sessions, limit]);

  const handleExportSession = (session: InterviewSession) => {
    const exportData = {
      sessionId: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.endTime ? 
        Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000) : 
        null,
      questionsCount: session.questions.length,
      responsesCount: session.responses.length,
      questions: session.questions.map(q => ({
        id: q.id,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty
      })),
      responses: session.responses.map(r => ({
        questionId: r.questionId,
        content: r.content,
        timestamp: r.timestamp,
        duration: r.duration
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-session-${session.id}-${format(new Date(session.startTime), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Session Exported",
      description: "Interview session data has been downloaded.",
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('interview-sessions-history', JSON.stringify(updatedSessions));

    toast({
      title: "Session Deleted",
      description: "Interview session has been removed from history.",
    });
  };

  const getSessionDuration = (session: InterviewSession) => {
    if (!session.endTime) return 'In Progress';
    const duration = Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCompletionRate = (session: InterviewSession) => {
    return Math.round((session.responses.length / session.questions.length) * 100);
  };

  if (displaySessions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <h3 className="font-medium mb-2">No Interview History</h3>
        <p className="text-sm text-muted-foreground">
          Complete your first interview session to see your history here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {displaySessions.map((session) => (
        <Card key={session.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              {/* Session Header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(session.startTime), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {getSessionDuration(session)}
                </div>
                <Badge 
                  variant={session.status === 'completed' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {session.status}
                </Badge>
              </div>

              {/* Session Stats */}
              <div className="flex items-center gap-4 text-sm">
                <span>
                  <strong>{session.responses.length}</strong> of{' '}
                  <strong>{session.questions.length}</strong> questions answered
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {getCompletionRate(session)}% complete
                </span>
              </div>

              {/* Session Categories */}
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(session.questions.map(q => q.category))).map(category => (
                  <Badge key={category} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions Menu */}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {session.status !== 'completed' && (
                    <DropdownMenuItem onClick={() => onSessionResume?.(session)}>
                      <Play className="h-4 w-4 mr-2" />
                      Resume Session
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onSessionView?.(session)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportSession(session)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteSession(session.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Session
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </Card>
      ))}

      {limit && sessions.length > limit && (
        <div className="text-center">
          <Button variant="outline" size="sm">
            View All Sessions ({sessions.length})
          </Button>
        </div>
      )}
    </div>
  );
}