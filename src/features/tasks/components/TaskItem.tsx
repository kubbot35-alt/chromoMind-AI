import React from 'react';
import type { Task } from '../types/task.types.ts';
import { Check, Clock, Trash2, Play, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  isActiveInPomodoro: boolean;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onActivateInPomodoro: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isActiveInPomodoro,
  onToggleStatus,
  onDelete,
  onActivateInPomodoro,
}) => {
  const isCompleted = task.status === 'completed';

  const priorityMeta = {
    high: { label: 'Wysoki', color: 'text-rose-600', border: 'border-rose-200' },
    medium: { label: 'Średni', color: 'text-amber-600', border: 'border-amber-200' },
    low: { label: 'Niski', color: 'text-emerald-600', border: 'border-emerald-200' },
  }[task.priority];

  return (
    <div
      className={`group relative p-4 rounded-xl transition-all duration-150 border ${
        isActiveInPomodoro
          ? 'bg-white ring-2 ring-[#FF6B35] shadow-lg shadow-[#FF6B35]/15 border-transparent'
          : 'bg-white hover:border-slate-300 border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox button */}
        <button
          type="button"
          onClick={() => onToggleStatus(task.id)}
          aria-label={isCompleted ? 'Oznacz jako nieukończone' : 'Oznacz jako ukończone'}
          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
            isCompleted
              ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
              : 'border-slate-300 hover:border-[#FF6B35] bg-white'
          }`}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`text-base font-semibold leading-snug transition-colors text-slate-900 ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.title}
            </h3>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
              {!isCompleted && (
                <button
                  type="button"
                  onClick={() => onActivateInPomodoro(task.id)}
                  title={isActiveInPomodoro ? 'Aktywne w Pomodoro' : 'Ustaw w zegarze Pomodoro'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isActiveInPomodoro
                      ? 'bg-[#FF6B35] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-[#FF6B35]/10 hover:text-[#FF6B35]'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isActiveInPomodoro ? 'W toku' : 'Pomodoro'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onDelete(task.id)}
                aria-label="Usuń zadanie"
                className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Clean Unboxed Metadata with Typographic Separators (Zero-Pill Rule) */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
            <span className="font-medium text-slate-700">{task.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            
            {/* Priority with icon + text label */}
            <span className={`inline-flex items-center gap-1 font-medium ${priorityMeta.color}`}>
              <AlertCircle className="w-3 h-3" />
              <span>Priorytet {priorityMeta.label}</span>
            </span>

            <span aria-hidden="true" className="text-slate-300">·</span>

            {/* Pomodoro sessions count */}
            <span className="inline-flex items-center gap-1 font-mono tabular-nums text-slate-700">
              <Clock className="w-3 h-3 text-[#FF6B35]" />
              <span>{task.completedPomodoros}/{task.estimatedPomodoros} pomodoro</span>
            </span>

            <span aria-hidden="true" className="text-slate-300">·</span>

            <span className="text-slate-500">
              Termin: {task.dueDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
