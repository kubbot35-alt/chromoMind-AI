import React from 'react';
import type { TaskFilter, TaskSortBy } from '../types/task.types.ts';
import { Search, ArrowUpDown } from 'lucide-react';

interface TaskFilterBarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: TaskSortBy;
  onSortChange: (sort: TaskSortBy) => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
      {/* Segmented Filter Controls */}
      <div className="flex items-center gap-1 p-1 bg-[#0E1A40] border border-[#1A2D61] rounded-lg shrink-0">
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
            filter === 'all'
              ? 'bg-[#FF6B35] text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-[#1A2D61]/50'
          }`}
        >
          Wszystkie
        </button>
        <button
          type="button"
          onClick={() => onFilterChange('todo')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
            filter === 'todo'
              ? 'bg-[#FF6B35] text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-[#1A2D61]/50'
          }`}
        >
          Do zrobienia
        </button>
        <button
          type="button"
          onClick={() => onFilterChange('in_progress')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
            filter === 'in_progress'
              ? 'bg-[#FF6B35] text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-[#1A2D61]/50'
          }`}
        >
          W toku
        </button>
        <button
          type="button"
          onClick={() => onFilterChange('completed')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
            filter === 'completed'
              ? 'bg-[#FF6B35] text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-[#1A2D61]/50'
          }`}
        >
          Ukończone
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex items-center gap-2.5 flex-1 max-w-md">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Szukaj w zadaniach..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white text-slate-900 placeholder:text-slate-400 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] transition-all"
          />
        </div>

        {/* Sort */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value as TaskSortBy)}
            aria-label="Sortuj zadania według"
            className="appearance-none pl-7 pr-8 py-1.5 text-xs bg-[#0E1A40] text-slate-200 border border-[#1A2D61] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] cursor-pointer"
          >
            <option value="dueDate">Według terminu</option>
            <option value="priority">Według priorytetu</option>
            <option value="time">Czas trwania (od najdłuższego)</option>
            <option value="createdAt">Data dodania</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
