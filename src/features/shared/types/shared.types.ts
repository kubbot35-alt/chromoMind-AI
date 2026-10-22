export type ActiveTab = 'tasks' | 'focus' | 'knowledge' | 'assistant';

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}
