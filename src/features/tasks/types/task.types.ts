export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedMinutes: number;
  spentMinutes: number;
  dueDate: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskFilter = 'all' | 'todo' | 'in_progress' | 'completed';

export type TaskSortBy = 'dueDate' | 'priority' | 'time' | 'createdAt';

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining} min` : `${hours}h`;
}
