import { useState, useCallback } from 'react';
import type { ChatMessage, SuggestedTaskItem } from '../types/assistant.types.ts';
import type { Task } from '../../tasks/types/task.types.ts';
import type { KnowledgeItem } from '../../knowledge/types/knowledge.types.ts';
import { INITIAL_CHAT_MESSAGES } from '../../shared/constants/defaultData.ts';
import { AssistantApiService } from '../services/assistantApiService.ts';

export function useAssistant(
  tasks: Task[],
  notes: KnowledgeItem[],
  activeTaskId: string | null,
  onApplySuggestedTask?: (task: SuggestedTaskItem) => void,
  onActivateTaskInPomodoro?: (taskId: string) => void
) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('chronomind_assistant_messages_v1');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveMessagesToStorage = (updated: ChatMessage[]) => {
    try {
      localStorage.setItem('chronomind_assistant_messages_v1', JSON.stringify(updated.slice(-30)));
    } catch (e) {
      console.warn('[useAssistant] Failed to save messages:', e);
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedWithUser = [...messages, userMessage];
    setMessages(updatedWithUser);
    saveMessagesToStorage(updatedWithUser);
    setIsLoading(true);
    setError(null);

    try {
      const response = await AssistantApiService.sendMessage(
        trimmed,
        tasks,
        notes,
        activeTaskId
      );

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        suggestedTasks: response.suggestedTasks,
        focusTaskId: response.focusTaskId,
        searchedNotesMatches: response.searchedNotesMatches,
        source: response.source || 'gemini',
      };

      const finalMessages = [...updatedWithUser, assistantMessage];
      setMessages(finalMessages);
      saveMessagesToStorage(finalMessages);

      if (response.focusTaskId && onActivateTaskInPomodoro) {
        onActivateTaskInPomodoro(response.focusTaskId);
      }
    } catch (err: unknown) {
      console.error('[useAssistant] API error:', err);
      const errorMessageText = err instanceof Error ? err.message : 'Wystąpił problem z połączeniem z asystentem.';
      setError(errorMessageText);

      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Przepraszam, wystąpił chwilowy problem z siecią. Możesz dodać zadanie ręcznie lub skorzystać z gotowych sugestii poniżej.`,
        timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        source: 'rule-engine',
      };

      const finalMessages = [...updatedWithUser, fallbackMsg];
      setMessages(finalMessages);
      saveMessagesToStorage(finalMessages);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, tasks, notes, activeTaskId, onActivateTaskInPomodoro]);

  const clearChatHistory = useCallback(() => {
    setMessages(INITIAL_CHAT_MESSAGES);
    saveMessagesToStorage(INITIAL_CHAT_MESSAGES);
  }, []);

  const handleApplySuggestedTask = useCallback((taskItem: SuggestedTaskItem) => {
    if (onApplySuggestedTask) {
      onApplySuggestedTask(taskItem);
    }
  }, [onApplySuggestedTask]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChatHistory,
    handleApplySuggestedTask,
  };
}
