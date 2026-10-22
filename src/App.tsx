import React, { useState, useCallback } from 'react';
import type { ActiveTab, ToastNotification } from './features/shared/types/shared.types.ts';
import type { SuggestedTaskItem } from './features/assistant/types/assistant.types.ts';
import type { KnowledgeItem } from './features/knowledge/types/knowledge.types.ts';

import { TopNavBar } from './features/shared/components/TopNavBar.tsx';
import { SectionHeader } from './features/shared/components/SectionHeader.tsx';
import { NotificationToast } from './features/shared/components/NotificationToast.tsx';

import { useTasks } from './features/tasks/hooks/useTasks.ts';
import { TaskList } from './features/tasks/components/TaskList.tsx';
import { TaskFilterBar } from './features/tasks/components/TaskFilterBar.tsx';
import { TaskStatistics } from './features/tasks/components/TaskStatistics.tsx';
import { TaskQuickAddModal } from './features/tasks/components/TaskQuickAddModal.tsx';

import { usePomodoro } from './features/pomodoro/hooks/usePomodoro.ts';
import { PomodoroWidget } from './features/pomodoro/components/PomodoroWidget.tsx';

import { useKnowledge } from './features/knowledge/hooks/useKnowledge.ts';
import { KnowledgeSearchBar } from './features/knowledge/components/KnowledgeSearchBar.tsx';
import { KnowledgeList } from './features/knowledge/components/KnowledgeList.tsx';
import { KnowledgeAddModal } from './features/knowledge/components/KnowledgeAddModal.tsx';

import { useAssistant } from './features/assistant/hooks/useAssistant.ts';
import { AssistantDrawer } from './features/assistant/components/AssistantDrawer.tsx';

import { Plus, Sparkles, BookOpen, Clock, CheckSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((message: string, type: ToastNotification['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Tasks Domain Hook
  const {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    searchQuery: taskSearchQuery,
    setSearchQuery: setTaskSearchQuery,
    sortBy,
    setSortBy,
    addTask,
    deleteTask,
    toggleTaskStatus,
    incrementTaskPomodoro,
    taskStats,
  } = useTasks();

  // Pomodoro Domain Hook
  const {
    mode: pomodoroMode,
    isRunning: isPomodoroRunning,
    formattedTime: pomodoroTime,
    progressRatio: pomodoroProgress,
    completedSessionsCount,
    activeTaskId,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode: switchPomodoroMode,
    selectActiveTask,
  } = usePomodoro({
    onSessionComplete: (mode, taskId) => {
      if (mode === 'work') {
        if (taskId) {
          incrementTaskPomodoro(taskId);
          const taskObj = tasks.find(t => t.id === taskId);
          addToast(
            `Ukończono sesję Pomodoro dla zadania: "${taskObj?.title || 'Zadanie'}"!`,
            'success'
          );
        } else {
          addToast('Ukończono 25-minutową sesję pracy!', 'success');
        }
      } else {
        addToast('Koniec przerwy! Czas na kolejny blok skupienia.', 'info');
      }
    },
  });

  // Knowledge Base Domain Hook
  const {
    items: knowledgeItems,
    filteredItems: filteredKnowledgeItems,
    searchQuery: knowledgeSearchQuery,
    setSearchQuery: setKnowledgeSearchQuery,
    selectedCategory: knowledgeCategory,
    setSelectedCategory: setKnowledgeCategory,
    addKnowledgeItem,
    deleteKnowledgeItem,
  } = useKnowledge();

  // Assistant Domain Hook
  const handleApplySuggestedTask = useCallback(
    (suggested: SuggestedTaskItem) => {
      addTask({
        title: suggested.title,
        priority: suggested.priority,
        estimatedPomodoros: suggested.estimatedPomodoros,
        category: 'Od Asystenta',
      });
      addToast(`Dodano zadanie "${suggested.title}" do planera.`, 'success');
    },
    [addTask, addToast]
  );

  const handleActivateTaskInPomodoro = useCallback(
    (taskId: string) => {
      selectActiveTask(taskId);
      setActiveTab('pomodoro');
      addToast('Zadanie podpięte do zegara Pomodoro.', 'info');
    },
    [selectActiveTask, addToast]
  );

  const {
    messages,
    isLoading: isAssistantLoading,
    sendMessage: sendAssistantMessage,
    clearChatHistory,
  } = useAssistant(
    tasks,
    knowledgeItems,
    activeTaskId,
    handleApplySuggestedTask,
    handleActivateTaskInPomodoro
  );

  const activePomodoroTask = tasks.find(t => t.id === activeTaskId);

  const handleAskAssistantAboutKnowledge = (item: KnowledgeItem) => {
    setActiveTab('assistant');
    sendAssistantMessage(`Wyjaśnij i podaj praktyczne przykłady dla notatki: "${item.title}". Treść: ${item.content}`);
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-slate-100 flex flex-col font-sans">
      {/* Strict Top Bar Contract Header */}
      <TopNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickAddTask={() => setIsTaskModalOpen(true)}
        activePomodoroTaskTitle={activePomodoroTask?.title}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: Tasks / Hybrid Workspace */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <SectionHeader
              title="Planer Zadań i Deep Work"
              description="Organizuj zadania z dekompozycją na interwały Pomodoro, ustalaj priorytety i realizuj pracę w skupieniu."
              action={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('assistant')}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-[#14213D] hover:bg-[#1A2D61] text-slate-200 border border-[#1A2D61] rounded-lg transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                    <span className="hidden sm:inline">Zapytaj asystenta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#FF6B35] hover:bg-[#F0551E] rounded-lg shadow-sm shadow-[#FF6B35]/25 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Dodaj zadanie</span>
                  </button>
                </div>
              }
            />

            {/* Statistics Row */}
            <TaskStatistics stats={taskStats} />

            {/* Two-Column Hybrid Desktop View: Tasks List + Contextual Assistant Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Tasks (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-4">
                <TaskFilterBar
                  filter={filter}
                  onFilterChange={setFilter}
                  searchQuery={taskSearchQuery}
                  onSearchChange={setTaskSearchQuery}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />

                <TaskList
                  tasks={filteredTasks}
                  activeTaskId={activeTaskId}
                  onToggleStatus={toggleTaskStatus}
                  onDelete={deleteTask}
                  onActivateInPomodoro={handleActivateTaskInPomodoro}
                  onOpenCreateModal={() => setIsTaskModalOpen(true)}
                  hasFilterActive={filter !== 'all' || Boolean(taskSearchQuery.trim())}
                />
              </div>

              {/* Right Column: Assistant (5 cols on lg) */}
              <div className="lg:col-span-5 sticky top-20">
                <AssistantDrawer
                  messages={messages}
                  isLoading={isAssistantLoading}
                  onSendMessage={sendAssistantMessage}
                  onClearHistory={clearChatHistory}
                  onApplySuggestedTask={handleApplySuggestedTask}
                  onActivateTaskInPomodoro={handleActivateTaskInPomodoro}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Pomodoro Focus View */}
        {activeTab === 'pomodoro' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <SectionHeader
              title="Zegar Skupienia Pomodoro"
              description="25 minut nieprzerwanej pracy nad wybranym zadaniem, 5 minut regeneracji. Każdy ukończony cykl automatycznie aktualizuje postęp powiązanego zadania."
            />

            <PomodoroWidget
              mode={pomodoroMode}
              isRunning={isPomodoroRunning}
              formattedTime={pomodoroTime}
              progressRatio={pomodoroProgress}
              completedSessionsCount={completedSessionsCount}
              activeTaskId={activeTaskId}
              tasks={tasks}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onSwitchMode={switchPomodoroMode}
              onSelectTask={selectActiveTask}
              onCompleteTask={taskId => {
                toggleTaskStatus(taskId);
                addToast('Oznaczono zadanie jako ukończone!', 'success');
              }}
            />

            {/* Quick Helper Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#0E1A40] border border-[#1A2D61]">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  1. Wybierz cel
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Podepnij pojedyncze zadanie z listy, aby skupić uwagę na jednym priorytecie.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0E1A40] border border-[#1A2D61]">
                <h4 className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider mb-1">
                  2. Głęboka praca
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pracuj przez 25 minut bez sprawdzania poczty, mediów i rozpraszaczy.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0E1A40] border border-[#1A2D61]">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  3. Odpoczynek
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Po sygnale dźwiękowym odejdź od ekranu na 5 minut, rozciągnij się i nawodnij.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Knowledge Base View */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <SectionHeader
              title="Baza Wiedzy i Notatek"
              description="Szybkie wyszukiwanie materiałów, procedur i dobrych praktyk. Asystent AI wykorzystuje te materiały do precyzyjnych odpowiedzi."
              action={
                <button
                  type="button"
                  onClick={() => setIsKnowledgeModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#FF6B35] hover:bg-[#F0551E] rounded-lg shadow-sm shadow-[#FF6B35]/25 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Nowy wpis</span>
                </button>
              }
            />

            <KnowledgeSearchBar
              searchQuery={knowledgeSearchQuery}
              onSearchChange={setKnowledgeSearchQuery}
              selectedCategory={knowledgeCategory}
              onSelectCategory={setKnowledgeCategory}
            />

            <KnowledgeList
              items={filteredKnowledgeItems}
              onDelete={deleteKnowledgeItem}
              onAskAssistant={handleAskAssistantAboutKnowledge}
              onOpenCreateModal={() => setIsKnowledgeModalOpen(true)}
              hasFilterActive={knowledgeCategory !== 'Wszystkie' || Boolean(knowledgeSearchQuery.trim())}
            />
          </div>
        )}

        {/* TAB 4: Dedicated Full Assistant View */}
        {activeTab === 'assistant' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <SectionHeader
              title="Inteligentny Asystent ChronoMind"
              description="Twój doradca w zarządzaniu czasem, priorytetach i poszukiwaniu wiedzy. Zadawaj pytania, proś o rozpisanie projektów lub wyszukiwanie notatek."
            />

            <AssistantDrawer
              messages={messages}
              isLoading={isAssistantLoading}
              onSendMessage={sendAssistantMessage}
              onClearHistory={clearChatHistory}
              onApplySuggestedTask={handleApplySuggestedTask}
              onActivateTaskInPomodoro={handleActivateTaskInPomodoro}
            />
          </div>
        )}
      </main>

      {/* Task Creation Modal */}
      <TaskQuickAddModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={data => {
          addTask(data);
          addToast(`Utworzono zadanie: "${data.title}"`, 'success');
        }}
      />

      {/* Knowledge Creation Modal */}
      <KnowledgeAddModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
        onAddKnowledge={data => {
          addKnowledgeItem(data);
          addToast(`Zapisano notatkę: "${data.title}"`, 'success');
        }}
      />

      {/* Toast Notification Layer */}
      <NotificationToast
        notifications={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}
