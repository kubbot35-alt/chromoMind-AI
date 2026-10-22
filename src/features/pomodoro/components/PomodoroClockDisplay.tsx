import React from 'react';
import type { PomodoroMode } from '../types/pomodoro.types.ts';

interface PomodoroClockDisplayProps {
  formattedTime: string;
  progressRatio: number;
  mode: PomodoroMode;
  isRunning: boolean;
}

export const PomodoroClockDisplay: React.FC<PomodoroClockDisplayProps> = ({
  formattedTime,
  progressRatio,
  mode,
  isRunning,
}) => {
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const modeConfig = {
    work: { label: 'Blok głębokiego skupienia', color: '#FF6B35' },
    short_break: { label: 'Krótka regeneracja (5m)', color: '#38BDF8' },
    long_break: { label: 'Długa przerwa (15m)', color: '#34D399' },
  }[mode];

  return (
    <div className="flex flex-col items-center justify-center relative my-4">
      {/* SVG Ring */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
          {/* Background track */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke="#1A2D61"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Animated active progress */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke={modeConfig.color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-linear"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums tracking-tight text-white drop-shadow-sm">
            {formattedTime}
          </span>
          <span className="text-xs font-medium text-slate-300 mt-2 tracking-wide uppercase">
            {modeConfig.label}
          </span>
          <span className="text-[11px] font-mono tabular-nums text-slate-400 mt-0.5">
            {isRunning ? 'Odliczanie w toku' : 'Wstrzymany'}
          </span>
        </div>
      </div>
    </div>
  );
};
