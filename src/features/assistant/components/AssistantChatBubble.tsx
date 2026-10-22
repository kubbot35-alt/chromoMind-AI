import React from 'react';
import type { ChatMessage, SuggestedTaskItem } from '../types/assistant.types.ts';
import { formatDuration } from '../../tasks/types/task.types.ts';
import { Sparkles, User, Plus, Clock, Play } from 'lucide-react';

interface AssistantChatBubbleProps {
  message: ChatMessage;
  onApplySuggestedTask?: (task: SuggestedTaskItem) => void;
  onActivateTaskInFocus?: (taskId: string) => void;
}

export const AssistantChatBubble: React.FC<AssistantChatBubbleProps> = ({
  message,
  onApplySuggestedTask,
  onActivateTaskInFocus,
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
          isUser
            ? 'bg-[#1A2D61] text-white'
            : 'bg-gradient-to-br from-[#FF6B35] to-[#E8501D] text-white shadow-sm shadow-[#FF6B35]/20'
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
      </div>

      {/* Bubble Content */}
      <div
        className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
          isUser
            ? 'bg-[#FF6B35] text-white font-medium shadow-sm'
            : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
        }`}
      >
        <div className="whitespace-pre-line">{message.content}</div>

        {/* Suggested Tasks Block (if provided by AI) */}
        {!isUser && message.suggestedTasks && message.suggestedTasks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
              Zaproponowane zadania z czasem trwania:
            </p>
            <div className="space-y-1.5">
              {message.suggestedTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{task.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                      Priorytet: {task.priority} · Czas: {formatDuration(task.estimatedMinutes)}
                    </p>
                  </div>
                  {onApplySuggestedTask && (
                    <button
                      type="button"
                      onClick={() => onApplySuggestedTask(task)}
                      className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-white bg-[#FF6B35] hover:bg-[#F0551E] rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Dodaj</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Focus task suggestion action */}
        {!isUser && message.focusTaskId && onActivateTaskInFocus && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Zadanie gotowe do pracy</span>
            <button
              type="button"
              onClick={() => onActivateTaskInFocus(message.focusTaskId!)}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current text-[#FF6B35]" />
              <span>Uruchom skupienie</span>
            </button>
          </div>
        )}

        {/* Timestamp & Source */}
        <div
          className={`flex items-center justify-between gap-2 mt-2 pt-1.5 text-[10px] ${
            isUser ? 'text-white/80' : 'text-slate-400 border-t border-slate-50'
          }`}
        >
          <span>{message.timestamp}</span>
          {!isUser && (
            <span className="font-mono">
              {message.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Silnik regułowy'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
