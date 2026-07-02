import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerPhase = 'idle' | 'prep' | 'answer' | 'paused' | 'finished';

interface UseTimerOptions {
  prepSeconds?: number;
  answerSeconds?: number;
  onPrepComplete?: () => void;
  onAnswerComplete?: () => void;
}

export function useTimer({
  prepSeconds = 15,
  answerSeconds = 60,
  onPrepComplete,
  onAnswerComplete,
}: UseTimerOptions = {}) {
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [answerDuration, setAnswerDuration] = useState(answerSeconds);
  const runningRef = useRef(false);

  useEffect(() => {
    if (phase !== 'prep' && phase !== 'answer') return undefined;
    if (!runningRef.current) return undefined;

    const id = window.setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (!runningRef.current) return;
    if (secondsLeft > 0) return;

    if (phase === 'prep') {
      onPrepComplete?.();
      setPhase('answer');
      setSecondsLeft(answerDuration);
      return;
    }

    if (phase === 'answer') {
      runningRef.current = false;
      setPhase('finished');
      onAnswerComplete?.();
    }
  }, [secondsLeft, phase, answerDuration, onPrepComplete, onAnswerComplete]);

  const start = useCallback(
    (duration = answerSeconds) => {
      setAnswerDuration(duration);
      runningRef.current = true;
      setPhase('prep');
      setSecondsLeft(prepSeconds);
    },
    [answerSeconds, prepSeconds],
  );

  const pause = useCallback(() => {
    if (phase === 'prep' || phase === 'answer') {
      runningRef.current = false;
      setPhase('paused');
    }
  }, [phase]);

  const resume = useCallback(() => {
    if (phase === 'paused' && secondsLeft > 0) {
      runningRef.current = true;
      setPhase(secondsLeft <= prepSeconds ? 'prep' : 'answer');
    }
  }, [phase, prepSeconds, secondsLeft]);

  const reset = useCallback(() => {
    runningRef.current = false;
    setPhase('idle');
    setSecondsLeft(0);
  }, []);

  const finish = useCallback(() => {
    runningRef.current = false;
    setPhase('finished');
    setSecondsLeft(0);
  }, []);

  const progress =
    phase === 'prep'
      ? ((prepSeconds - secondsLeft) / prepSeconds) * 100
      : phase === 'answer'
        ? ((answerDuration - secondsLeft) / answerDuration) * 100
        : 0;

  return {
    phase,
    secondsLeft,
    progress,
    prepSeconds,
    answerDuration,
    start,
    pause,
    resume,
    reset,
    finish,
    setAnswerDuration,
  };
}
