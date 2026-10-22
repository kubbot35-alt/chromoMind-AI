import React from 'react';
import type { KnowledgeCategory } from '../types/knowledge.types.ts';
import { Search } from 'lucide-react';

interface KnowledgeSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: KnowledgeCategory;
  onSelectCategory: (category: KnowledgeCategory) => void;
}

const CATEGORIES: KnowledgeCategory[] = [
  'Wszystkie',
  'Architektura',
  'Zarządzanie czasem',
  'Procedury',
  'Wskazówki',
];

export const KnowledgeSearchBar: React.FC<KnowledgeSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-3.5 mb-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Szybkie wyszukiwanie w notatkach i bazie wiedzy (np. SRP, Pomodoro, Procedura)..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] shadow-xs transition-all"
        />
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0E1A40] border border-[#1A2D61] rounded-xl">
        {CATEGORIES.map(category => (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === category
                ? 'bg-[#FF6B35] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#1A2D61]/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
