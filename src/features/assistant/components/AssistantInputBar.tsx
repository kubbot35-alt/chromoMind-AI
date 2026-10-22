import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface AssistantInputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const AssistantInputBar: React.FC<AssistantInputBarProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
      <textarea
        rows={1}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Napisz do asystenta (np. 'Rozpisz zadanie na raport', 'Co oznacza SRP?')..."
        disabled={isLoading}
        className="w-full pl-3.5 pr-12 py-2.5 text-xs bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B35] resize-none shadow-xs transition-all disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        aria-label="Wyślij wiadomość"
        className="absolute right-2 p-1.5 bg-[#FF6B35] hover:bg-[#F0551E] disabled:bg-slate-300 text-white rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  );
};
