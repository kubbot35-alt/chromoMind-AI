import React from 'react';
import type { Task } from '../types/task.types.ts';
import { TaskItem } from './TaskItem.tsx';
import { CheckCircle2, Plus } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onActivateInPomodoro: (id: string) => void;
  onOpenCreateModal: () => void;
  hasFilterActive: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTaskId,
  onToggleStatus,
  onDelete,
  onActivateInPomodoro,
  onOpenCreateModal,
  hasFilterActive,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0E1A40]/50 border border-dashed border-[#1A2D61] rounded-2xl">
        <div className="w-12 h-12 rounded-xl bg-[#14213D] flex items-center justify-center text-[#FF6B35] mb-3">
          <CheckCircle2 className="w-6 h-6 stroke-[2]" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          {hasFilterActive ? 'Brak zadań spełniających kryteria' : 'Brak zadań na liście'}
        </h3>
        <p className="text-xs text-slate-300 max-w-sm mb-4">
          {hasFilterActive
            ? 'Zmień kryteria wyszukiwania lub wyczyść filtry, aby wyświetlić pozostałe pozycje.'
            : 'Dodaj swoje pierwsze zadanie lub poproś asystenta AI o przygotowanie planu dnia.'}
        </p>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#FF6B35] hover:bg-[#F0551E] rounded-lg transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Dodaj nowe zadanie</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          isActiveInPomodoro={activeTaskId === task.id}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onActivateInPomodoro={onActivateInPomodoro}
        />
      ))}
    </div>
  );
};
