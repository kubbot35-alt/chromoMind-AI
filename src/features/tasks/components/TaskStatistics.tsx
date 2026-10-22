import React from 'react';
import { formatDuration } from '../types/task.types.ts';
import { CheckCircle, Clock, Target, ListTodo } from 'lucide-react';

interface TaskStatisticsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    totalEstimatedMinutes: number;
    totalSpentMinutes: number;
    completionRate: number;
  };
}

export const TaskStatistics: React.FC<TaskStatisticsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div className="p-4 rounded-xl bg-[#0E1A40] border border-[#1A2D61] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#14213D] flex items-center justify-center text-slate-300 shrink-0">
          <ListTodo className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Wszystkie zadania</p>
          <p className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
            {stats.total}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#0E1A40] border border-[#1A2D61] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Ukończone</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold font-mono tabular-nums text-emerald-400">
              {stats.completed}
            </span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              ({stats.completionRate}%)
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#0E1A40] border border-[#1A2D61] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#14213D] flex items-center justify-center text-[#FF6B35] shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Zarejestrowany czas</p>
          <p className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
            {formatDuration(stats.totalSpentMinutes)}{' '}
            <span className="text-xs text-slate-400 font-normal">
              / {formatDuration(stats.totalEstimatedMinutes)}
            </span>
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#0E1A40] border border-[#1A2D61] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#14213D] flex items-center justify-center text-amber-400 shrink-0">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">W trakcie realizacji</p>
          <p className="text-lg font-bold font-mono tabular-nums text-amber-400 mt-0.5">
            {stats.inProgress}
          </p>
        </div>
      </div>
    </div>
  );
};
