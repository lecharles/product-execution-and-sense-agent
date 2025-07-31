/**
 * Interview Types and Enums
 * 
 * This file defines all the core types for the PM Interview Practice Agent,
 * including question categories, difficulty levels, and question structures.
 * 
 * Architecture Notes:
 * - Uses string enums for better debugging and serialization
 * - Extensible design allows easy addition of new categories/difficulties
 * - Type-safe interfaces ensure data consistency across the application
 */

/**
 * Available interview question categories
 * Each category focuses on different PM skills and competencies
 */
export enum QuestionCategory {
  PRODUCT_STRATEGY = "product_strategy",
  PRODUCT_DESIGN = "product_design", 
  TECHNICAL_PM = "technical_pm",
  ANALYTICS_METRICS = "analytics_metrics",
  LEADERSHIP_TEAM = "leadership_team",
  CASE_STUDY = "case_study",
  BEHAVIORAL = "behavioral",
  ESTIMATION = "estimation",
  PRIORITIZATION = "prioritization",
  MARKET_RESEARCH = "market_research"
}

/**
 * Question difficulty levels
 * Determines complexity and expected depth of responses
 */
export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate", 
  ADVANCED = "advanced",
  EXPERT = "expert"
}

/**
 * Interview question structure
 * Contains all metadata and content for a single question
 */
export interface InterviewQuestion {
  /** Unique identifier for the question */
  id: string;
  
  /** Main question text presented to the user */
  question: string;
  
  /** Category classification */
  category: QuestionCategory;
  
  /** Difficulty level */
  difficulty: DifficultyLevel;
  
  /** Optional follow-up questions for deeper exploration */
  followUpQuestions?: string[];
  
  /** Context or background information for the question */
  context?: string;
  
  /** Sample answer framework or key points to cover */
  framework?: string[];
  
  /** Estimated time to answer (in minutes) */
  estimatedTime?: number;
  
  /** Tags for additional categorization */
  tags?: string[];
  
  /** Whether this question requires specific company/product context */
  requiresContext?: boolean;
}

/**
 * Question selection criteria
 * Used for filtering and finding relevant questions
 */
export interface QuestionFilters {
  /** Selected categories to include */
  categories?: QuestionCategory[];
  
  /** Selected difficulty levels */
  difficulties?: DifficultyLevel[];
  
  /** Maximum estimated time per question */
  maxTime?: number;
  
  /** Search text for question content */
  searchText?: string;
  
  /** Specific tags to match */
  tags?: string[];
  
  /** Whether to include questions requiring context */
  includeContextRequired?: boolean;
}

/**
 * Question bank configuration
 * Defines how questions are organized and retrieved
 */
export interface QuestionBankConfig {
  /** Total number of questions to select */
  questionCount: number;
  
  /** Distribution of difficulties (percentages should sum to 100) */
  difficultyDistribution?: {
    [DifficultyLevel.BEGINNER]?: number;
    [DifficultyLevel.INTERMEDIATE]?: number;
    [DifficultyLevel.ADVANCED]?: number;
    [DifficultyLevel.EXPERT]?: number;
  };
  
  /** Distribution of categories */
  categoryDistribution?: Partial<Record<QuestionCategory, number>>;
  
  /** Whether to randomize question order */
  randomize?: boolean;
  
  /** Applied filters */
  filters?: QuestionFilters;
}

/**
 * Category metadata for UI display
 * Contains display information and descriptions for each category
 */
export interface CategoryInfo {
  /** Category enum value */
  category: QuestionCategory;
  
  /** Display name for UI */
  displayName: string;
  
  /** Brief description of what this category covers */
  description: string;
  
  /** Icon name or emoji for visual representation */
  icon: string;
  
  /** Color theme for category badges */
  color: string;
  
  /** Typical skills evaluated in this category */
  skills: string[];
}

/**
 * Difficulty metadata for UI display
 */
export interface DifficultyInfo {
  /** Difficulty enum value */
  difficulty: DifficultyLevel;
  
  /** Display name for UI */
  displayName: string;
  
  /** Description of what this difficulty entails */
  description: string;
  
  /** Color for difficulty indicators */
  color: string;
  
  /** Expected experience level */
  experienceLevel: string;
}