import React from 'react';
import type { Task } from '../../tasks/types/task.types.ts';
import { FocusClockDisplay } from './FocusClockDisplay.tsx';
import { FocusControls } from './FocusControls.tsx';
import { FocusActiveTaskBanner } from './FocusActiveTaskBanner.tsx';

interface FocusTimerWidgetProps {
  durationMinutes: number;
  formattedTime: string;
  progressRatio: number;
  isRunning: boolean;
  completedSessionsCount: number;
  activeTaskId: string | null;
  tasks: Task[];
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onChangeDuration: (minutes: number) => void;
  onSelectTask: (taskId: string | null, suggestedMinutes?: number) => void;
  onCompleteTask: (taskId: string) => void;
}

export const FocusTimerWidget: React.FC<FocusTimerWidgetProps> = ({
  durationMinutes,
  formattedTime,
  progressRatio,
  isRunning,
  completedSessionsCount,
  activeTaskId,
  tasks,
  onStart,
  onPause,
  onReset,
  onChangeDuration,
  onSelectTask,
  onCompleteTask,
}) => {
  const activeTask = tasks.find(t => t.id === activeTaskId) || null;

  return (
    <div className="flex flex-col items-center p-6 md:p-8 rounded-2xl bg-[#0E1A40] border border-[#1A2D61] shadow-xl">
      {/* Session counter */}
      <div className="flex items-center gap-2 px-3 py-1 bg-[#14213D] border border-[#1A2D61] rounded-full text-xs font-mono tabular-nums text-slate-300 mb-2">
        <span>Zrealizowane bloki skupienia dziś:</span>
        <span className="font-bold text-[#FF6B35]">{completedSessionsCount}</span>
      </div>

      <FocusClockDisplay
        formattedTime={formattedTime}
        progressRatio={progressRatio}
        durationMinutes={durationMinutes}
        isRunning={isRunning}
      />

      <FocusControls
        isRunning={isRunning}
        durationMinutes={durationMinutes}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        onChangeDuration={onChangeDuration}
      />

      <FocusActiveTaskBanner
        activeTask={activeTask}
        tasks={tasks}
        onSelectTask={onSelectTask}
        onCompleteTask={onCompleteTask}
      />
    </div>
  );
};
