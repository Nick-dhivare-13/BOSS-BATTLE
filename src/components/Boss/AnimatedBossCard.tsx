import React, { useState } from 'react';
import { BossBattle } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { MONSTERS_STREAK_LIST, Monster, getMonsterById } from '../../data/monsters';
import { motion } from 'motion/react';
import { Sword, Shield, Trophy, Zap, AlertCircle, Info, Flame, CheckCircle2 } from 'lucide-react';
import { MonsterDetailModal } from '../Modals/MonsterDetailModal';

interface AnimatedBossCardProps {
  boss: BossBattle;
  currentStreak?: number;
  onAttack?: () => void;
  onSelect?: () => void;
}

export const AnimatedBossCard: React.FC<AnimatedBossCardProps> = ({
  boss,
  currentStreak = 7,
  onAttack,
  onSelect,
}) => {
  const { reducedMotion } = useTheme();
  const [showDetailModal, setShowDetailModal] = useState(false);

  const monsterData =
    (boss.monsterId && getMonsterById(boss.monsterId)) ||
    MONSTERS_STREAK_LIST.find((m) => m.name.toLowerCase() === boss.name.toLowerCase()) ||
    MONSTERS_STREAK_LIST[0];

  const hpPercent = Math.max(0, Math.min(100, Math.round((boss.currentHp / boss.maxHp) * 100)));

  return (
    <>
      <div
        id={`boss-card-${boss.id}`}
        onClick={onSelect}
        className={`relative overflow-hidden rounded-[28px] md:rounded-[32px] bg-[#0f172a] text-white p-6 md:p-8 shadow-2xl transition-all duration-200 cursor-pointer group ${
          boss.status === 'DEFEATED' ? 'opacity-85' : ''
        }`}
      >
        {/* Background Radial Glows */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-[80px] rounded-full pointer-events-none"
          style={{ backgroundColor: monsterData.color || '#10b981' }}
        />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#3b82f6] opacity-10 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Monster Artwork Avatar */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-lg group-hover:border-emerald-400/50 transition">
              <span className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none z-0">
                {boss.avatarIcon || monsterData.avatarIcon}
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
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] text-[10px] font-black tracking-widest rounded-full uppercase border border-[#10b981]/30">
                  {boss.status === 'DEFEATED' ? 'CONQUERED ✓' : `BOSS #${monsterData.order} • ACTIVE`}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {monsterData.subtitle}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black mt-2 tracking-tight text-white flex items-center gap-2">
                <span>{boss.name}</span>
              </h2>
              <p className="text-xs md:text-sm text-[#94a3b8] font-medium mt-1 line-clamp-2">
                {boss.description || monsterData.description}
              </p>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between gap-2">
            <div className="md:text-right">
              <p className="text-[10px] font-bold uppercase text-[#94a3b8] tracking-widest">Difficulty</p>
              <p className="text-sm md:text-base font-black text-[#f43f5e]">{boss.difficulty.toUpperCase()}</p>
            </div>

            <button
              id={`boss-details-btn-${boss.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowDetailModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1 border border-white/10"
              title="View full lore, weakness and counter habits"
            >
              <Info size={13} />
              <span>Codex</span>
            </button>
          </div>
        </div>

        {/* Counter Habit & Weakness Pill */}
        <div className="relative z-10 mt-4 p-3 bg-white/5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 size={14} />
            <span>Counter Habit: {monsterData.defeatHabit}</span>
          </div>
          <div className="text-amber-400 font-medium">
            Weakness: <strong className="text-white">{monsterData.weakness}</strong>
          </div>
        </div>

        {/* HP Bar */}
        <div className="relative z-10 mt-5 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-[#10b981]" />
              <span className="text-lg md:text-xl font-black tabular-nums">
                {boss.currentHp} / {boss.maxHp} HP
              </span>
            </div>
            <span className="text-base font-bold opacity-75 text-emerald-400">{hpPercent}%</span>
          </div>

          <div className="h-4 bg-white/5 rounded-full p-1 border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${hpPercent}%` }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full"
            />
          </div>
        </div>

        {/* Stats Footer Row */}
        <div className="relative z-10 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Slayer Reward</p>
            <p className="font-bold mt-0.5 text-xs md:text-sm text-white">
              +{boss.xpReward} XP • {boss.rewardTitle || `${boss.name} Conqueror`}
            </p>
          </div>

          <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">Status</p>
              <p className="font-bold mt-0.5 text-xs md:text-sm text-[#10b981]">
                {boss.status === 'DEFEATED' ? 'CONQUERED ✓' : 'IN PROGRESS'}
              </p>
            </div>
            {boss.status === 'ACTIVE' && onAttack && (
              <button
                id={`attack-card-btn-${boss.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onAttack();
                }}
                className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-black rounded-xl uppercase tracking-wider transition shadow-lg shadow-[#10b981]/20"
              >
                Attack
              </button>
            )}
          </div>
        </div>
      </div>

      {showDetailModal && (
        <MonsterDetailModal
          monster={monsterData}
          currentStreak={currentStreak}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  );
};
