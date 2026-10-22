import { useState, useEffect, useRef, useCallback } from 'react';
import type { FocusTimerSettings } from '../types/focusTimer.types.ts';
import { TimerStorageService } from '../services/timerStorageService.ts';
import { TimerAudioService } from '../services/timerAudioService.ts';

interface UseFocusTimerOptions {
  onSessionComplete?: (durationMinutes: number, taskId: string | null) => void;
}

export function useFocusTimer(options?: UseFocusTimerOptions) {
  const [settings, setSettings] = useState<FocusTimerSettings>(() => TimerStorageService.loadSettings());
  const [durationMinutes, setDurationMinutes] = useState<number>(() => settings.defaultDurationMinutes || 30);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => (settings.defaultDurationMinutes || 30) * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  const onSessionCompleteRef = useRef(options?.onSessionComplete);
  onSessionCompleteRef.current = options?.onSessionComplete;

  useEffect(() => {
    TimerStorageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          if (settings.soundEnabled) {
            TimerAudioService.playCompletionChime();
          }

          TimerStorageService.appendSessionLog({
            id: `session-${Date.now()}`,
            taskId: activeTaskId,
            durationMinutes,
            completedAt: new Date().toISOString(),
          });

          if (onSessionCompleteRef.current) {
            onSessionCompleteRef.current(durationMinutes, activeTaskId);
          }

          setCompletedSessionsCount(c => c + 1);
          setIsRunning(false);
          return durationMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, durationMinutes, activeTaskId, settings]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(durationMinutes * 60);
  }, [durationMinutes]);

  const changeDuration = useCallback((minutes: number) => {
    const validMinutes = Math.max(1, Math.min(180, minutes));
    setIsRunning(false);
    setDurationMinutes(validMinutes);
    setRemainingSeconds(validMinutes * 60);
  }, []);

  const selectActiveTask = useCallback((taskId: string | null, suggestedMinutes?: number) => {
    setActiveTaskId(taskId);
    if (suggestedMinutes && suggestedMinutes > 0) {
      changeDuration(suggestedMinutes);
    }
  }, [changeDuration]);

  const formattedTime = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`;
  const totalDurationSeconds = durationMinutes * 60;
  const progressRatio = totalDurationSeconds > 0 ? (totalDurationSeconds - remainingSeconds) / totalDurationSeconds : 0;

  return {
    durationMinutes,
    remainingSeconds,
    totalDurationSeconds,
    formattedTime,
    progressRatio,
    isRunning,
    activeTaskId,
    completedSessionsCount,
    startTimer,
    pauseTimer,
    resetTimer,
    changeDuration,
    selectActiveTask,
  };
}
