import React from 'react';
import type { KnowledgeItem } from '../types/knowledge.types.ts';
import { KnowledgeItemCard } from './KnowledgeItemCard.tsx';
import { BookOpen, Plus } from 'lucide-react';

interface KnowledgeListProps {
  items: KnowledgeItem[];
  onDelete: (id: string) => void;
  onAskAssistant: (item: KnowledgeItem) => void;
  onOpenCreateModal: () => void;
  hasFilterActive: boolean;
}

export const KnowledgeList: React.FC<KnowledgeListProps> = ({
  items,
  onDelete,
  onAskAssistant,
  onOpenCreateModal,
  hasFilterActive,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0E1A40]/50 border border-dashed border-[#1A2D61] rounded-2xl">
        <div className="w-12 h-12 rounded-xl bg-[#14213D] flex items-center justify-center text-[#FF6B35] mb-3">
          <BookOpen className="w-6 h-6 stroke-[2]" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          {hasFilterActive ? 'Nie znaleziono materiałów' : 'Baza wiedzy jest pusta'}
        </h3>
        <p className="text-xs text-slate-300 max-w-sm mb-4">
          {hasFilterActive
            ? 'Spróbuj wpisać inne słowa kluczowe lub zresetować filtr kategorii.'
            : 'Zapisuj notatki, procedury, linki i dobre praktyki, aby asystent mógł z nich korzystać.'}
        </p>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#FF6B35] hover:bg-[#F0551E] rounded-lg transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Dodaj pierwszy wpis</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map(item => (
        <KnowledgeItemCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          onAskAssistantAboutItem={onAskAssistant}
        />
      ))}
    </div>
  );
};
