/**
 * QuestionCategorySelector Component
 * 
 * This component provides a user interface for selecting question categories
 * and difficulty levels for interview sessions. It displays categories in
 * an organized grid with visual indicators and allows multiple selections.
 * 
 * Features:
 * - Multi-select category selection with visual feedback
 * - Difficulty level selector with color-coded indicators  
 * - Search functionality for finding specific categories
 * - Responsive grid layout that adapts to screen size
 * - Category descriptions and skill indicators
 * - Integration with interview store for state management
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Search, Check } from 'lucide-react';
import { 
  QuestionCategory, 
  DifficultyLevel, 
  QuestionFilters 
} from '@/types/interview';
import { 
  CATEGORY_INFO, 
  DIFFICULTY_INFO, 
  QUESTION_BANK,
  filterQuestions 
} from '@/data/questionBank';
import { cn } from '@/lib/utils';

interface QuestionCategorySelectorProps {
  /** Currently selected categories */
  selectedCategories: QuestionCategory[];
  
  /** Currently selected difficulty levels */
  selectedDifficulties: DifficultyLevel[];
  
  /** Callback when categories change */
  onCategoriesChange: (categories: QuestionCategory[]) => void;
  
  /** Callback when difficulties change */
  onDifficultiesChange: (difficulties: DifficultyLevel[]) => void;
  
  /** Optional additional filters */
  additionalFilters?: Partial<QuestionFilters>;
  
  /** Whether to show question counts for each category */
  showQuestionCounts?: boolean;
  
  /** Maximum number of categories that can be selected */
  maxCategories?: number;
  
  /** Whether the selector is in a compact mode */
  compact?: boolean;
}

/**
 * Main QuestionCategorySelector component
 */
export function QuestionCategorySelector({
  selectedCategories,
  selectedDifficulties,
  onCategoriesChange,
  onDifficultiesChange,
  additionalFilters,
  showQuestionCounts = true,
  maxCategories,
  compact = false
}: QuestionCategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    const categories = Object.values(QuestionCategory);
    if (!searchTerm) return categories;
    
    return categories.filter(category => {
      const info = CATEGORY_INFO[category];
      const searchText = `${info.displayName} ${info.description} ${info.skills.join(' ')}`.toLowerCase();
      return searchText.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  // Calculate question counts for each category
  const questionCounts = useMemo(() => {
    if (!showQuestionCounts) return {};
    
    const counts: Record<string, number> = {};
    
    Object.values(QuestionCategory).forEach(category => {
      const filters: QuestionFilters = {
        categories: [category],
        difficulties: selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
        ...additionalFilters
      };
      
      counts[category] = filterQuestions(QUESTION_BANK, filters).length;
    });
    
    return counts;
  }, [selectedDifficulties, additionalFilters, showQuestionCounts]);

  /**
   * Handle category selection toggle
   */
  const handleCategoryToggle = (category: QuestionCategory) => {
    const isSelected = selectedCategories.includes(category);
    
    if (isSelected) {
      // Remove category
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      // Add category (check max limit)
      if (maxCategories && selectedCategories.length >= maxCategories) {
        return; // Don't add if at max
      }
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  /**
   * Handle difficulty selection toggle
   */
  const handleDifficultyToggle = (difficulty: DifficultyLevel) => {
    const isSelected = selectedDifficulties.includes(difficulty);
    
    if (isSelected) {
      onDifficultiesChange(selectedDifficulties.filter(d => d !== difficulty));
    } else {
      onDifficultiesChange([...selectedDifficulties, difficulty]);
    }
  };

  /**
   * Clear all selections
   */
  const handleClearAll = () => {
    onCategoriesChange([]);
    onDifficultiesChange([]);
  };

  /**
   * Select all categories
   */
  const handleSelectAll = () => {
    const allCategories = Object.values(QuestionCategory);
    const categoriesToSelect = maxCategories 
      ? allCategories.slice(0, maxCategories)
      : allCategories;
    onCategoriesChange(categoriesToSelect);
  };

  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Select Question Categories</h3>
          <p className="text-sm text-muted-foreground">
            Choose the PM skills you want to practice
          </p>
        </div>
        
        {!compact && (
          <div className="flex gap-2">
            <Button
              variant="outline" 
              size="sm"
              onClick={handleSelectAll}
              disabled={maxCategories && selectedCategories.length >= maxCategories}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm" 
              onClick={handleClearAll}
              disabled={selectedCategories.length === 0 && selectedDifficulties.length === 0}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      {!compact && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Category Grid */}
      <div className={cn(
        "grid gap-4",
        compact ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {filteredCategories.map(category => {
          const info = CATEGORY_INFO[category];
          const isSelected = selectedCategories.includes(category);
          const questionCount = questionCounts[category] || 0;
          const isDisabled = maxCategories && selectedCategories.length >= maxCategories && !isSelected;

          return (
            <Card
              key={category}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary border-primary",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isDisabled && handleCategoryToggle(category)}
            >
              <CardHeader className={cn("pb-3", compact && "pb-2")}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{info.icon}</span>
                    <CardTitle className={cn("text-base", compact && "text-sm")}>
                      {info.displayName}
                    </CardTitle>
                  </div>
                  {isSelected && (
                    <div className="rounded-full bg-primary p-1">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                
                {!compact && (
                  <CardDescription className="text-sm">
                    {info.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className={cn("pt-0", compact && "pt-0")}>
                {!compact && (
                  <div className="space-y-3">
                    {/* Skills */}
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Key Skills
                      </Label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {info.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {info.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{info.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Question count */}
                {showQuestionCounts && (
                  <div className={cn("mt-2 text-xs text-muted-foreground", compact && "mt-1")}>
                    {questionCount} question{questionCount !== 1 ? 's' : ''} available
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-4">
        <Separator />
        
        <div>
          <h4 className="font-semibold mb-2">Difficulty Level</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Select the difficulty levels that match your experience
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.values(DifficultyLevel).map(difficulty => {
              const info = DIFFICULTY_INFO[difficulty];
              const isSelected = selectedDifficulties.includes(difficulty);

              return (
                <Card
                  key={difficulty}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    isSelected && "ring-2 ring-primary border-primary"
                  )}
                  onClick={() => handleDifficultyToggle(difficulty)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        style={{ backgroundColor: info.color, color: 'white' }}
                        className="text-xs"
                      >
                        {info.displayName}
                      </Badge>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    
                    {!compact && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          {info.description}
                        </p>
                        <p className="text-xs font-medium">
                          {info.experienceLevel}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      {(selectedCategories.length > 0 || selectedDifficulties.length > 0) && (
        <div className="space-y-2">
          <Separator />
          <div className="text-sm">
            <p className="font-medium mb-2">Your Selection:</p>
            <div className="space-y-1">
              {selectedCategories.length > 0 && (
                <p>
                  <span className="text-muted-foreground">Categories:</span>{' '}
                  {selectedCategories.map(cat => CATEGORY_INFO[cat].displayName).join(', ')}
                </p>
              )}
              {selectedDifficulties.length > 0 && (
                <p>
                  <span className="text-muted-foreground">Difficulties:</span>{' '}
                  {selectedDifficulties.map(diff => DIFFICULTY_INFO[diff].displayName).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionCategorySelector;