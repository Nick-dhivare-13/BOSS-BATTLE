import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MONSTERS_STREAK_LIST, Monster, getMonsterById } from '../../data/monsters';
import { motion } from 'motion/react';
import {
  Sword,
  Shield,
  Trophy,
  Zap,
  Info,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  BookOpen,
} from 'lucide-react';
import { MonsterDetailModal } from '../Modals/MonsterDetailModal';
import { LevelDetailsModal, TaskDifficultyLevel } from '../Modals/LevelDetailsModal';
import { FocusShieldModal } from './FocusShieldModal';

interface BossBattleDashboardCardProps {
  onSelectTab?: (tab: string) => void;
  onAttack?: () => void;
}

export const BossBattleDashboardCard: React.FC<BossBattleDashboardCardProps> = ({
  onSelectTab,
  onAttack,
}) => {
  const { user } = useAuth();
  const { bossBattles, isModuleEnabled } = useData();
  const { reducedMotion } = useTheme();

  // Modals state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showFocusShieldModal, setShowFocusShieldModal] = useState(false);
  const [selectedMonsterForCodex, setSelectedMonsterForCodex] = useState<Monster | null>(null);

  // 1. Fetch active study boss
  const activeBoss = bossBattles.find((b) => b.status === 'ACTIVE') || bossBattles[0];

  // 2. Fetch associated monster codex data
  const monsterData =
    (activeBoss?.monsterId && getMonsterById(activeBoss.monsterId)) ||
    MONSTERS_STREAK_LIST.find(
      (m) => m.name.toLowerCase() === (activeBoss?.name || '').toLowerCase()
    ) ||
    MONSTERS_STREAK_LIST[0];

  // If no boss exists, render an invitation to summon
  if (!activeBoss) {
    return (
      <div
        id="no-active-boss-card"
        className="rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl shrink-0">
            ⚔️
          </div>
          <div>
            <h3 className="text-lg font-black text-white">No Active Study Boss</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Awaken a study boss to channel your productivity and earn bonus XP!
            </p>
          </div>
        </div>
        <button
          id="summon-boss-btn"
          onClick={() => onSelectTab?.('bosses')}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition shrink-0"
        >
          Summon Boss
        </button>
      </div>
    );
  }

  // 3. Boss HP calculation
  const hpPercent = Math.max(
    0,
    Math.min(100, Math.round((activeBoss.currentHp / activeBoss.maxHp) * 100))
  );

  // 4. Boss Level / Tier
  const bossLevel = monsterData?.order || 1;
  const bossDifficulty: TaskDifficultyLevel =
    (activeBoss.difficulty as TaskDifficultyLevel) || 'Medium';

  return (
    <>
      <div
        id={`boss-battle-dashboard-card-${activeBoss.id}`}
        className="relative overflow-hidden rounded-[28px] bg-[#0f172a] text-white p-5 sm:p-6 shadow-2xl border border-slate-800/80 transition-all group"
      >
        {/* Background Radial Glows */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-[80px] rounded-full pointer-events-none"
          style={{ backgroundColor: monsterData.color || '#10b981' }}
        />

        {/* Compact Top Header Label */}
        <div className="relative z-10 flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
              ACTIVE STUDY BOSS
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Level Details Trigger Button */}
            <button
              id="boss-level-details-btn"
              onClick={() => setShowLevelModal(true)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-wider transition flex items-center gap-1 border border-white/10"
              title="Click to view Level Details & Progression"
            >
              <Layers size={11} className="text-emerald-400" />
              <span>Level Details</span>
            </button>

            {onSelectTab && (
              <button
                id="boss-arena-nav-btn"
                onClick={() => onSelectTab('bosses')}
                className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 transition flex items-center gap-0.5"
              >
                <span>Arena</span>
                <ChevronRight size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Monster Profile Row */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Monster Artwork Avatar */}
            <button
              id={`boss-dashboard-avatar-btn-${monsterData.id}`}
              onClick={() => {
                setSelectedMonsterForCodex(monsterData);
                setShowDetailModal(true);
              }}
              className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-lg group-hover:border-emerald-400/50 transition cursor-pointer"
              title="Click to inspect Boss Codex & Abilities"
            >
              <span className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none z-0">
                {activeBoss.avatarIcon || monsterData.avatarIcon}
              </span>
              <img
                src={monsterData.imageSrc}
                alt={monsterData.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500 relative z-10"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.endsWith('.png')) {
                    target.src = target.src.replace('.png', '.svg');
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition z-20">
                <Info size={16} />
              </div>
            </button>

            {/* Boss Identity, Subtitle, and Badges */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Level Badge */}
                <span
                  id="boss-level-badge"
                  className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-wider rounded-md uppercase border border-emerald-500/30 flex items-center gap-1"
                >
                  <Shield size={10} />
                  <span>Level {bossLevel} Boss</span>
                </span>

                {/* Difficulty Badge */}
                <button
                  type="button"
                  onClick={() => setShowLevelModal(true)}
                  className="px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-black tracking-wider rounded-md uppercase border border-rose-500/30 flex items-center gap-1 transition"
                  title="Click to view Difficulty Level Details"
                >
                  <span>{bossDifficulty}</span>
                  <span className="text-[9px] underline opacity-80">Info</span>
                </button>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {monsterData.subtitle}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight text-white flex items-center gap-2 truncate">
                <span>{activeBoss.name}</span>
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="text-emerald-400 font-bold">Counter: {monsterData.defeatHabit}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: [View Abilities] & [Focus Shield] */}
          <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
            <button
              id="boss-view-abilities-btn"
              onClick={() => {
                setSelectedMonsterForCodex(monsterData);
                setShowDetailModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 border border-white/10"
              title="View full tactical abilities, lore and defeat habits"
            >
              <Info size={14} className="text-amber-400" />
              <span>View Abilities</span>
            </button>

            <button
              id="boss-activate-focus-shield-btn"
              onClick={() => setShowFocusShieldModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
              title="Activate anti-distraction Focus Shield session"
            >
              <Shield size={14} />
              <span>Focus Shield</span>
            </button>
          </div>
        </div>

        {/* Boss HP & Progress Bar */}
        <div className="relative z-10 mt-4 pt-3 border-t border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <Sword className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health:</span>
              <span
                id="boss-current-hp"
                className="text-sm sm:text-base font-black text-white tabular-nums"
              >
                {activeBoss.currentHp} / {activeBoss.maxHp} HP
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">+{activeBoss.xpReward} XP Reward</span>
              <span className="text-xs font-bold text-rose-400">({hpPercent}% remaining)</span>
            </div>
          </div>

          <div className="h-3 bg-white/5 rounded-full p-0.5 border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${hpPercent}%` }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Full Monster Codex & Abilities Modal */}
      {showDetailModal && selectedMonsterForCodex && (
        <MonsterDetailModal
          monster={selectedMonsterForCodex}
          currentStreak={user?.currentStreak || 7}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedMonsterForCodex(null);
          }}
        />
      )}

      {/* Level Details Modal */}
      {showLevelModal && (
        <LevelDetailsModal
          level={bossDifficulty}
          onClose={() => setShowLevelModal(false)}
          onSelectMonster={(monster) => {
            setShowLevelModal(false);
            setSelectedMonsterForCodex(monster);
            setShowDetailModal(true);
          }}
        />
      )}

      {/* Focus Shield Modal */}
      {showFocusShieldModal && (
        <FocusShieldModal
          onClose={() => setShowFocusShieldModal(false)}
        />
      )}
    </>
  );
};
