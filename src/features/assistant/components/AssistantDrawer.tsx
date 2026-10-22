import React, { useRef, useEffect } from 'react';
import type { ChatMessage, SuggestedTaskItem } from '../types/assistant.types.ts';
import { AssistantChatBubble } from './AssistantChatBubble.tsx';
import { AssistantQuickPromptChips } from './AssistantQuickPromptChips.tsx';
import { AssistantInputBar } from './AssistantInputBar.tsx';
import { Sparkles, Trash2, Bot } from 'lucide-react';

interface AssistantDrawerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  onApplySuggestedTask: (task: SuggestedTaskItem) => void;
  onActivateTaskInFocus: (taskId: string) => void;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearHistory,
  onApplySuggestedTask,
  onActivateTaskInFocus,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[640px] rounded-2xl bg-[#0E1A40] border border-[#1A2D61] shadow-xl overflow-hidden">
      {/* Assistant Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0A1128] border-b border-[#1A2D61]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#E8501D] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif]">
              <span>Asystent ChronoMind</span>
              <span className="text-[10px] font-normal text-slate-400 font-mono">v2.1</span>
            </h3>
            <p className="text-[11px] text-slate-300">
              Planowanie, zegar skupienia & przeszukiwanie wiedzy
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          title="Wyczyść historię rozmowy"
          aria-label="Wyczyść historię rozmowy"
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#14213D] rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
        {messages.map(msg => (
          <AssistantChatBubble
            key={msg.id}
            message={msg}
            onApplySuggestedTask={onApplySuggestedTask}
            onActivateTaskInFocus={onActivateTaskInFocus}
          />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 text-slate-300 text-xs animate-pulse max-w-[70%]">
            <Sparkles className="w-4 h-4 text-[#FF6B35] animate-spin" />
            <span>Asystent analizuje zadania i generuje odpowiedź...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer Area: Quick Chips + Input */}
      <div className="p-4 bg-[#0A1128]/80 border-t border-[#1A2D61]">
        <AssistantQuickPromptChips
          onSelectPrompt={onSendMessage}
          disabled={isLoading}
        />
        <AssistantInputBar
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
