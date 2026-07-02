import { useCallback, useMemo, useState } from 'react';
import { DMRECChecklist } from '../components/shared/DMRECChecklist';
import { RubricFeedback } from '../components/practice/RubricFeedback';
import { TopicBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getRandomQuestions } from '../data/questions';
import { useProgress } from '../hooks/useProgress';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTimer } from '../hooks/useTimer';
import type { DMRECSection, EvaluationResult, PracticeQuestion } from '../types';
import { evaluateFreeformAnswer } from '../utils/evaluator';
import {
  appendMistakes,
  createMistakesFromEvaluation,
  createTimedOutMistake,
  createUnsureMistake,
  recordAnswerProgress,
} from '../utils/mistakes';

const SELF_RUBRIC: { key: DMRECSection; label: string }[] = [
  { key: 'definition', label: 'Clear definition' },
  { key: 'mechanism', label: 'Explained mechanism' },
  { key: 'benefit', label: 'Stated security benefit' },
  { key: 'risk', label: 'Mentioned risk/tradeoff' },
  { key: 'example', label: 'Gave real example' },
  { key: 'conclusion', label: 'Concluded cleanly' },
];

export function SpeakingPractice() {
  const { persist } = useProgress();
  const [question, setQuestion] = useState<PracticeQuestion>(
    () => getRandomQuestions(1)[0]!,
  );
  const [answerMode, setAnswerMode] = useState<60 | 90>(60);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [selfEval, setSelfEval] = useState<Record<string, boolean>>({});
  const [timedOut, setTimedOut] = useState(false);
  const [phase, setLocalPhase] = useState<'idle' | 'active' | 'review'>('idle');

  const speech = useSpeechRecognition();

  const handleAnswerEnd = useCallback(() => {
    speech.stop();
    setTimedOut(true);
    setLocalPhase('review');
  }, [speech]);

  const timer = useTimer({
    prepSeconds: 15,
    answerSeconds: answerMode,
    onPrepComplete: () => {
      speech.start();
    },
    onAnswerComplete: handleAnswerEnd,
  });

  const checklistCompleted = useMemo(() => {
    const text = transcript.toLowerCase();
    return {
      definition: /is a|means|protocol|technique|method/.test(text),
      mechanism: /how|step|process|handshake|works|when/.test(text),
      benefit: /protect|prevent|benefit|because/.test(text),
      risk: /risk|tradeoff|however|limitation|but /.test(text),
      example: /example|such as|e\.g\.|https|api|app/.test(text),
      conclusion: /conclusion|therefore|overall|matters/.test(text),
    };
  }, [transcript]);

  const startSession = () => {
    setResult(null);
    setTranscript('');
    setTimedOut(false);
    setSelfEval({});
    setLocalPhase('active');
    speech.setText('');
    timer.start(answerMode);
    if (speech.supported) speech.start();
  };

  const finishEarly = () => {
    speech.stop();
    timer.finish();
    setLocalPhase('review');
  };

  const gradeAnswer = () => {
    const text = transcript.trim();
    if (!text) return;

    const evaluation = evaluateFreeformAnswer(
      text,
      question.rubric,
      question.modelAnswer,
      { timedOut, usedFallback: /not completely sure|i believe/i.test(text) },
    );

    setResult(evaluation);

    const duration =
      answerMode - (timer.phase === 'finished' ? 0 : timer.secondsLeft);

    persist((prev) => {
      let next = recordAnswerProgress(prev, question.id, evaluation);
      next = {
        ...next,
        speakingAttempts: [
          ...next.speakingAttempts,
          {
            id: `speak-${Date.now()}`,
            questionId: question.id,
            completedAt: new Date().toISOString(),
            durationSeconds: duration,
            transcript: text,
            selfEvaluation: selfEval,
            evaluation,
          },
        ],
      };

      let mistakes = createMistakesFromEvaluation(
        evaluation,
        question.topicId,
        question.id,
        question.prompt,
      );
      if (timedOut) mistakes = [...mistakes, createTimedOutMistake(question.topicId, question.id)];
      if (/not completely sure/i.test(text)) {
        mistakes = [...mistakes, createUnsureMistake(question.topicId, question.id)];
      }
      return appendMistakes(next, mistakes);
    });
  };

  const newQuestion = () => {
    timer.reset();
    speech.stop();
    setQuestion(getRandomQuestions(1)[0]!);
    setTranscript('');
    setResult(null);
    setLocalPhase('idle');
    setTimedOut(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Timed Speaking Practice</h2>
          <p className="mt-1 text-sm text-muted">
            15s prep · {answerMode}s answer · speak D-M-B-R-E-C aloud
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAnswerMode(60)}
            className={`rounded px-3 py-1 text-sm ${answerMode === 60 ? 'bg-accent text-white' : 'border border-border'}`}
          >
            60s
          </button>
          <button
            type="button"
            onClick={() => setAnswerMode(90)}
            className={`rounded px-3 py-1 text-sm ${answerMode === 90 ? 'bg-accent text-white' : 'border border-border'}`}
          >
            90s
          </button>
        </div>
      </header>

      <Card>
        <TopicBadge topicId={question.topicId} />
        <p className="mt-2 text-lg font-medium">{question.prompt}</p>
      </Card>

      <Card title="Timer">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm capitalize text-muted">Phase: {timer.phase}</span>
          <span className="font-mono text-2xl font-bold">
            {timer.phase === 'idle' ? '--' : timer.secondsLeft}s
          </span>
        </div>
        <ProgressBar
          value={timer.progress}
          variant={timer.phase === 'answer' ? 'warning' : 'default'}
          showValue={false}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startSession}
            disabled={timer.phase === 'prep' || timer.phase === 'answer'}
            className="rounded bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Start
          </button>
          <button
            type="button"
            onClick={timer.pause}
            disabled={timer.phase !== 'prep' && timer.phase !== 'answer'}
            className="rounded border border-border px-4 py-2 text-sm"
          >
            Pause
          </button>
          <button
            type="button"
            onClick={timer.resume}
            disabled={timer.phase !== 'paused'}
            className="rounded border border-border px-4 py-2 text-sm"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={() => {
              timer.reset();
              setLocalPhase('idle');
              speech.stop();
            }}
            className="rounded border border-border px-4 py-2 text-sm"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={finishEarly}
            disabled={timer.phase !== 'prep' && timer.phase !== 'answer'}
            className="rounded border border-border px-4 py-2 text-sm"
          >
            Finish
          </button>
        </div>
      </Card>

      <Card title="D-M-B-R-E-C checklist">
        <DMRECChecklist completed={checklistCompleted} />
      </Card>

      <Card title="Transcript">
        {speech.supported ? (
          <p className="mb-2 text-xs text-muted">
            Speech-to-text {speech.listening ? 'listening…' : 'available'} — edit errors below.
          </p>
        ) : (
          <p className="mb-2 text-xs text-warning">
            Speech-to-text not supported in this browser — type your spoken answer manually.
          </p>
        )}
        <textarea
          value={speech.transcript || transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            speech.setText(e.target.value);
          }}
          rows={8}
          placeholder="Your spoken answer appears here. Use D-M-B-R-E-C structure."
          className="w-full rounded border border-border bg-surface px-3 py-2 text-sm"
        />
      </Card>

      {(phase === 'review' || timer.phase === 'finished') && (
        <Card title="Self-evaluation rubric">
          <div className="grid gap-2 sm:grid-cols-2">
            {SELF_RUBRIC.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selfEval[key] ?? false}
                  onChange={(e) =>
                    setSelfEval((s) => ({ ...s, [key]: e.target.checked }))
                  }
                  className="accent-accent"
                />
                {label}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={gradeAnswer}
            className="mt-4 rounded bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Score transcript (estimate)
          </button>
        </Card>
      )}

      {result && <RubricFeedback result={result} />}

      {result && (
        <button
          type="button"
          onClick={newQuestion}
          className="rounded border border-border px-4 py-2 text-sm"
        >
          Next question
        </button>
      )}
    </div>
  );
}
