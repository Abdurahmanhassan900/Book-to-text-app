import type {
  DMRECAnswer,
  DMRECSection,
  EvaluationResult,
  ModelAnswer,
  Rubric,
  SectionScore,
} from '../types';
import { DEFAULT_RUBRIC_WEIGHTS } from '../types';

const MIN_SECTION_CHARS = 12;

const VAGUE_TERMS = ['secure', 'safe', 'protected', 'good', 'bad', 'important'];

const FALLBACK_PATTERNS = [
  /i'?m not (completely )?sure/i,
  /i believe/i,
  /my best understanding/i,
  /i think/i,
];

const SECTION_SIGNALS: Record<DMRECSection, RegExp[]> = {
  definition: [/what (it|tls|jwt|sql) is/i, /is a (protocol|method|technique)/i, /^.{0,80}is\b/i],
  mechanism: [/how (it|this) works/i, /process|handshake|flow|step|works by|when the/i],
  benefit: [/benefit|protects|prevents|solves|purpose|because it/i],
  risk: [/risk|tradeoff|trade-off|limitation|downside|however|but |cost|overhead/i],
  example: [/for example|e\.g\.|such as|in practice|real[- ]world/i, /https?:\/\//i, /api\./i],
  conclusion: [/in conclusion|to summarize|matters because|overall|therefore|so /i],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): Set<string> {
  return new Set(
    normalize(text)
      .split(' ')
      .filter((w) => w.length > 2),
  );
}

function conceptMatchScore(text: string, concept: string): number {
  const textTokens = tokenize(text);
  const conceptWords = normalize(concept)
    .split(' ')
    .filter((w) => w.length > 3);

  if (conceptWords.length === 0) return 0;

  const matched = conceptWords.filter((w) => textTokens.has(w)).length;
  const threshold = Math.ceil(conceptWords.length * 0.4);
  return matched >= threshold ? 1 : matched / Math.max(threshold, 1);
}

function matchRatio(text: string, items: string[]): number {
  if (items.length === 0) return 1;
  const scores = items.map((item) => conceptMatchScore(text, item));
  return scores.reduce((a, b) => a + b, 0) / items.length;
}

function detectMissingSections(answer: DMRECAnswer): DMRECSection[] {
  const sections: DMRECSection[] = [
    'definition',
    'mechanism',
    'benefit',
    'risk',
    'example',
    'conclusion',
  ];
  return sections.filter((s) => normalize(answer[s]).length < MIN_SECTION_CHARS);
}

function detectSectionsInFreeform(text: string): Set<DMRECSection> {
  const found = new Set<DMRECSection>();
  const sections: DMRECSection[] = [
    'definition',
    'mechanism',
    'benefit',
    'risk',
    'example',
    'conclusion',
  ];
  for (const section of sections) {
    if (SECTION_SIGNALS[section].some((re) => re.test(text))) {
      found.add(section);
    }
  }
  // Heuristic: first sentence often definition; presence of long text implies some structure
  if (text.length > 40) found.add('definition');
  if (text.length > 120) found.add('mechanism');
  return found;
}

function findProhibitedClaims(text: string, claims: string[]): string[] {
  const norm = normalize(text);
  return claims.filter((claim) => {
    const words = normalize(claim)
      .split(' ')
      .filter((w) => w.length > 4);
    if (words.length === 0) return false;
    const hits = words.filter((w) => norm.includes(w)).length;
    return hits >= Math.ceil(words.length * 0.6);
  });
}

function findVagueFlags(text: string): string[] {
  const norm = normalize(text);
  return VAGUE_TERMS.filter((term) => {
    if (!norm.includes(term)) return false;
    const idx = norm.indexOf(term);
    const context = norm.slice(Math.max(0, idx - 20), idx + 40);
    const hasMechanism =
      /because|by|through|using|when|encrypt|hash|validate|bind|parameter/.test(context);
    return !hasMechanism;
  });
}

function terminologyScore(text: string, keywords: string[]): number {
  if (keywords.length === 0) return 0.7;
  const norm = normalize(text);
  const hits = keywords.filter((kw) => norm.includes(normalize(kw))).length;
  return Math.min(1, hits / Math.max(3, Math.ceil(keywords.length * 0.35)));
}

function compareToModel(answerText: string, model?: ModelAnswer): string[] {
  if (!model) return [];
  const suggestions: string[] = [];
  const fullModel = Object.values({
    definition: model.definition,
    mechanism: model.mechanism,
    benefit: model.benefit,
    risk: model.risk,
    example: model.example,
    conclusion: model.conclusion,
  }).join(' ');

  const modelTokens = tokenize(fullModel);
  const answerTokens = tokenize(answerText);
  const missing = [...modelTokens].filter(
    (t) => !answerTokens.has(t) && t.length > 5,
  );
  const topMissing = [...new Set(missing)].slice(0, 6);
  if (topMissing.length > 0) {
    suggestions.push(`Model answer also discusses: ${topMissing.join(', ')}`);
  }
  return suggestions;
}

function scoreSectionField(
  text: string,
  maxScore: number,
  conceptPool: string[],
  stepPool: string[],
): SectionScore & { section: DMRECSection | 'terminology' } {
  const feedback: string[] = [];
  if (normalize(text).length < MIN_SECTION_CHARS) {
    return {
      section: 'definition',
      score: 0,
      maxScore,
      feedback: ['Section empty or too short—add a complete sentence.'],
    };
  }

  const conceptRatio = matchRatio(text, conceptPool);
  const stepRatio = stepPool.length > 0 ? matchRatio(text, stepPool) : conceptRatio;
  const combined = stepPool.length > 0 ? conceptRatio * 0.4 + stepRatio * 0.6 : conceptRatio;

  let score = Math.round(maxScore * Math.min(1, combined));

  if (score < maxScore * 0.5) {
    feedback.push('Add more precise technical detail—avoid vague wording.');
  }
  if (findVagueFlags(text).length > 0) {
    feedback.push('Replace vague terms (secure, safe) with specific mechanisms.');
    score = Math.max(0, score - 2);
  }

  return { section: 'definition', score, maxScore, feedback };
}

export interface EvaluateOptions {
  usedFallback?: boolean;
  timedOut?: boolean;
  selfEvaluation?: Partial<Record<DMRECSection | 'terminology', boolean>>;
}

export function combineAnswer(answer: DMRECAnswer): string {
  return [
    answer.definition,
    answer.mechanism,
    answer.benefit,
    answer.risk,
    answer.example,
    answer.conclusion,
  ].join(' ');
}

export function evaluateStructuredAnswer(
  answer: DMRECAnswer,
  rubric: Rubric,
  modelAnswer?: ModelAnswer,
  options: EvaluateOptions = {},
): EvaluationResult {
  const weights = rubric.weights ?? DEFAULT_RUBRIC_WEIGHTS;
  const fullText = combineAnswer(answer);
  const missingSections = detectMissingSections(answer);
  const flags: string[] = [];
  const suggestions: string[] = [];

  if (options.usedFallback || FALLBACK_PATTERNS.some((re) => re.test(fullText))) {
    flags.push('Honest partial-answer mode detected—reward structure, verify accuracy.');
  }
  if (options.timedOut) {
    flags.push('Answer may be incomplete due to time limit.');
  }

  const prohibited = findProhibitedClaims(fullText, rubric.prohibitedClaims);
  if (prohibited.length > 0) {
    flags.push(`Possible incorrect claims: ${prohibited.join('; ')}`);
  }

  const sectionScores: SectionScore[] = [];

  const defResult = scoreSectionField(
    answer.definition,
    weights.definition,
    rubric.requiredConcepts.slice(0, 3),
    [],
  );
  sectionScores.push({ ...defResult, section: 'definition' });

  const mechResult = scoreSectionField(
    answer.mechanism,
    weights.mechanism,
    rubric.requiredConcepts,
    rubric.mechanismSteps,
  );
  sectionScores.push({ ...mechResult, section: 'mechanism' });

  const benResult = scoreSectionField(
    answer.benefit,
    weights.benefit,
    rubric.requiredConcepts.filter((c) =>
      /protect|prevent|confidential|integrity|auth|benefit|solve/.test(c.toLowerCase()),
    ),
    [],
  );
  if (benResult.score === 0 && normalize(answer.benefit).length >= MIN_SECTION_CHARS) {
    benResult.score = Math.round(weights.benefit * matchRatio(answer.benefit, rubric.requiredConcepts));
  }
  sectionScores.push({ ...benResult, section: 'benefit' });

  const riskResult = scoreSectionField(
    answer.risk,
    weights.risk,
    rubric.requiredConcepts.filter((c) =>
      /risk|limit|trade|overhead|misconfig|attack|weak/.test(c.toLowerCase()),
    ),
    [],
  );
  if (riskResult.score === 0 && normalize(answer.risk).length >= MIN_SECTION_CHARS) {
    riskResult.score = Math.round(
      weights.risk * Math.max(0.4, matchRatio(answer.risk, rubric.prohibitedClaims) * 0.5 + 0.5),
    );
  }
  sectionScores.push({ ...riskResult, section: 'risk' });

  const exResult = scoreSectionField(answer.example, weights.example, rubric.requiredConcepts, []);
  if (/https?:\/\/|\.com|api|browser|app|server|login|database|ci\/cd|port \d{3}/i.test(answer.example)) {
    exResult.score = Math.min(weights.example, exResult.score + 2);
    if (exResult.score === 0) exResult.score = Math.round(weights.example * 0.6);
  }
  sectionScores.push({ ...exResult, section: 'example' });

  const concResult = scoreSectionField(answer.conclusion, weights.completeness, [], []);
  if (normalize(answer.conclusion).length >= MIN_SECTION_CHARS) {
    concResult.score = Math.max(
      concResult.score,
      Math.round(weights.completeness * (missingSections.length === 0 ? 1 : 0.5)),
    );
  }
  sectionScores.push({ ...concResult, section: 'conclusion' });

  const termScore = Math.round(weights.terminology * terminologyScore(fullText, rubric.terminologyKeywords));
  sectionScores.push({
    section: 'terminology',
    score: termScore,
    maxScore: weights.terminology,
    feedback:
      termScore < weights.terminology * 0.5
        ? ['Use more domain-specific terms from the rubric.']
        : [],
  });

  let totalScore = sectionScores.reduce((sum, s) => sum + s.score, 0);

  // Penalties
  totalScore -= prohibited.length * 8;
  totalScore -= missingSections.length * 4;
  if (normalize(fullText).length < rubric.minTotalLength) {
    flags.push('Answer shorter than recommended—likely missing mechanism or tradeoffs.');
    totalScore -= 5;
  }
  if (options.timedOut) totalScore -= 8;

  // Missing risk penalty flag
  if (missingSections.includes('risk') || normalize(answer.risk).length < MIN_SECTION_CHARS) {
    flags.push('Missing risk or tradeoff discussion.');
  }
  if (missingSections.includes('mechanism')) {
    flags.push('Missing mechanism—definition alone will not score highly.');
  }

  // Honest fallback: small bonus for structure, not for wrong claims
  if (options.usedFallback && missingSections.length <= 2) {
    totalScore += 3;
  }

  totalScore = Math.max(0, Math.min(100, totalScore));

  suggestions.push(...compareToModel(fullText, modelAnswer));
  if (missingSections.length > 0) {
    suggestions.push(`Complete missing sections: ${missingSections.join(', ')}`);
  }

  const operational =
    rubric.mechanismSteps.length > 0
      ? matchRatio(answer.mechanism, rubric.mechanismSteps) >= 0.35
      : normalize(answer.mechanism).length > 40;
  if (!operational) {
    flags.push('Answer sounds theoretical—add step-by-step operational detail.');
  }

  return {
    totalScore,
    maxScore: 100,
    percentage: totalScore,
    isEstimate: true,
    sectionScores,
    missingSections,
    flags,
    suggestions,
  };
}

export function evaluateFreeformAnswer(
  text: string,
  rubric: Rubric,
  modelAnswer?: ModelAnswer,
  options: EvaluateOptions = {},
): EvaluationResult {
  const pseudo: DMRECAnswer = {
    definition: text.slice(0, Math.min(200, text.length)),
    mechanism: text,
    benefit: text,
    risk: text,
    example: text,
    conclusion: text.slice(-Math.min(150, text.length)),
  };

  const result = evaluateStructuredAnswer(pseudo, rubric, modelAnswer, options);

  const detected = detectSectionsInFreeform(text);
  const allSections: DMRECSection[] = [
    'definition',
    'mechanism',
    'benefit',
    'risk',
    'example',
    'conclusion',
  ];
  const missingFromFreeform = allSections.filter((s) => !detected.has(s));

  if (missingFromFreeform.length > 0) {
    result.missingSections = [
      ...new Set([...result.missingSections, ...missingFromFreeform]),
    ];
    result.flags.push(
      'Freeform answer may not follow D-M-B-R-E-C structure—use explicit section cues.',
    );
    result.totalScore = Math.max(0, result.totalScore - missingFromFreeform.length * 3);
    result.percentage = result.totalScore;
  }

  return result;
}
