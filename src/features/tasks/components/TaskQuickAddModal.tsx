import React, { useState } from 'react';
import type { TaskPriority } from '../types/task.types.ts';
import { formatDuration } from '../types/task.types.ts';
import { X, Clock, Calendar, Tag, AlertCircle } from 'lucide-react';

interface TaskQuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    estimatedMinutes: number;
    category: string;
    dueDate: string;
  }) => void;
}

const PRESET_DURATIONS = [15, 30, 45, 60, 90, 120];

export const TaskQuickAddModal: React.FC<TaskQuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [category, setCategory] = useState('Praca');
  const [dueDate, setDueDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      estimatedMinutes: Math.max(5, estimatedMinutes || 30),
      category: category.trim() || 'Ogólne',
      dueDate,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setEstimatedMinutes(30);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A1128] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#FF6B35] flex items-center justify-center text-white">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold font-['Plus_Jakarta_Sans',sans-serif]">
              Dodaj nowe zadanie
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
              Tytuł zadania *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="np. Złożenie formularza podatkowego lub przygotowanie oferty"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all text-slate-900"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Opis / Notatki
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Szczegóły wykonania, linki lub podpunkty do odhaczenia..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all text-slate-900 resize-none"
            />
          </div>

          {/* Intuitive Duration Selector: Quick minute buttons + custom input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                Szacowany czas trwania
              </span>
              <span className="font-mono tabular-nums text-[#FF6B35] font-semibold text-xs lowercase">
                Wybrano: {formatDuration(estimatedMinutes)}
              </span>
            </label>

            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {PRESET_DURATIONS.map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setEstimatedMinutes(mins)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    estimatedMinutes === mins
                      ? 'bg-[#FF6B35] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {formatDuration(mins)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 whitespace-nowrap">Lub wpisz własny czas:</span>
              <input
                type="number"
                min={5}
                max={480}
                step={5}
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(Math.max(5, parseInt(e.target.value, 10) || 5))}
                className="w-24 px-2.5 py-1 text-xs font-mono tabular-nums bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] text-slate-900"
              />
              <span className="text-xs text-slate-500">minut</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                Priorytet
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] cursor-pointer"
              >
                <option value="high">Wysoki</option>
                <option value="medium">Średni</option>
                <option value="low">Niski</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                Kategoria
              </label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="np. Praca, Dom, Urząd"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Termin (deadline)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>
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
              Zapisz zadanie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
