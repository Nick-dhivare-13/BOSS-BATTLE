import React, { useState } from 'react';
import { LogoBrand } from '../Brand/LogoBrand';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { NotificationCenterModal } from './NotificationCenterModal';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  LayoutDashboard,
  Timer,
  CheckSquare,
  Sword,
  RefreshCw,
  Calendar as CalendarIcon,
  BookOpenCheck,
  FileText,
  BarChart3,
  Settings,
  PlusCircle,
  Bell,
} from 'lucide-react';
import { ModuleId } from '../../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAIPilot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAIPilot }) => {
  const { user } = useAuth();
  const { appearance, setAppearance, soundEnabled, setSoundEnabled } = useTheme();
  const { isModuleEnabled, setShowStreakJourneyModal, setShowOnboardingModal, nextMonster, daysToNextMonster, appNotifications } =
    useData();
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const unreadCount = appNotifications.filter((n) => !n.read).length;

  const toggleAppearance = () => {
    setAppearance(appearance === 'dark' ? 'light' : 'dark');
  };

  const mobileNavItems: { id: string; moduleId?: ModuleId; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
    { id: 'study', moduleId: 'study' as ModuleId, label: 'Study', icon: Timer },
    { id: 'tasks', moduleId: 'tasks' as ModuleId, label: 'Tasks', icon: CheckSquare },
    { id: 'bosses', moduleId: 'bosses' as ModuleId, label: 'Bosses', icon: Sword },
    { id: 'habits', moduleId: 'habits' as ModuleId, label: 'Habits', icon: RefreshCw },
    { id: 'calendar', moduleId: 'calendar' as ModuleId, label: 'Cal', icon: CalendarIcon },
    { id: 'academic', moduleId: 'academic' as ModuleId, label: 'Exams', icon: BookOpenCheck },
  ].filter((item) => !item.moduleId || isModuleEnabled(item.moduleId));

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#e2e8f0] dark:border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between w-full">
        <div className="flex items-center gap-3 md:hidden">
          <LogoBrand size="sm" />
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className="px-2.5 py-1 bg-[#10b981]/15 text-[#10b981] text-[10px] font-black tracking-widest rounded-lg uppercase">
            MODULAR ENGINE ACTIVE
          </span>
          <div className="flex items-center gap-2 pl-3 border-l border-[#e2e8f0] dark:border-slate-800">
            <div className="w-2 h-2 bg-[#10b981] rounded-full animate-ping"></div>
            <span className="text-xs font-black uppercase tracking-tighter text-[#10b981]">
              Level {user?.level || 8} • {(user?.xp || 2450).toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Clickable Streak Indicator */}
          <button
            onClick={() => setShowStreakJourneyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-500/30 hover:border-amber-500/60 rounded-xl text-xs font-black text-[#f59e0b] transition"
            title="Click to view 10 Monster Streak Evolution Journey"
          >
            <Flame size={15} className="animate-pulse text-amber-500" />
            <span>{user?.currentStreak || 7}d Streak</span>
            {nextMonster && (
              <span className="hidden lg:inline text-[10px] font-bold text-[#94a3b8] dark:text-slate-400 pl-1 border-l border-amber-500/30">
                Next in {daysToNextMonster}d
              </span>
            )}
          </button>

          {/* AI Planner Button */}
          <button
            onClick={onOpenAIPilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10b981]/10 text-[#10b981] font-black text-xs hover:bg-[#10b981]/20 border border-[#10b981]/30 transition"
            title="AI Plan My Day"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">AI Planner</span>
          </button>

          {/* Notification Center Bell */}
          <button
            onClick={() => setShowNotificationCenter(true)}
            className="relative p-2 rounded-xl text-[#64748b] dark:text-slate-400 hover:bg-[#f1f5f9] dark:hover:bg-slate-800 transition"
            title="Notification Center & Scheduled Alerts"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl text-[#64748b] dark:text-slate-400 hover:bg-[#f1f5f9] dark:hover:bg-slate-800 transition"
            title={soundEnabled ? 'Sound Effects Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 size={18} className="text-[#10b981]" /> : <VolumeX size={18} />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleAppearance}
            className="p-2 rounded-xl text-[#64748b] dark:text-slate-400 hover:bg-[#f1f5f9] dark:hover:bg-slate-800 transition"
            title="Toggle Dark/Light Mode"
          >
            {appearance === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* User Profile */}
          <button
            onClick={() => onSelectTab('settings')}
            className="flex items-center gap-2 pl-2 border-l border-[#e2e8f0] dark:border-slate-800"
          >
            <div className="w-8 h-8 rounded-xl bg-[#10b981] text-white font-bold flex items-center justify-center text-xs shadow-sm">
              {user?.displayName ? user.displayName.charAt(0) : 'U'}
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#e2e8f0] dark:border-slate-800 px-2 py-1.5 md:hidden flex justify-around items-center">
        {mobileNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
                isActive ? 'text-[#10b981] font-black' : 'text-[#64748b] dark:text-slate-400'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setShowOnboardingModal(true)}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-[#10b981]"
          title="Add Modules"
        >
          <PlusCircle size={18} />
          <span className="text-[10px] mt-0.5">Modules</span>
        </button>
      </div>

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onNavigate={(tab) => {
          setShowNotificationCenter(false);
          onSelectTab(tab);
        }}
      />
    </>
  );
};
