import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RubricFeedback } from '../components/practice/RubricFeedback';
import { Badge, TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { mockConfigs } from '../data/mockAssessments';
import { getQuestionById } from '../data/questions';
import { useProgress } from '../hooks/useProgress';
import type { MockAttempt, MockConfig, PracticeQuestion } from '../types';
import { DMREC_LABELS } from '../types';
import {
  buildMockAttempt,
  getIncompleteQuestions,
  getMockConfigTitle,
  resolveMockQuestions,
} from '../utils/mockAssessment';
import {
  appendMistakes,
  createMistakesFromEvaluation,
  createTimedOutMistake,
  recordAnswerProgress,
} from '../utils/mistakes';
import { getReviewRecommendations, calculateReadiness } from '../utils/scoring';

type Phase = 'home' | 'exam' | 'results';

export function MockAssessment() {
  const { progress, persist } = useProgress();
  const [phase, setPhase] = useState<Phase>('home');
  const [config, setConfig] = useState<MockConfig | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fallbackFlags, setFallbackFlags] = useState<Record<string, boolean>>({});
  const [startedAt, setStartedAt] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [attempt, setAttempt] = useState<MockAttempt | null>(null);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const submittedRef = useRef(false);

  const startMock = (cfg: MockConfig) => {
    submittedRef.current = false;
    const qs = resolveMockQuestions(cfg);
    setConfig(cfg);
    setQuestions(qs);
    setAnswers({});
    setFallbackFlags({});
    setCurrentIndex(0);
    setStartedAt(new Date().toISOString());
    setSecondsLeft(cfg.timeLimitMinutes * 60);
    setTimedOut(false);
    setAttempt(null);
    setPhase('exam');
  };

  const submitMock = useCallback(() => {
    if (!config || submittedRef.current) return;
    submittedRef.current = true;

    const mockAttempt = buildMockAttempt(
      config,
      questions,
      answers,
      startedAt,
      timedOut,
      fallbackFlags,
    );

    setAttempt(mockAttempt);
    setPhase('results');

    persist((prev) => {
      let next = {
        ...prev,
        mockAttempts: [...prev.mockAttempts, mockAttempt],
      };

      for (const r of mockAttempt.results) {
        next = recordAnswerProgress(next, r.questionId, r.evaluation);
        let mistakes = createMistakesFromEvaluation(
          r.evaluation,
          r.topicId,
          r.questionId,
          getQuestionById(r.questionId)?.prompt,
        );
        if (r.timedOut) {
          mistakes = [...mistakes, createTimedOutMistake(r.topicId, r.questionId)];
        }
        next = appendMistakes(next, mistakes);
      }
      return next;
    });
  }, [answers, config, fallbackFlags, persist, questions, startedAt, timedOut]);

  useEffect(() => {
    if (phase !== 'exam') return undefined;

    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === 'exam' && secondsLeft === 0 && !attempt) {
      setTimedOut(true);
      submitMock();
    }
  }, [phase, secondsLeft, attempt, submitMock]);

  const current = questions[currentIndex];
  const timerPercent = config
    ? ((config.timeLimitMinutes * 60 - secondsLeft) / (config.timeLimitMinutes * 60)) * 100
    : 0;

  const recommendations = useMemo(() => {
    if (!attempt) return [];
    const metrics = calculateReadiness({
      ...progress,
      mockAttempts: [...progress.mockAttempts, attempt],
    });
    return getReviewRecommendations(
      { ...progress, mockAttempts: [...progress.mockAttempts, attempt] },
      metrics,
    ).slice(0, 3);
  }, [attempt, progress]);

  if (phase === 'home') {
    return (
      <div className="space-y-6">
        <header>
          <h2 className="text-2xl font-bold">Mock Assessment</h2>
          <p className="mt-1 text-sm text-muted">
            12–15 questions · timed · answers hidden until submission
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {mockConfigs.map((cfg) => {
            const attempts = progress.mockAttempts.filter((a) => a.configId === cfg.id);
            const best =
              attempts.length > 0
                ? Math.max(...attempts.map((a) => a.percentage))
                : null;
            return (
              <Card key={cfg.id}>
                <h3 className="font-semibold">{cfg.title}</h3>
                <p className="mt-1 text-sm text-muted">{cfg.description}</p>
                <p className="mt-2 text-xs text-muted">
                  {cfg.questionIds?.length ?? 14} questions · {cfg.timeLimitMinutes} min
                  {best !== null && (
                    <span className="ml-2 font-mono text-accent">Best: {best}%</span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => startMock(cfg)}
                  className="mt-3 rounded bg-accent px-4 py-2 text-sm font-medium text-white"
                >
                  Start mock
                </button>
              </Card>
            );
          })}
        </div>

        {progress.mockAttempts.length > 0 && (
          <Card title="Attempt history">
            <ul className="space-y-2">
              {[...progress.mockAttempts].reverse().slice(0, 10).map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-border bg-surface px-3 py-2 text-sm"
                >
                  <span>{getMockConfigTitle(a.configId)}</span>
                  <span className="font-mono">{a.percentage}%</span>
                  <span className="text-xs text-muted">
                    {new Date(a.completedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    );
  }

  if (phase === 'exam' && current && config) {
    return (
      <div className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{config.title}</h2>
            <p className="text-sm text-muted">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-warning">
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </p>
            <p className="text-xs text-muted">Time remaining</p>
          </div>
        </header>

        <ProgressBar value={timerPercent} variant="warning" showValue={false} />

        <div className="flex flex-wrap gap-1">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-8 w-8 rounded text-xs font-mono ${
                i === currentIndex
                  ? 'bg-accent text-white'
                  : answers[q.id]?.trim()
                    ? 'bg-success/30 text-green-200'
                    : 'bg-surface-overlay text-muted'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <Card>
          <TopicBadge topicId={current.topicId} />
          <p className="mt-2 text-lg font-medium">{current.prompt}</p>
          <p className="mt-1 text-xs text-muted">
            Answer in D-M-B-R-E-C structure · ~60–90 seconds if spoken
          </p>
          <textarea
            value={answers[current.id] ?? ''}
            onChange={(e) =>
              setAnswers((a) => ({ ...a, [current.id]: e.target.value }))
            }
            rows={10}
            placeholder="Definition → Mechanism → Benefit → Risk → Example → Conclusion"
            className="mt-3 w-full rounded border border-border bg-surface px-3 py-2 text-sm"
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={fallbackFlags[current.id] ?? false}
              onChange={(e) =>
                setFallbackFlags((f) => ({ ...f, [current.id]: e.target.checked }))
              }
              className="accent-accent"
            />
            Using honest fallback (&quot;I&apos;m not completely sure, but I believe…&quot;)
          </label>
        </Card>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="rounded border border-border px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="rounded bg-accent px-4 py-2 text-sm text-white"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submitMock}
              className="rounded bg-success px-4 py-2 text-sm font-semibold text-white"
            >
              Submit mock assessment
            </button>
          )}
          <button
            type="button"
            onClick={submitMock}
            className="rounded border border-border px-4 py-2 text-sm"
          >
            Submit early
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'results' && attempt) {
    const incomplete = getIncompleteQuestions(attempt.results);

    return (
      <div className="space-y-6">
        <header>
          <h2 className="text-2xl font-bold">Mock Results</h2>
          <p className="text-sm text-muted">{getMockConfigTitle(attempt.configId)}</p>
        </header>

        <Card>
          <p className="text-sm text-muted">Final score (estimate)</p>
          <p className="text-4xl font-bold font-mono">{attempt.percentage}%</p>
          <ProgressBar
            value={attempt.percentage}
            variant={attempt.percentage >= 85 ? 'success' : attempt.percentage >= 70 ? 'warning' : 'danger'}
          />
          {timedOut && (
            <p className="mt-2 text-sm text-warning">Time expired — incomplete answers penalized.</p>
          )}
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Performance by topic">
            <ul className="space-y-2">
              {Object.entries(attempt.topicBreakdown)
                .filter(([, v]) => v > 0)
                .sort(([, a], [, b]) => a - b)
                .map(([topicId, score]) => (
                  <li key={topicId} className="flex items-center gap-3">
                    <TopicBadge topicId={topicId as PracticeQuestion['topicId']} />
                    <div className="flex-1">
                      <ProgressBar value={score} size="sm" />
                    </div>
                  </li>
                ))}
            </ul>
          </Card>

          <Card title="Performance by D-M-B-R-E-C component">
            <ul className="space-y-2">
              {Object.entries(attempt.componentBreakdown).map(([section, score]) => (
                <li key={section} className="flex items-center justify-between text-sm">
                  <span className="text-muted">
                    {DMREC_LABELS[section as keyof typeof DMREC_LABELS]?.label ?? section}
                  </span>
                  <span className="font-mono">{score}%</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {incomplete.length > 0 && (
          <Card title="Incomplete answers">
            <ul className="list-inside list-disc text-sm text-amber-200">
              {incomplete.map((r) => (
                <li key={r.questionId}>
                  {getQuestionById(r.questionId)?.prompt.slice(0, 80)}…
                  {r.evaluation.missingSections.length > 0 &&
                    ` (missing: ${r.evaluation.missingSections.join(', ')})`}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card title="Review next">
          <ul className="space-y-2">
            {recommendations.map((rec) => (
              <li key={rec.topicId + rec.reason} className="rounded border border-border p-3 text-sm">
                <div className="flex items-center gap-2">
                  <TopicBadge topicId={rec.topicId} />
                  <Badge variant={rec.priority === 'high' ? 'danger' : 'warning'}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="mt-1 text-muted">{rec.reason}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {rec.actions.map((a) => (
                    <Link
                      key={a.route + a.label}
                      to={a.route}
                      className="text-xs text-accent hover:underline"
                    >
                      {a.label}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Question breakdown">
          {attempt.results.map((r, i) => {
            const q = getQuestionById(r.questionId);
            const open = expandedResult === r.questionId;
            return (
              <div key={r.questionId} className="border-b border-border py-3 last:border-0">
                <button
                  type="button"
                  onClick={() => setExpandedResult(open ? null : r.questionId)}
                  className="w-full text-left"
                >
                  <span className="text-xs text-muted">Q{i + 1}</span>
                  <p className="font-medium">{q?.prompt}</p>
                  <p className="text-sm font-mono text-accent">{r.evaluation.percentage}%</p>
                </button>
                {open && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-slate-400">Your answer: {r.answer || '(empty)'}</p>
                    <RubricFeedback result={r.evaluation} />
                  </div>
                )}
              </div>
            );
          })}
        </Card>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => config && startMock(config)}
            className="rounded bg-accent px-4 py-2 text-sm text-white"
          >
            Retake this mock
          </button>
          <Link to="/review" className="rounded border border-border px-4 py-2 text-sm">
            Review mode
          </Link>
          <Link to="/readiness" className="rounded border border-border px-4 py-2 text-sm">
            Readiness report
          </Link>
          <button
            type="button"
            onClick={() => setPhase('home')}
            className="rounded border border-border px-4 py-2 text-sm"
          >
            All mocks
          </button>
        </div>
      </div>
    );
  }

  return null;
}
