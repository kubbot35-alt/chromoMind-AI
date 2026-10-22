export type PresetFocusDuration = 15 | 25 | 45 | 60 | 90;

export interface FocusTimerSettings {
  defaultDurationMinutes: number;
  soundEnabled: boolean;
}

export interface FocusSessionLog {
  id: string;
  taskId: string | null;
  durationMinutes: number;
  completedAt: string;
}
