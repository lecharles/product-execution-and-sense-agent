import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Day 1 Enhanced Components - Replacing basic input with professional interview components
import { QuestionDisplay } from './QuestionDisplay';
import { ResponseInput } from './ResponseInput';
import { TypingIndicator, MessageSkeleton } from './LoadingStates';

/**
 * Message interface - Defines structure for chat messages
 * Used throughout the interview chat system for consistent data handling
 */
interface Message {
  id: string;           // Unique identifier for each message
  content: string;      // The actual message text content
  role: 'user' | 'assistant';  // Distinguishes between user responses and AI questions/feedback
  timestamp: Date;      // When the message was created
}

/**
 * Props interface for InterviewChat component
 * Provides callback for opening settings dialog from parent component
 */
interface InterviewChatProps {
  onOpenSettings: () => void;  // Callback to open settings dialog
}

/**
 * InterviewChat Component - Enhanced Day 1 Implementation
 * 
 * Main interview interface that manages the conversation flow between user and AI.
 * Features implemented in Day 1:
 * - Enhanced UI with professional components (QuestionDisplay, ResponseInput)
 * - Improved loading states and user feedback
 * - Better error handling and validation
 * - Character limits and input validation
 * - Keyboard shortcuts and accessibility improvements
 */

export const InterviewChat = ({ onOpenSettings }: InterviewChatProps) => {
  // State management for interview session
  const [messages, setMessages] = useState<Message[]>([]);        // All chat messages
  const [input, setInput] = useState('');                         // Current user input
  const [isLoading, setIsLoading] = useState(false);              // Loading state for AI responses
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);  // Interview session state
  
  // Refs and hooks
  const scrollAreaRef = useRef<HTMLDivElement>(null);             // Reference for auto-scrolling
  const { toast } = useToast();                                   // Toast notifications for user feedback

  /**
   * Scrolls the chat area to the bottom to show the latest message
   * Essential for maintaining chat flow as new messages are added
   */

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // Find the actual scrollable viewport within the ScrollArea component
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        // Scroll to the bottom to show the latest message
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  // Auto-scroll effect - triggers whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Retrieves the OpenAI API key from localStorage
   * Centralized function for API key management
   */

  const getApiKey = () => {
    return localStorage.getItem('openai_api_key');
  };

  /**
   * Initiates a new interview session
   * - Validates API key presence
   * - Sets up initial interview state
   * - Sends welcome message to establish context
   */
  const startInterview = async () => {
    // Validate API key before starting
    const apiKey = getApiKey();
    if (!apiKey) {
      // Show user-friendly error and redirect to settings
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key in settings first.",
        variant: "destructive"
      });
      onOpenSettings();  // Open settings dialog for user
      return;
    }

    // Initialize interview session
    setIsInterviewStarted(true);
    setIsLoading(true);

    // Create welcome message to set interview context
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: "Hello! I'm your AI interview coach. I'll be conducting a product management interview with you today. We'll focus on product execution and product sense questions. Are you ready to begin?",
      role: 'assistant',
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    setIsLoading(false);
  };

  /**
   * Sends user message to AI and processes the response
   * Enhanced error handling and user feedback
   */
  const sendMessage = async () => {
    // Input validation
    if (!input.trim() || isLoading) return;

    // API key validation
    const apiKey = getApiKey();
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key in settings.",
        variant: "destructive"
      });
      return;
    }

    // Create and add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');  // Clear input field immediately for better UX
    setIsLoading(true);  // Show loading indicator

    try {
      // Call OpenAI API with interview-specific prompt and context
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',  // Using GPT-4 for high-quality interview experience
          messages: [
            {
              role: 'system',
              // Comprehensive system prompt for interview context
              content: `You are an experienced product management interviewer conducting a realistic PM interview. 

Key Guidelines:
- Ask one question at a time
- Follow up with clarifying questions based on the candidate's answers
- Focus on product execution and product sense
- Be encouraging but thorough
- Provide brief feedback when appropriate
- Ask about trade-offs, prioritization, and metrics
- Keep responses concise and conversational

Interview Flow:
1. Start with a product execution question (e.g., "How would you improve Instagram Stories?")
2. Follow up with clarifying questions about their approach
3. Ask about metrics and success measurement
4. Move to product sense questions
5. Conclude with feedback

Stay in character as an interviewer throughout.`
            },
            // Include all previous messages for context
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: input
            }
          ],
          max_tokens: 300,     // Reasonable limit for interview responses
          temperature: 0.7     // Balanced creativity and consistency
        })
      });

      // Error handling for API response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Create AI response message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),  // Unique ID different from user message
        content: data.choices[0].message.content,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Comprehensive error handling with user feedback
      console.error('Error calling OpenAI API:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);  // Always clear loading state
    }
  };

  /**
   * Legacy keyboard handler for Enter key submission
   * Note: Enhanced ResponseInput component now handles this internally
   */

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Interview start screen - shown before interview begins
  if (!isInterviewStarted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {/* Welcome card with gradient styling and clear call-to-action */}
        <Card className="p-8 text-center bg-gradient-card border-primary/20">
          {/* Bot icon for visual branding */}
          <Bot className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4">Ready for your PM Interview?</h2>
          <p className="text-muted-foreground mb-6">
            Practice product execution and product sense questions with our AI interviewer.
            Get real-time feedback to improve your interview skills.
          </p>
          <div className="space-y-3">
            {/* Primary action - start interview */}
            <Button onClick={startInterview} size="lg" className="w-full">
              Start Interview Practice
            </Button>
            {/* Secondary action - configure settings */}
            <Button onClick={onOpenSettings} variant="outline" size="lg" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure Settings
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Main interview interface - shown during active interview
  return (
    <div className="flex flex-col h-[70vh] bg-gradient-card rounded-lg border border-primary/20">
      {/* Header with branding and settings access */}
      <div className="flex items-center justify-between p-4 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold">AI Interview Coach</span>
        </div>
        {/* Settings button for quick access */}
        <Button onClick={onOpenSettings} variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable message area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {/* Render all messages in chronological order */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* AI avatar - only shown for assistant messages */}
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              {/* Message content with role-based styling */}
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'      // User messages: primary theme
                    : 'bg-secondary text-secondary-foreground'  // AI messages: secondary theme
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {/* User avatar - only shown for user messages */}
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}
          {/* Loading indicator when AI is responding - Day 1 Enhanced Component */}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Input area with enhanced ResponseInput component - Day 1 Implementation */}
      <div className="p-4 border-t border-primary/20">
        <ResponseInput
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          disabled={isLoading}
          placeholder="Type your detailed response here..."
          maxLength={2000}  // Generous limit for comprehensive interview responses
        />
      </div>
    </div>
  );
};