import type {
  AppProgress,
  EvaluationResult,
  MistakeEntry,
  MistakeStatus,
  TopicId,
} from '../types';

function mistakeId(): string {
  return `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createMistakesFromEvaluation(
  evaluation: EvaluationResult,
  topicId: TopicId,
  questionId?: string,
  prompt?: string,
): MistakeEntry[] {
  const entries: MistakeEntry[] = [];
  const now = new Date().toISOString();

  if (evaluation.percentage < 80) {
    entries.push({
      id: mistakeId(),
      createdAt: now,
      topicId,
      questionId,
      type: 'low-score',
      description: `Score ${evaluation.percentage}% below 80% target`,
      detail: prompt ?? evaluation.suggestions.join(' '),
      status: 'not-reviewed',
    });
  }

  for (const section of evaluation.missingSections) {
    entries.push({
      id: mistakeId(),
      createdAt: now,
      topicId,
      questionId,
      type: 'missing-section',
      description: `Missing ${section} in answer framework`,
      detail: `D-M-B-R-E-C requires a clear ${section} section.`,
      status: 'not-reviewed',
    });
  }

  for (const flag of evaluation.flags) {
    if (/incorrect claim|Possible incorrect/i.test(flag)) {
      entries.push({
        id: mistakeId(),
        createdAt: now,
        topicId,
        questionId,
        type: 'incorrect-claim',
        description: 'Possible incorrect or risky claim',
        detail: flag,
        status: 'not-reviewed',
      });
    }
  }

  return entries;
}

export function createTimedOutMistake(
  topicId: TopicId,
  questionId?: string,
): MistakeEntry {
  return {
    id: mistakeId(),
    createdAt: new Date().toISOString(),
    topicId,
    questionId,
    type: 'timed-out',
    description: 'Ran out of time before finishing answer',
    detail: 'Practice delivering D-M-B-R-E-C within 60–90 seconds.',
    status: 'not-reviewed',
  };
}

export function createUnsureMistake(
  topicId: TopicId,
  questionId?: string,
): MistakeEntry {
  return {
    id: mistakeId(),
    createdAt: new Date().toISOString(),
    topicId,
    questionId,
    type: 'unsure',
    description: 'Marked unsure or used fallback structure',
    detail: 'Review topic and retest with structured model answer.',
    status: 'retest-needed',
  };
}

export function appendMistakes(
  progress: AppProgress,
  newEntries: MistakeEntry[],
): AppProgress {
  if (newEntries.length === 0) return progress;

  const existing = progress.mistakes;
  const deduped = newEntries.filter((n) => {
    return !existing.some(
      (e) =>
        e.topicId === n.topicId &&
        e.type === n.type &&
        e.description === n.description &&
        e.status !== 'fixed',
    );
  });

  return {
    ...progress,
    mistakes: [...existing, ...deduped],
  };
}

export function updateMistakeStatus(
  progress: AppProgress,
  mistakeId: string,
  status: MistakeStatus,
): AppProgress {
  return {
    ...progress,
    mistakes: progress.mistakes.map((m) =>
      m.id === mistakeId ? { ...m, status } : m,
    ),
  };
}

export function getMistakeStats(progress: AppProgress) {
  const byType = progress.mistakes.reduce(
    (acc, m) => {
      acc[m.type] = (acc[m.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<MistakeEntry['type'], number>,
  );

  const byStatus = progress.mistakes.reduce(
    (acc, m) => {
      acc[m.status] = (acc[m.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<MistakeStatus, number>,
  );

  const repeated = progress.mistakes.filter((m) => m.type === 'repeated');

  return { byType, byStatus, total: progress.mistakes.length, repeated };
}

export function recordAnswerProgress(
  progress: AppProgress,
  questionId: string,
  evaluation: EvaluationResult,
): AppProgress {
  const answered = progress.answeredQuestionIds.includes(questionId)
    ? progress.answeredQuestionIds
    : [...progress.answeredQuestionIds, questionId];

  const total = progress.totalQuestionsAnswered + 1;
  const completed = evaluation.missingSections.length === 0 ? 1 : 0;
  const prevCompleted =
    (progress.answerCompletionRate / 100) * progress.totalQuestionsAnswered;
  const completionRate =
    total > 0 ? Math.round(((prevCompleted + completed) / total) * 100) : 0;

  return {
    ...progress,
    answeredQuestionIds: answered,
    totalQuestionsAnswered: total,
    answerCompletionRate: completionRate,
  };
}
