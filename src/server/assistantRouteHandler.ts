import type { IncomingMessage, ServerResponse } from 'http';
import { aiClient, hasGeminiApiKey } from './geminiClient.ts';

interface ChatRequestBody {
  message: string;
  tasks?: Array<{ id: string; title: string; status: string; priority: string; estimatedMinutes: number; spentMinutes: number }>;
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
1. Planowaniu i dekompozycji zadań (ustalanie priorytetów oraz szacowanie realistycznego czasu trwania w minutach, np. 15, 30, 45, 60, 90 min).
2. Zarządzaniu czasem i skupieniem (wskazywanie zadań do uruchomienia sesji skupienia).
3. Błyskawicznym wyszukiwaniu informacji i syntezie wiedzy z bazy notatek użytkownika.

Bieżący kontekst użytkownika:
- Istniejące zadania: ${JSON.stringify(tasksContext.slice(0, 15))}
- Zapisane notatki / baza wiedzy: ${JSON.stringify(notesContext.slice(0, 15))}
- Aktualne aktywne zadanie: ${activeTaskId ? JSON.stringify(tasksContext.find(t => t.id === activeTaskId)) : 'Brak aktywnego zadania'}

Instrukcje dotyczące odpowiedzi:
Zwróć odpowiedź WYŁĄCZNIE w formacie JSON (bez bloków markdown z potrójnymi apostrofami, sam czysty obiekt JSON) o następującej strukturze:
{
  "reply": "Twoja zwięzła, profesjonalna i uprzejma odpowiedź po polsku",
  "suggestedTasks": [
    {
      "title": "Tytuł zadania",
      "priority": "low" | "medium" | "high",
      "estimatedMinutes": liczba minut (np. 15, 30, 45, 60, 90)
    }
  ],
  "focusTaskId": "opcjonalne ID istniejącego zadania, jeśli użytkownik chciał je aktywować w zegarze skupienia",
  "searchedNotesMatches": [
    "opcjonalne ID pasujących notatek"
  ]
}
Jeśli użytkownik prosi o zaplanowanie czegoś, dodaj konkretne propozycje do "suggestedTasks" z realnym czasem w minutach.
Nie używaj słowa 'pomodoro' ani nienaturalnych liczników bloków; operuj wyłącznie na minutach i godzinach.`;

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

        // Heuristic fallback rule engine without any pomodoro jargon
        const lower = userPrompt.toLowerCase();
        let reply = '';
        const suggestedTasks: Array<{ title: string; priority: 'low' | 'medium' | 'high'; estimatedMinutes: number }> = [];
        let focusTaskId: string | null = null;
        const searchedNotesMatches: string[] = [];

        // Search matching notes
        for (const note of notesContext) {
          if (lower.includes(note.title.toLowerCase()) || lower.split(' ').some(w => w.length > 3 && note.content.toLowerCase().includes(w))) {
            searchedNotesMatches.push(note.id);
          }
        }

        if (lower.includes('planuj') || lower.includes('zadanie') || lower.includes('dodaj') || lower.includes('zrób') || lower.includes('projekt')) {
          reply = `Przeanalizowałem Twoje plany i przygotowałem propozycje zadań z oszacowanym czasem trwania w minutach, aby ułatwić ich realizację.`;
          if (lower.includes('urząd') || lower.includes('formalno') || lower.includes('wniosek') || lower.includes('podat')) {
            suggestedTasks.push(
              { title: 'Pobranie i wypełnienie formularza wniosku', priority: 'high', estimatedMinutes: 20 },
              { title: 'Dołączenie wymaganych załączników i podpis Profilem Zaufanym', priority: 'high', estimatedMinutes: 15 },
              { title: 'Pobranie potwierdzenia wysyłki (UPP) i archiwizacja', priority: 'low', estimatedMinutes: 10 }
            );
          } else if (lower.includes('dom') || lower.includes('porządk') || lower.includes('zakup')) {
            suggestedTasks.push(
              { title: 'Przygotowanie listy zakupów lub planu porządków', priority: 'medium', estimatedMinutes: 15 },
              { title: 'Główna realizacja spraw domowych', priority: 'medium', estimatedMinutes: 45 },
              { title: 'Krótkie podsumowanie i odhaczenie zadań', priority: 'low', estimatedMinutes: 15 }
            );
          } else {
            suggestedTasks.push(
              { title: `Doprecyzowanie celu: ${userPrompt.slice(0, 35)}...`, priority: 'high', estimatedMinutes: 20 },
              { title: 'Główny blok realizacji (skupienie)', priority: 'high', estimatedMinutes: 45 },
              { title: 'Weryfikacja efektów i podsumowanie', priority: 'low', estimatedMinutes: 15 }
            );
          }
        } else if (lower.includes('skup') || lower.includes('stoper') || lower.includes('timer') || lower.includes('czas') || lower.includes('zacznij')) {
          const firstTodo = tasksContext.find(t => t.status !== 'completed');
          if (firstTodo) {
            focusTaskId = firstTodo.id;
            reply = `Ustawiłem zadanie "${firstTodo.title}" jako aktywne w zegarze skupienia. Możesz rozpocząć pracę nad nim z poziomu widoku skupienia.`;
          } else {
            reply = `Twój zegar skupienia jest gotowy. Wybierz lub utwórz najpierw zadanie, aby powiązać z nim sesję pracy.`;
          }
        } else if (lower.includes('szukaj') || lower.includes('notatk') || lower.includes('wiedz') || searchedNotesMatches.length > 0) {
          if (searchedNotesMatches.length > 0) {
            const matchedTitles = notesContext
              .filter(n => searchedNotesMatches.includes(n.id))
              .map(n => `"${n.title}"`)
              .join(', ');
            reply = `Znalazłem powiązane materiały w Twojej bazie wiedzy: ${matchedTitles}. Możesz je przejrzeć w zakładce Baza Wiedzy.`;
          } else {
            reply = `Przeszukałem bazę wiedzy. Nie znalazłem bezpośredniego dopasowania do tego hasła, ale możesz zapisać nowe ustalenia jako notatkę w sekcji Baza Wiedzy.`;
          }
        } else {
          reply = `Cześć! Jestem Twoim asystentem ChronoMind. Pomogę Ci rozpisać zadania z realnym czasem trwania (minuty, godziny), zaplanować priorytety oraz wyszukać informacje w notatkach. W czym mogę pomóc?`;
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
