export interface SuggestedTaskItem {
  title: string;
  priority: 'low' | 'medium' | 'high';
  estimatedPomodoros: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedTasks?: SuggestedTaskItem[];
  focusTaskId?: string | null;
  searchedNotesMatches?: string[];
  source?: 'gemini' | 'rule-engine';
}
