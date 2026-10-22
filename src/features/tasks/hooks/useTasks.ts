import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, TaskFilter, TaskSortBy, TaskPriority } from '../types/task.types.ts';
import { TaskStorageService } from '../services/taskStorageService.ts';
import { TaskFilterService } from '../services/taskFilterService.ts';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => TaskStorageService.loadTasks());
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<TaskSortBy>('dueDate');

  useEffect(() => {
    TaskStorageService.saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((taskData: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    estimatedMinutes?: number;
    category?: string;
    dueDate?: string;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: taskData.title.trim(),
      description: (taskData.description || '').trim(),
      status: 'todo',
      priority: taskData.priority || 'medium',
      estimatedMinutes: Math.max(5, taskData.estimatedMinutes || 30),
      spentMinutes: 0,
      dueDate: taskData.dueDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      category: taskData.category || 'Ogólne',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task;
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        return {
          ...task,
          status: newStatus,
          spentMinutes: newStatus === 'completed' && task.spentMinutes === 0 ? task.estimatedMinutes : task.spentMinutes,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const recordTaskTime = useCallback((id: string, minutesToAdd: number) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task;
        const newSpent = task.spentMinutes + minutesToAdd;
        const shouldComplete = newSpent >= task.estimatedMinutes && task.status === 'todo';
        return {
          ...task,
          spentMinutes: newSpent,
          status: shouldComplete ? 'in_progress' : task.status,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const filteredTasks = useMemo(() => {
    return TaskFilterService.filterAndSort(tasks, filter, searchQuery, sortBy);
  }, [tasks, filter, searchQuery, sortBy]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const totalEstimatedMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const totalSpentMinutes = tasks.reduce((sum, t) => sum + t.spentMinutes, 0);

    return {
      total,
      completed,
      inProgress,
      todo,
      totalEstimatedMinutes,
      totalSpentMinutes,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);

  return {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    recordTaskTime,
    taskStats,
  };
}
