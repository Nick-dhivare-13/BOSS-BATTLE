import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Sword,
  RefreshCw,
  Calendar as CalendarIcon,
  BookOpenCheck,
  FileText,
  BarChart3,
  Settings,
  PlusCircle,
  Flame,
  Zap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ModuleId } from '../../types';
import { LogoBrand } from '../Brand/LogoBrand';

interface SidebarProps {
  activeTab?: string;
  currentTab?: string;
  onSelectTab: (tab: string) => void;
  onOpenAIPilot?: () => void;
}

interface NavItemConfig {
  id: string;
  moduleId?: ModuleId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, currentTab, onSelectTab, onOpenAIPilot }) => {
  const currentActiveTab = activeTab || currentTab || 'dashboard';
  const { isModuleEnabled, setShowOnboardingModal, setShowStreakJourneyModal, tasks, habits, habitLogs, bossBattles } =
    useData();
  const { user } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const pendingHabitsCount = habits.filter(
    (h) => !habitLogs.some((l) => l.habitId === h.id && l.date === todayStr && l.completed)
  ).length;
  const activeBoss = bossBattles.find((b) => b.status === 'ACTIVE');

  // Master definition of all possible navigation items
  const ALL_NAV_ITEMS: NavItemConfig[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'study', moduleId: 'study', label: 'Study Timer', icon: Timer },
    { id: 'tasks', moduleId: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'bosses', moduleId: 'bosses', label: 'Boss Battles', icon: Sword, badge: activeBoss ? 'BOSS' : undefined },
    { id: 'habits', moduleId: 'habits', label: 'Habit Tracker', icon: RefreshCw, badge: pendingHabitsCount > 0 ? pendingHabitsCount : undefined },
    { id: 'calendar', moduleId: 'calendar', label: 'Calendar & Blocks', icon: CalendarIcon },
    { id: 'academic', moduleId: 'academic', label: 'Exams & Goals', icon: BookOpenCheck },
    { id: 'notes', moduleId: 'notes', label: 'Notes & AI Deck', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Dynamically filter based on enabled modules
  const filteredNavItems = ALL_NAV_ITEMS.filter((item) => {
    if (!item.moduleId) return true; // Always visible items like dashboard, analytics, settings
    return isModuleEnabled(item.moduleId);
  });

  return (
    <aside className="hidden md:flex flex-col w-64 min-w-[16rem] max-w-[16rem] fixed top-0 bottom-0 left-0 h-screen h-[100dvh] max-h-screen z-30 border-r border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 select-none overflow-hidden">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between shrink-0">
        <LogoBrand size="md" />
      </div>

      {/* Streak Journey Quick Widget (Clickable) */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={() => setShowStreakJourneyModal(true)}
          className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/10 border border-amber-500/30 hover:border-amber-500/50 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-black text-[#f59e0b]">
              <Flame size={15} className="animate-pulse" />
              <span>{user?.currentStreak || 7} DAY STREAK</span>
            </span>
            <span className="text-[10px] font-bold text-[#f59e0b] group-hover:underline">Journey &gt;</span>
          </div>
          <p className="text-[11px] font-bold text-[#64748b] dark:text-slate-400 mt-1">
            Tap to view 10 Monster Evolutions
          </p>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-2 space-y-1.5">
        {filteredNavItems.map((item) => {
          const isActive = currentActiveTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition text-left cursor-pointer ${
                isActive
                  ? 'bg-[#10b981] text-white shadow-md shadow-[#10b981]/25'
                  : 'text-[#64748b] dark:text-slate-400 hover:bg-[#f1f5f9] dark:hover:bg-slate-800 hover:text-[#0f172a] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-white' : 'text-[#94a3b8] dark:text-slate-400'} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : typeof item.badge === 'string'
                      ? 'bg-[#f43f5e] text-white'
                      : 'bg-[#f1f5f9] dark:bg-slate-800 text-[#0f172a] dark:text-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Modular "+ Add Module" quick button */}
        <div className="pt-3 pb-2">
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#10b981] bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/30 transition cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>+ Add / Toggle Modules</span>
          </button>
        </div>
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-xs font-black text-[#10b981]">
              L{user?.level || 8}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0f172a] dark:text-white truncate">
                {user?.displayName || 'Solo Hero'}
              </p>
              <p className="text-[10px] text-[#64748b] dark:text-slate-400 font-semibold">
                {(user?.xp || 2450).toLocaleString()} XP
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('settings')}
            className="p-1.5 text-[#64748b] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-slate-800 cursor-pointer"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
