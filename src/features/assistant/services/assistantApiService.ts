import type { Task } from '../../tasks/types/task.types.ts';
import type { KnowledgeItem } from '../../knowledge/types/knowledge.types.ts';
import type { SuggestedTaskItem } from '../types/assistant.types.ts';

export interface AssistantApiResponse {
  reply: string;
  suggestedTasks?: SuggestedTaskItem[];
  focusTaskId?: string | null;
  searchedNotesMatches?: string[];
  source?: 'gemini' | 'rule-engine';
}

export class AssistantApiService {
  public static async sendMessage(
    message: string,
    tasks: Task[],
    notes: KnowledgeItem[],
    activeTaskId: string | null
  ): Promise<AssistantApiResponse> {
    const payload = {
      message,
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        estimatedPomodoros: t.estimatedPomodoros,
      })),
      notes: notes.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        category: n.category,
      })),
      activeTaskId,
    };

    const response = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Serwer zwrócił błąd: ${response.statusText}`);
    }

    return await response.json();
  }
}
