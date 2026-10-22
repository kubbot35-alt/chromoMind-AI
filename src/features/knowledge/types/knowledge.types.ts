export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type KnowledgeCategory = 'Architektura' | 'Zarządzanie czasem' | 'Procedury' | 'Wskazówki' | 'Wszystkie';
