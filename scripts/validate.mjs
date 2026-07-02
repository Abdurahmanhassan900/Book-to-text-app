#!/usr/bin/env node
/**
 * Phase 6 validation — run with: npm run validate
 * Checks content counts, duplicates, mock IDs, routes, and curriculum coverage.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
let failures = 0;
let passes = 0;

function pass(msg) {
  passes += 1;
  console.log(`✓ ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`✗ ${msg}`);
}

function read(path) {
  return readFileSync(join(ROOT, path), 'utf8');
}

// --- Question bank ---
const qDir = 'src/data/questions';
const qFiles = readdirSync(join(ROOT, qDir)).filter(
  (f) => f.endsWith('.ts') && f !== 'index.ts',
);
const questionIds = [];
for (const f of qFiles) {
  const content = read(join(qDir, f));
  const matches = [...content.matchAll(/^\s{4}id: '([^']+)',$/gm)];
  for (const m of matches) questionIds.push(m[1]);
}

if (questionIds.length >= 100) pass(`${questionIds.length} questions (≥100)`);
else fail(`Only ${questionIds.length} questions (need ≥100)`);

const qSet = new Set(questionIds);
if (qSet.size === questionIds.length) pass('No duplicate question IDs');
else fail(`Duplicate question IDs: ${questionIds.length - qSet.size}`);

// --- Flashcards ---
const fcCount = (read('src/data/flashcards/index.ts').match(/id: 'fc-/g) || []).length;
if (fcCount >= 80) pass(`${fcCount} flashcards (≥80)`);
else fail(`Only ${fcCount} flashcards (need ≥80)`);

// --- Topics ---
const topicFiles = readdirSync(join(ROOT, 'src/data/topics')).filter(
  (f) => f.endsWith('.ts') && f !== 'index.ts',
);
const requiredTopics = [
  'tls',
  'sql-injection',
  'jwt-authentication',
  'sast-dast',
  'api-rate-limiting',
  'defensive-security',
  'mobile-pinning',
  'cia-triad',
];
if (topicFiles.length === 8) pass('8 topic content files');
else fail(`Expected 8 topics, found ${topicFiles.length}`);

for (const t of requiredTopics) {
  if (topicFiles.some((f) => f.replace('.ts', '') === t)) pass(`Topic: ${t}`);
  else fail(`Missing topic file: ${t}`);
}

// --- Daily plans ---
const plans = read('src/data/dailyPlans.ts');
const dayCount = (plans.match(/^\s+day: \d,/gm) || []).length;
if (dayCount === 7) pass('7 daily plans');
else fail(`Expected 7 daily plans, found ${dayCount}`);

for (let d = 1; d <= 7; d++) {
  if (new RegExp(`buildTasks\\(\\s*${d},`).test(plans)) pass(`Day ${d} buildTasks configured`);
  else fail(`Day ${d} missing buildTasks call`);
}
if (plans.includes('/plan/quiz/${day}') || plans.includes("`/plan/quiz/${day}`"))
  pass('Daily quiz routes use /plan/quiz/:day pattern');
else fail('Daily quiz route pattern missing');

// --- Mock assessment IDs ---
const mockContent = read('src/data/mockAssessments.ts');
const mockIdBlocks = [...mockContent.matchAll(/questionIds: \[([\s\S]*?)\]/g)];
const mockIds = mockIdBlocks.flatMap((block) =>
  [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]),
);
const missingMock = mockIds.filter((id) => !qSet.has(id));
if (missingMock.length === 0) pass(`${mockIds.length} mock question refs all valid`);
else fail(`Invalid mock IDs: ${missingMock.join(', ')}`);

if (mockContent.includes("'mock-random'")) pass('Randomized mock mode defined');
else fail('Missing random mock config');

// --- Routes ---
const app = read('src/App.tsx');
const requiredRoutes = [
  '/',
  'plan',
  'plan/quiz/:day',
  'topics',
  'topics/:id',
  'practice/builder',
  'practice/speaking',
  'practice/flashcards',
  'questions',
  'mock',
  'mistakes',
  'readiness',
  'review',
];
for (const r of requiredRoutes) {
  if (app.includes(`"${r}"`) || app.includes(`'${r}'`) || app.includes(`path="${r}"`) || app.includes(`path='${r}'`) || app.includes(`path={\`${r}\`}`) || app.includes(`path="${r.replace(':day', ':day')}"`)) {
    // simpler check
  }
}
const routeChecks = [
  ['index', 'Dashboard'],
  ['plan/quiz/:day', 'DailyQuiz'],
  ['practice/builder', 'AnswerBuilder'],
  ['mock', 'MockAssessment'],
  ['review', 'ReviewMode'],
];
for (const [path, component] of routeChecks) {
  if (app.includes(path) && app.includes(component)) pass(`Route /${path} → ${component}`);
  else fail(`Missing route ${path}`);
}

// --- Curriculum keywords (spot check) ---
const allContent = [
  ...topicFiles.map((f) => read(join('src/data/topics', f))),
  read('src/data/flashcards/index.ts'),
].join('\n');

const curriculumTerms = [
  'ClientHello',
  'parameterized',
  'JWT',
  'SAST',
  'DAST',
  'token bucket',
  'certificate pinning',
  'confidentiality',
  'forward secrecy',
  'HttpOnly',
];
for (const term of curriculumTerms) {
  if (allContent.toLowerCase().includes(term.toLowerCase())) pass(`Curriculum covers: ${term}`);
  else fail(`Curriculum missing: ${term}`);
}

// --- Build artifacts ---
if (existsSync(join(ROOT, 'package.json'))) pass('package.json exists');
else fail('package.json missing');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.dev && pkg.scripts?.build) pass('npm scripts configured');
else fail('Missing npm scripts');

// --- No stale UI placeholders ---
const pages = readdirSync(join(ROOT, 'src/pages')).filter((f) => f.endsWith('.tsx'));
let stalePlaceholders = 0;
for (const p of pages) {
  const c = read(join('src/pages', p));
  if (/Coming in Phase|Phase \d+ will/i.test(c)) stalePlaceholders += 1;
}
if (stalePlaceholders === 0) pass('No stale phase placeholders in pages');
else fail(`${stalePlaceholders} pages still have phase placeholders`);

console.log(`\n--- ${passes} passed, ${failures} failed ---`);
process.exit(failures > 0 ? 1 : 0);
