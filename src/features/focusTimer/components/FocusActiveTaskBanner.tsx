import React from 'react';
import type { Task } from '../../tasks/types/task.types.ts';
import { formatDuration } from '../../tasks/types/task.types.ts';
import { Target, Check, ChevronRight } from 'lucide-react';

interface FocusActiveTaskBannerProps {
  activeTask: Task | null;
  tasks: Task[];
  onSelectTask: (taskId: string | null, suggestedMinutes?: number) => void;
  onCompleteTask: (taskId: string) => void;
}

export const FocusActiveTaskBanner: React.FC<FocusActiveTaskBannerProps> = ({
  activeTask,
  tasks,
  onSelectTask,
  onCompleteTask,
}) => {
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  const handleSelectChange = (taskId: string) => {
    if (!taskId) {
      onSelectTask(null);
      return;
    }
    const selected = tasks.find(t => t.id === taskId);
    if (selected) {
      const remainingMinutes = Math.max(5, selected.estimatedMinutes - selected.spentMinutes);
      onSelectTask(taskId, remainingMinutes);
    } else {
      onSelectTask(taskId);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-900 mt-6">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Zadanie w toku
          </span>
        </div>

        {/* Task selector dropdown */}
        <select
          value={activeTask?.id || ''}
          onChange={e => handleSelectChange(e.target.value)}
          aria-label="Wybierz powiązane zadanie"
          className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md px-2.5 py-1 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] cursor-pointer"
        >
          <option value="">-- Wybierz zadanie z listy --</option>
          {pendingTasks.map(t => (
            <option key={t.id} value={t.id}>
              {t.title} ({formatDuration(t.estimatedMinutes)})
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
              Szacunek: {formatDuration(activeTask.estimatedMinutes)} · Przepracowano: {formatDuration(activeTask.spentMinutes)} · Kategoria: {activeTask.category}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onCompleteTask(activeTask.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Ukończ zadanie</span>
          </button>
        </div>
      ) : (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Brak wybranego zadania. Możesz uruchomić timer na dowolny czas skupienia.</span>
          {pendingTasks.length > 0 && (
            <button
              type="button"
              onClick={() => handleSelectChange(pendingTasks[0].id)}
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
