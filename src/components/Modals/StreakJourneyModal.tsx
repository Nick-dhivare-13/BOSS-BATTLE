import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Monster, MONSTERS_STREAK_LIST } from '../../data/monsters';
import { MonsterDetailModal } from './MonsterDetailModal';
import { Flame, Lock, CheckCircle2, Shield, Sparkles, X, ChevronRight, Trophy, Zap, Info, Sword } from 'lucide-react';

export const StreakJourneyModal: React.FC = () => {
  const { user } = useAuth();
  const {
    showStreakJourneyModal,
    setShowStreakJourneyModal,
    streakMonsters,
    unlockedMonsters,
    nextMonster,
    daysToNextMonster,
    addBossBattle,
  } = useData();

  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);

  if (!showStreakJourneyModal) return null;

  const currentStreak = user?.currentStreak || 7;
  const progressPercent = Math.min(100, Math.round((currentStreak / 70) * 100));

  const handleSummonBoss = (monster: Monster) => {
    addBossBattle({
      name: monster.name,
      description: `${monster.subtitle}: Defeat through ${monster.defeatHabit.toLowerCase()}.`,
      difficulty: (monster.allowedDifficulties[0] || 'Medium') as any,
      maxHp: monster.maxHpScale,
      xpReward: monster.xpRewardScale,
      avatarIcon: monster.avatarIcon,
      monsterId: monster.id,
      rewardTitle: `${monster.name} Slayer`,
      startDate: new Date().toISOString().split('T')[0],
    });
    setShowStreakJourneyModal(false);
  };

  return (
    <>
      <div
        id="streak-journey-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      >
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="p-6 md:p-8 border-b border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40 relative">
            <button
              id="close-streak-journey-btn"
              onClick={() => setShowStreakJourneyModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#64748b] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 transition"
              aria-label="Close Streak Journey"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-[#f59e0b] font-black text-xs uppercase tracking-widest mb-1">
              <Flame size={16} />
              <span>Study Boss Codex & Streak Evolution Journey</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-3">
                  <span>🔥 {currentStreak} Day Battle Streak</span>
                </h2>
                <p className="text-xs md:text-sm text-[#64748b] dark:text-slate-400 mt-1 max-w-xl">
                  Conquer 10 real-world study flaws: Procrastination, Distraction, Imposter Syndrome, Overwhelm, Cramming, Burnout, Perfectionism, Doom-scrolling, Cynicism, and Escapism.
                </p>
              </div>

              {nextMonster ? (
                <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-2xl px-4 py-2.5 text-right shrink-0">
                  <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider block">
                    Next Boss Milestone
                  </span>
                  <span className="text-sm font-black text-[#0f172a] dark:text-white">
                    {nextMonster.name} ({daysToNextMonster} {daysToNextMonster === 1 ? 'day' : 'days'} left)
                  </span>
                </div>
              ) : (
                <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-2xl px-4 py-2.5 text-right shrink-0">
                  <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider block">
                    MAX STREAK ASCENDED
                  </span>
                  <span className="text-sm font-black text-[#10b981]">All 10 Study Bosses Unlocked!</span>
                </div>
              )}
            </div>

            {/* Grand Progression Bar */}
            <div className="mt-6 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#64748b] dark:text-slate-400">
                <span>Evolution Progress: {unlockedMonsters.length} / 10 Bosses Qualified</span>
                <span>Day {currentStreak} of 70 Milestone</span>
              </div>
              <div className="h-3 bg-[#e2e8f0] dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#10b981] via-[#3b82f6] to-[#f43f5e] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Modal Body: Monster Roster */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {streakMonsters.map((monster) => {
                const isUnlocked = currentStreak >= monster.unlockStreakDays;
                const daysLeft = monster.unlockStreakDays - currentStreak;

                return (
                  <div
                    key={monster.id}
                    id={`streak-monster-card-${monster.id}`}
                    onClick={() => setSelectedMonster(monster)}
                    className={`p-5 rounded-2xl border transition cursor-pointer relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-lg ${
                      isUnlocked
                        ? 'bg-white dark:bg-slate-900 border-[#10b981]/40 shadow-sm'
                        : 'bg-[#f8fafc] dark:bg-slate-800/30 border-[#e2e8f0] dark:border-slate-800/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Monster Artwork Avatar */}
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 border relative overflow-hidden ${
                          isUnlocked
                            ? 'border-[#10b981]/40 shadow-md bg-slate-950'
                            : 'border-slate-300 dark:border-slate-700 grayscale opacity-60 bg-slate-900'
                        }`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-2xl pointer-events-none z-0">
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

                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-white text-xs z-20">
                            <Lock size={16} className="text-amber-400" />
                          </div>
                        )}
                      </div>

                      {/* Monster Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f1f5f9] dark:bg-slate-800 text-[#64748b] dark:text-slate-400">
                            #{monster.order} • {monster.rarity}
                          </span>
                          <span
                            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white"
                            style={{ backgroundColor: monster.color }}
                          >
                            {monster.element}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-[#0f172a] dark:text-white mt-1 truncate flex items-center gap-2">
                          <span>{monster.name}</span>
                        </h3>
                        <p className="text-xs font-bold text-[#64748b] dark:text-slate-400">{monster.subtitle}</p>
                      </div>
                    </div>

                    {/* Flaw and Defeat Counter */}
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-[#64748b] dark:text-slate-300 line-clamp-1">
                        Flaw: <strong className="text-rose-500 dark:text-rose-400">{monster.problem}</strong>
                      </p>
                      <p className="text-xs text-[#64748b] dark:text-slate-300 line-clamp-1">
                        Counter Habit: <strong className="text-emerald-600 dark:text-emerald-400">{monster.defeatHabit}</strong>
                      </p>
                    </div>

                    {/* Footer status */}
                    <div className="mt-4 pt-3 border-t border-[#f1f5f9] dark:border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#64748b] dark:text-slate-400">
                        Levels: <strong>{monster.allowedDifficulties.join(', ')}</strong>
                      </span>

                      {isUnlocked ? (
                        <span className="flex items-center gap-1 font-bold text-[#10b981]">
                          <CheckCircle2 size={14} /> Unlocked • Codex &gt;
                        </span>
                      ) : (
                        <span className="font-bold text-[#f59e0b]">
                          Day {monster.unlockStreakDays} ({daysLeft}d left)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 md:p-6 border-t border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[#64748b] dark:text-slate-400">
              Click any boss to review tactical counter-habits, weaknesses, lore, and summon into the Arena.
            </span>

            <button
              id="footer-close-streak-modal-btn"
              onClick={() => setShowStreakJourneyModal(false)}
              className="px-5 py-2.5 rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition w-full sm:w-auto"
            >
              Close Codex
            </button>
          </div>
        </div>
      </div>

      {selectedMonster && (
        <MonsterDetailModal
          monster={selectedMonster}
          currentStreak={currentStreak}
          onClose={() => setSelectedMonster(null)}
          onSummonBoss={handleSummonBoss}
        />
      )}
    </>
  );
};
