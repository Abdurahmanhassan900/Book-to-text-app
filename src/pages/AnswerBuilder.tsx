import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DMRECForm, emptyDMRECAnswer } from '../components/practice/DMRECForm';
import { RubricFeedback } from '../components/practice/RubricFeedback';
import { TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { getQuestionById, getRandomQuestions } from '../data/questions';
import { useProgress } from '../hooks/useProgress';
import type { DMRECAnswer, DMRECSection, EvaluationResult, PracticeQuestion } from '../types';
import { evaluateStructuredAnswer } from '../utils/evaluator';
import {
  appendMistakes,
  createMistakesFromEvaluation,
  recordAnswerProgress,
} from '../utils/mistakes';

const SELF_KEYS: (DMRECSection | 'terminology')[] = [
  'definition',
  'mechanism',
  'benefit',
  'risk',
  'example',
  'conclusion',
  'terminology',
];

export function AnswerBuilder() {
  const [searchParams] = useSearchParams();
  const questionParam = searchParams.get('q');
  const { persist } = useProgress();

  const [question, setQuestion] = useState<PracticeQuestion | null>(() => {
    if (questionParam) return getQuestionById(questionParam) ?? null;
    return getRandomQuestions(1)[0] ?? null;
  });
  const [answer, setAnswer] = useState<DMRECAnswer>(emptyDMRECAnswer);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [selfCheck, setSelfCheck] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const pickNew = () => {
    const next = getRandomQuestions(1)[0] ?? null;
    setQuestion(next);
    setAnswer(emptyDMRECAnswer());
    setResult(null);
    setSubmitted(false);
    setUsedFallback(false);
    setSelfCheck({});
  };

  const handleSubmit = () => {
    if (!question) return;

    const evaluation = evaluateStructuredAnswer(
      answer,
      question.rubric,
      question.modelAnswer,
      { usedFallback, selfEvaluation: selfCheck },
    );

    setResult(evaluation);
    setSubmitted(true);

    persist((prev) => {
      let next = {
        ...prev,
        builderAttempts: prev.builderAttempts + 1,
      };
      next = recordAnswerProgress(next, question.id, evaluation);
      const mistakes = createMistakesFromEvaluation(
        evaluation,
        question.topicId,
        question.id,
        question.prompt,
      );
      if (usedFallback) {
        mistakes.push({
          id: `mistake-${Date.now()}`,
          createdAt: new Date().toISOString(),
          topicId: question.topicId,
          questionId: question.id,
          type: 'unsure',
          description: 'Used honest fallback structure',
          detail: question.prompt,
          status: 'retest-needed',
        });
      }
      return appendMistakes(next, mistakes);
    });
  };

  if (!question) {
    return <p className="text-muted">No questions available.</p>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Structured Answer Builder</h2>
          <p className="mt-1 text-sm text-muted">
            Write a full D-M-B-R-E-C answer · scored locally (estimate)
          </p>
        </div>
        <button
          type="button"
          onClick={pickNew}
          className="rounded border border-border px-3 py-1.5 text-sm hover:bg-surface-raised"
        >
          New question
        </button>
      </header>

      <Card>
        <TopicBadge topicId={question.topicId} />
        <p className="mt-2 text-lg font-medium">{question.prompt}</p>
        <p className="mt-1 text-xs text-muted">
          {question.category} · {question.difficulty}
        </p>
      </Card>

      <DMRECForm value={answer} onChange={setAnswer} disabled={submitted} />

      <Card title="Self-evaluation (honest check)">
        <p className="mb-2 text-xs text-muted">
          Does not inflate auto-score — helps you calibrate.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {SELF_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selfCheck[key] ?? false}
                onChange={(e) =>
                  setSelfCheck((s) => ({ ...s, [key]: e.target.checked }))
                }
                disabled={submitted}
                className="accent-accent"
              />
              I addressed {key} accurately
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={usedFallback}
              onChange={(e) => setUsedFallback(e.target.checked)}
              disabled={submitted}
              className="accent-accent"
            />
            I used &quot;I&apos;m not completely sure, but I believe…&quot;
          </label>
        </div>
      </Card>

      {!submitted ? (
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-muted"
        >
          Submit for scoring
        </button>
      ) : (
        result && <RubricFeedback result={result} />
      )}

      {submitted && (
        <Card title="Model answer comparison">
          <dl className="space-y-2 text-sm">
            <div><dt className="font-mono text-accent">D</dt><dd>{question.modelAnswer.definition}</dd></div>
            <div><dt className="font-mono text-accent">M</dt><dd>{question.modelAnswer.mechanism}</dd></div>
            <div><dt className="font-mono text-accent">B</dt><dd>{question.modelAnswer.benefit}</dd></div>
            <div><dt className="font-mono text-accent">R</dt><dd>{question.modelAnswer.risk}</dd></div>
            <div><dt className="font-mono text-accent">E</dt><dd>{question.modelAnswer.example}</dd></div>
            <div><dt className="font-mono text-accent">C</dt><dd>{question.modelAnswer.conclusion}</dd></div>
          </dl>
          <button
            type="button"
            onClick={pickNew}
            className="mt-4 rounded bg-accent px-4 py-2 text-sm text-white"
          >
            Next question
          </button>
        </Card>
      )}
    </div>
  );
}
