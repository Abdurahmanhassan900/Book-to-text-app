// Domain types for the CyberSec study prep application.
// Kept separate from UI so curriculum data and persistence share one schema.

export type TopicId =
  | 'tls-cryptography'
  | 'sql-injection'
  | 'jwt-authentication'
  | 'sast-dast'
  | 'api-rate-limiting'
  | 'defensive-security'
  | 'mobile-pinning'
  | 'cia-triad';

export type QuestionCategory =
  | 'definition'
  | 'mechanism'
  | 'comparison'
  | 'scenario'
  | 'troubleshooting'
  | 'architecture'
  | 'risk-tradeoff'
  | 'follow-up';

export type Difficulty = 'foundation' | 'intermediate' | 'assessment' | 'pressure';

export type MistakeStatus = 'not-reviewed' | 'reviewing' | 'fixed' | 'retest-needed';

export type DMRECSection = 'definition' | 'mechanism' | 'benefit' | 'risk' | 'example' | 'conclusion';

export interface DMRECAnswer {
  definition: string;
  mechanism: string;
  benefit: string;
  risk: string;
  example: string;
  conclusion: string;
}

export interface RubricWeights {
  definition: number;
  mechanism: number;
  benefit: number;
  risk: number;
  example: number;
  terminology: number;
  completeness: number;
}

export interface Rubric {
  weights: RubricWeights;
  requiredConcepts: string[];
  mechanismSteps: string[];
  prohibitedClaims: string[];
  terminologyKeywords: string[];
  minTotalLength: number;
  maxTotalLength: number;
}

export interface ModelAnswer extends DMRECAnswer {
  id: string;
  questionId?: string;
  topicId: TopicId;
  estimatedSeconds: number;
}

export interface Topic {
  id: TopicId;
  title: string;
  day: number;
  tags: string[];
  plainDefinition: string;
  technicalDefinition: string;
  mechanism: string[];
  securityBenefit: string;
  risksAndTradeoffs: string[];
  realWorldExample: string;
  commonMisconception: string;
  modelAnswer: ModelAnswer;
  weakAnswer: string;
  weakAnswerExplanation: string;
  followUpQuestions: string[];
  relatedTopicIds: TopicId[];
}

export type TaskType =
  | 'concept-lesson'
  | 'mechanism-walkthrough'
  | 'flashcards'
  | 'written-answers'
  | 'spoken-practice'
  | 'scenario-practice'
  | 'review-mistakes'
  | 'daily-quiz';

export interface DailyTask {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  durationMinutes: number;
  route?: string;
}

export interface DailyPlan {
  day: number;
  title: string;
  topics: TopicId[];
  objectives: string[];
  tasks: DailyTask[];
  estimatedMinutes: number;
}

export interface Lesson {
  id: string;
  topicId: TopicId;
  day: number;
  title: string;
  summary: string;
  content: string[];
  mechanismSteps: string[];
  practicePrompts: string[];
}

export interface Flashcard {
  id: string;
  topicId: TopicId;
  front: string;
  back: string;
  mechanism: string;
  risk: string;
  example: string;
  followUp: string;
}

export interface PracticeQuestion {
  id: string;
  topicId: TopicId;
  category: QuestionCategory;
  difficulty: Difficulty;
  prompt: string;
  rubric: Rubric;
  modelAnswer: ModelAnswer;
  hints: string[];
}

export interface SectionScore {
  section: DMRECSection | 'terminology';
  score: number;
  maxScore: number;
  feedback: string[];
}

export interface EvaluationResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  isEstimate: boolean;
  sectionScores: SectionScore[];
  missingSections: DMRECSection[];
  flags: string[];
  suggestions: string[];
}

export interface QuizAttempt {
  id: string;
  day: number;
  completedAt: string;
  score: number;
  maxScore: number;
  questionIds: string[];
  answers: Record<string, string>;
}

export interface MockQuestionResult {
  questionId: string;
  topicId: TopicId;
  answer: string;
  evaluation: EvaluationResult;
  timedOut: boolean;
  usedFallback: boolean;
}

export interface MockAttempt {
  id: string;
  configId: string;
  startedAt: string;
  completedAt: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeLimitMinutes: number;
  results: MockQuestionResult[];
  topicBreakdown: Record<TopicId, number>;
  componentBreakdown: Record<DMRECSection, number>;
}

export interface MockConfig {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questionIds?: string[];
  topicMix?: { topicId: TopicId; count: number }[];
  difficultyFilter?: Difficulty[];
}

export interface ReviewRecommendation {
  topicId: TopicId;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  actions: { label: string; route: string }[];
}

export interface MistakeEntry {
  id: string;
  createdAt: string;
  topicId: TopicId;
  questionId?: string;
  type: 'incorrect-claim' | 'missing-section' | 'timed-out' | 'unsure' | 'low-score' | 'repeated';
  description: string;
  detail: string;
  status: MistakeStatus;
}

export interface ReadinessMetrics {
  overallReadiness: number;
  avgRecentQuizzes: number;
  avgRecentMocks: number;
  topicMastery: Record<TopicId, number>;
  answerStructureConsistency: number;
  completionRate: number;
  mechanismScore: number;
  riskTradeoffScore: number;
  realExampleScore: number;
  timedPerformanceScore: number;
  isReady: boolean;
  blockers: string[];
}

export interface TaskCompletion {
  day: number;
  taskId: string;
  completed: boolean;
  completedAt?: string;
}

export interface SpeakingAttempt {
  id: string;
  questionId: string;
  completedAt: string;
  durationSeconds: number;
  transcript: string;
  selfEvaluation: Record<string, boolean>;
  evaluation?: EvaluationResult;
}

export interface AppProgress {
  schemaVersion: number;
  startedAt: string;
  currentDay: number;
  taskCompletions: TaskCompletion[];
  quizAttempts: QuizAttempt[];
  mockAttempts: MockAttempt[];
  mistakes: MistakeEntry[];
  speakingAttempts: SpeakingAttempt[];
  answeredQuestionIds: string[];
  builderAttempts: number;
  totalQuestionsAnswered: number;
  answerCompletionRate: number;
}

export const DEFAULT_RUBRIC_WEIGHTS: RubricWeights = {
  definition: 15,
  mechanism: 25,
  benefit: 15,
  risk: 15,
  example: 10,
  terminology: 10,
  completeness: 10,
};

export const DMREC_LABELS: Record<DMRECSection, { letter: string; label: string }> = {
  definition: { letter: 'D', label: 'Definition' },
  mechanism: { letter: 'M', label: 'Mechanism' },
  benefit: { letter: 'B', label: 'Benefit' },
  risk: { letter: 'R', label: 'Risk or tradeoff' },
  example: { letter: 'E', label: 'Example' },
  conclusion: { letter: 'C', label: 'Conclusion' },
};

export const TOPIC_LABELS: Record<TopicId, string> = {
  'tls-cryptography': 'TLS & Cryptography',
  'sql-injection': 'SQL Injection & DB Security',
  'jwt-authentication': 'JWT & Authentication',
  'sast-dast': 'SAST, DAST & DevSecOps',
  'api-rate-limiting': 'API Security & Rate Limiting',
  'defensive-security': 'Defensive Security Design',
  'mobile-pinning': 'Mobile Security & Pinning',
  'cia-triad': 'CIA Triad & Foundations',
};
