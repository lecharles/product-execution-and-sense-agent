/**
 * QuestionSelector Component
 * 
 * This component provides a complete interface for selecting and configuring
 * interview questions. It combines category/difficulty selection with advanced
 * filtering options and question preview capabilities.
 * 
 * Features:
 * - Category and difficulty selection via QuestionCategorySelector
 * - Advanced filtering options (time, tags, search)
 * - Real-time question count and preview
 * - Session configuration (number of questions, randomization)
 * - Integration with interview store for session creation
 * - Responsive design for mobile and desktop
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Settings, 
  ChevronDown, 
  Clock, 
  Shuffle, 
  Hash,
  Filter,
  Play,
  Eye
} from 'lucide-react';
import { QuestionCategorySelector } from './QuestionCategorySelector';
import { 
  QuestionCategory, 
  DifficultyLevel, 
  QuestionFilters,
  QuestionBankConfig,
  InterviewQuestion
} from '@/types/interview';
import { 
  QUESTION_BANK,
  filterQuestions,
  selectQuestions,
  CATEGORY_INFO,
  DIFFICULTY_INFO
} from '@/data/questionBank';
import { useInterviewStore } from '@/stores/interviewStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface QuestionSelectorProps {
  /** Callback when a session is created */
  onSessionCreated?: () => void;
  
  /** Whether to show in compact mode */
  compact?: boolean;
  
  /** Initial configuration */
  initialConfig?: Partial<QuestionBankConfig>;
}

/**
 * Main QuestionSelector component
 */
export function QuestionSelector({ 
  onSessionCreated, 
  compact = false,
  initialConfig 
}: QuestionSelectorProps) {
  // State for selection criteria
  const [selectedCategories, setSelectedCategories] = useState<QuestionCategory[]>(
    initialConfig?.filters?.categories || []
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState<DifficultyLevel[]>(
    initialConfig?.filters?.difficulties || []
  );
  
  // State for advanced filters
  const [searchText, setSearchText] = useState(initialConfig?.filters?.searchText || '');
  const [maxTime, setMaxTime] = useState<number>(initialConfig?.filters?.maxTime || 20);
  const [includeContextRequired, setIncludeContextRequired] = useState(
    initialConfig?.filters?.includeContextRequired !== false
  );
  
  // State for session configuration
  const [questionCount, setQuestionCount] = useState(initialConfig?.questionCount || 5);
  const [randomize, setRandomize] = useState(initialConfig?.randomize !== false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Interview store
  const { startNewSession, isLoading } = useInterviewStore();

  // Calculate current filters
  const currentFilters: QuestionFilters = useMemo(() => ({
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    difficulties: selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
    searchText: searchText.trim() || undefined,
    maxTime: maxTime,
    includeContextRequired
  }), [selectedCategories, selectedDifficulties, searchText, maxTime, includeContextRequired]);

  // Calculate available questions
  const availableQuestions = useMemo(() => {
    return filterQuestions(QUESTION_BANK, currentFilters);
  }, [currentFilters]);

  // Preview selected questions
  const previewQuestions = useMemo(() => {
    const config: QuestionBankConfig = {
      questionCount,
      randomize,
      filters: currentFilters
    };
    return selectQuestions(availableQuestions, config);
  }, [availableQuestions, questionCount, randomize, currentFilters]);

  /**
   * Handle session creation
   */
  const handleCreateSession = async () => {
    try {
      if (availableQuestions.length === 0) {
        toast.error('No questions match your criteria. Please adjust your filters.');
        return;
      }

      if (availableQuestions.length < questionCount) {
        toast.error(`Only ${availableQuestions.length} questions available. Please reduce the question count or adjust filters.`);
        return;
      }

      const selectedQuestions = selectQuestions(availableQuestions, {
        questionCount,
        randomize,
        filters: currentFilters
      });

      await startNewSession(selectedQuestions);
      
      toast.success(`Interview session created with ${selectedQuestions.length} questions!`);
      onSessionCreated?.();
      
    } catch (error) {
      console.error('Failed to create session:', error);
      toast.error('Failed to create interview session. Please try again.');
    }
  };

  /**
   * Reset all filters
   */
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSearchText('');
    setMaxTime(20);
    setIncludeContextRequired(true);
    setQuestionCount(5);
    setRandomize(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Create Interview Session</h2>
        <p className="text-muted-foreground">
          Select categories and configure your practice session
        </p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <QuestionCategorySelector
            selectedCategories={selectedCategories}
            selectedDifficulties={selectedDifficulties}
            onCategoriesChange={setSelectedCategories}
            onDifficultiesChange={setSelectedDifficulties}
            additionalFilters={currentFilters}
            compact={compact}
          />
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          {/* Basic Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Session Configuration
              </CardTitle>
              <CardDescription>
                Configure your interview session preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Count */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Number of Questions: {questionCount}
                </Label>
                <Slider
                  value={[questionCount]}
                  onValueChange={([value]) => setQuestionCount(value)}
                  max={Math.min(20, availableQuestions.length)}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  {availableQuestions.length} questions available with current filters
                </p>
              </div>

              {/* Randomize */}
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Shuffle className="h-4 w-4" />
                  Randomize Question Order
                </Label>
                <Switch
                  checked={randomize}
                  onCheckedChange={setRandomize}
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Filters */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                <ChevronDown className={cn(
                  "h-4 w-4 ml-2 transition-transform",
                  showAdvanced && "rotate-180"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  {/* Search Filter */}
                  <div className="space-y-2">
                    <Label>Search Questions</Label>
                    <Input
                      placeholder="Search question content, tags..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>

                  {/* Max Time Filter */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Maximum Time per Question: {maxTime} minutes
                    </Label>
                    <Slider
                      value={[maxTime]}
                      onValueChange={([value]) => setMaxTime(value)}
                      max={30}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Context Required */}
                  <div className="flex items-center justify-between">
                    <Label>Include questions requiring context</Label>
                    <Switch
                      checked={includeContextRequired}
                      onCheckedChange={setIncludeContextRequired}
                    />
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Session Preview
              </CardTitle>
              <CardDescription>
                Review your selected questions before starting
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previewQuestions.length > 0 ? (
                <div className="space-y-4">
                  {previewQuestions.map((question, index) => (
                    <Card key={question.id} className="border-l-4" style={{
                      borderLeftColor: CATEGORY_INFO[question.category].color
                    }}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="font-medium text-sm">
                              Question {index + 1}
                            </h4>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {CATEGORY_INFO[question.category].displayName}
                              </Badge>
                              <Badge 
                                style={{ 
                                  backgroundColor: DIFFICULTY_INFO[question.difficulty].color,
                                  color: 'white'
                                }}
                                className="text-xs"
                              >
                                {DIFFICULTY_INFO[question.difficulty].displayName}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {question.question}
                          </p>
                          
                          {question.estimatedTime && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              ~{question.estimatedTime} minutes
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No questions available with current filters.
                    Please adjust your selection criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleCreateSession}
          disabled={isLoading || availableQuestions.length === 0 || availableQuestions.length < questionCount}
          className="flex-1"
          size="lg"
        >
          <Play className="h-4 w-4 mr-2" />
          {isLoading ? 'Creating Session...' : 'Start Interview Session'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleResetFilters}
          disabled={isLoading}
        >
          Reset
        </Button>
      </div>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{availableQuestions.length}</p>
              <p className="text-sm text-muted-foreground">Available Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{selectedCategories.length}</p>
              <p className="text-sm text-muted-foreground">Selected Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{selectedDifficulties.length || 'All'}</p>
              <p className="text-sm text-muted-foreground">Difficulty Levels</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{questionCount}</p>
              <p className="text-sm text-muted-foreground">Questions in Session</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuestionSelector;