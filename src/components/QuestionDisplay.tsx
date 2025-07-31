/**
 * QuestionDisplay Component
 * 
 * Enhanced component for displaying interview questions with rich metadata
 * including category badges, difficulty indicators, and contextual information.
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { InterviewQuestion } from '@/types/interview';
import { CATEGORY_INFO, DIFFICULTY_INFO } from '@/data/questionBank';

interface QuestionDisplayProps {
  /** The interview question object with all metadata */
  question: InterviewQuestion;
}

export const QuestionDisplay = ({ question }: QuestionDisplayProps) => {
  return (
    <Card className="p-6 mb-6 bg-gradient-subtle border-primary/30">
      <CardContent className="p-0">
        {/* Category and Difficulty Badges */}
        <div className="flex items-center gap-2 mb-4">
          {question.category && (
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: CATEGORY_INFO[question.category]?.color + '20',
                color: CATEGORY_INFO[question.category]?.color 
              }}
            >
              {CATEGORY_INFO[question.category]?.icon} {CATEGORY_INFO[question.category]?.displayName || question.category}
            </Badge>
          )}
          {question.difficulty && (
            <Badge 
              className="text-xs"
              style={{ 
                backgroundColor: DIFFICULTY_INFO[question.difficulty]?.color,
                color: 'white'
              }}
            >
              {DIFFICULTY_INFO[question.difficulty]?.displayName || question.difficulty}
            </Badge>
          )}
          {question.estimatedTime && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {question.estimatedTime}m
            </Badge>
          )}
        </div>

        {/* Main Question */}
        <h2 className="text-xl font-semibold text-foreground mb-6 leading-relaxed">
          {question.question}
        </h2>

        {/* Context Section */}
        {question.context && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Context</h3>
            <p className="text-sm">{question.context}</p>
          </div>
        )}

        {/* Framework Section */}
        {question.framework && question.framework.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Suggested Framework</h3>
            <ul className="space-y-2">
              {question.framework.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary font-medium min-w-[20px]">{index + 1}.</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {question.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};