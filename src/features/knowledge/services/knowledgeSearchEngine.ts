import type { KnowledgeItem, KnowledgeCategory } from '../types/knowledge.types.ts';

export class KnowledgeSearchEngine {
  public static search(
    items: KnowledgeItem[],
    query: string,
    category: KnowledgeCategory
  ): KnowledgeItem[] {
    let result = [...items];

    if (category !== 'Wszystkie') {
      result = result.filter(item => item.category === category);
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return result;
    }

    const searchTerms = trimmed.split(/\s+/).filter(Boolean);

    return result.filter(item => {
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      const tagsJoined = item.tags.join(' ').toLowerCase();

      // Match all terms
      return searchTerms.every(term =>
        titleLower.includes(term) ||
        contentLower.includes(term) ||
        tagsJoined.includes(term)
      );
    });
  }
}
