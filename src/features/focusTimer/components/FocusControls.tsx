import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface FocusControlsProps {
  isRunning: boolean;
  durationMinutes: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onChangeDuration: (minutes: number) => void;
}

const PRESET_MINUTES = [15, 25, 45, 60, 90];

export const FocusControls: React.FC<FocusControlsProps> = ({
  isRunning,
  durationMinutes,
  onStart,
  onPause,
  onReset,
  onChangeDuration,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val >= 1 && val <= 180) {
      onChangeDuration(val);
      setShowCustomInput(false);
      setCustomInput('');
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Duration Presets */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-[#0A1128] border border-[#1A2D61] rounded-xl">
        {PRESET_MINUTES.map(mins => (
          <button
            key={mins}
            type="button"
            onClick={() => {
              setShowCustomInput(false);
              onChangeDuration(mins);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              durationMinutes === mins && !showCustomInput
                ? 'bg-[#FF6B35] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#1A2D61]/50'
            }`}
          >
            {mins} min
          </button>
        ))}

        <button
          type="button"
          onClick={() => setShowCustomInput(prev => !prev)}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            showCustomInput
              ? 'bg-[#FF6B35] text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-[#1A2D61]/50'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>Inny czas</span>
        </button>
      </div>

      {/* Optional Custom Minute Form */}
      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 animate-in fade-in duration-150">
          <input
            type="number"
            min={1}
            max={180}
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="np. 40"
            className="w-24 px-3 py-1.5 text-xs text-slate-900 bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35]"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#FF6B35] hover:bg-[#F0551E] rounded-lg transition-colors cursor-pointer"
          >
            Ustaw minuty
          </button>
        </form>
      )}

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
