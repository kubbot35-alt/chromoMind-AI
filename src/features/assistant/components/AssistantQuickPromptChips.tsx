import React from 'react';
import { Sparkles } from 'lucide-react';

interface AssistantQuickPromptChipsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled: boolean;
}

const PROMPT_SUGGESTIONS = [
  'Zaplanuj mój dzisiejszy dzień pracy',
  'Rozbij zadanie na sesje Pomodoro 25 min',
  'Jakie mam zadania o wysokim priorytecie?',
  'Wyszukaj w notatkach: Zasada SRP',
];

export const AssistantQuickPromptChips: React.FC<AssistantQuickPromptChipsProps> = ({
  onSelectPrompt,
  disabled,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-3">
      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mr-1 shrink-0">
        <Sparkles className="w-3 h-3 text-[#FF6B35]" />
        <span>Szybkie pytania:</span>
      </div>
      {PROMPT_SUGGESTIONS.map((prompt, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onSelectPrompt(prompt)}
          className="text-left text-[11px] px-2.5 py-1 bg-[#14213D] hover:bg-[#1A2D61] text-slate-200 hover:text-white border border-[#1A2D61] rounded-lg transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
