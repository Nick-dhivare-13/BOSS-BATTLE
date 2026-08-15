import React from 'react';
import { Monster, MONSTERS_STREAK_LIST } from '../../data/monsters';
import {
  X,
  Shield,
  Zap,
  Sword,
  Target,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  Info,
} from 'lucide-react';

export type TaskDifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Epic' | 'Legendary';

export interface LevelInfo {
  level: TaskDifficultyLevel;
  displayName: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  recommendedFocusDuration: string;
  recommendedTasks: string[];
  requiredEffort: string;
  xpReward: string;
  bossDamageRange: string;
  streakImpact: string;
  bossBattlesAllowed: string[];
  eligibleMonsterIds: string[];
}

export const LEVEL_DEFINITIONS: Record<TaskDifficultyLevel, LevelInfo> = {
  Easy: {
    level: 'Easy',
    displayName: 'Easy Level',
    badgeColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    description:
      'Foundational tasks that require low cognitive friction and can be conquered rapidly with immediate micro-action.',
    recommendedFocusDuration: '15 - 25 minutes (Sprint Focus)',
    recommendedTasks: [
      'Quick flashcard review or vocabulary practice',
      'Reading 5-10 pages of textbook notes',
      'Solving 3-5 routine homework exercises',
      'Organizing daily syllabus and planning study blocks',
    ],
    requiredEffort: 'Low complexity • Minimal setup • Immediate 2-minute rule starter',
    xpReward: '+25 - 40 XP per task / focus session',
    bossDamageRange: '20 - 35 Boss Damage',
    streakImpact: 'Counts toward preserving your active daily Battle Streak',
    bossBattlesAllowed: ['Procrastar (Boss #1)', 'Dopa-Hound (Boss #2)'],
    eligibleMonsterIds: ['boss_1_procrastar', 'boss_2_dopahound'],
  },
  Medium: {
    level: 'Medium',
    displayName: 'Medium Level',
    badgeColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    description:
      'Standard academic workload requiring sustained single-task concentration, structured problem solving, and analytical focus.',
    recommendedFocusDuration: '30 - 50 minutes (Deep Focus)',
    recommendedTasks: [
      'Writing an essay draft section or lab report intro',
      'Solving multi-step math or engineering problem sets',
      'Coding structured functions and debugging modules',
      'Spaced review of past exam question papers',
    ],
    requiredEffort: 'Moderate complexity • Sustained focus • Minimal distractions allowed',
    xpReward: '+50 - 75 XP per task / focus session',
    bossDamageRange: '40 - 70 Boss Damage',
    streakImpact: 'Accelerates streak evolution and milestone multiplier bonuses',
    bossBattlesAllowed: [
      'Procrastar (Boss #1)',
      'Dopa-Hound (Boss #2)',
      'Umbra-Doubt (Boss #3)',
      'Fog-Claw (Boss #4)',
      'Rush-Volt (Boss #5)',
      'Pyre-Drake (Boss #6)',
    ],
    eligibleMonsterIds: [
      'boss_1_procrastar',
      'boss_2_dopahound',
      'boss_3_umbradoubt',
      'boss_4_fogclaw',
      'boss_5_rushvolt',
      'boss_6_pyredrake',
    ],
  },
  Hard: {
    level: 'Hard',
    displayName: 'Hard Level',
    badgeColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/30',
    description:
      'High-intensity deep work on rigorous academic concepts, major deliverables, and difficult exam preparation.',
    recommendedFocusDuration: '50 - 90 minutes (Ultra Focus Block)',
    recommendedTasks: [
      'Completing a full mock exam under timed exam conditions',
      'Major project architecture or full-stack feature build',
      'Comprehensive term paper research & synthesis',
      'Mastering difficult mathematical proofs or complex algorithms',
    ],
    requiredEffort: 'High complexity • Zero-distraction environment • High cognitive load',
    xpReward: '+80 - 120 XP per task / focus session',
    bossDamageRange: '75 - 120 Boss Damage',
    streakImpact: 'Unlocks advanced Slayer badges and large streak multiplier boosts',
    bossBattlesAllowed: [
      'Umbra-Doubt (Boss #3)',
      'Fog-Claw (Boss #4)',
      'Rush-Volt (Boss #5)',
      'Pyre-Drake (Boss #6)',
      'Cryo-Stasis (Boss #7)',
      'Cyber-Grip (Boss #8)',
      'Nihilor (Boss #9)',
    ],
    eligibleMonsterIds: [
      'boss_3_umbradoubt',
      'boss_4_fogclaw',
      'boss_5_rushvolt',
      'boss_6_pyredrake',
      'boss_7_cryostasis',
      'boss_8_cybergrip',
      'boss_9_nihilor',
    ],
  },
  Epic: {
    level: 'Epic',
    displayName: 'Epic Level',
    badgeColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    description:
      'Major academic milestone or multi-day synthesis project demanding elite discipline and peak mental endurance.',
    recommendedFocusDuration: '90+ minutes (Deep Focus Cycle)',
    recommendedTasks: [
      'Final thesis chapter submission or research defense prep',
      'Final exam marathon comprehensive mastery review',
      'End-to-end capstone project completion and deployment',
      'High-stakes competitive exam syllabus simulation',
    ],
    requiredEffort: 'Very High • Mastery-level rigor • Scheduled recovery intervals',
    xpReward: '+130 - 200 XP per task / focus session',
    bossDamageRange: '130 - 200 Boss Damage',
    streakImpact: 'Massive battle streak boost and unlocks rare raid boss titles',
    bossBattlesAllowed: [
      'Pyre-Drake (Boss #6)',
      'Cryo-Stasis (Boss #7)',
      'Cyber-Grip (Boss #8)',
      'Nihilor (Boss #9)',
      'Lustivox (Boss #10)',
    ],
    eligibleMonsterIds: [
      'boss_6_pyredrake',
      'boss_7_cryostasis',
      'boss_8_cybergrip',
      'boss_9_nihilor',
      'boss_10_lustivox',
    ],
  },
  Legendary: {
    level: 'Legendary',
    displayName: 'Legendary Level',
    badgeColor: 'text-amber-300',
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-400/40',
    description:
      'The highest pinnacle of academic achievement and unbroken 70-day study streak transcendence.',
    recommendedFocusDuration: 'Multiple 90-min sessions with scheduled recovery',
    recommendedTasks: [
      '70-day unbroken study streak milestone completion',
      'Full academic degree / course final examination triumph',
      'Publishing a scientific paper or winning academic Olympiad',
    ],
    requiredEffort: 'Supreme • Timeless focus transcendence • Unstoppable habit discipline',
    xpReward: '+250 - 500+ XP & Supreme Title',
    bossDamageRange: '250 - 500+ Boss Damage',
    streakImpact: 'Crowns the student as Grandmaster of Focus across the realm',
    bossBattlesAllowed: ['Nihilor (Boss #9)', 'Lustivox (Boss #10)'],
    eligibleMonsterIds: ['boss_9_nihilor', 'boss_10_lustivox'],
  },
};

interface LevelDetailsModalProps {
  level: TaskDifficultyLevel;
  onClose: () => void;
  onSelectMonster?: (monster: Monster) => void;
  onSelectLevel?: (level: TaskDifficultyLevel) => void;
}

export const LevelDetailsModal: React.FC<LevelDetailsModalProps> = ({
  level,
  onClose,
  onSelectMonster,
  onSelectLevel,
}) => {
  const currentInfo = LEVEL_DEFINITIONS[level] || LEVEL_DEFINITIONS.Medium;

  // Find corresponding monster objects
  const matchingMonsters = MONSTERS_STREAK_LIST.filter((m) =>
    currentInfo.eligibleMonsterIds.includes(m.id)
  );

  return (
    <div
      id="level-details-backdrop"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'level-details-backdrop') onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div
        id={`level-details-modal-${level.toLowerCase()}`}
        className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl max-w-3xl w-full my-8 shadow-2xl overflow-hidden flex flex-col relative transition-all"
      >
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40 relative">
          <button
            id="close-level-details-btn"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-[#64748b] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 transition"
            aria-label="Close Level Details"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-1 text-slate-500 dark:text-slate-400">
            <Shield size={14} className="text-emerald-500" />
            <span>Difficulty & Progression Level Details</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${currentInfo.badgeBg} ${currentInfo.badgeColor} ${currentInfo.badgeBorder}`}
                >
                  {currentInfo.displayName}
                </span>
                <span className="text-xs font-bold text-slate-400">Task & Combat Tier</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white mt-2 tracking-tight">
                {currentInfo.displayName} Breakdown
              </h2>
            </div>

            {/* Level Quick Switcher */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['Easy', 'Medium', 'Hard', 'Epic', 'Legendary'] as TaskDifficultyLevel[]).map(
                (lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onSelectLevel?.(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase transition ${
                      level === lvl
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Meaning / What belongs here */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-[#e2e8f0] dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <BookOpen size={15} />
              <span>What this level means</span>
            </div>
            <p className="text-sm text-[#0f172a] dark:text-slate-200 font-medium leading-relaxed">
              {currentInfo.description}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold uppercase tracking-wider text-[11px]">
                <Clock size={14} />
                <span>Recommended Focus</span>
              </div>
              <p className="text-sm font-black text-[#0f172a] dark:text-white">
                {currentInfo.recommendedFocusDuration}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-500 font-bold uppercase tracking-wider text-[11px]">
                <Sparkles size={14} />
                <span>XP Reward</span>
              </div>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                {currentInfo.xpReward}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-rose-500 font-bold uppercase tracking-wider text-[11px]">
                <Sword size={14} />
                <span>Boss Damage</span>
              </div>
              <p className="text-sm font-black text-rose-500">
                {currentInfo.bossDamageRange}
              </p>
            </div>
          </div>

          {/* Recommended Tasks */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-[#e2e8f0] dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Target size={15} className="text-indigo-500" />
              <span>Recommended Task Examples</span>
            </div>
            <ul className="space-y-1.5 pt-1">
              {currentInfo.recommendedTasks.map((t, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-[#0f172a] dark:text-slate-300"
                >
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Boss Battles & Monster Unlocks (CLICKABLE MONSTERS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Flame size={15} className="text-amber-500" />
                <span>Study Bosses Available at this Level (Click to View Full Codex)</span>
              </div>
              <span className="text-[11px] text-slate-400 font-bold">
                {matchingMonsters.length} Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingMonsters.map((monster) => (
                <div
                  key={monster.id}
                  id={`level-monster-card-${monster.id}`}
                  onClick={() => onSelectMonster?.(monster)}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 transition cursor-pointer flex items-center justify-between gap-3 text-white group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                      <span className="absolute inset-0 flex items-center justify-center text-xl pointer-events-none z-0">
                        {monster.avatarIcon}
                      </span>
                      <img
                        src={monster.imageSrc}
                        alt={monster.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover relative z-10"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.endsWith('.png')) {
                            target.src = target.src.replace('.png', '.svg');
                          } else {
                            target.style.display = 'none';
                          }
                        }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-emerald-400">
                          #{monster.order} • {monster.name}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-300 line-clamp-1">
                        {monster.subtitle}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        Flaw: {monster.problem}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition shrink-0">
                    <span className="hidden sm:inline text-[11px]">Codex</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Impact & Ascension Rule */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
            <Flame size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Streak & Ascension Impact
              </p>
              <p className="text-xs text-[#0f172a] dark:text-slate-300 font-medium">
                {currentInfo.streakImpact}. Tasks completed at {currentInfo.displayName} maintain and accelerate your 70-day battle streak progression toward conquering all 10 Study Flaws.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-6 border-t border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Clicking any monster opens its full tactical strategy, habits, and live HP.
          </span>

          <button
            id="footer-close-level-details-btn"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-black text-xs uppercase tracking-wider hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
