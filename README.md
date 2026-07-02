# Cybersecurity & DevSecOps Assessment Prep

Interactive 7-day study system for technical interview-style assessments. Trains structured **60–90 second** answers using the **D-M-B-R-E-C** framework.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

## Validate (Phase 6)

```bash
npm run validate
```

Runs TypeScript build + checks: 100+ questions, 80+ flashcards, 8 topics, 7 daily plans, mock IDs, routes, curriculum coverage.

## Stack

- React 19 + TypeScript + Vite + Tailwind CSS + React Router
- LocalStorage persistence (no backend)

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Dashboard, readiness gauge, today's tasks |
| `/plan` | Seven-day schedule with task checkboxes |
| `/plan/quiz/:day` | Daily 5-question quiz |
| `/topics` | Topic library (8 curriculum areas) |
| `/topics/:id` | Full D-M-B-R-E-C content + lessons |
| `/practice/builder` | Structured written answers + scoring |
| `/practice/speaking` | Timed speaking (15s prep, 60/90s answer) |
| `/practice/flashcards` | 88 active-recall cards |
| `/questions` | 108-question bank with model answers |
| `/mock` | Mock assessments (3 fixed + random) |
| `/mistakes` | Auto-captured mistake log |
| `/readiness` | Conservative readiness report |
| `/review` | Weak-topic review mode |

## D-M-B-R-E-C answer framework

1. **D** — Definition  
2. **M** — Mechanism  
3. **B** — Benefit  
4. **R** — Risk or tradeoff  
5. **E** — Example  
6. **C** — Conclusion  

When unsure: *"I'm not completely sure, but I believe…"* then deliver all six sections honestly.

## Curriculum (8 topics)

1. TLS and cryptography  
2. SQL injection and secure database access  
3. Authentication and JWT security  
4. SAST, DAST, and DevSecOps pipelines  
5. API security and rate limiting  
6. Defensive security design  
7. Mobile security and certificate pinning  
8. CIA triad and foundational principles  

## Content counts

- **108** practice questions with rubrics and model answers  
- **88** flashcards  
- **9** mechanism lessons  
- **4** mock exam configurations  

## Scoring

Local rubric evaluator (labeled **estimate**): keyword matching, mechanism steps, prohibited-claim penalties. Not AI — transparent and extensible.

## Readiness requirements

- ≥85% on two recent mock assessments  
- ≥80% per topic (from mock data)  
- ≥90% answer completion rate (all D-M-B-R-E-C sections)  
- No topic below 75%  

## Project structure

```
src/
├── components/   # Layout, UI, practice widgets
├── data/         # Topics, questions, flashcards, mocks, plans
├── hooks/        # useProgress, useTimer, useSpeechRecognition
├── pages/        # Route views
├── types/        # Domain TypeScript interfaces
└── utils/        # Storage, evaluator, scoring, mistakes
```

## Reset progress

Dashboard → **Reset all progress** (clears LocalStorage).
