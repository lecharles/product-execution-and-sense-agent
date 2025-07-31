/**
 * Question Bank Data
 * 
 * This file contains the core question database for the PM Interview Practice Agent.
 * It includes categorized questions, metadata, and utility functions for question selection.
 * 
 * Architecture Notes:
 * - Questions are organized by category and difficulty for easy filtering
 * - Each question includes comprehensive metadata for AI analysis
 * - Sample questions cover real PM interview scenarios from top companies
 * - Extensible structure allows easy addition of new questions
 */

import { 
  InterviewQuestion, 
  QuestionCategory, 
  DifficultyLevel, 
  CategoryInfo, 
  DifficultyInfo,
  QuestionFilters,
  QuestionBankConfig
} from '@/types/interview';

/**
 * Category metadata for UI display and organization
 */
export const CATEGORY_INFO: Record<QuestionCategory, CategoryInfo> = {
  [QuestionCategory.PRODUCT_STRATEGY]: {
    category: QuestionCategory.PRODUCT_STRATEGY,
    displayName: "Product Strategy",
    description: "Long-term vision, market positioning, and strategic decisions",
    icon: "🎯",
    color: "hsl(var(--primary))",
    skills: ["Strategic thinking", "Market analysis", "Vision setting", "Competitive positioning"]
  },
  [QuestionCategory.PRODUCT_DESIGN]: {
    category: QuestionCategory.PRODUCT_DESIGN,
    displayName: "Product Design",
    description: "User experience, feature design, and product architecture",
    icon: "🎨",
    color: "hsl(262, 90%, 60%)",
    skills: ["UX design", "User research", "Prototyping", "Design thinking"]
  },
  [QuestionCategory.TECHNICAL_PM]: {
    category: QuestionCategory.TECHNICAL_PM,
    displayName: "Technical PM",
    description: "System design, technical tradeoffs, and engineering collaboration",
    icon: "⚙️",
    color: "hsl(173, 90%, 50%)",
    skills: ["System design", "Technical architecture", "Engineering collaboration", "API design"]
  },
  [QuestionCategory.ANALYTICS_METRICS]: {
    category: QuestionCategory.ANALYTICS_METRICS,
    displayName: "Analytics & Metrics",
    description: "Data analysis, KPIs, and performance measurement",
    icon: "📊",
    color: "hsl(43, 90%, 60%)",
    skills: ["Data analysis", "KPI definition", "A/B testing", "Business intelligence"]
  },
  [QuestionCategory.LEADERSHIP_TEAM]: {
    category: QuestionCategory.LEADERSHIP_TEAM,
    displayName: "Leadership & Team",
    description: "Team management, stakeholder communication, and leadership",
    icon: "👥",
    color: "hsl(330, 90%, 60%)",
    skills: ["Team leadership", "Stakeholder management", "Communication", "Conflict resolution"]
  },
  [QuestionCategory.CASE_STUDY]: {
    category: QuestionCategory.CASE_STUDY,
    displayName: "Case Study",
    description: "Real-world scenarios and comprehensive product challenges",
    icon: "📋",
    color: "hsl(220, 90%, 60%)",
    skills: ["Problem solving", "Analytical thinking", "Comprehensive analysis", "Business acumen"]
  },
  [QuestionCategory.BEHAVIORAL]: {
    category: QuestionCategory.BEHAVIORAL,
    displayName: "Behavioral",
    description: "Past experiences, leadership situations, and personal examples",
    icon: "💭",
    color: "hsl(120, 60%, 50%)",
    skills: ["Self-reflection", "Communication", "Leadership examples", "Growth mindset"]
  },
  [QuestionCategory.ESTIMATION]: {
    category: QuestionCategory.ESTIMATION,
    displayName: "Estimation",
    description: "Market sizing, resource estimation, and quantitative reasoning",
    icon: "🔢",
    color: "hsl(15, 90%, 60%)",
    skills: ["Quantitative reasoning", "Market sizing", "Resource planning", "Analytical thinking"]
  },
  [QuestionCategory.PRIORITIZATION]: {
    category: QuestionCategory.PRIORITIZATION,
    displayName: "Prioritization",
    description: "Feature prioritization, resource allocation, and tradeoff decisions",
    icon: "⚖️",
    color: "hsl(285, 90%, 60%)",
    skills: ["Decision making", "Tradeoff analysis", "Resource allocation", "Framework application"]
  },
  [QuestionCategory.MARKET_RESEARCH]: {
    category: QuestionCategory.MARKET_RESEARCH,
    displayName: "Market Research",
    description: "Market analysis, customer research, and competitive intelligence",
    icon: "🔍",
    color: "hsl(195, 90%, 60%)",
    skills: ["Market analysis", "Customer research", "Competitive analysis", "Research methodology"]
  }
};

/**
 * Difficulty level metadata for UI display
 */
export const DIFFICULTY_INFO: Record<DifficultyLevel, DifficultyInfo> = {
  [DifficultyLevel.BEGINNER]: {
    difficulty: DifficultyLevel.BEGINNER,
    displayName: "Beginner",
    description: "Entry-level questions for new PMs or career changers",
    color: "hsl(120, 60%, 50%)",
    experienceLevel: "0-1 years PM experience"
  },
  [DifficultyLevel.INTERMEDIATE]: {
    difficulty: DifficultyLevel.INTERMEDIATE,
    displayName: "Intermediate", 
    description: "Standard PM questions for mid-level positions",
    color: "hsl(43, 90%, 60%)",
    experienceLevel: "1-3 years PM experience"
  },
  [DifficultyLevel.ADVANCED]: {
    difficulty: DifficultyLevel.ADVANCED,
    displayName: "Advanced",
    description: "Complex scenarios for senior PM roles",
    color: "hsl(15, 90%, 60%)",
    experienceLevel: "3-5 years PM experience"
  },
  [DifficultyLevel.EXPERT]: {
    difficulty: DifficultyLevel.EXPERT,
    displayName: "Expert",
    description: "Executive-level questions for senior leadership roles",
    color: "hsl(330, 90%, 60%)",
    experienceLevel: "5+ years PM experience"
  }
};

/**
 * Core question database
 * Organized by category with comprehensive metadata
 */
export const QUESTION_BANK: InterviewQuestion[] = [
  // Product Strategy Questions
  {
    id: "ps_001",
    question: "How would you develop a product strategy for entering a new market?",
    category: QuestionCategory.PRODUCT_STRATEGY,
    difficulty: DifficultyLevel.INTERMEDIATE,
    context: "You're tasked with expanding your company's product into a completely new market segment.",
    framework: [
      "Market research and analysis",
      "Competitive landscape assessment", 
      "Target customer identification",
      "Value proposition development",
      "Go-to-market strategy",
      "Success metrics definition"
    ],
    estimatedTime: 10,
    tags: ["market entry", "strategy", "competitive analysis"],
    followUpQuestions: [
      "How would you validate market demand before launch?",
      "What metrics would you track in the first 6 months?"
    ]
  },
  {
    id: "ps_002", 
    question: "Your product is losing market share to competitors. What's your strategy to regain position?",
    category: QuestionCategory.PRODUCT_STRATEGY,
    difficulty: DifficultyLevel.ADVANCED,
    context: "Market share has declined 15% over the past year due to new competitive products.",
    framework: [
      "Competitive analysis and gap identification",
      "Customer feedback analysis",
      "Product differentiation strategy",
      "Pricing and positioning review",
      "Feature roadmap prioritization",
      "Marketing and sales alignment"
    ],
    estimatedTime: 12,
    tags: ["competitive strategy", "market share", "turnaround"],
    followUpQuestions: [
      "How would you prioritize which competitors to focus on?",
      "What would convince customers to switch back to your product?"
    ]
  },

  // Product Design Questions
  {
    id: "pd_001",
    question: "Design a mobile app for busy parents to manage their family's schedule.",
    category: QuestionCategory.PRODUCT_DESIGN,
    difficulty: DifficultyLevel.INTERMEDIATE,
    context: "Target users are working parents with children aged 5-18 who struggle with scheduling conflicts.",
    framework: [
      "User research and persona development",
      "Problem identification and prioritization",
      "Core feature definition",
      "User experience design",
      "Technical feasibility assessment",
      "Success metrics and validation plan"
    ],
    estimatedTime: 15,
    tags: ["mobile app", "user experience", "family scheduling"],
    followUpQuestions: [
      "How would you handle conflicts between family members' schedules?",
      "What features would differentiate this from existing calendar apps?"
    ]
  },
  {
    id: "pd_002",
    question: "How would you redesign the checkout process for an e-commerce platform to reduce cart abandonment?",
    category: QuestionCategory.PRODUCT_DESIGN,
    difficulty: DifficultyLevel.ADVANCED,
    context: "Current cart abandonment rate is 70%, higher than industry average of 55%.",
    framework: [
      "Current funnel analysis",
      "User pain point identification",
      "Checkout flow optimization",
      "Trust and security improvements",
      "Mobile experience enhancement",
      "A/B testing strategy"
    ],
    estimatedTime: 12,
    tags: ["e-commerce", "conversion optimization", "UX design"],
    followUpQuestions: [
      "How would you measure the success of your redesign?",
      "What external factors might affect cart abandonment rates?"
    ]
  },

  // Technical PM Questions
  {
    id: "tp_001",
    question: "Explain how you would architect a real-time notification system for a social media platform.",
    category: QuestionCategory.TECHNICAL_PM,
    difficulty: DifficultyLevel.ADVANCED,
    context: "Platform has 10M daily active users and needs to handle various notification types efficiently.",
    framework: [
      "System requirements definition",
      "Architecture design (pub/sub, queues)",
      "Scalability considerations", 
      "Database design",
      "API design",
      "Performance monitoring"
    ],
    estimatedTime: 15,
    tags: ["system design", "real-time", "scalability"],
    requiresContext: true,
    followUpQuestions: [
      "How would you handle notification delivery failures?",
      "What would be your strategy for different notification priorities?"
    ]
  },
  {
    id: "tp_002",
    question: "Your engineering team says a critical feature will take 6 months, but the business needs it in 3. How do you handle this?",
    category: QuestionCategory.TECHNICAL_PM,
    difficulty: DifficultyLevel.INTERMEDIATE,
    context: "Feature is essential for a major client contract worth $2M annually.",
    framework: [
      "Requirement analysis and prioritization",
      "Technical scope assessment",
      "Alternative solution exploration",
      "Stakeholder communication",
      "Risk assessment and mitigation",
      "Timeline negotiation strategies"
    ],
    estimatedTime: 10,
    tags: ["stakeholder management", "scope management", "technical negotiation"],
    followUpQuestions: [
      "How would you communicate the tradeoffs to senior leadership?",
      "What if the engineering estimate was actually too optimistic?"
    ]
  },

  // Analytics & Metrics Questions
  {
    id: "am_001",
    question: "Define the key metrics for a food delivery app and explain how you'd track success.",
    category: QuestionCategory.ANALYTICS_METRICS,
    difficulty: DifficultyLevel.INTERMEDIATE,
    context: "New food delivery app competing with established players like DoorDash and Uber Eats.",
    framework: [
      "Business model understanding",
      "User journey mapping",
      "Key metric identification (acquisition, engagement, retention, revenue)",
      "Leading vs lagging indicators",
      "Measurement methodology",
      "Dashboard and reporting design"
    ],
    estimatedTime: 12,
    tags: ["KPIs", "food delivery", "measurement"],
    followUpQuestions: [
      "How would you measure customer satisfaction versus operational efficiency?",
      "What would indicate if your app is gaining market share?"
    ]
  },
  {
    id: "am_002",
    question: "User engagement dropped 20% after a recent product update. How would you investigate and address this?",
    category: QuestionCategory.ANALYTICS_METRICS,
    difficulty: DifficultyLevel.ADVANCED,
    context: "Drop occurred immediately after releasing new navigation and several feature updates.",
    framework: [
      "Data segmentation and analysis",
      "User feedback collection",
      "A/B testing for solutions",
      "Root cause analysis",
      "Recovery strategy development",
      "Prevention measures for future releases"
    ],
    estimatedTime: 15,
    tags: ["data analysis", "user engagement", "problem solving"],
    followUpQuestions: [
      "How would you differentiate between correlation and causation?",
      "What would you do if you couldn't identify a clear cause?"
    ]
  },

  // Leadership & Team Questions  
  {
    id: "lt_001",
    question: "How would you resolve a conflict between your engineering and design teams about a product direction?",
    category: QuestionCategory.LEADERSHIP_TEAM,
    difficulty: DifficultyLevel.INTERMEDIATE,
    context: "Engineering wants a simpler solution for faster delivery, while design insists on a more complex UX for better user experience.",
    framework: [
      "Stakeholder perspective understanding",
      "Root cause identification",
      "Data-driven decision making",
      "Compromise and solution finding",
      "Communication strategy",
      "Process improvement for future conflicts"
    ],
    estimatedTime: 10,
    tags: ["conflict resolution", "team management", "stakeholder alignment"],
    followUpQuestions: [
      "How would you prevent similar conflicts in the future?",
      "What if the CEO supported one side over the other?"
    ]
  },

  // Behavioral Questions
  {
    id: "bh_001",
    question: "Tell me about a time when you had to make a difficult product decision with limited data.",
    category: QuestionCategory.BEHAVIORAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    context: "Looking for examples of decision-making under uncertainty and leadership in ambiguous situations.",
    framework: [
      "Situation description",
      "Available data and constraints",
      "Decision-making process",
      "Stakeholder management",
      "Outcome and learnings",
      "How you'd handle it differently"
    ],
    estimatedTime: 8,
    tags: ["decision making", "uncertainty", "leadership"],
    followUpQuestions: [
      "How did you communicate the uncertainty to stakeholders?",
      "What did you learn about making decisions with incomplete information?"
    ]
  },

  // Estimation Questions
  {
    id: "est_001",
    question: "Estimate the market size for smart home devices in the United States.",
    category: QuestionCategory.ESTIMATION,
    difficulty: DifficultyLevel.BEGINNER,
    context: "Practice market sizing and quantitative reasoning skills.",
    framework: [
      "Market definition and scope",
      "Top-down vs bottom-up approach",
      "Key assumptions identification",
      "Calculation methodology",
      "Sanity check and validation",
      "Market growth considerations"
    ],
    estimatedTime: 8,
    tags: ["market sizing", "quantitative reasoning", "assumptions"],
    followUpQuestions: [
      "How would you validate your estimate?",
      "What factors could significantly change this market size?"
    ]
  },

  // Prioritization Questions
  {
    id: "pr_001",
    question: "You have 5 feature requests from different stakeholders but can only build 2 this quarter. How do you prioritize?",
    category: QuestionCategory.PRIORITIZATION,
    difficulty: DifficultyLevel.INTERMEDIATE,
    context: "Features include: security update, new user onboarding, advanced analytics, mobile optimization, and API improvements.",
    framework: [
      "Evaluation criteria definition",
      "Stakeholder impact assessment",
      "Business value quantification",
      "Resource requirement analysis",
      "Risk assessment",
      "Communication strategy for rejected features"
    ],
    estimatedTime: 12,
    tags: ["prioritization", "stakeholder management", "resource allocation"],
    followUpQuestions: [
      "How would you handle pushback from stakeholders whose features weren't selected?",
      "What framework would you use to make this decision more objective?"
    ]
  },

  // Market Research Questions
  {
    id: "mr_001",
    question: "How would you research and validate demand for a new B2B software product?",
    category: QuestionCategory.MARKET_RESEARCH,
    difficulty: DifficultyLevel.INTERMEDIATE,
    context: "Company is considering entering the project management software space for small businesses.",
    framework: [
      "Market landscape analysis",
      "Target customer identification",
      "Competitive analysis",
      "Customer interview strategy",
      "Demand validation methods",
      "Go/no-go decision criteria"
    ],
    estimatedTime: 12,
    tags: ["market validation", "B2B research", "customer discovery"],
    followUpQuestions: [
      "How would you differentiate between stated preferences and actual buying behavior?",
      "What would indicate strong enough demand to proceed?"
    ]
  }
];

/**
 * Utility functions for question bank operations
 */

/**
 * Filter questions based on provided criteria
 */
export function filterQuestions(
  questions: InterviewQuestion[], 
  filters: QuestionFilters
): InterviewQuestion[] {
  return questions.filter(question => {
    // Category filter
    if (filters.categories?.length && !filters.categories.includes(question.category)) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulties?.length && !filters.difficulties.includes(question.difficulty)) {
      return false;
    }
    
    // Time filter
    if (filters.maxTime && question.estimatedTime && question.estimatedTime > filters.maxTime) {
      return false;
    }
    
    // Search text filter
    if (filters.searchText) {
      const searchTerm = filters.searchText.toLowerCase();
      const searchableText = `${question.question} ${question.context || ''} ${question.tags?.join(' ') || ''}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    // Tags filter
    if (filters.tags?.length) {
      const questionTags = question.tags || [];
      if (!filters.tags.some(tag => questionTags.includes(tag))) {
        return false;
      }
    }
    
    // Context required filter
    if (filters.includeContextRequired === false && question.requiresContext) {
      return false;
    }
    
    return true;
  });
}

/**
 * Select questions based on configuration
 */
export function selectQuestions(
  questions: InterviewQuestion[],
  config: QuestionBankConfig
): InterviewQuestion[] {
  let availableQuestions = config.filters 
    ? filterQuestions(questions, config.filters)
    : [...questions];
    
  if (config.randomize) {
    availableQuestions = shuffleArray(availableQuestions);
  }
  
  // If we need distribution logic, implement it here
  // For now, just return the requested count
  return availableQuestions.slice(0, config.questionCount);
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(category: QuestionCategory): InterviewQuestion[] {
  return QUESTION_BANK.filter(q => q.category === category);
}

/**
 * Get questions by difficulty
 */
export function getQuestionsByDifficulty(difficulty: DifficultyLevel): InterviewQuestion[] {
  return QUESTION_BANK.filter(q => q.difficulty === difficulty);
}

/**
 * Utility function to shuffle array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get all available categories
 */
export function getAllCategories(): QuestionCategory[] {
  return Object.values(QuestionCategory);
}

/**
 * Get all available difficulties  
 */
export function getAllDifficulties(): DifficultyLevel[] {
  return Object.values(DifficultyLevel);
}