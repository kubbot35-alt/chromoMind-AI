import type { Task } from '../types/task.types.ts';
import { INITIAL_TASKS } from '../../shared/constants/defaultData.ts';

const STORAGE_KEY = 'chronomind_tasks_v1';

export class TaskStorageService {
  public static loadTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveTasks(INITIAL_TASKS);
        return INITIAL_TASKS;
      }
      return JSON.parse(data);
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
