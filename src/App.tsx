import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { Navbar } from './components/Navigation/Navbar';
import { FloatingFeedback } from './components/Animation/FloatingFeedback';
import { AIPlanModal } from './components/AI/AIPlanModal';
import { OnboardingModal } from './components/Modals/OnboardingModal';
import { StreakJourneyModal } from './components/Modals/StreakJourneyModal';
import { LiveAlarmModal } from './components/Modals/LiveAlarmModal';

import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Habits } from './pages/Habits';
import { StudyTimer } from './pages/StudyTimer';
import { BossBattles } from './pages/BossBattles';
import { Calendar } from './pages/Calendar';
import { SubjectsExamsGoals } from './pages/SubjectsExamsGoals';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotesFlashcards } from './pages/NotesFlashcards';
import { SettingsPage } from './pages/SettingsPage';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isAIPilotOpen, setIsAIPilotOpen] = useState(false);

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onSelectTab={setCurrentTab} onOpenAIPilot={() => setIsAIPilotOpen(true)} />;
      case 'tasks':
        return <Tasks />;
      case 'habits':
        return <Habits />;
      case 'study':
        return <StudyTimer />;
      case 'bosses':
        return <BossBattles />;
      case 'calendar':
        return <Calendar />;
      case 'academic':
        return <SubjectsExamsGoals />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'notes':
        return <NotesFlashcards />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onSelectTab={setCurrentTab} onOpenAIPilot={() => setIsAIPilotOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-brand-background text-brand-text font-sans antialiased selection:bg-brand-primary/20 flex flex-col w-full">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} onOpenAIPilot={() => setIsAIPilotOpen(true)} />

      <div className="md:pl-64 flex flex-col min-h-screen min-h-[100dvh] w-full min-w-0 flex-1">
        <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} onOpenAIPilot={() => setIsAIPilotOpen(true)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-16 min-w-0">
          {renderTabContent()}
        </main>

        {/* Bottom Status Bar */}
        <footer className="hidden md:flex bg-white dark:bg-slate-900 border-t border-[#e2e8f0] dark:border-slate-800 py-2.5 px-8 justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] sticky bottom-0 z-10 w-full shrink-0">
          <div className="flex gap-6">
            <span>User: test-admin-ng-01</span>
            <span>Server: AP-SOUTH-1-STAGING</span>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-ping"></div>
              <span className="text-[#10b981]">Real-time Data Active</span>
            </div>
            <span>Last Sync: {new Date().toLocaleTimeString()}</span>
          </div>
        </footer>
      </div>

      {/* Overlays */}
      <FloatingFeedback />
      <AIPlanModal isOpen={isAIPilotOpen} onClose={() => setIsAIPilotOpen(false)} />
      <OnboardingModal />
      <StreakJourneyModal />
      <LiveAlarmModal onNavigate={setCurrentTab} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
