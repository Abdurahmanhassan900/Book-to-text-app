import { useCallback, useEffect, useState } from 'react';
import type { AppProgress } from '../types';
import {
  loadProgress,
  saveProgress,
  setCurrentDay as setDay,
  toggleTaskCompletion,
  updateProgress,
} from '../utils/storage';

export function useProgress() {
  const [progress, setProgress] = useState<AppProgress>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const refresh = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  const toggleTask = useCallback((day: number, taskId: string) => {
    setProgress((prev) => toggleTaskCompletion(prev, day, taskId));
  }, []);

  const changeDay = useCallback((day: number) => {
    setProgress((prev) => setDay(prev, day));
  }, []);

  const mutate = useCallback((updater: (prev: AppProgress) => AppProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      return next;
    });
  }, []);

  const persist = useCallback((updater: (prev: AppProgress) => AppProgress) => {
    const next = updateProgress(updater);
    setProgress(next);
    return next;
  }, []);

  return {
    progress,
    setProgress,
    refresh,
    toggleTask,
    changeDay,
    mutate,
    persist,
  };
}
