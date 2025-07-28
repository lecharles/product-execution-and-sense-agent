import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

/**
 * LoadingStates.tsx - Day 1 Implementation
 * 
 * Collection of loading and skeleton components to improve perceived performance
 * and provide better user feedback during async operations.
 * 
 * Components included:
 * - MessageSkeleton: For loading chat messages
 * - TypingIndicator: Animated indicator when AI is responding
 * - InterviewLoadingSkeleton: For loading interview interface
 */

/**
 * MessageSkeleton Component
 * 
 * Displays a skeleton placeholder while AI messages are loading.
 * Maintains the same layout as actual messages for smooth transitions.
 * Uses the Bot avatar to indicate this is an AI message placeholder.
 */
export const MessageSkeleton = () => (
  <div className="flex gap-3 justify-start">
    {/* AI avatar circle - maintains consistent visual structure */}
    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
      <Bot className="h-4 w-4 text-primary" />
    </div>
    {/* Skeleton content with varying widths to simulate realistic text */}
    <div className="space-y-2 flex-1 max-w-[70%]">
      <Skeleton className="h-4 w-full" />      {/* Full width line */}
      <Skeleton className="h-4 w-4/5" />      {/* 80% width line */}
      <Skeleton className="h-4 w-3/5" />      {/* 60% width line */}
    </div>
  </div>
);

/**
 * TypingIndicator Component
 * 
 * Animated indicator that shows when the AI is actively generating a response.
 * Features bouncing dots animation with staggered timing for organic feel.
 * Includes helpful text to set user expectations.
 */
export const TypingIndicator = () => (
  <div className="flex gap-3 justify-start">
    {/* AI avatar - consistent with message layout */}
    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
      <Bot className="h-4 w-4 text-primary" />
    </div>
    {/* Animated typing indicator */}
    <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
      <div className="flex items-center gap-1">
        {/* Three bouncing dots with staggered animation delays */}
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
      {/* Status text to inform user what's happening */}
      <span className="text-xs text-muted-foreground ml-1">AI is thinking...</span>
    </div>
  </div>
);

/**
 * InterviewLoadingSkeleton Component
 * 
 * Full interface skeleton for when the entire interview component is loading.
 * Useful for initial load states or when switching between interview modes.
 * Mimics the structure of the actual interview interface.
 */
export const InterviewLoadingSkeleton = () => (
  <Card className="p-6 space-y-4">
    {/* Header skeleton - simulates question display header */}
    <div className="flex items-center gap-2">
      <Skeleton className="h-5 w-5 rounded-full" />    {/* Icon placeholder */}
      <Skeleton className="h-5 w-32" />                {/* Title placeholder */}
    </div>
    
    {/* Content skeleton - simulates question text */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />              {/* Full width line */}
      <Skeleton className="h-4 w-4/5" />               {/* 80% width line */}
      <Skeleton className="h-4 w-3/5" />               {/* 60% width line */}
    </div>
    
    {/* Input area skeleton - simulates response input */}
    <div className="flex gap-2">
      <Skeleton className="h-10 flex-1" />             {/* Input field placeholder */}
      <Skeleton className="h-10 w-16" />               {/* Submit button placeholder */}
    </div>
  </Card>
);