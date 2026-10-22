export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedPomodoros: number;
  completedPomodoros: number;
  dueDate: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskFilter = 'all' | 'todo' | 'in_progress' | 'completed';

export type TaskSortBy = 'dueDate' | 'priority' | 'pomodoros' | 'createdAt';
