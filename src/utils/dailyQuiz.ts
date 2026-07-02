import { getDailyPlan } from '../data/dailyPlans';
import { getQuestionsByTopic } from '../data/questions';
import type { PracticeQuestion, TopicId } from '../types';

const QUIZ_SIZE = 5;

export function getDailyQuizQuestions(day: number): PracticeQuestion[] {
  const plan = getDailyPlan(day);
  if (!plan) return [];

  const pool = plan.topics.flatMap((topicId: TopicId) => getQuestionsByTopic(topicId));
  if (pool.length === 0) return [];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const picked: PracticeQuestion[] = [];
  const used = new Set<string>();

  for (const q of shuffled) {
    if (picked.length >= QUIZ_SIZE) break;
    if (!used.has(q.id)) {
      picked.push(q);
      used.add(q.id);
    }
  }

  return picked;
}

export function getStableDailyQuizQuestions(day: number, seed = day): PracticeQuestion[] {
  const plan = getDailyPlan(day);
  if (!plan) return [];

  const pool = plan.topics.flatMap((topicId: TopicId) => getQuestionsByTopic(topicId));
  const sorted = [...pool].sort((a, b) => a.id.localeCompare(b.id));

  const picked: PracticeQuestion[] = [];
  let i = seed;
  while (picked.length < QUIZ_SIZE && sorted.length > 0) {
    const idx = i % sorted.length;
    const q = sorted[idx];
    if (!picked.find((p) => p.id === q.id)) {
      picked.push(q);
    }
    i += 1;
    if (i > seed + sorted.length * 2) break;
  }

  return picked;
}
