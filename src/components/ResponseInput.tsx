import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props interface for the ResponseInput component
 * Provides comprehensive control over input behavior and validation
 */
interface ResponseInputProps {
  value: string;                    // Current input value (controlled component)
  onChange: (value: string) => void; // Handler for input changes
  onSubmit: () => void;             // Handler for form submission
  disabled?: boolean;               // Disables input during loading states
  placeholder?: string;             // Custom placeholder text
  maxLength?: number;               // Character limit for responses
}

/**
 * ResponseInput Component - Day 1 Implementation
 * 
 * An enhanced textarea component specifically designed for interview responses with:
 * - Character count with visual warnings (80% threshold, over-limit highlighting)
 * - Keyboard shortcuts (Cmd+Enter to submit)
 * - Voice recording toggle button (UI ready, functionality placeholder)
 * - Smart validation and submission controls
 * - Professional styling that matches the interview context
 * 
 * This replaces the basic Input component with a more suitable textarea
 * that encourages detailed, thoughtful responses while providing helpful UX features.
 */
export const ResponseInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  disabled = false,
  placeholder = "Type your response here...",
  maxLength = 2000                  // Default 2000 character limit for detailed responses
}: ResponseInputProps) => {
  // Local state for voice recording UI (functionality to be implemented later)
  const [isListening, setIsListening] = useState(false);
  
  // Calculate character usage and determine warning states
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;  // Warning at 80% capacity
  const isOverLimit = characterCount > maxLength;        // Error state when over limit

  /**
   * Handles keyboard shortcuts for better UX
   * Cmd+Enter (Mac) or Ctrl+Enter (Windows) triggers submission
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {  // metaKey = Cmd on Mac, Ctrl on Windows when combined
      e.preventDefault();
      onSubmit();
    }
  };

  /**
   * Toggles voice recording state
   * Currently just UI state - actual voice recording to be implemented in future phases
   * Provides visual feedback for recording state
   */
  const toggleListening = () => {
    setIsListening(!isListening);
    // TODO: Implement actual voice recording functionality
    // This will integrate with Web Speech API or similar service
  };

  return (
    <div className="space-y-3">
      {/* Main textarea with voice recording button overlay */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[120px] resize-none pr-12",  // Fixed height, no resize, space for button
            // Dynamic styling based on character limit status
            isOverLimit && "border-destructive focus-visible:ring-destructive"
          )}
          maxLength={maxLength}
        />
        {/* Voice recording toggle button - positioned in top-right corner */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={toggleListening}
          disabled={disabled}
          title={isListening ? "Stop recording" : "Start voice recording"}
        >
          {isListening ? (
            <MicOff className="h-4 w-4 text-destructive" />  // Red mic when recording
          ) : (
            <Mic className="h-4 w-4" />                      // Normal mic when not recording
          )}
        </Button>
      </div>
      
      {/* Footer with character count and submission controls */}
      <div className="flex items-center justify-between">
        {/* Character count with progressive styling based on usage */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span 
            className={cn(
              // Default styling
              "transition-colors duration-200",
              // Warning state at 80% capacity
              isNearLimit && "text-orange-500",
              // Error state when over limit
              isOverLimit && "text-destructive font-medium"
            )}
          >
            {characterCount}/{maxLength}
          </span>
          {/* Helpful shortcut reminder */}
          <span className="text-xs">• Cmd+Enter to send</span>
        </div>
        
        {/* Submit button with smart enabling logic */}
        <Button 
          onClick={onSubmit} 
          disabled={
            disabled ||           // Disabled during loading
            !value.trim() ||      // Disabled if empty or only whitespace
            isOverLimit          // Disabled if over character limit
          }
          size="sm"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Response
        </Button>
      </div>
    </div>
  );
};