import type { AppProgress, DMRECSection, ReadinessMetrics, ReviewRecommendation, TopicId } from '../types';
import { DMREC_LABELS } from '../types';
import { ALL_TOPIC_IDS, getOverallCompletionPercent } from '../utils/storage';
import { dailyPlans } from '../data/dailyPlans';
import { getQuestionsByTopic } from '../data/questions';

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function calculateReadiness(progress: AppProgress): ReadinessMetrics {
  const recentQuizzes = progress.quizAttempts.slice(-3);
  const recentMocks = progress.mockAttempts.slice(-2);

  const avgRecentQuizzes =
    recentQuizzes.length > 0
      ? average(recentQuizzes.map((q) => (q.score / q.maxScore) * 100))
      : 0;

  const avgRecentMocks =
    recentMocks.length > 0
      ? average(recentMocks.map((m) => m.percentage))
      : 0;

  const topicMastery = ALL_TOPIC_IDS.reduce(
    (acc, topicId) => {
      const topicMocks = progress.mockAttempts.flatMap((m) =>
        m.results.filter((r) => r.topicId === topicId),
      );
      if (topicMocks.length === 0) {
        acc[topicId] = 0;
        return acc;
      }
      const scores = topicMocks.map((r) => r.evaluation.percentage);
      acc[topicId] = Math.round(average(scores));
      return acc;
    },
    {} as Record<TopicId, number>,
  );

  const completionRate = getOverallCompletionPercent(progress, dailyPlans);

  const allEvaluations = [
    ...progress.mockAttempts.flatMap((m) => m.results.map((r) => r.evaluation)),
    ...progress.speakingAttempts
      .filter((s) => s.evaluation)
      .map((s) => s.evaluation!),
  ];

  const mechanismScore =
    allEvaluations.length > 0
      ? average(
          allEvaluations.map(
            (e) =>
              e.sectionScores.find((s) => s.section === 'mechanism')?.score ?? 0,
          ),
        )
      : 0;

  const riskTradeoffScore =
    allEvaluations.length > 0
      ? average(
          allEvaluations.map(
            (e) => e.sectionScores.find((s) => s.section === 'risk')?.score ?? 0,
          ),
        )
      : 0;

  const realExampleScore =
    allEvaluations.length > 0
      ? average(
          allEvaluations.map(
            (e) => e.sectionScores.find((s) => s.section === 'example')?.score ?? 0,
          ),
        )
      : 0;

  const timedPerformanceScore =
    progress.speakingAttempts.length > 0
      ? average(
          progress.speakingAttempts.map((s) =>
            s.durationSeconds <= 90 ? 100 : Math.max(0, 100 - (s.durationSeconds - 90) * 2),
          ),
        )
      : 0;

  const structureScores = allEvaluations.map((e) => {
    const filled = 6 - e.missingSections.length;
    return (filled / 6) * 100;
  });
  const answerStructureConsistency =
    structureScores.length > 0 ? average(structureScores) : 0;

  const minTopic = Math.min(...Object.values(topicMastery).filter((v) => v > 0), 100);
  const minTopicSafe = Object.values(topicMastery).some((v) => v > 0) ? minTopic : 0;

  const overallReadiness = Math.round(
    Math.min(
      avgRecentMocks * 0.35 +
        minTopicSafe * 0.25 +
        completionRate * 0.15 +
        answerStructureConsistency * 0.15 +
        timedPerformanceScore * 0.1,
      100,
    ),
  );

  const blockers: string[] = [];
  if (avgRecentMocks < 85 || recentMocks.length < 2) {
    blockers.push('Need at least 85% on two recent mock assessments');
  }
  if (Object.values(topicMastery).some((v) => v > 0 && v < 80)) {
    blockers.push('At least one topic is below 80% mastery');
  }
  if (minTopicSafe > 0 && minTopicSafe < 75) {
    blockers.push('A foundational topic is below 75%');
  }
  if (progress.answerCompletionRate < 90 && progress.totalQuestionsAnswered > 0) {
    blockers.push('Answer completion rate is below 90%');
  }
  if (completionRate < 50) {
    blockers.push('Complete more daily tasks to build readiness');
  }

  const isReady =
    blockers.length === 0 &&
    avgRecentMocks >= 85 &&
    recentMocks.length >= 2 &&
    (progress.answerCompletionRate >= 90 || progress.totalQuestionsAnswered === 0);

  return {
    overallReadiness,
    avgRecentQuizzes: Math.round(avgRecentQuizzes),
    avgRecentMocks: Math.round(avgRecentMocks),
    topicMastery,
    answerStructureConsistency: Math.round(answerStructureConsistency),
    completionRate,
    mechanismScore: Math.round(mechanismScore),
    riskTradeoffScore: Math.round(riskTradeoffScore),
    realExampleScore: Math.round(realExampleScore),
    timedPerformanceScore: Math.round(timedPerformanceScore),
    isReady,
    blockers,
  };
}

export function getWeakestTopics(metrics: ReadinessMetrics, limit = 3): TopicId[] {
  return [...ALL_TOPIC_IDS]
    .sort((a, b) => (metrics.topicMastery[a] ?? 0) - (metrics.topicMastery[b] ?? 0))
    .slice(0, limit);
}

export function getStrongestTopics(metrics: ReadinessMetrics, limit = 3): TopicId[] {
  return [...ALL_TOPIC_IDS]
    .sort((a, b) => (metrics.topicMastery[b] ?? 0) - (metrics.topicMastery[a] ?? 0))
    .slice(0, limit)
    .filter((id) => (metrics.topicMastery[id] ?? 0) > 0);
}

export function getWeakComponents(progress: AppProgress): DMRECSection[] {
  const latest = progress.mockAttempts[progress.mockAttempts.length - 1];
  if (!latest) return [];

  const sections: DMRECSection[] = [
    'definition',
    'mechanism',
    'benefit',
    'risk',
    'example',
    'conclusion',
  ];

  return sections
    .filter((s) => (latest.componentBreakdown[s] ?? 0) < 70)
    .sort((a, b) => (latest.componentBreakdown[a] ?? 0) - (latest.componentBreakdown[b] ?? 0));
}

export function getReviewRecommendations(
  progress: AppProgress,
  metrics: ReadinessMetrics,
): ReviewRecommendation[] {
  const recommendations: ReviewRecommendation[] = [];
  const weakest = getWeakestTopics(metrics, 5);

  for (const topicId of weakest) {
    const mastery = metrics.topicMastery[topicId] ?? 0;
    if (mastery >= 80 && progress.mockAttempts.length > 0) continue;

    const openMistakes = progress.mistakes.filter(
      (m) => m.topicId === topicId && m.status !== 'fixed',
    );

    const priority: ReviewRecommendation['priority'] =
      mastery === 0 || mastery < 60 || openMistakes.length >= 3
        ? 'high'
        : mastery < 75
          ? 'medium'
          : 'low';

    const reasons: string[] = [];
    if (mastery > 0 && mastery < 80) reasons.push(`Topic mastery ${mastery}%`);
    if (mastery === 0) reasons.push('No mock data yet — study and test this topic');
    if (openMistakes.length > 0) reasons.push(`${openMistakes.length} open mistakes`);

    const weakComponent = getWeakComponents(progress)[0];
    if (weakComponent) {
      reasons.push(`Weak ${DMREC_LABELS[weakComponent].label.toLowerCase()} in recent mock`);
    }

    recommendations.push({
      topicId,
      reason: reasons.join(' · ') || 'Core curriculum area',
      priority,
      actions: [
        { label: 'Study topic', route: `/topics/${topicId}` },
        { label: 'Flashcards', route: '/practice/flashcards' },
        { label: 'Practice answers', route: '/practice/builder' },
        { label: 'Mistake log', route: '/mistakes' },
      ],
    });
  }

  if (progress.answerCompletionRate < 90 && progress.totalQuestionsAnswered > 0) {
    recommendations.push({
      topicId: weakest[0] ?? 'tls-cryptography',
      reason: `Answer completion rate ${progress.answerCompletionRate}% — finish all D-M-B-R-E-C sections`,
      priority: 'high',
      actions: [
        { label: 'Answer Builder', route: '/practice/builder' },
        { label: 'Speaking practice', route: '/practice/speaking' },
      ],
    });
  }

  if (metrics.avgRecentMocks < 85) {
    recommendations.push({
      topicId: weakest[0] ?? 'tls-cryptography',
      reason: `Recent mock average ${metrics.avgRecentMocks}% — target 85%+`,
      priority: 'high',
      actions: [
        { label: 'Take mock exam', route: '/mock' },
        { label: 'Review mode', route: '/review' },
      ],
    });
  }

  return recommendations.slice(0, 6);
}

export function getRetestQuestions(progress: AppProgress, limit = 5): string[] {
  const weakTopics = getWeakestTopics(calculateReadiness(progress), 3);
  const ids: string[] = [];

  for (const topicId of weakTopics) {
    const pool = getQuestionsByTopic(topicId);
    for (const q of pool) {
      if (ids.length >= limit) break;
      if (!ids.includes(q.id)) ids.push(q.id);
    }
  }

  const mistakeQuestions = progress.mistakes
    .filter((m) => m.questionId && m.status === 'retest-needed')
    .map((m) => m.questionId!)
    .slice(0, limit);

  return [...new Set([...mistakeQuestions, ...ids])].slice(0, limit);
}
