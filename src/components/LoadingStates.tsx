import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export const MessageSkeleton = () => (
  <div className="flex gap-3 justify-start">
    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
      <Bot className="h-4 w-4 text-primary" />
    </div>
    <div className="space-y-2 flex-1 max-w-[70%]">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  </div>
);

export const TypingIndicator = () => (
  <div className="flex gap-3 justify-start">
    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
      <Bot className="h-4 w-4 text-primary" />
    </div>
    <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
      <span className="text-xs text-muted-foreground ml-1">AI is thinking...</span>
    </div>
  </div>
);

export const InterviewLoadingSkeleton = () => (
  <Card className="p-6 space-y-4">
    <div className="flex items-center gap-2">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-5 w-32" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-16" />
    </div>
  </Card>
);