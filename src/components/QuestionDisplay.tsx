import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingUp } from 'lucide-react';

/**
 * Props interface for the QuestionDisplay component
 * Defines all the properties needed to display an interview question with metadata
 */
interface QuestionDisplayProps {
  question: string;           // The actual interview question text
  category?: string;          // Question category (e.g., "Product Execution", "Product Sense")
  difficulty?: 'Easy' | 'Medium' | 'Hard';  // Difficulty level with strict typing
  timeLimit?: number;         // Suggested time limit in minutes
  isVisible: boolean;         // Controls whether the component is rendered
}

/**
 * QuestionDisplay Component - Day 1 Implementation
 * 
 * A polished component for displaying interview questions with:
 * - Category and difficulty badges with appropriate styling
 * - Time limit indicator with clock icon
 * - Professional card layout with gradient background
 * - Proper typography and spacing for readability
 * 
 * This component replaces simple text display with a rich, informative presentation
 * that helps users understand the context and expectations of each question.
 */
export const QuestionDisplay = ({ 
  question, 
  category = "Product Execution",     // Default category if none provided
  difficulty = "Medium",              // Default difficulty level
  timeLimit = 30,                     // Default time limit of 30 minutes
  isVisible 
}: QuestionDisplayProps) => {
  // Early return if component should not be visible - prevents unnecessary rendering
  if (!isVisible) return null;

  /**
   * Determines the appropriate badge color variant based on difficulty level
   * Uses semantic color mapping for intuitive difficulty indication
   */
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'default';      // Green-ish default color for easy questions
      case 'Medium': return 'secondary';  // Neutral color for medium questions  
      case 'Hard': return 'destructive';  // Red-ish color for hard questions
      default: return 'default';          // Fallback to default
    }
  };

  /**
   * Returns appropriate icon for each difficulty level
   * Visual indicators help users quickly identify question complexity
   */
  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case 'Easy': return <Target className="h-3 w-3" />;        // Target icon for easy (precise, achievable)
      case 'Medium': return <TrendingUp className="h-3 w-3" />;  // Trending up for medium (growth challenge)
      case 'Hard': return <TrendingUp className="h-3 w-3" />;    // Same icon but with destructive color
      default: return <Target className="h-3 w-3" />;           // Fallback icon
    }
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-subtle border-primary/30">
      {/* Header section with category and difficulty badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Category badge - helps users understand question type */}
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          {/* Difficulty badge with dynamic color and icon */}
          <Badge variant={getDifficultyColor(difficulty)} className="text-xs">
            {getDifficultyIcon(difficulty)}
            {difficulty}
          </Badge>
        </div>
        {/* Time limit indicator - sets expectations for response time */}
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Clock className="h-4 w-4" />
          <span>{timeLimit} min suggested</span>
        </div>
      </div>
      
      {/* Question content area with proper typography */}
      <div className="prose prose-sm">
        <p className="text-base leading-relaxed">{question}</p>
      </div>
    </Card>
  );
};