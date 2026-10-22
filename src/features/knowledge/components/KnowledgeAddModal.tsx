import React, { useState } from 'react';
import { X, BookOpen, Tag } from 'lucide-react';

interface KnowledgeAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddKnowledge: (data: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  }) => void;
}

export const KnowledgeAddModal: React.FC<KnowledgeAddModalProps> = ({
  isOpen,
  onClose,
  onAddKnowledge,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Architektura');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddKnowledge({
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || 'Wskazówki',
      tags: tags.length > 0 ? tags : ['Ogólne'],
    });

    setTitle('');
    setContent('');
    setTagsInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A1128] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#FF6B35] flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif]">
              Dodaj materiał do bazy wiedzy
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij okno"
            className="p-1 text-slate-300 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tytuł notatki / tematu *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="np. Wytyczne pisania czystego kodu (SRP/SOLID)"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all text-slate-900"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kategoria
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] cursor-pointer"
            >
              <option value="Architektura">Architektura</option>
              <option value="Zarządzanie czasem">Zarządzanie czasem</option>
              <option value="Procedury">Procedury</option>
              <option value="Wskazówki">Wskazówki</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Treść merytoryczna / wytyczne *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Wprowadź istotne informacje, definicje, linki lub procedury, z których asystent będzie korzystał..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all text-slate-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              Tagi (oddzielone przecinkami)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="np. Architektura, SOLID, Refaktoring"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#FF6B35] hover:bg-[#F0551E] rounded-lg shadow-sm shadow-[#FF6B35]/25 transition-all cursor-pointer"
            >
              Zapisz w bazie wiedzy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
