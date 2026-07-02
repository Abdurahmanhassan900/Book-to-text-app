import { apiQuestions } from './api-rate-limiting';
import { ciaQuestions } from './cia-triad';
import { defensiveQuestions } from './defensive-security';
import { jwtQuestions } from './jwt-authentication';
import { mobilePinningQuestions } from './mobile-pinning';
import { sastDastQuestions } from './sast-dast';
import { sqlQuestions } from './sql-injection';
import { tlsQuestions } from './tls';
import type { Difficulty, PracticeQuestion, QuestionCategory, TopicId } from '../../types';

export const allQuestions: PracticeQuestion[] = [
  ...tlsQuestions,
  ...sqlQuestions,
  ...jwtQuestions,
  ...sastDastQuestions,
  ...apiQuestions,
  ...defensiveQuestions,
  ...mobilePinningQuestions,
  ...ciaQuestions,
];

export function getQuestionById(id: string): PracticeQuestion | undefined {
  return allQuestions.find((q) => q.id === id);
}

export function getQuestionsByTopic(topicId: TopicId): PracticeQuestion[] {
  return allQuestions.filter((q) => q.topicId === topicId);
}

export function getQuestionsByCategory(category: QuestionCategory): PracticeQuestion[] {
  return allQuestions.filter((q) => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: Difficulty): PracticeQuestion[] {
  return allQuestions.filter((q) => q.difficulty === difficulty);
}

export function getRandomQuestions(count: number, topicId?: TopicId): PracticeQuestion[] {
  const pool = topicId ? getQuestionsByTopic(topicId) : [...allQuestions];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export {
  tlsQuestions,
  sqlQuestions,
  jwtQuestions,
  sastDastQuestions,
  apiQuestions,
  defensiveQuestions,
  mobilePinningQuestions,
  ciaQuestions,
};
