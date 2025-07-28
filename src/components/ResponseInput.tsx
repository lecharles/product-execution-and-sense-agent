import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponseInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const ResponseInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  disabled = false,
  placeholder = "Type your response here...",
  maxLength = 2000
}: ResponseInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recording logic would go here
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[120px] resize-none pr-12",
            isOverLimit && "border-destructive focus-visible:ring-destructive"
          )}
          maxLength={maxLength}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={toggleListening}
          disabled={disabled}
        >
          {isListening ? (
            <MicOff className="h-4 w-4 text-destructive" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span 
            className={cn(
              isNearLimit && "text-orange-500",
              isOverLimit && "text-destructive font-medium"
            )}
          >
            {characterCount}/{maxLength}
          </span>
          <span className="text-xs">• Cmd+Enter to send</span>
        </div>
        
        <Button 
          onClick={onSubmit} 
          disabled={disabled || !value.trim() || isOverLimit}
          size="sm"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Response
        </Button>
      </div>
    </div>
  );
};