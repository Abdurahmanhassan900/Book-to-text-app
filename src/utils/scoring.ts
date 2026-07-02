import type { AppProgress, ReadinessMetrics, TopicId } from '../types';
import { ALL_TOPIC_IDS } from '../utils/storage';
import { dailyPlans } from '../data/dailyPlans';
import { getOverallCompletionPercent } from '../utils/storage';

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
