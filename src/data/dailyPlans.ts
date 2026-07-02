import type { DailyPlan, TopicId } from '../types';

const DEFAULT_TASKS = [
  {
    type: 'concept-lesson' as const,
    title: 'Concept lesson',
    durationMinutes: 35,
    route: '/topics',
  },
  {
    type: 'mechanism-walkthrough' as const,
    title: 'Mechanism walkthrough',
    durationMinutes: 25,
    route: '/topics',
  },
  {
    type: 'flashcards' as const,
    title: 'Flashcards',
    durationMinutes: 20,
    route: '/practice/flashcards',
  },
  {
    type: 'written-answers' as const,
    title: 'Written structured answers',
    durationMinutes: 30,
    route: '/practice/builder',
  },
  {
    type: 'spoken-practice' as const,
    title: 'Spoken timed answers',
    durationMinutes: 40,
    route: '/practice/speaking',
  },
  {
    type: 'scenario-practice' as const,
    title: 'Scenario practice',
    durationMinutes: 25,
    route: '/questions',
  },
  {
    type: 'review-mistakes' as const,
    title: 'Review and mistake log',
    durationMinutes: 15,
    route: '/mistakes',
  },
  {
    type: 'daily-quiz' as const,
    title: 'Daily quiz',
    durationMinutes: 10,
    route: '/plan',
  },
];

function buildTasks(
  day: number,
  descriptions: Record<string, string>,
): DailyPlan['tasks'] {
  return DEFAULT_TASKS.map((task) => ({
    id: `day${day}-${task.type}`,
    type: task.type,
    title: task.title,
    description: descriptions[task.type] ?? task.title,
    durationMinutes: task.durationMinutes,
    route: task.route,
  }));
}

export const dailyPlans: DailyPlan[] = [
  {
    day: 1,
    title: 'TLS and Cryptography',
    topics: ['tls-cryptography'],
    objectives: [
      'Understand the TLS handshake',
      'Explain asymmetric versus symmetric encryption',
      'Explain certificates and certificate validation',
      'Explain session keys and forward secrecy',
      'Complete timed TLS questions',
    ],
    tasks: buildTasks(1, {
      'concept-lesson': 'Study TLS purpose, versions, and the handshake overview.',
      'mechanism-walkthrough': 'Walk through ClientHello → ServerHello → cert validation → key exchange → encrypted data.',
      flashcards: 'Drill TLS terms: cipher suites, CAs, forward secrecy, MITM.',
      'written-answers': 'Write D-M-B-R-E-C answers for TLS handshake and hybrid crypto.',
      'spoken-practice': 'Explain a full TLS connection aloud in 60–90 seconds.',
      'scenario-practice': 'Troubleshoot certificate expiry, hostname mismatch, and weak cipher issues.',
      'review-mistakes': 'Log gaps in mechanism explanations and cert validation steps.',
      'daily-quiz': '10-minute TLS fundamentals quiz.',
    }),
    estimatedMinutes: 180,
  },
  {
    day: 2,
    title: 'SQL Injection and Secure Database Access',
    topics: ['sql-injection'],
    objectives: [
      'Understand how SQL injection works',
      'Explain parameterized queries precisely',
      'Compare parameterization and sanitization',
      'Explain ORM safety and raw-query risks',
      'Complete timed database-security questions',
    ],
    tasks: buildTasks(2, {
      'concept-lesson': 'Learn how untrusted input alters SQL query logic.',
      'mechanism-walkthrough': 'Trace string concatenation vs prepared statements with bound parameters.',
      flashcards: 'Drill injection types, least privilege, and error exposure.',
      'written-answers': 'Write answers on parameterization, ORM limits, and sanitization pitfalls.',
      'spoken-practice': 'Explain why sanitization alone is insufficient.',
      'scenario-practice': 'Design defenses for a login endpoint using a relational database.',
      'review-mistakes': 'Capture missing mechanism steps and weak examples.',
      'daily-quiz': '10-minute SQL injection quiz.',
    }),
    estimatedMinutes: 180,
  },
  {
    day: 3,
    title: 'JWT and Authentication Security',
    topics: ['jwt-authentication'],
    objectives: [
      'Understand JWT structure',
      'Explain signing and verification',
      'Compare access and refresh tokens',
      'Explain token theft, expiration, rotation, and revocation',
      'Complete timed authentication questions',
    ],
    tasks: buildTasks(3, {
      'concept-lesson': 'Learn auth vs authorization, JWT parts, and stateless tradeoffs.',
      'mechanism-walkthrough': 'Trace token creation, transmission, verification, and expiration handling.',
      flashcards: 'Drill HttpOnly cookies, algorithm confusion, and revocation limits.',
      'written-answers': 'Write D-M-B-R-E-C answers on JWT benefits and limitations.',
      'spoken-practice': 'Explain what happens when a server receives a JWT.',
      'scenario-practice': 'Defend token storage choices for a SPA vs server-rendered app.',
      'review-mistakes': 'Note confusion between encoding and encryption.',
      'daily-quiz': '10-minute JWT and auth quiz.',
    }),
    estimatedMinutes: 180,
  },
  {
    day: 4,
    title: 'SAST, DAST, and DevSecOps Pipelines',
    topics: ['sast-dast'],
    objectives: [
      'Compare SAST and DAST',
      'Explain false positives and false negatives',
      'Place security scans into a CI/CD pipeline',
      'Understand dependency, secret, container, and IaC scanning',
      'Complete timed DevSecOps questions',
    ],
    tasks: buildTasks(4, {
      'concept-lesson': 'Learn white-box vs black-box testing and when each runs.',
      'mechanism-walkthrough': 'Map SAST, DAST, SCA, secret, container, and IaC scans in CI/CD.',
      flashcards: 'Drill what each scan type detects and misses.',
      'written-answers': 'Compare SAST and DAST with pipeline placement.',
      'spoken-practice': 'Explain why multiple testing methods are needed.',
      'scenario-practice': 'Design security gates for pull requests and releases.',
      'review-mistakes': 'Log false positive/negative confusion.',
      'daily-quiz': '10-minute DevSecOps scanning quiz.',
    }),
    estimatedMinutes: 180,
  },
  {
    day: 5,
    title: 'API Security and Defensive Design',
    topics: ['api-rate-limiting', 'defensive-security'],
    objectives: [
      'Compare rate-limiting algorithms',
      'Explain brute-force and credential-stuffing defenses',
      'Explain MFA and layered login protection',
      'Discuss security-usability tradeoffs',
      'Complete timed scenario questions',
    ],
    tasks: buildTasks(5, {
      'concept-lesson': 'Learn rate limiting purpose and login abuse patterns.',
      'mechanism-walkthrough': 'Compare fixed window, sliding window, and token bucket.',
      flashcards: 'Drill MFA, password hashing, and account lockout tradeoffs.',
      'written-answers': 'Write layered defenses for credential stuffing.',
      'spoken-practice': 'Explain protecting a login API with rate limits and MFA.',
      'scenario-practice': 'Balance security vs usability for account recovery.',
      'review-mistakes': 'Capture missing tradeoff discussions.',
      'daily-quiz': '10-minute API and defensive design quiz.',
    }),
    estimatedMinutes: 180,
  },
  {
    day: 6,
    title: 'Mobile Security, CIA Triad, and Mixed Review',
    topics: ['mobile-pinning', 'cia-triad'],
    objectives: [
      'Explain certificate pinning',
      'Explain pinning tradeoffs',
      'Apply confidentiality, integrity, and availability to real systems',
      'Review weak topics from Days 1–5',
      'Complete a mixed mock assessment',
    ],
    tasks: buildTasks(6, {
      'concept-lesson': 'Learn pinning vs normal TLS validation and CIA controls.',
      'mechanism-walkthrough': 'Trace pinning checks, backup pins, and rotation failures.',
      flashcards: 'Drill CIA examples and pinning operational risks.',
      'written-answers': 'Write CIA controls for a healthcare application.',
      'spoken-practice': 'Explain why pinning is not appropriate for every app.',
      'scenario-practice': 'Mixed review scenarios from Days 1–5.',
      'review-mistakes': 'Prioritize retest for lowest-scoring topics.',
      'daily-quiz': 'Mixed review quiz.',
    }),
    estimatedMinutes: 180,
  },
  {
    day: 7,
    title: 'Assessment Simulation',
    topics: [
      'tls-cryptography',
      'sql-injection',
      'jwt-authentication',
      'sast-dast',
      'api-rate-limiting',
      'defensive-security',
      'mobile-pinning',
      'cia-triad',
    ],
    objectives: [
      'Complete multiple full mock assessments',
      'Answer each question in 60–90 seconds',
      'Review only weak areas',
      'Practice recovery when unsure',
      'Reach a consistent score of at least 85%',
    ],
    tasks: buildTasks(7, {
      'concept-lesson': 'Light review of weakest topics from readiness report.',
      'mechanism-walkthrough': 'Rehearse fallback structure: "I\'m not completely sure, but I believe…"',
      flashcards: 'Rapid recall across all curriculum areas.',
      'written-answers': 'One structured answer per weak topic.',
      'spoken-practice': 'Full timed speaking set under pressure.',
      'scenario-practice': 'Two scenario blocks with follow-up questions.',
      'review-mistakes': 'Close out all "retest needed" mistakes.',
      'daily-quiz': 'Final readiness check quiz.',
    }),
    estimatedMinutes: 180,
  },
];

export function getDailyPlan(day: number): DailyPlan | undefined {
  return dailyPlans.find((p) => p.day === day);
}

export function getPlanForTopic(topicId: TopicId): DailyPlan | undefined {
  return dailyPlans.find((p) => p.topics.includes(topicId));
}
