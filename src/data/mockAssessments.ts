import type { MockConfig } from '../types';

export const mockConfigs: MockConfig[] = [
  {
    id: 'mock-a',
    title: 'Mock A — Foundations (TLS, SQL, JWT)',
    description:
      'Days 1–3 focus: cryptography, database security, and authentication. 12 questions, 22 minutes.',
    timeLimitMinutes: 22,
    questionIds: [
      'q-tls-02',
      'q-tls-03',
      'q-tls-04',
      'q-tls-05',
      'q-tls-07',
      'q-sql-02',
      'q-sql-03',
      'q-sql-04',
      'q-sql-05',
      'jwt-q1-server-receives',
      'jwt-q2-long-lived-danger',
      'jwt-q3-auth-vs-authz',
    ],
  },
  {
    id: 'mock-b',
    title: 'Mock B — DevSecOps & Defensive Design',
    description:
      'Days 4–5 focus: SAST/DAST pipelines, API security, and login defenses. 13 questions, 24 minutes.',
    timeLimitMinutes: 24,
    questionIds: [
      'sast-dast-q1-compare',
      'sast-dast-q2-pipeline-placement',
      'sast-dast-q3-false-positive',
      'sast-dast-q5-dependency-scanning',
      'sast-dast-q6-secret-scanning',
      'q-api-01',
      'q-api-02',
      'q-api-05',
      'q-def-01',
      'q-def-02',
      'q-def-05',
      'q-pin-01',
      'q-cia-01',
    ],
  },
  {
    id: 'mock-c',
    title: 'Mock C — Full Assessment Simulation',
    description:
      'Mixed topics at assessment pressure. 15 questions, 28 minutes. Closest to exam conditions.',
    timeLimitMinutes: 28,
    questionIds: [
      'q-tls-02',
      'q-tls-06',
      'q-sql-04',
      'jwt-q1-server-receives',
      'jwt-q8-algorithm-confusion',
      'sast-dast-q1-compare',
      'sast-dast-q7-container-scanning',
      'q-api-02',
      'q-api-08',
      'q-def-02',
      'q-def-08',
      'q-pin-02',
      'q-cia-01',
      'q-cia-05',
      'q-tls-08',
    ],
  },
  {
    id: 'mock-random',
    title: 'Mock Random — Mixed Draw',
    description:
      'Random 14 questions across all topics. Different each attempt. 26 minutes.',
    timeLimitMinutes: 26,
    topicMix: [
      { topicId: 'tls-cryptography', count: 2 },
      { topicId: 'sql-injection', count: 2 },
      { topicId: 'jwt-authentication', count: 2 },
      { topicId: 'sast-dast', count: 2 },
      { topicId: 'api-rate-limiting', count: 2 },
      { topicId: 'defensive-security', count: 2 },
      { topicId: 'mobile-pinning', count: 1 },
      { topicId: 'cia-triad', count: 1 },
    ],
    difficultyFilter: ['intermediate', 'assessment', 'pressure'],
  },
];

export function getMockConfig(id: string): MockConfig | undefined {
  return mockConfigs.find((c) => c.id === id);
}
