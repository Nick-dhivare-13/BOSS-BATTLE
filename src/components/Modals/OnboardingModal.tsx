import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ModuleId } from '../../types';
import { AppLogo } from '../Brand/AppLogo';
import { LEGAL_CONFIG } from '../../config/legalConfig';
import {
  CheckSquare,
  RefreshCw,
  Timer,
  Sword,
  Calendar as CalendarIcon,
  BookOpenCheck,
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

interface ModuleOption {
  id: ModuleId;
  name: string;
  category: 'Optional System' | 'Core System';
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  recommendedFor: string;
}

const AVAILABLE_OPTIONS: ModuleOption[] = [
  {
    id: 'study',
    name: 'Study Sessions & Focus Timer',
    category: 'Core System',
    description: '30/10 Productive Study, Pomodoro, Deep Focus timers with ambient focus audio & loud alarms.',
    icon: Timer,
    color: '#10b981',
    recommendedFor: 'Students preparing for intense exams or coding sprints',
  },
  {
    id: 'tasks',
    name: 'Tasks & Assignments',
    category: 'Core System',
    description: 'Track academic assignments with priorities, AI subtask decomposition, and deadlines.',
    icon: CheckSquare,
    color: '#3b82f6',
    recommendedFor: 'Managing homework, lab assignments, and project deliverables',
  },
  {
    id: 'bosses',
    name: 'Boss Battles & Monster Streaks',
    category: 'Core System',
    description: 'Gamify your productivity by dealing damage to RPG boss monsters for every completed session.',
    icon: Sword,
    color: '#f43f5e',
    recommendedFor: 'Gamers who want rewarding visual motivation & unlockable monsters',
  },
  {
    id: 'habits',
    name: 'Habits & Consistency Streaks',
    category: 'Optional System',
    description: 'Daily, weekly, monthly and yearly visual habit calendars to build lasting routines.',
    icon: RefreshCw,
    color: '#f59e0b',
    recommendedFor: 'Daily routines like coding practice, reading, or flashcard reviews',
  },
  {
    id: 'calendar',
    name: 'Calendar & Notion-Style Blocks',
    category: 'Optional System',
    description: 'Flexible time blocking with checklists, study events, recurrence, and automated habit sync.',
    icon: CalendarIcon,
    color: '#8b5cf6',
    recommendedFor: 'Structured time-blockers who like detailed daily planning',
  },
  {
    id: 'academic',
    name: 'Exams & Milestone Goals',
    category: 'Optional System',
    description: 'Syllabus countdowns, exam priority rankings, and measurable long-term study targets.',
    icon: BookOpenCheck,
    color: '#06b6d4',
    recommendedFor: 'Students with upcoming school/university exams or cert targets',
  },
];

export const OnboardingModal: React.FC = () => {
  const { showOnboardingModal, setShowOnboardingModal, enabledModules, completeOnboarding } = useData();

  const [selected, setSelected] = useState<ModuleId[]>(() => {
    return enabledModules.length > 0 ? enabledModules : ['tasks', 'study', 'bosses'];
  });

  if (!showOnboardingModal) return null;

  const toggleSelection = (id: ModuleId) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  const selectAll = () => {
    setSelected(AVAILABLE_OPTIONS.map((o) => o.id));
  };

  const selectMinimal = () => {
    setSelected(['study', 'tasks', 'bosses']);
  };

  const handleContinue = () => {
    completeOnboarding(selected.length > 0 ? selected : ['tasks', 'study']);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#10b981] font-black text-xs uppercase tracking-widest mb-1">
                <Sparkles size={16} />
                <span>Modular Workspace Engine</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
                Choose Your Study & Productivity System
              </h2>
              <p className="text-xs md:text-sm text-[#64748b] dark:text-slate-400 mt-1">
                Boss Battles is fully modular. Select the systems you want to use right now. You can enable or disable
                modules anytime without losing your stored data.
              </p>
            </div>
            <AppLogo size="lg" className="hidden sm:inline-flex shrink-0" />
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mt-4 text-xs font-bold">
            <span className="text-[#94a3b8] dark:text-slate-500 self-center mr-1">Quick Select:</span>
            <button
              type="button"
              onClick={selectAll}
              className="px-3 py-1.5 rounded-lg bg-[#f1f5f9] dark:bg-slate-800 text-[#0f172a] dark:text-slate-200 hover:bg-[#10b981]/20 hover:text-[#10b981] transition"
            >
              All Systems ({AVAILABLE_OPTIONS.length})
            </button>
            <button
              type="button"
              onClick={selectMinimal}
              className="px-3 py-1.5 rounded-lg bg-[#f1f5f9] dark:bg-slate-800 text-[#0f172a] dark:text-slate-200 hover:bg-[#10b981]/20 hover:text-[#10b981] transition"
            >
              Focus & Battles Only (3)
            </button>
          </div>
        </div>

        {/* Modal Body: Checkbox Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#64748b] dark:text-slate-400">
            What do you want to track? ({selected.length} Selected)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {AVAILABLE_OPTIONS.map((item) => {
              const isSelected = selected.includes(item.id);
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelection(item.id)}
                  className={`cursor-pointer p-4 rounded-2xl border text-left transition relative flex flex-col justify-between select-none ${
                    isSelected
                      ? 'bg-[#10b981]/5 border-[#10b981] dark:bg-[#10b981]/10'
                      : 'bg-[#f8fafc] dark:bg-slate-800/40 border-[#e2e8f0] dark:border-slate-800 hover:border-[#cbd5e1] dark:hover:border-slate-700 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-[#0f172a] dark:text-white">{item.name}</h4>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-[#10b981] border-[#10b981] text-white shadow-sm'
                          : 'border-[#cbd5e1] dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>

                  <p className="text-xs text-[#64748b] dark:text-slate-400 mt-3 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="text-xs text-[#64748b] dark:text-slate-400">
              You can always modify active modules in <strong>Settings → Modules</strong>.
            </p>
            <p className="text-[11px] font-semibold text-brand-muted">
              {LEGAL_CONFIG.minimumAgeNotice}
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#10b981]/25 transition shrink-0"
          >
            <span>Continue to App</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
