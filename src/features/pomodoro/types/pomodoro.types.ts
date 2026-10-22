export type PomodoroMode = 'work' | 'short_break' | 'long_break';

export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
}

export interface PomodoroSessionLog {
  id: string;
  taskId: string | null;
  mode: PomodoroMode;
  durationMinutes: number;
  completedAt: string;
}
