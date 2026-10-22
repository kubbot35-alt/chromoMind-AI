import React from 'react';
import type { PomodoroMode } from '../types/pomodoro.types.ts';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PomodoroControlsProps {
  isRunning: boolean;
  currentMode: PomodoroMode;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSwitchMode: (mode: PomodoroMode) => void;
}

export const PomodoroControls: React.FC<PomodoroControlsProps> = ({
  isRunning,
  currentMode,
  onStart,
  onPause,
  onReset,
  onSwitchMode,
}) => {
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Mode Switcher Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0A1128] border border-[#1A2D61] rounded-xl">
        <button
          type="button"
          onClick={() => onSwitchMode('work')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            currentMode === 'work'
              ? 'bg-[#FF6B35] text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-[#1A2D61]/50'
          }`}
        >
          Praca (25 min)
        </button>

        <button
          type="button"
          onClick={() => onSwitchMode('short_break')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            currentMode === 'short_break'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-[#1A2D61]/50'
          }`}
        >
          Przerwa (5 min)
        </button>

        <button
          type="button"
          onClick={() => onSwitchMode('long_break')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            currentMode === 'long_break'
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-[#1A2D61]/50'
          }`}
        >
          Długa (15 min)
        </button>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center gap-3">
        {isRunning ? (
          <button
            type="button"
            onClick={onPause}
            className="flex items-center gap-2.5 px-6 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition-all rounded-xl shadow-md cursor-pointer"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Wstrzymaj</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="flex items-center gap-2.5 px-7 py-2.5 text-sm font-bold text-white bg-[#FF6B35] hover:bg-[#F0551E] active:scale-95 transition-all rounded-xl shadow-md shadow-[#FF6B35]/30 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Rozpocznij skupienie</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          title="Zresetuj zegar"
          aria-label="Zresetuj zegar"
          className="p-2.5 text-slate-300 hover:text-white bg-[#0A1128] hover:bg-[#14213D] border border-[#1A2D61] rounded-xl transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
