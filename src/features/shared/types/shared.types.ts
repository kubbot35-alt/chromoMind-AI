export type ActiveTab = 'tasks' | 'pomodoro' | 'knowledge' | 'assistant';

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}
