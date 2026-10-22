import React from 'react';
import type { Task } from '../../tasks/types/task.types.ts';
import type { PomodoroMode } from '../types/pomodoro.types.ts';
import { PomodoroClockDisplay } from './PomodoroClockDisplay.tsx';
import { PomodoroControls } from './PomodoroControls.tsx';
import { PomodoroActiveTaskBanner } from './PomodoroActiveTaskBanner.tsx';

interface PomodoroWidgetProps {
  mode: PomodoroMode;
  isRunning: boolean;
  formattedTime: string;
  progressRatio: number;
  completedSessionsCount: number;
  activeTaskId: string | null;
  tasks: Task[];
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSwitchMode: (mode: PomodoroMode) => void;
  onSelectTask: (taskId: string | null) => void;
  onCompleteTask: (taskId: string) => void;
}

export const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({
  mode,
  isRunning,
  formattedTime,
  progressRatio,
  completedSessionsCount,
  activeTaskId,
  tasks,
  onStart,
  onPause,
  onReset,
  onSwitchMode,
  onSelectTask,
  onCompleteTask,
}) => {
  const activeTask = tasks.find(t => t.id === activeTaskId) || null;

  return (
    <div className="flex flex-col items-center p-6 md:p-8 rounded-2xl bg-[#0E1A40] border border-[#1A2D61] shadow-xl">
      {/* Session counter */}
      <div className="flex items-center gap-2 px-3 py-1 bg-[#14213D] border border-[#1A2D61] rounded-full text-xs font-mono tabular-nums text-slate-300 mb-2">
        <span>Ukończone cykle dziś:</span>
        <span className="font-bold text-[#FF6B35]">{completedSessionsCount}</span>
      </div>

      <PomodoroClockDisplay
        formattedTime={formattedTime}
        progressRatio={progressRatio}
        mode={mode}
        isRunning={isRunning}
      />

      <PomodoroControls
        isRunning={isRunning}
        currentMode={mode}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        onSwitchMode={onSwitchMode}
      />

      <PomodoroActiveTaskBanner
        activeTask={activeTask}
        tasks={tasks}
        onSelectTask={onSelectTask}
        onCompleteTask={onCompleteTask}
      />
    </div>
  );
};
