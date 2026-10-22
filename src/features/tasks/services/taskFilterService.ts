import type { Task, TaskFilter, TaskSortBy } from '../types/task.types.ts';

export class TaskFilterService {
  public static filterAndSort(
    tasks: Task[],
    filter: TaskFilter,
    searchQuery: string,
    sortBy: TaskSortBy
  ): Task[] {
    let result = [...tasks];

    // Filter by status
    if (filter !== 'all') {
      result = result.filter(task => task.status === filter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q) ||
          task.category.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === 'time') {
        return b.estimatedMinutes - a.estimatedMinutes;
      }
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }
}
