import React, { useState } from 'react';
import { BossBattle } from '../../types';
import { MONSTERS_STREAK_LIST, Monster, getMonsterById } from '../../data/monsters';
import { motion } from 'motion/react';
import { Sword, Zap, Shield, Target, Flame, ChevronRight, Sparkles, AlertCircle, Info } from 'lucide-react';
import { MonsterDetailModal } from '../Modals/MonsterDetailModal';

interface ActiveStudyBossWidgetProps {
  boss: BossBattle;
  currentStreak: number;
  onAttack?: () => void;
  onViewArena?: () => void;
}

export const ActiveStudyBossWidget: React.FC<ActiveStudyBossWidgetProps> = ({
  boss,
  currentStreak,
  onAttack,
  onViewArena,
}) => {
  const [selectedMonsterForModal, setSelectedMonsterForModal] = useState<Monster | null>(null);

  // Link to monster metadata from id or order
  const monsterData =
    (boss.monsterId && getMonsterById(boss.monsterId)) ||
    MONSTERS_STREAK_LIST.find((m) => m.name.toLowerCase() === boss.name.toLowerCase()) ||
    MONSTERS_STREAK_LIST[0];

  const hpPercent = Math.max(0, Math.min(100, Math.round((boss.currentHp / boss.maxHp) * 100)));

  return (
    <>
      <div
        id="active-study-boss-widget"
        className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white p-5 sm:p-6 shadow-xl transition-all"
      >
        {/* Background glow tailored to monster color */}
        <div
          className="absolute -right-16 -top-16 w-64 h-64 opacity-20 blur-3xl rounded-full pointer-events-none"
          style={{ backgroundColor: monsterData.color || '#10b981' }}
        />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Header Row: Monster identity & quick actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Monster Avatar with interactive modal trigger */}
              <button
                id={`boss-avatar-btn-${monsterData.id}`}
                onClick={() => setSelectedMonsterForModal(monsterData)}
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 border border-slate-700/80 overflow-hidden flex items-center justify-center shrink-0 hover:border-emerald-400/60 transition group shadow-md"
                title="Click for Monster Codex details"
              >
                <span className="absolute inset-0 flex items-center justify-center text-2xl group-hover:opacity-80 transition pointer-events-none z-0">
                  {monsterData.avatarIcon}
                </span>
                <img
                  src={monsterData.imageSrc}
                  alt={monsterData.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300 relative z-10"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.endsWith('.png')) {
                      target.src = target.src.replace('.png', '.svg');
                    } else {
                      target.style.display = 'none';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-black uppercase text-white tracking-widest transition z-20">
                  <Info size={14} />
                </div>
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                    Boss #{monsterData.order} • {boss.difficulty}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {monsterData.subtitle}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight flex items-center gap-2">
                  <span>{boss.name}</span>
                </h3>

                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  Counter: <strong className="text-emerald-400">{monsterData.defeatHabit}</strong>
                </p>
              </div>
            </div>

            {/* View Details / Arena actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="view-boss-codex-btn"
                onClick={() => setSelectedMonsterForModal(monsterData)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1"
              >
                <span>Codex</span>
                <Info size={13} />
              </button>

              {onViewArena && (
                <button
                  id="view-boss-arena-btn"
                  onClick={onViewArena}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1"
                >
                  <span>Arena</span>
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Combat HP Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <Sword size={14} className="text-emerald-400" />
                <span className="font-black text-white tabular-nums">{boss.currentHp}</span> / {boss.maxHp} HP
              </div>
              <span className="font-black text-emerald-400">{hpPercent}% remaining</span>
            </div>

            <div className="h-3.5 bg-slate-800/80 rounded-full p-0.5 border border-slate-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hpPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full shadow-sm"
              />
            </div>
          </div>

          {/* Tactical Advice & Quick Action */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Zap size={14} className="text-amber-400 shrink-0" />
              <span className="truncate">
                Weakness: <strong className="text-slate-200">{monsterData.weakness}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">+{boss.xpReward} XP Reward</span>
              {boss.status === 'ACTIVE' && onAttack && (
                <button
                  id="attack-active-boss-btn"
                  onClick={onAttack}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[11px] tracking-wider transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Sword size={12} />
                  <span>Attack (Task / Focus)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Monster Detail Codex Modal */}
      {selectedMonsterForModal && (
        <MonsterDetailModal
          monster={selectedMonsterForModal}
          currentStreak={currentStreak}
          onClose={() => setSelectedMonsterForModal(null)}
        />
      )}
    </>
  );
};
