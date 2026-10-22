# ChronoMind AI – Asystent Produktywności, Planowania i Bazy Wiedzy

Aplikacja hybrydowego pulpitu produktywności łącząca inteligentnego asystenta AI z interaktywnym planerem zadań, zintegrowanym zegarem Pomodoro oraz semantyczną bazą wiedzy, zbudowana w rygorze SOLID, SRP oraz modularnej architektury *package by feature*.

### User Review & Critical Decisions

> [!IMPORTANT]
> Na podstawie Twoich odpowiedzi w etapie doprecyzowania wymagań ustaliliśmy następujące kluczowe decyzje:
> - **Model interakcji**: Hybrydowy pulpit roboczy z asystentem czatowym i interaktywnym planerem (dwukolumnowy układ z pełną synchronizacją stanu).
> - **Wyszukiwanie i wiedza**: Inteligentne przeszukiwanie bazy notatek i wiedzy użytkownika wraz z generowaniem syntezy odpowiedzi przez asystenta AI.
> - **Zarządzanie czasem**: Licznik Pomodoro bezpośrednio połączony z aktywnym zadaniem (sesje skupienia, zliczanie interwałów, rejestracja postępów).
> - **Zasady inżynieryjne**: Rygorystyczny podział SOLID (Single Responsibility Principle na poziomie pojedynczych plików serwisów, hooków i komponentów) oraz struktura *package by feature*.

---

### 1. Overview & Core Concept

**ChronoMind AI** to centrum dowodzenia osobistą produktywnością, zaprojektowane dla profesjonalistów, programistów i twórców potrzebujących natychmiastowego przekształcania myśli i notatek w ustrukturyzowane zadania, harmonogram i skupione sesje pracy.

- **Planer zadań**: Tworzenie, dekompozycja złożonych celów na podzadania z pomocą asystenta, szacowanie czasu trwania, kategoryzacja i ustalanie priorytetów.
- **Zintegrowany Timer Pomodoro**: Połączenie aktywnego zadania z zegarem skupienia (25 min pracy / 5 min przerwy / długa przerwa), wizualny postęp, automatyczne odhaczanie sesji i statystyki czasu.
- **Inteligentna Baza Wiedzy (Knowledge Engine)**: Zapisywanie notatek, artykułów i dokumentacji oraz błyskawiczne wyszukiwanie pełnotekstowe i kontekstowe z podpowiedziami asystenta AI.
- **Asystent AI (Gemini 3.8 Flash)**: Działa w tle i w panelu czatu – potrafi na polecenie użytkownika wygenerować zadania, przypisać czas, streścić notatki oraz odpowiadać na pytania w oparciu o zebraną wiedzę.

---

### 2. User Experience & Visual Design

#### Dyscyplina kolorystyczna 60/30/10
- **60% Głęboki Granat (Deep Midnight Navy)**:
  - Tło aplikacji, boczne panele nawigacyjne, nagłówki kart, strefa skupienia: `#0A1128`, `#0E1A40`, `#14213D`.
  - Daje profesjonalny, stonowany charakter wspierający koncentrację i redukujący zmęczenie wzroku.
- **30% Czysta Biel i Jasny Kontrast (Pure White & Crisp Surfaces)**:
  - Karty robocze, tła list zadań, pola edycji i treść notatek: `#FFFFFF` oraz subtelne chłodne odcienie `#F8FAFC`.
  - Zapewnia maksymalną czytelność (standard WCAG AA 4.5:1+) dla tekstu, list i formularzy.
- **10% Żywa Pomarańcza (Vibrant Energetic Accent)**:
  - Wyrazisty akcent akcji: `#FF6B35` / `#F97316`.
  - Zastosowany wyłącznie dla kluczowych punktów akcji: przycisk "Uruchom Pomodoro", aktywny wskaźnik timera, przyciski wysyłania asystenta, aktywne filtry i checkboxy zadań.

#### Zasady Typografii i Anty-Slop
- **Typografia**: Display/Nagłówki w wyrazistym, nowoczesnym kroju `Plus Jakarta Sans` / `Outfit`; ciało tekstu w czytelnym `DM Sans` / `Public Sans`; cyfry, czas i odliczenia Pomodoro w `JetBrains Mono` / `tabular-nums` dla absolutnej stabilności siatki.
- **Zero-Pill Discipline**: Brak cukierkowych zaokrąglonych kapsułek na metadanych. Tagi, daty i czasy oddzielone subtelnymi separatorami typograficznymi (`·`, `/`).
- **Pojedyncza linia kontrolek**: Przyciski i akcje zdefiniowane z `whitespace-nowrap shrink-0` i pełną obsługą stanów interaktywnych.

---

### 3. Key Product Decisions & Trade-Offs

1. **SOLID & Single Responsibility Principle (SRP)**:
   - Każdy plik odpowiada za dokładnie jedno zadanie.
   - Osobne serwisy do komunikacji z API Gemini (`geminiService.ts`).
   - Osobne repozytoria danych z lokalną synchronizacją `localStorage` (`taskStorage.ts`, `noteStorage.ts`, `settingsStorage.ts`).
   - Dedykowane hooki domenowe z wyłączną odpowiedzialnością (`usePomodoro.ts`, `useTasks.ts`, `useKnowledgeSearch.ts`, `useAssistantChat.ts`).
   - Prezentacyjne komponenty atomowe i molekuły oddzielone od logiki biznesowej.

2. **Struktura katalogów "Package by Feature"**:
   - `src/features/tasks/`: modele, serwisy, hooki i komponenty planera zadań.
   - `src/features/pomodoro/`: silnik timera, dźwięk/powiadomienie, widok skupienia.
   - `src/features/knowledge/`: baza wiedzy, silnik wyszukiwania, notatki, filtry.
   - `src/features/assistant/`: panel asystenta AI, integracja z Gemini, interpretacja komend użytkownika (np. "Zaplanuj mi pracę na dzisiaj", "Dodaj zadanie z 2 pomodoro").
   - `src/features/shared/`: wspólne komponenty UI (nagłówek zgodny z Top Bar Contract, layout, ikony, modal, powiadomienia).

3. **Architektura AI – Bezpieczne API Server-Side**:
   - Serwer proxy Express wbudowany w środowisko (`/api/assistant/chat`, `/api/assistant/extract-tasks`), używający `@google/genai` z modelem `gemini-3.8-flash`.
   - Klucz API `GEMINI_API_KEY` pozostaje wyłącznie po stronie serwera.
   - W przypadku braku skonfigurowanego klucza API w środowisku lokalnym, asystent posiada inteligentny fallback regułowy (lokalne parsowanie komend i wyszukiwanie heurystyczne), gwarantując brak błędów.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          ChronoMind Web App                            │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar: [Logo / Nazwa] ── [Zadania | Pomodoro | Baza Wiedzy] ── [CTA]│
├──────────────────────────┬─────────────────────────────────────────────┤
│   Interaktywny Planer    │             Asystent Kontekstowy            │
│   & Moduły Robocze       │             (Panel Boczny / Czat)           │
│                          │                                             │
│  ┌────────────────────┐  │  ┌───────────────────────────────────────┐  │
│  │ Aktywny Pomodoro   │  │  │ Historia dialogu i kontekstu zadań    │  │
│  │ (połączone zadanie)│  │  │ "Dodaj zadanie Napisz raport..."     │  │
│  └────────────────────┘  │  └───────────────────────────────────────┘  │
│  ┌────────────────────┐  │  ┌───────────────────────────────────────┐  │
│  │ Lista Zadań        │  │  │ Pole wprowadzania z szybkimi akcjami  │  │
│  │ (priorytety/stany) │  │  │ [Zaplanuj dzień] [Szukaj w notatkach] │  │
│  └────────────────────┘  │  └───────────────────────────────────────┘  │
│  ┌────────────────────┐  │                                             │
│  │ Baza Wiedzy        │  │                                             │
│  │ (szybka wyszukiw.) │  │                                             │
│  └────────────────────┘  │                                             │
├──────────────────────────┴─────────────────────────────────────────────┤
│  Feature Packages: /tasks, /pomodoro, /knowledge, /assistant, /shared   │
│  Storage Layer: LocalStorage Repository + Server Proxy (/api/assistant) │
└────────────────────────────────────────────────────────────────────────┘
```

#### Encje Danych:
- `Task`: `id`, `title`, `description`, `status` (todo | in_progress | completed), `priority` (low | medium | high), `estimatedPomodoros`, `completedPomodoros`, `dueDate`, `tags`, `createdAt`.
- `PomodoroSession`: `id`, `taskId`, `type` (work | short_break | long_break), `durationSeconds`, `remainingSeconds`, `isActive`, `isPaused`, `totalCompletedSessions`.
- `KnowledgeItem`: `id`, `title`, `content`, `category`, `tags`, `updatedAt`, `source`.
- `ChatMessage`: `id`, `role` (user | assistant), `content`, `suggestedActions` (np. utworzenie zadania, przejście do Pomodoro), `timestamp`.

#### Weryfikacja i kompilacja:
- Przetestowanie działania `npm run build` oraz `compile_applet`.
- Sprawdzenie zgodności kolorów 60/30/10 oraz wytycznych Top Bar Contract i Anti-Slop.
