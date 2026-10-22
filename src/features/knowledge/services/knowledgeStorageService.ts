import type { KnowledgeItem } from '../types/knowledge.types.ts';
import { INITIAL_KNOWLEDGE_ITEMS } from '../../shared/constants/defaultData.ts';

const STORAGE_KEY = 'chronomind_knowledge_v1';

export class KnowledgeStorageService {
  public static loadItems(): KnowledgeItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveItems(INITIAL_KNOWLEDGE_ITEMS);
        return INITIAL_KNOWLEDGE_ITEMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_KNOWLEDGE_ITEMS;
    }
  }

  public static saveItems(items: KnowledgeItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('[KnowledgeStorageService] Failed to save knowledge items:', e);
    }
  }
}
