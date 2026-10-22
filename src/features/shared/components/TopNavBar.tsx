import React from 'react';
import type { ActiveTab } from '../types/shared.types.ts';
import { Plus, Sparkles, Clock, CheckSquare, BookOpen } from 'lucide-react';

interface TopNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onQuickAddTask: () => void;
  activeFocusTaskTitle?: string | null;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  onTabChange,
  onQuickAddTask,
  activeFocusTaskTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070D1E]/95 backdrop-blur-md border-b border-[#1A2D61] px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#E8501D] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF6B35]/20">
            <Clock className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-white whitespace-nowrap shrink-0">
            ChronoMind<span className="text-[#FF6B35]">.AI</span>
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onTabChange('tasks')}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'tasks'
                ? 'text-[#FF6B35] border-[#FF6B35] font-semibold'
                : 'text-slate-300 border-transparent hover:text-white hover:border-slate-500'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Planer zadań</span>
          </button>

          <button
            onClick={() => onTabChange('focus')}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'focus'
                ? 'text-[#FF6B35] border-[#FF6B35] font-semibold'
                : 'text-slate-300 border-transparent hover:text-white hover:border-slate-500'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Zegar skupienia</span>
            {activeFocusTaskTitle && (
              <span className="text-xs text-[#FF6B35] font-mono tabular-nums truncate max-w-[120px]">
                ({activeFocusTaskTitle})
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('knowledge')}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'knowledge'
                ? 'text-[#FF6B35] border-[#FF6B35] font-semibold'
                : 'text-slate-300 border-transparent hover:text-white hover:border-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Baza wiedzy</span>
          </button>

          <button
            onClick={() => onTabChange('assistant')}
            className={`flex items-center gap-2 pb-1 border-b-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'assistant'
                ? 'text-[#FF6B35] border-[#FF6B35] font-semibold'
                : 'text-slate-300 border-transparent hover:text-white hover:border-slate-500'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Asystent AI</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickAddTask}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#FF6B35] hover:bg-[#F0551E] active:scale-[0.98] transition-all rounded-lg shadow-sm shadow-[#FF6B35]/25 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nowe zadanie</span>
          </button>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden flex items-center justify-around pt-3 border-t border-[#1A2D61] mt-2.5">
        <button
          onClick={() => onTabChange('tasks')}
          className={`text-xs flex flex-col items-center gap-1 ${
            activeTab === 'tasks' ? 'text-[#FF6B35] font-semibold' : 'text-slate-400'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Zadania</span>
        </button>
        <button
          onClick={() => onTabChange('focus')}
          className={`text-xs flex flex-col items-center gap-1 ${
            activeTab === 'focus' ? 'text-[#FF6B35] font-semibold' : 'text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Skupienie</span>
        </button>
        <button
          onClick={() => onTabChange('knowledge')}
          className={`text-xs flex flex-col items-center gap-1 ${
            activeTab === 'knowledge' ? 'text-[#FF6B35] font-semibold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Wiedza</span>
        </button>
        <button
          onClick={() => onTabChange('assistant')}
          className={`text-xs flex flex-col items-center gap-1 ${
            activeTab === 'assistant' ? 'text-[#FF6B35] font-semibold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Asystent</span>
        </button>
      </div>
    </header>
  );
};
