# Refaktoryzacja ChronoMind: Naturalne Zarządzanie Czasem i Realistyczne Zadania

Kompleksowy plan refaktoryzacji aplikacji mający na celu całkowite usunięcie pojęć związanych z cyklami „pomodoro”, wprowadzenie intuicyjnych jednostek czasu (minuty i godziny), wdrożenie elastycznego Timera Skupienia (Focus Timer) oraz uporządkowanie danych początkowych w nowym pliku `src/data/initialData.ts`.

### User Review & Critical Decisions

> [!IMPORTANT]
> Potwierdzone decyzje z etapu doprecyzowania:
> - **Model zegara**: Dotychczasowy sztywny mechanizm Pomodoro (25/5 min) zostaje zastąpiony **elastycznym timerem skupienia (Focus Timer)** z możliwością wyboru dowolnego czasu (15, 25, 45, 60 min lub czas dokładnie odpowiadający szacunkowi wybranego zadania).
> - **Wprowadzanie czasu trwania zadania**: Intuicyjny selektor łączący **szybkie przyciski minutowe** (15 min, 30 min, 45 min, 1h, 1.5h, 2h) z **polem własnej wartości w minutach**.
> - **Baza danych początkowych**: Nowy plik `src/data/initialData.ts` z realistycznymi zadaniami z życia codziennego (praca, dom, urząd, rozwój) o zróżnicowanych czasach od 15 minut do 2-3 godzin.

---

### 1. Overview & Core Concept

Aplikacja przekształca się w naturalny, przyjazny i elastyczny planer zadań osobistych i zawodowych:
- **Naturalny czas trwania**: Każde zadanie posiada czytelny szacowany czas (`estimatedMinutes`) oraz licznik zarejestrowanego czasu (`spentMinutes`), prezentowane w czytelnym formacie (np. „45 min”, „1h 15 min”).
- **Elastyczny Focus Timer**: Zegar skupienia pozwala na uruchomienie odliczania dopasowanego do aktualnego zadania lub wybranego bloku czasu, bez narzucania sztywnych przerw.
- **Baza wiedzy i asystent**: Asystent AI i wyszukiwarka zostają zaktualizowane tak, aby operować wyłącznie na minutach i godzinach.

---

### 2. User Experience & Visual Design

#### UI i Formularze Zadań
- **Wybór czasu w formularzu**:
  - Pasek szybkich kafelków wyboru: `15m`, `30m`, `45m`, `1h (60m)`, `1.5h (90m)`, `2h (120m)`.
  - Opcja wpisania dowolnej liczby minut z klawiatury dla nietypowych zadań.
- **Karty zadań (Zero-Pill)**:
  - Format metadanych: `Praca · Szacunek: 45 min · Przepracowano: 15 min · Termin: 24 paź`.
  - Wskaźnik postępu czasu (pasek lub tekstowa proporcja).
- **Górny pasek nawigacji**:
  - Etykiety: `Planer zadań`, `Zegar skupienia`, `Baza wiedzy`, `Asystent AI`.
- **Kolorystyka 60/30/10**:
  - Zachowanie 60% głębokiego granatu (`#0A1128`), 30% czystej bieli dla kart i formularzy, 10% żywej pomarańczy (`#FF6B35`) dla akcji głównych.

---

### 3. Key Product Decisions & Trade-Offs

1. **Struktura danych początkowych (`src/data/initialData.ts`)**:
   - Usunięcie fikcyjnych danych.
   - Wprowadzenie 6-8 autentycznych zadań z różnych sfer życia:
     - *Urzędowe*: Złożenie wniosku o dowód osobisty przez ePUAP (20 min, wysoki priorytet)
     - *Praca*: Podsumowanie ustaleń po spotkaniu projektowym (45 min, średni priorytet)
     - *Praca*: Przygotowanie oferty dla klienta i zestawienie kosztów (90 min, wysoki priorytet)
     - *Dom*: Zamówienie filtrów do wody i środków czystości (15 min, niski priorytet)
     - *Dom*: Umówienie przeglądu technicznego samochodu (15 min, średni priorytet)
     - *Zdrowie*: Trening ogólnorozwojowy i rozciąganie (45 min, niski priorytet)
     - *Rozwój*: Lektura artykułu o architekturze aplikacji internetowych (30 min, niski priorytet)
2. **Architektura Focus Timer (`src/features/focusTimer`)**:
   - Zmiana nazwy pakietu `pomodoro` na `focusTimer` lub refaktoryzacja w ramach tej samej ścieżki z czystym API.
   - Zastąpienie sztywnego stanu `work | short_break | long_break` elastycznym trybem `focus` z konfigurowalnym czasem trwania (15m, 25m, 45m, 60m lub czas zadania).
3. **Aktualizacja promptu i silnika asystenta AI**:
   - Zmiana definicji w `src/server/assistantRouteHandler.ts` oraz `src/features/assistant`:
   - Zamiast `estimatedPomodoros: number` -> `estimatedMinutes: number`.
   - Podpowiedzi asystenta generują zadania w naturalnych minutach (np. 15, 30, 45, 60 min).

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ChronoMind Refactored Architecture              │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar: [Logo] ── [Zadania | Zegar Skupienia | Baza Wiedzy] ── [CTA] │
├──────────────────────────┬─────────────────────────────────────────────┤
│   Interaktywny Planer    │             Asystent Kontekstowy            │
│   (Czas w minutach/godz) │             (Czas w min/godz)               │
│                          │                                             │
│  ┌────────────────────┐  │  ┌───────────────────────────────────────┐  │
│  │ Zegar Skupienia    │  │  │ Czat i sugestie zadań w minutach      │  │
│  │ (15m/30m/45m/zad.) │  │  │ "Dodaj zadanie Złóż wniosek (20m)"    │  │
│  └────────────────────┘  │  └───────────────────────────────────────┘  │
│  ┌────────────────────┐  │  ┌───────────────────────────────────────┐  │
│  │ Zadania z realnymi │  │  │ Szybkie prompty i wyszukiwanie        │  │
│  │ czasami i deadlin. │  │  └───────────────────────────────────────┘  │
│  └────────────────────┘  │                                             │
├──────────────────────────┴─────────────────────────────────────────────┤
│  Data Layer: src/data/initialData.ts (realistyczne zadania i notatki)  │
│  Feature Packages: /tasks, /focusTimer, /knowledge, /assistant         │
└────────────────────────────────────────────────────────────────────────┘
```

#### Kluczowe Encje po refaktoryzacji:
- `Task`:
  - `id: string`
  - `title: string`
  - `description: string`
  - `status: 'todo' | 'in_progress' | 'completed'`
  - `priority: 'low' | 'medium' | 'high'`
  - `estimatedMinutes: number` (np. 15, 30, 45, 60, 90, 120)
  - `spentMinutes: number` (przepracowany czas w minutach)
  - `dueDate: string` (format YYYY-MM-DD)
  - `category: string`
  - `createdAt: string`, `updatedAt: string`

- `FocusTimer`:
  - `remainingSeconds: number`
  - `totalDurationSeconds: number`
  - `isRunning: boolean`
  - `activeTaskId: string | null`
  - `presetMinutes: number[]` ([15, 25, 45, 60])

#### Plan wdrożenia krok po kroku:
1. Utworzenie `src/data/initialData.ts` z realistycznymi danymi testowymi.
2. Zaktualizowanie typów zadań (`task.types.ts`) i asystenta (`assistant.types.ts`) na `estimatedMinutes` i `spentMinutes`.
3. Zaktualizowanie repozytoriów, serwisów filtrujących i hooka `useTasks.ts`.
4. Przekształcenie modułu Pomodoro w elastyczny `FocusTimer` (hook `useFocusTimer.ts`, komponenty zegara skupienia).
5. Dostosowanie formularzy `TaskQuickAddModal.tsx` i widoku `TaskItem.tsx` z intuicyjnym selektorem minut.
6. Zaktualizowanie backendu asystenta `src/server/assistantRouteHandler.ts` do operowania na minutach.
7. Weryfikacja za pomocą `compile_applet` i `lint_applet`.
