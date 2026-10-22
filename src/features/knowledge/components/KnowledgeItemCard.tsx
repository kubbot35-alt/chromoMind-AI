import React, { useState } from 'react';
import type { KnowledgeItem } from '../types/knowledge.types.ts';
import { Copy, Check, Trash2, BookOpen } from 'lucide-react';

interface KnowledgeItemCardProps {
  item: KnowledgeItem;
  onDelete: (id: string) => void;
  onAskAssistantAboutItem: (item: KnowledgeItem) => void;
}

export const KnowledgeItemCard: React.FC<KnowledgeItemCardProps> = ({
  item,
  onDelete,
  onAskAssistantAboutItem,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${item.title}\n\n${item.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between text-slate-900 group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#0A1128] text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-[#FF6B35]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {item.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleCopy}
              title="Kopiuj treść"
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              title="Usuń wpis"
              className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mt-2">
          {item.content}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Zero-Pill Unboxed Metadata */}
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span className="text-slate-800 font-semibold">{item.category}</span>
          {item.tags.length > 0 && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{item.tags.join(', ')}</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAskAssistantAboutItem(item)}
          className="text-xs font-semibold text-[#FF6B35] hover:text-[#F0551E] hover:underline cursor-pointer transition-colors"
        >
          Zapytaj asystenta &rarr;
        </button>
      </div>
    </article>
  );
};
