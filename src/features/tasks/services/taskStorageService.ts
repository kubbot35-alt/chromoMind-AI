import type { Task } from '../types/task.types.ts';
import { INITIAL_TASKS } from '../../../data/initialData.ts';

const STORAGE_KEY = 'chronomind_tasks_v2';

export class TaskStorageService {
  public static loadTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveTasks(INITIAL_TASKS);
        return INITIAL_TASKS;
      }
      const parsed: unknown = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveTasks(INITIAL_TASKS);
        return INITIAL_TASKS;
      }

      // Ensure all tasks conform to natural time schema
      const sanitized: Task[] = parsed.map((item: Record<string, unknown>, idx: number) => {
        const estMinutes = typeof item.estimatedMinutes === 'number'
          ? item.estimatedMinutes
          : (typeof item.estimatedPomodoros === 'number' ? (item.estimatedPomodoros as number) * 25 : 30);

        const spentMinutes = typeof item.spentMinutes === 'number'
          ? item.spentMinutes
          : (typeof item.completedPomodoros === 'number' ? (item.completedPomodoros as number) * 25 : 0);

        return {
          id: typeof item.id === 'string' ? item.id : `task-${Date.now()}-${idx}`,
          title: typeof item.title === 'string' ? item.title : 'Bez tytułu',
          description: typeof item.description === 'string' ? item.description : '',
          status: (item.status === 'in_progress' || item.status === 'completed' || item.status === 'todo') ? item.status : 'todo',
          priority: (item.priority === 'high' || item.priority === 'low' || item.priority === 'medium') ? item.priority : 'medium',
          estimatedMinutes: estMinutes,
          spentMinutes: spentMinutes,
          dueDate: typeof item.dueDate === 'string' ? item.dueDate : new Date().toISOString().slice(0, 10),
          category: typeof item.category === 'string' ? item.category : 'Ogólne',
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
          updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
        };
      });

      return sanitized;
    } catch (e) {
      console.error('[TaskStorageService] Failed to load tasks:', e);
      return INITIAL_TASKS;
    }
  }

  public static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('[TaskStorageService] Failed to save tasks:', e);
    }
  }
}
