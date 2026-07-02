import type {
  AppProgress,
  DailyPlan,
  DMRECSection,
  TaskCompletion,
  TopicId,
} from '../types';

const STORAGE_KEY = 'cybersec-study-progress';
const SCHEMA_VERSION = 1;

export function createDefaultProgress(): AppProgress {
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    startedAt: now,
    currentDay: 1,
    taskCompletions: [],
    quizAttempts: [],
    mockAttempts: [],
    mistakes: [],
    speakingAttempts: [],
    answeredQuestionIds: [],
    builderAttempts: 0,
    totalQuestionsAnswered: 0,
    answerCompletionRate: 0,
  };
}

export function loadProgress(): AppProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();

    const parsed = JSON.parse(raw) as AppProgress;
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      return migrateProgress(parsed);
    }
    return parsed;
  } catch {
    return createDefaultProgress();
  }
}

function migrateProgress(old: AppProgress): AppProgress {
  return { ...createDefaultProgress(), ...old, schemaVersion: SCHEMA_VERSION };
}

export function saveProgress(progress: AppProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateProgress(updater: (prev: AppProgress) => AppProgress): AppProgress {
  const current = loadProgress();
  const next = updater(current);
  saveProgress(next);
  return next;
}

export function isTaskCompleted(
  progress: AppProgress,
  day: number,
  taskId: string,
): boolean {
  return progress.taskCompletions.some(
    (t) => t.day === day && t.taskId === taskId && t.completed,
  );
}

export function toggleTaskCompletion(
  progress: AppProgress,
  day: number,
  taskId: string,
): AppProgress {
  const existing = progress.taskCompletions.find(
    (t) => t.day === day && t.taskId === taskId,
  );

  if (existing) {
    return {
      ...progress,
      taskCompletions: progress.taskCompletions.map((t) =>
        t.day === day && t.taskId === taskId
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
          : t,
      ),
    };
  }

  const entry: TaskCompletion = {
    day,
    taskId,
    completed: true,
    completedAt: new Date().toISOString(),
  };

  return {
    ...progress,
    taskCompletions: [...progress.taskCompletions, entry],
  };
}

export function setCurrentDay(progress: AppProgress, day: number): AppProgress {
  return { ...progress, currentDay: Math.min(7, Math.max(1, day)) };
}

export function getDayCompletionPercent(
  progress: AppProgress,
  plan: DailyPlan,
): number {
  const completed = plan.tasks.filter((task) =>
    isTaskCompleted(progress, plan.day, task.id),
  ).length;
  return plan.tasks.length === 0 ? 0 : Math.round((completed / plan.tasks.length) * 100);
}

export function getOverallCompletionPercent(
  progress: AppProgress,
  plans: DailyPlan[],
): number {
  const totalTasks = plans.reduce((sum, plan) => sum + plan.tasks.length, 0);
  if (totalTasks === 0) return 0;

  const completed = plans.reduce(
    (sum, plan) =>
      sum +
      plan.tasks.filter((task) => isTaskCompleted(progress, plan.day, task.id)).length,
    0,
  );

  return Math.round((completed / totalTasks) * 100);
}

export function resetProgress(): AppProgress {
  const fresh = createDefaultProgress();
  saveProgress(fresh);
  return fresh;
}

export const DMREC_SECTIONS: DMRECSection[] = [
  'definition',
  'mechanism',
  'benefit',
  'risk',
  'example',
  'conclusion',
];

export const ALL_TOPIC_IDS: TopicId[] = [
  'tls-cryptography',
  'sql-injection',
  'jwt-authentication',
  'sast-dast',
  'api-rate-limiting',
  'defensive-security',
  'mobile-pinning',
  'cia-triad',
];
