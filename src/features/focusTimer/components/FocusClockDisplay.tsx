import React from 'react';

interface FocusClockDisplayProps {
  formattedTime: string;
  progressRatio: number;
  durationMinutes: number;
  isRunning: boolean;
}

export const FocusClockDisplay: React.FC<FocusClockDisplayProps> = ({
  formattedTime,
  progressRatio,
  durationMinutes,
  isRunning,
}) => {
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

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
            stroke="#FF6B35"
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
            Sesja skupienia ({durationMinutes} min)
          </span>
          <span className="text-[11px] font-mono tabular-nums text-slate-400 mt-0.5">
            {isRunning ? 'Czas płynie...' : 'Zegar wstrzymany'}
          </span>
        </div>
      </div>
    </div>
  );
};
