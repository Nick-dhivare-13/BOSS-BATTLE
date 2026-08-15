import React from 'react';
import { Monster } from '../../data/monsters';
import {
  X,
  Flame,
  Shield,
  Zap,
  Target,
  Sparkles,
  Lock,
  CheckCircle2,
  Sword,
  AlertTriangle,
  Heart,
  Quote,
  BookOpen,
} from 'lucide-react';

interface MonsterDetailModalProps {
  monster: Monster | null;
  currentStreak: number;
  onClose: () => void;
  onSummonBoss?: (monster: Monster) => void;
}

export const MonsterDetailModal: React.FC<MonsterDetailModalProps> = ({
  monster,
  currentStreak,
  onClose,
  onSummonBoss,
}) => {
  if (!monster) return null;

  const isUnlocked = currentStreak >= monster.unlockStreakDays;
  const daysRemaining = monster.unlockStreakDays - currentStreak;

  return (
    <div
      id="monster-detail-backdrop"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'monster-detail-backdrop') onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div
        id={`monster-detail-${monster.id}`}
        className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl max-w-2xl w-full my-8 shadow-2xl overflow-hidden flex flex-col relative transition-all"
      >
        {/* Close Button */}
        <button
          id="close-monster-detail-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/10 transition"
          aria-label="Close detail modal"
        >
          <X size={18} />
        </button>

        {/* Hero Header with Monster Art */}
        <div
          className="relative h-64 sm:h-72 w-full flex items-end p-6 overflow-hidden"
          style={{
            background: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.95)), ${monster.glowColor}`,
          }}
        >
          {/* Background Ambient Glow */}
          <div
            className="absolute inset-0 opacity-40 blur-3xl pointer-events-none"
            style={{ backgroundColor: monster.color }}
          />

          {/* Monster Art Image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={monster.imageSrc}
              alt={monster.name}
              referrerPolicy="no-referrer"
              className={`h-full w-full object-cover sm:object-contain transition-transform duration-700 hover:scale-105 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] ${
                !isUnlocked ? 'filter grayscale brightness-50 contrast-125' : ''
              }`}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.endsWith('.png')) {
                  target.src = target.src.replace('.png', '.svg');
                } else {
                  target.style.display = 'none';
                  if (target.parentElement && !target.parentElement.querySelector('.monster-fallback-emoji')) {
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'monster-fallback-emoji text-8xl drop-shadow-2xl';
                    fallbackDiv.innerText = monster.avatarIcon;
                    target.parentElement.appendChild(fallbackDiv);
                  }
                }
              }}
            />
          </div>

          {/* Lock Badge if locked */}
          {!isUnlocked && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30 text-xs font-bold">
              <Lock size={14} />
              <span>Locked • Requires {monster.unlockStreakDays}-Day Streak</span>
            </div>
          )}

          {/* Title & Badge Overlay */}
          <div className="relative z-10 w-full text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                Boss #{monster.order} • {monster.rarity}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-white"
                style={{ backgroundColor: monster.color }}
              >
                {monster.element}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/40 text-slate-300">
                {monster.category}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3 drop-shadow-md">
              <span>{monster.name}</span>
            </h2>
            <p className="text-sm font-semibold text-emerald-300 drop-shadow">{monster.subtitle}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
          {/* Mantra Quote */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <Quote size={22} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                Slayer's Mantra
              </p>
              <p className="text-sm font-black italic text-[#0f172a] dark:text-white mt-0.5">
                "{monster.mantra}"
              </p>
            </div>
          </div>

          {/* Core Boss Profile Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Real-World Flaw / Problem */}
            <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-slate-800/50 border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle size={14} />
                <span>Real-World Flaw</span>
              </div>
              <p className="text-sm font-black text-[#0f172a] dark:text-white">{monster.problem}</p>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">{monster.description}</p>
            </div>

            {/* In-Game Ability */}
            <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-slate-800/50 border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-500 text-xs font-bold uppercase tracking-wider">
                <Zap size={14} />
                <span>Special Ability</span>
              </div>
              <p className="text-sm font-black text-[#0f172a] dark:text-white">{monster.ability}</p>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
                Signature Move: <strong className="text-indigo-600 dark:text-indigo-400">{monster.signatureMove}</strong>
              </p>
            </div>

            {/* Defeat Habit */}
            <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-slate-800/50 border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={14} />
                <span>Counter Habit</span>
              </div>
              <p className="text-sm font-black text-[#0f172a] dark:text-white">{monster.defeatHabit}</p>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
                Weakness: <strong className="text-emerald-600 dark:text-emerald-400">{monster.weakness}</strong>
              </p>
            </div>

            {/* Allowed Difficulties & Combat Scales */}
            <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-slate-800/50 border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold uppercase tracking-wider">
                <Shield size={14} />
                <span>Battle Qualifiers</span>
              </div>
              <p className="text-xs font-bold text-[#0f172a] dark:text-white">
                Allowed Task Levels: <span className="text-emerald-500">{monster.allowedDifficulties.join(', ')}</span>
              </p>
              <div className="flex items-center justify-between text-xs text-[#64748b] dark:text-slate-400 pt-1">
                <span>Base HP: ~{monster.maxHpScale}</span>
                <span>Reward: +{monster.xpRewardScale} XP</span>
              </div>
            </div>
          </div>

          {/* Defeat Method Detailed Guide */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Target size={15} />
              <span>Defeat Method & Tactical Strategy</span>
            </div>
            <p className="text-sm text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
              {monster.defeatMethod}
            </p>
          </div>

          {/* Lore Narrative */}
          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-slate-800/30 border border-[#e2e8f0] dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[#64748b] dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <BookOpen size={14} />
              <span>Archival Lore</span>
            </div>
            <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed italic">
              {monster.lore}
            </p>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 md:p-6 border-t border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#64748b] dark:text-slate-400">
            {isUnlocked ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 size={16} /> Qualified for Live Combat Arena
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                <Flame size={16} /> Need {daysRemaining} more consecutive streak {daysRemaining === 1 ? 'day' : 'days'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0f172a] dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 transition flex-1 sm:flex-initial"
            >
              Close
            </button>

            {isUnlocked && onSummonBoss && (
              <button
                onClick={() => {
                  onSummonBoss(monster);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              >
                <Sword size={15} />
                <span>Summon into Arena</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
