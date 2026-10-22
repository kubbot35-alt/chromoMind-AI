import type { Task } from '../../tasks/types/task.types.ts';
import type { KnowledgeItem } from '../../knowledge/types/knowledge.types.ts';
import type { ChatMessage } from '../../assistant/types/assistant.types.ts';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Refaktoryzacja modułu autoryzacji zgodnie z SRP',
    description: 'Wydzielenie walidacji tokenu do osobnego serwisu oraz redukcja sprzężeń w kontrolerze.',
    status: 'in_progress',
    priority: 'high',
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    category: 'Architektura',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Przygotowanie raportu kwartalnego i metryk wydajności',
    description: 'Zestawienie czasów odpowiedzi API, wskaźnika dostępności oraz podsumowanie zadań zespołu.',
    status: 'todo',
    priority: 'medium',
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    category: 'Zarządzanie',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Przegląd dokumentacji API i bazy wiedzy zespołu',
    description: 'Aktualizacja endpointów w OpenAPI i weryfikacja poprawności przykładów wywołań curl.',
    status: 'todo',
    priority: 'low',
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 10),
    category: 'Dokumentacja',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Konfiguracja polityki cache dla zapytań o wiedzę',
    description: 'Optymalizacja czasu odpowiedzi wyszukiwarki za pomocą mechanizmu LRU w pamięci lokalnej.',
    status: 'completed',
    priority: 'high',
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString().slice(0, 10),
    category: 'Wydajność',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'note-1',
    title: 'Zasada Pojedynczej Odpowiedzialności (SRP) w praktyce',
    content: 'Pojedyncza klasa lub plik powinien mieć tylko jeden powód do zmiany. Oddzielamy logikę pobierania danych (repozytoria) od logiki biznesowej (serwisy) oraz warstwy widoku (komponenty prezentacyjne).',
    category: 'Architektura',
    tags: ['SOLID', 'Architektura', 'Czysty Kod'],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'Technika Pomodoro i głęboka praca (Deep Work)',
    content: 'Standardowy interwał: 25 minut nieprzerwanej pracy w skupieniu, a następnie 5 minut regeneracyjnej przerwy bez ekranu. Po 4 sesjach przypada długa przerwa trwająca 15-30 minut.',
    category: 'Zarządzanie czasem',
    tags: ['Produktywność', 'Pomodoro', 'Skupienie'],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-3',
    title: 'Procedura tworzenia wydań i testów regresyjnych',
    content: 'Przed wdrożeniem produkcyjnym należy: 1. Uruchomić pełny linter i testy typów (tsc), 2. Zweryfikować migracje bazodanowe, 3. Sprawdzić logi wydajności endpointów /api.',
    category: 'Procedury',
    tags: ['DevOps', 'CI/CD', 'Wdrożenia'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-4',
    title: 'Dyscyplina kolorystyczna 60/30/10 w UI',
    content: '60% powierzchni to dominujący kolor tła (głęboki granat w motywie nocnym), 30% to czysta biel i powierzchnie strukturalne kart, a 10% to dynamiczny akcent żywej pomarańczy na głównych elementach akcji (CTA, aktywne wskaźniki).',
    category: 'Wskazówki',
    tags: ['Design System', 'UI/UX', '60-30-10'],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Witaj w ChronoMind AI! Jestem Twoim osobistym asystentem produktywności. Mogę pomóc Ci zaplanować zadania na dziś, podpowiedzieć liczbę sesji Pomodoro, aktywować zadanie w zegarze lub wyszukać informacje w Twojej bazie wiedzy. W czym mogę Ci teraz pomóc?',
    timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    source: 'gemini',
  },
];
