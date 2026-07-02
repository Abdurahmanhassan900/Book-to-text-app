import { mockConfigs } from '../data/mockAssessments';
import {
  allQuestions,
  getQuestionById,
  getQuestionsByTopic,
} from '../data/questions';
import type {
  DMRECSection,
  MockAttempt,
  MockConfig,
  MockQuestionResult,
  PracticeQuestion,
  TopicId,
} from '../types';
import { ALL_TOPIC_IDS } from './storage';
import { evaluateFreeformAnswer } from './evaluator';

function emptyTopicRecord(): Record<TopicId, number> {
  return ALL_TOPIC_IDS.reduce(
    (acc, id) => {
      acc[id] = 0;
      return acc;
    },
    {} as Record<TopicId, number>,
  );
}

function emptyComponentRecord(): Record<DMRECSection, number> {
  return {
    definition: 0,
    mechanism: 0,
    benefit: 0,
    risk: 0,
    example: 0,
    conclusion: 0,
  };
}

export function resolveMockQuestions(config: MockConfig): PracticeQuestion[] {
  if (config.questionIds) {
    return config.questionIds
      .map((id) => getQuestionById(id))
      .filter((q): q is PracticeQuestion => !!q);
  }

  if (config.topicMix) {
    const picked: PracticeQuestion[] = [];
    const used = new Set<string>();

    for (const { topicId, count } of config.topicMix) {
      let pool = getQuestionsByTopic(topicId);
      if (config.difficultyFilter) {
        pool = pool.filter((q) => config.difficultyFilter!.includes(q.difficulty));
      }
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      let added = 0;
      for (const q of shuffled) {
        if (added >= count) break;
        if (!used.has(q.id)) {
          picked.push(q);
          used.add(q.id);
          added += 1;
        }
      }
    }
    return picked;
  }

  return allQuestions.slice(0, 12);
}

export function buildMockAttempt(
  config: MockConfig,
  questions: PracticeQuestion[],
  answers: Record<string, string>,
  startedAt: string,
  timedOut: boolean,
  fallbackFlags: Record<string, boolean>,
): MockAttempt {
  const results: MockQuestionResult[] = questions.map((q) => {
    const answer = answers[q.id] ?? '';
    const evaluation = evaluateFreeformAnswer(answer, q.rubric, q.modelAnswer, {
      timedOut: timedOut && !answer.trim(),
      usedFallback: fallbackFlags[q.id] ?? /not completely sure|i believe/i.test(answer),
    });
    return {
      questionId: q.id,
      topicId: q.topicId,
      answer,
      evaluation,
      timedOut: timedOut && !answer.trim(),
      usedFallback: fallbackFlags[q.id] ?? false,
    };
  });

  const totalScore = results.reduce((s, r) => s + r.evaluation.totalScore, 0);
  const maxScore = results.length * 100;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const topicBreakdown = emptyTopicRecord();
  const topicCounts = emptyTopicRecord();

  for (const r of results) {
    topicBreakdown[r.topicId] += r.evaluation.percentage;
    topicCounts[r.topicId] += 1;
  }

  for (const id of ALL_TOPIC_IDS) {
    if (topicCounts[id] > 0) {
      topicBreakdown[id] = Math.round(topicBreakdown[id] / topicCounts[id]);
    }
  }

  const componentBreakdown = emptyComponentRecord();
  const componentCounts = emptyComponentRecord();

  const sections: DMRECSection[] = [
    'definition',
    'mechanism',
    'benefit',
    'risk',
    'example',
    'conclusion',
  ];

  for (const r of results) {
    for (const section of sections) {
      const score = r.evaluation.sectionScores.find((s) => s.section === section);
      if (score) {
        componentBreakdown[section] += (score.score / score.maxScore) * 100;
        componentCounts[section] += 1;
      }
    }
  }

  for (const section of sections) {
    if (componentCounts[section] > 0) {
      componentBreakdown[section] = Math.round(
        componentBreakdown[section] / componentCounts[section],
      );
    }
  }

  return {
    id: `mock-${config.id}-${Date.now()}`,
    configId: config.id,
    startedAt,
    completedAt: new Date().toISOString(),
    score: totalScore,
    maxScore,
    percentage,
    timeLimitMinutes: config.timeLimitMinutes,
    results,
    topicBreakdown,
    componentBreakdown,
  };
}

export function getIncompleteQuestions(results: MockQuestionResult[]): MockQuestionResult[] {
  return results.filter(
    (r) =>
      r.evaluation.missingSections.length > 0 ||
      r.answer.trim().length < 20 ||
      r.timedOut,
  );
}

export function getMockConfigTitle(configId: string): string {
  return mockConfigs.find((c) => c.id === configId)?.title ?? configId;
}
