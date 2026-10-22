import { useState, useEffect, useRef, useCallback } from 'react';
import type { PomodoroMode, PomodoroSettings } from '../types/pomodoro.types.ts';
import { PomodoroStorageService } from '../services/pomodoroStorageService.ts';
import { PomodoroAudioService } from '../services/pomodoroAudioService.ts';

interface UsePomodoroOptions {
  onSessionComplete?: (mode: PomodoroMode, taskId: string | null) => void;
}

export function usePomodoro(options?: UsePomodoroOptions) {
  const [settings, setSettings] = useState<PomodoroSettings>(() => PomodoroStorageService.loadSettings());
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  const getModeDuration = useCallback((targetMode: PomodoroMode, currentSettings: PomodoroSettings): number => {
    switch (targetMode) {
      case 'work':
        return currentSettings.workMinutes * 60;
      case 'short_break':
        return currentSettings.shortBreakMinutes * 60;
      case 'long_break':
        return currentSettings.longBreakMinutes * 60;
    }
  }, []);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    settings.workMinutes * 60
  );

  const onSessionCompleteRef = useRef(options?.onSessionComplete);
  onSessionCompleteRef.current = options?.onSessionComplete;

  // Persist settings
  useEffect(() => {
    PomodoroStorageService.saveSettings(settings);
  }, [settings]);

  // Main timer tick
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          // Completed
          if (settings.soundEnabled) {
            PomodoroAudioService.playCompletionChime();
          }

          // Log session
          PomodoroStorageService.appendSessionLog({
            id: `session-${Date.now()}`,
            taskId: activeTaskId,
            mode,
            durationMinutes: Math.round(getModeDuration(mode, settings) / 60),
            completedAt: new Date().toISOString(),
          });

          // Callback
          if (onSessionCompleteRef.current) {
            onSessionCompleteRef.current(mode, activeTaskId);
          }

          // Transition mode
          if (mode === 'work') {
            const nextCount = completedSessionsCount + 1;
            setCompletedSessionsCount(nextCount);
            const isLongBreak = nextCount % settings.sessionsUntilLongBreak === 0;
            const nextMode: PomodoroMode = isLongBreak ? 'long_break' : 'short_break';
            setMode(nextMode);
            setIsRunning(false);
            return getModeDuration(nextMode, settings);
          } else {
            // After break, back to work
            setMode('work');
            setIsRunning(false);
            return getModeDuration('work', settings);
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode, activeTaskId, completedSessionsCount, settings, getModeDuration]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(getModeDuration(mode, settings));
  }, [mode, settings, getModeDuration]);

  const switchMode = useCallback((newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setRemainingSeconds(getModeDuration(newMode, settings));
  }, [settings, getModeDuration]);

  const selectActiveTask = useCallback((taskId: string | null) => {
    setActiveTaskId(taskId);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setSettings(prev => {
      const merged = { ...prev, ...newSettings };
      return merged;
    });
  }, []);

  const formattedTime = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`;
  const totalModeDuration = getModeDuration(mode, settings);
  const progressRatio = totalModeDuration > 0 ? (totalModeDuration - remainingSeconds) / totalModeDuration : 0;

  return {
    mode,
    isRunning,
    remainingSeconds,
    totalModeDuration,
    formattedTime,
    progressRatio,
    activeTaskId,
    completedSessionsCount,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    selectActiveTask,
    updateSettings,
  };
}
