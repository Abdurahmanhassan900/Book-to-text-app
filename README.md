# Cybersecurity & DevSecOps Assessment Prep

Interactive 7-day study system for technical interview-style assessments. Trains structured 60–90 second answers using the **D-M-B-R-E-C** framework.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- LocalStorage persistence (no backend)

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

## Build

```bash
npm run build
```

## Project structure

```
src/
├── components/   # Layout, UI primitives, shared widgets
├── data/         # Curriculum content (separate from UI)
├── hooks/        # useProgress and future hooks
├── pages/        # Route-level views
├── types/        # Domain TypeScript interfaces
└── utils/        # Storage, scoring, evaluators
```

## Phases

- **Phase 2 (current):** Routing, layout, types, storage, dashboard, 7-day plan
- **Phase 3:** Full topic library, flashcards, question bank
- **Phase 4:** Answer builder, speaking practice, mistake log, evaluator
- **Phase 5:** Mock assessments, readiness report
- **Phase 6:** Validation
