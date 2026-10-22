import type { PomodoroSettings, PomodoroSessionLog } from '../types/pomodoro.types.ts';

const SETTINGS_KEY = 'chronomind_pomodoro_settings_v1';
const SESSIONS_KEY = 'chronomind_pomodoro_sessions_v1';

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
};

export class PomodoroStorageService {
  public static loadSettings(): PomodoroSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return DEFAULT_POMODORO_SETTINGS;
      return { ...DEFAULT_POMODORO_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_POMODORO_SETTINGS;
    }
  }

  public static saveSettings(settings: PomodoroSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('[PomodoroStorageService] Failed to save settings:', e);
    }
  }

  public static loadSessionLogs(): PomodoroSessionLog[] {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static appendSessionLog(log: PomodoroSessionLog): void {
    try {
      const existing = this.loadSessionLogs();
      const updated = [log, ...existing].slice(0, 50); // keep recent 50 logs
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('[PomodoroStorageService] Failed to append log:', e);
    }
  }
}
