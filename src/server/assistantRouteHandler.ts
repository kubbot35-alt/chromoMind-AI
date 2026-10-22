import type { IncomingMessage, ServerResponse } from 'http';
import { aiClient, hasGeminiApiKey } from './geminiClient.ts';

interface ChatRequestBody {
  message: string;
  tasks?: Array<{ id: string; title: string; status: string; priority: string; estimatedPomodoros: number }>;
  notes?: Array<{ id: string; title: string; content: string; category: string }>;
  activeTaskId?: string | null;
}

export function assistantApiMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
  if (req.url === '/api/assistant/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      res.setHeader('Content-Type', 'application/json');
      try {
        const parsed: ChatRequestBody = JSON.parse(body || '{}');
        const userPrompt = parsed.message || '';
        const tasksContext = parsed.tasks || [];
        const notesContext = parsed.notes || [];
        const activeTaskId = parsed.activeTaskId || null;

        if (hasGeminiApiKey) {
          try {
            const systemPrompt = `Jesteś zaawansowanym osobistym asystentem produktywności "ChronoMind AI" wspierającym użytkownika w:
1. Planowaniu i dekompozycji zadań (ustalanie priorytetów, szacowanie liczby sesji Pomodoro 25-minutowych).
2. Zarządzaniu czasem i skupieniem (wskazywanie zadań do uruchomienia timera Pomodoro).
3. Błyskawicznym wyszukiwaniu informacji i syntezie wiedzy z bazy notatek użytkownika.

Bieżący kontekst użytkownika:
- Istniejące zadania: ${JSON.stringify(tasksContext.slice(0, 15))}
- Zapisane notatki / baza wiedzy: ${JSON.stringify(notesContext.slice(0, 15))}
- Aktualne aktywne zadanie w Pomodoro: ${activeTaskId ? JSON.stringify(tasksContext.find(t => t.id === activeTaskId)) : 'Brak aktywnego zadania'}

Instrukcje dotyczące odpowiedzi:
Zwróć odpowiedź WYŁĄCZNIE w formacie JSON (bez bloków markdown z potrójnymi apostrofami, sam czysty obiekt JSON) o następującej strukturze:
{
  "reply": "Twoja zwięzła, profesjonalna i uprzejma odpowiedź po polsku",
  "suggestedTasks": [
    {
      "title": "Tytuł zadania",
      "priority": "low" | "medium" | "high",
      "estimatedPomodoros": liczba (1-6)
    }
  ],
  "focusTaskId": "opcjonalne ID istniejącego zadania, jeśli użytkownik chciał je aktywować w Pomodoro",
  "searchedNotesMatches": [
    "opcjonalne ID pasujących notatek"
  ]
}
Jeśli użytkownik prosi o zaplanowanie czegoś, dodaj konkretne propozycje do "suggestedTasks".
Jeśli zadaje pytanie o wiedzę, odpowiedz na podstawie notatek lub ogólnej wiedzy merytorycznej.`;

            const aiResponse = await aiClient.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: userPrompt,
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: 'application/json',
                temperature: 0.7,
              },
            });

            const text = aiResponse.text || '{}';
            try {
              const data = JSON.parse(text);
              res.statusCode = 200;
              res.end(JSON.stringify({
                reply: data.reply || 'Przeanalizowałem Twoje zapytanie.',
                suggestedTasks: Array.isArray(data.suggestedTasks) ? data.suggestedTasks : [],
                focusTaskId: data.focusTaskId || null,
                searchedNotesMatches: Array.isArray(data.searchedNotesMatches) ? data.searchedNotesMatches : [],
                source: 'gemini'
              }));
              return;
            } catch {
              // fallback if json parse of Gemini output fails
              res.statusCode = 200;
              res.end(JSON.stringify({
                reply: text,
                suggestedTasks: [],
                source: 'gemini'
              }));
              return;
            }
          } catch (geminiError) {
            console.warn('[ChronoMind AI] Gemini API fallback used:', geminiError);
          }
        }

        // Heuristic fallback rule engine if key is not set or network unavailable
        const lower = userPrompt.toLowerCase();
        let reply = '';
        const suggestedTasks: Array<{ title: string; priority: 'low' | 'medium' | 'high'; estimatedPomodoros: number }> = [];
        let focusTaskId: string | null = null;
        const searchedNotesMatches: string[] = [];

        // Search matching notes
        for (const note of notesContext) {
          if (lower.includes(note.title.toLowerCase()) || lower.split(' ').some(w => w.length > 3 && note.content.toLowerCase().includes(w))) {
            searchedNotesMatches.push(note.id);
          }
        }

        if (lower.includes('planuj') || lower.includes('zadanie') || lower.includes('dodaj') || lower.includes('zrób') || lower.includes('projekt')) {
          reply = `Przeanalizowałem Twoje plany. Przygotowałem propozycje zadań z podziałem na sesje Pomodoro, aby ułatwić realizację krok po kroku.`;
          if (lower.includes('raport') || lower.includes('prezentacj')) {
            suggestedTasks.push(
              { title: 'Zebranie kluczowych danych i wstępny szkic', priority: 'high', estimatedPomodoros: 2 },
              { title: 'Opracowanie podsumowania i wniosków', priority: 'medium', estimatedPomodoros: 2 },
              { title: 'Korekta i formatowanie finalnego dokumentu', priority: 'low', estimatedPomodoros: 1 }
            );
          } else if (lower.includes('kod') || lower.includes('programow') || lower.includes('aplikacj') || lower.includes('refaktor')) {
            suggestedTasks.push(
              { title: 'Analiza architektury i projekt interfejsów', priority: 'high', estimatedPomodoros: 2 },
              { title: 'Implementacja logiki domenowej (SRP)', priority: 'high', estimatedPomodoros: 3 },
              { title: 'Testy jednostkowe i weryfikacja poprawności', priority: 'medium', estimatedPomodoros: 2 }
            );
          } else {
            suggestedTasks.push(
              { title: `Doprecyzowanie założeń: ${userPrompt.slice(0, 35)}...`, priority: 'high', estimatedPomodoros: 1 },
              { title: 'Główny blok roboczy (Deep Work)', priority: 'high', estimatedPomodoros: 2 },
              { title: 'Przegląd wyników i podsumowanie', priority: 'low', estimatedPomodoros: 1 }
            );
          }
        } else if (lower.includes('pomodoro') || lower.includes('skup') || lower.includes('czas') || lower.includes('zacznij')) {
          const firstTodo = tasksContext.find(t => t.status !== 'completed');
          if (firstTodo) {
            focusTaskId = firstTodo.id;
            reply = `Ustawiłem zadanie "${firstTodo.title}" jako aktywne w liczniku Pomodoro. Kliknij 'Start', aby rozpocząć 25-minutowy blok głębokiego skupienia.`;
          } else {
            reply = `Twój zegar Pomodoro jest gotowy. Wybierz lub utwórz najpierw zadanie, aby powiązać z nim sesję skupienia.`;
          }
        } else if (lower.includes('szukaj') || lower.includes('notatk') || lower.includes('wiedz') || searchedNotesMatches.length > 0) {
          if (searchedNotesMatches.length > 0) {
            const matchedTitles = notesContext
              .filter(n => searchedNotesMatches.includes(n.id))
              .map(n => `"${n.title}"`)
              .join(', ');
            reply = `Znalazłem powiązane materiały w Twojej bazie wiedzy: ${matchedTitles}. Zapoznaj się z nimi w panelu Bazy Wiedzy.`;
          } else {
            reply = `Przeszukałem bazę wiedzy. Nie znalazłem bezpośredniego dopasowania do tego hasła, ale możesz zapisać nowe ustalenia jako notatkę za pomocą przycisku w panelu.`;
          }
        } else {
          reply = `Cześć! Jestem Twoim asystentem ChronoMind. Pomogę Ci rozpisać zadania na interwały Pomodoro, zoptymalizować plan dnia oraz wyszukać informacje w Twoich notatkach. W czym mogę pomóc?`;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({
          reply,
          suggestedTasks,
          focusTaskId,
          searchedNotesMatches,
          source: 'rule-engine'
        }));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Błąd przetwarzania zapytania asystenta' }));
      }
    });
    return;
  }
  next();
}
