import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingUp } from 'lucide-react';

interface QuestionDisplayProps {
  question: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  timeLimit?: number;
  isVisible: boolean;
}

export const QuestionDisplay = ({ 
  question, 
  category = "Product Execution", 
  difficulty = "Medium", 
  timeLimit = 30,
  isVisible 
}: QuestionDisplayProps) => {
  if (!isVisible) return null;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'default';
      case 'Medium': return 'secondary';
      case 'Hard': return 'destructive';
      default: return 'default';
    }
  };

  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case 'Easy': return <Target className="h-3 w-3" />;
      case 'Medium': return <TrendingUp className="h-3 w-3" />;
      case 'Hard': return <TrendingUp className="h-3 w-3" />;
      default: return <Target className="h-3 w-3" />;
    }
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-subtle border-primary/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <Badge variant={getDifficultyColor(difficulty)} className="text-xs">
            {getDifficultyIcon(difficulty)}
            {difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Clock className="h-4 w-4" />
          <span>{timeLimit} min suggested</span>
        </div>
      </div>
      
      <div className="prose prose-sm">
        <p className="text-base leading-relaxed">{question}</p>
      </div>
    </Card>
  );
};