import { useState, useEffect, useCallback, useMemo } from 'react';
import type { KnowledgeItem, KnowledgeCategory } from '../types/knowledge.types.ts';
import { KnowledgeStorageService } from '../services/knowledgeStorageService.ts';
import { KnowledgeSearchEngine } from '../services/knowledgeSearchEngine.ts';

export function useKnowledge() {
  const [items, setItems] = useState<KnowledgeItem[]>(() => KnowledgeStorageService.loadItems());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory>('Wszystkie');

  useEffect(() => {
    KnowledgeStorageService.saveItems(items);
  }, [items]);

  const addKnowledgeItem = useCallback((itemData: {
    title: string;
    content: string;
    category?: string;
    tags?: string[];
  }) => {
    const newItem: KnowledgeItem = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: itemData.title.trim(),
      content: itemData.content.trim(),
      category: itemData.category || 'Wskazówki',
      tags: itemData.tags || ['Ogólne'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems(prev => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateKnowledgeItem = useCallback((id: string, updates: Partial<KnowledgeItem>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      )
    );
  }, []);

  const deleteKnowledgeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const filteredItems = useMemo(() => {
    return KnowledgeSearchEngine.search(items, searchQuery, selectedCategory);
  }, [items, searchQuery, selectedCategory]);

  return {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addKnowledgeItem,
    updateKnowledgeItem,
    deleteKnowledgeItem,
  };
}
