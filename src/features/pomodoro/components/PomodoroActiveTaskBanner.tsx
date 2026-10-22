import React from 'react';
import type { Task } from '../../tasks/types/task.types.ts';
import { Target, Check, ChevronRight } from 'lucide-react';

interface PomodoroActiveTaskBannerProps {
  activeTask: Task | null;
  tasks: Task[];
  onSelectTask: (taskId: string | null) => void;
  onCompleteTask: (taskId: string) => void;
}

export const PomodoroActiveTaskBanner: React.FC<PomodoroActiveTaskBannerProps> = ({
  activeTask,
  tasks,
  onSelectTask,
  onCompleteTask,
}) => {
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div className="w-full max-w-xl mx-auto p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-900 mt-6">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Podpięte zadanie
          </span>
        </div>

        {/* Task selector dropdown */}
        <select
          value={activeTask?.id || ''}
          onChange={e => onSelectTask(e.target.value ? e.target.value : null)}
          aria-label="Wybierz powiązane zadanie"
          className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md px-2.5 py-1 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] cursor-pointer"
        >
          <option value="">-- Wybierz zadanie do pracy --</option>
          {pendingTasks.map(t => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.completedPomodoros}/{t.estimatedPomodoros} pomodoro)
            </option>
          ))}
        </select>
      </div>

      {activeTask ? (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 truncate">
              {activeTask.title}
            </h4>
            <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
              Postęp: {activeTask.completedPomodoros} z {activeTask.estimatedPomodoros} sesji Pomodoro · Kategoria: {activeTask.category}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onCompleteTask(activeTask.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Zakończ</span>
          </button>
        </div>
      ) : (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Nie wybrano zadania. Każda ukończona sesja będzie zaliczana ogólnie.</span>
          {pendingTasks.length > 0 && (
            <button
              type="button"
              onClick={() => onSelectTask(pendingTasks[0].id)}
              className="text-[#FF6B35] hover:underline font-medium inline-flex items-center gap-0.5 shrink-0"
            >
              Wybierz pierwsze <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
