import type { FocusTimerSettings, FocusSessionLog } from '../types/focusTimer.types.ts';

const SETTINGS_KEY = 'chronomind_focus_timer_settings_v1';
const SESSIONS_KEY = 'chronomind_focus_timer_sessions_v1';

export const DEFAULT_FOCUS_TIMER_SETTINGS: FocusTimerSettings = {
  defaultDurationMinutes: 30,
  soundEnabled: true,
};

export class TimerStorageService {
  public static loadSettings(): FocusTimerSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return DEFAULT_FOCUS_TIMER_SETTINGS;
      return { ...DEFAULT_FOCUS_TIMER_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_FOCUS_TIMER_SETTINGS;
    }
  }

  public static saveSettings(settings: FocusTimerSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('[TimerStorageService] Failed to save settings:', e);
    }
  }

  public static loadSessionLogs(): FocusSessionLog[] {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static appendSessionLog(log: FocusSessionLog): void {
    try {
      const existing = this.loadSessionLogs();
      const updated = [log, ...existing].slice(0, 50);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('[TimerStorageService] Failed to append log:', e);
    }
  }
}
