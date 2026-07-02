import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RubricFeedback } from '../components/practice/RubricFeedback';
import { TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getDailyPlan } from '../data/dailyPlans';
import { useProgress } from '../hooks/useProgress';
import type { EvaluationResult, QuizAttempt } from '../types';
import { getStableDailyQuizQuestions } from '../utils/dailyQuiz';
import { evaluateFreeformAnswer } from '../utils/evaluator';
import { appendMistakes, createMistakesFromEvaluation } from '../utils/mistakes';

export function DailyQuiz() {
  const { day: dayParam } = useParams<{ day: string }>();
  const day = Math.min(7, Math.max(1, Number(dayParam) || 1));
  const plan = getDailyPlan(day);
  const questions = useMemo(() => getStableDailyQuizQuestions(day), [day]);
  const { progress, persist } = useProgress();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, EvaluationResult>>({});
  const [submitted, setSubmitted] = useState(false);

  const previousAttempt = progress.quizAttempts
    .filter((a) => a.day === day)
    .slice(-1)[0];

  const handleSubmit = () => {
    const evals: Record<string, EvaluationResult> = {};
    let totalScore = 0;

    for (const q of questions) {
      const text = answers[q.id] ?? '';
      const evaluation = evaluateFreeformAnswer(text, q.rubric, q.modelAnswer);
      evals[q.id] = evaluation;
      totalScore += evaluation.percentage;
    }

    setResults(evals);
    setSubmitted(true);

    const attempt: QuizAttempt = {
      id: `quiz-${day}-${Date.now()}`,
      day,
      completedAt: new Date().toISOString(),
      score: totalScore,
      maxScore: questions.length * 100,
      questionIds: questions.map((q) => q.id),
      answers,
    };

    persist((prev) => {
      let next = {
        ...prev,
        quizAttempts: [...prev.quizAttempts, attempt],
      };

      for (const q of questions) {
        const ev = evals[q.id];
        if (ev) {
          const mistakes = createMistakesFromEvaluation(
            ev,
            q.topicId,
            q.id,
            q.prompt,
          );
          next = appendMistakes(next, mistakes);
        }
      }
      return next;
    });
  };

  const avgScore = submitted
    ? Math.round(
        Object.values(results).reduce((s, r) => s + r.percentage, 0) /
          questions.length,
      )
    : 0;

  if (!plan) {
    return <p className="text-muted">Invalid day.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <Link to="/plan" className="text-sm text-accent hover:underline">
          ← Seven-day plan
        </Link>
        <h2 className="mt-2 text-2xl font-bold">Day {day} Daily Quiz</h2>
        <p className="mt-1 text-sm text-muted">
          {questions.length} questions · ~10 minutes · {plan.title}
        </p>
        {previousAttempt && !submitted && (
          <p className="mt-1 text-xs text-muted">
            Last score:{' '}
            {Math.round((previousAttempt.score / previousAttempt.maxScore) * 100)}%
          </p>
        )}
      </header>

      {!submitted ? (
        <>
          {questions.map((q, idx) => (
            <Card key={q.id} title={`Question ${idx + 1}`}>
              <TopicBadge topicId={q.topicId} />
              <p className="mt-2 font-medium">{q.prompt}</p>
              <textarea
                value={answers[q.id] ?? ''}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                }
                rows={5}
                placeholder="Answer using D-M-B-R-E-C cues in prose (60–90s worth)."
                className="mt-3 w-full rounded border border-border bg-surface px-3 py-2 text-sm"
              />
            </Card>
          ))}
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white"
          >
            Submit quiz
          </button>
        </>
      ) : (
        <>
          <Card>
            <p className="text-sm text-muted">Quiz average (estimate)</p>
            <p className="text-3xl font-bold font-mono">{avgScore}%</p>
            <ProgressBar value={avgScore} variant={avgScore >= 80 ? 'success' : 'warning'} />
          </Card>
          {questions.map((q) => (
            <div key={q.id} className="space-y-3">
              <Card>
                <p className="font-medium">{q.prompt}</p>
                <p className="mt-2 text-sm text-slate-400">Your answer: {answers[q.id]}</p>
              </Card>
              {results[q.id] && <RubricFeedback result={results[q.id]} />}
            </div>
          ))}
          <Link to="/plan" className="text-accent hover:underline">
            Back to plan
          </Link>
        </>
      )}
    </div>
  );
}
