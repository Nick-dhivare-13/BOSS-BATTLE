import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AnimatedBossCard } from '../components/Boss/AnimatedBossCard';
import { BossDifficulty } from '../types';
import { SubjectSelect } from '../components/Subject/SubjectSelect';
import { AppLogo } from '../components/Brand/AppLogo';
import { MONSTERS_STREAK_LIST, Monster } from '../data/monsters';
import { MonsterDetailModal } from '../components/Modals/MonsterDetailModal';
import { LevelDetailsModal, TaskDifficultyLevel } from '../components/Modals/LevelDetailsModal';
import { FocusShieldModal } from '../components/Boss/FocusShieldModal';
import {
  Sword,
  Trophy,
  Shield,
  Plus,
  Zap,
  Flame,
  Award,
  History,
  X,
  BookOpen,
  Layers,
  ChevronRight,
  Sparkles,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export const BossBattles: React.FC = () => {
  const { user } = useAuth();
  const { bossBattles, battleEvents, achievements, addBossBattle, subjects } = useData();
  const [activeTab, setActiveTab] = useState<'active' | 'codex' | 'history' | 'achievements'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modals state
  const [selectedMonsterForCodex, setSelectedMonsterForCodex] = useState<Monster | null>(null);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showFocusShieldModal, setShowFocusShieldModal] = useState(false);

  // New Boss Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<BossDifficulty>('Medium');
  const [subjectId, setSubjectId] = useState('');
  const [avatarIcon, setAvatarIcon] = useState('🐉');

  const activeBosses = bossBattles.filter((b) => b.status === 'ACTIVE');
  const defeatedBosses = bossBattles.filter((b) => b.status === 'DEFEATED');
  const userStreak = user?.currentStreak || 7;

  const handleCreateBoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const hpMap: Record<BossDifficulty, number> = {
      Easy: 500,
      Medium: 1000,
      Hard: 1500,
      Epic: 2500,
      Legendary: 5000,
    };

    const xpMap: Record<BossDifficulty, number> = {
      Easy: 250,
      Medium: 500,
      Hard: 750,
      Epic: 1250,
      Legendary: 2500,
    };

    addBossBattle({
      name,
      description: description || 'Conquer this milestone through study sessions and completed tasks.',
      difficulty,
      maxHp: hpMap[difficulty],
      xpReward: xpMap[difficulty],
      subjectId: subjectId || undefined,
      avatarIcon: avatarIcon || '🐉',
      rewardTitle: `${name} Slayer`,
      startDate: new Date().toISOString().split('T')[0],
    });

    setShowCreateModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-surface border border-brand-border p-6 rounded-3xl">
        <div className="flex items-center gap-4">
          <AppLogo size="lg" className="hidden sm:inline-flex" />
          <div>
            <div className="flex items-center gap-2 text-[#10b981] font-extrabold text-xs">
              <Sword size={18} />
              <span>OFFICIAL ARENA & 70-DAY EVOLUTION</span>
            </div>
            <h1 className="text-2xl font-black text-brand-text mt-1">Boss Battles Hub</h1>
            <p className="text-xs text-brand-muted mt-0.5">
              Defeat study bosses by completing tasks, defending focus with Focus Shield, and building unbreakable streaks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Level Details Trigger */}
          <button
            id="arena-level-details-btn"
            onClick={() => setShowLevelModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-brand-background border border-brand-border hover:border-brand-primary text-xs font-black text-brand-text transition flex items-center gap-1.5 shadow-sm"
          >
            <Layers size={14} className="text-emerald-500" />
            <span>Level Details</span>
          </button>

          {/* Focus Shield Button */}
          <button
            id="arena-focus-shield-btn"
            onClick={() => setShowFocusShieldModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-black transition flex items-center gap-1.5 shadow-sm"
          >
            <Shield size={14} />
            <span>Focus Shield</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-hover transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} />
            <span>Summon Boss</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-brand-border gap-6 text-sm font-extrabold overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'active'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <Sword size={16} />
          <span>Active Battles ({activeBosses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('codex')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'codex'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <BookOpen size={16} />
          <span>70-Day Monster Codex (10 Bosses)</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'history'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <History size={16} />
          <span>Combat History</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'achievements'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <Trophy size={16} />
          <span>Achievements ({achievements.filter((a) => a.unlocked).length}/{achievements.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* Tab 1: Active Battles                                     */}
      {/* ========================================================= */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBosses.map((boss) => (
              <AnimatedBossCard key={boss.id} boss={boss} />
            ))}
          </div>

          {activeBosses.length === 0 && (
            <div className="text-center py-12 bg-brand-surface border border-brand-border rounded-2xl p-6">
              <Trophy size={32} className="mx-auto text-amber-500 mb-2" />
              <h3 className="font-extrabold text-base text-brand-text">All Bosses Conquered!</h3>
              <p className="text-xs text-brand-muted mt-1">Summon a new boss or visit the 70-Day Monster Codex to challenge future monsters.</p>
            </div>
          )}

          {/* Defeated Bosses Showcase */}
          {defeatedBosses.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="font-black text-lg text-brand-text flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <span>Defeated Bosses ({defeatedBosses.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {defeatedBosses.map((boss) => (
                  <AnimatedBossCard key={boss.id} boss={boss} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* Tab 2: 70-Day Monster Codex & Progression                  */}
      {/* ========================================================= */}
      {activeTab === 'codex' && (
        <div className="space-y-6">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-500 font-extrabold text-xs uppercase tracking-wider">
                <Sparkles size={14} />
                <span>70-Day Mastery Evolution Cycle</span>
              </div>
              <h2 className="text-xl font-black text-brand-text mt-1">The 10 Study Bosses</h2>
              <p className="text-xs text-brand-muted mt-0.5">
                Every 7-day study streak evolves your focus to unlock and confront the next psychological beast.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-brand-background border border-brand-border rounded-xl">
              <div className="text-right">
                <p className="text-[10px] font-bold text-brand-muted uppercase">Your Study Streak</p>
                <p className="text-base font-black text-amber-500">{userStreak} Days</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-xl">
                🔥
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MONSTERS_STREAK_LIST.map((monster) => {
              const isUnlocked = userStreak >= monster.unlockStreakDays;
              const startDay = Math.max(1, (monster.order - 1) * 7 + 1);
              const endDay = monster.order * 7;

              return (
                <div
                  key={monster.id}
                  onClick={() => setSelectedMonsterForCodex(monster)}
                  className={`relative p-5 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-brand-surface border-brand-border hover:border-emerald-500/50 shadow-md'
                      : 'bg-brand-surface/60 border-brand-border/60 opacity-75'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      {/* Monster Image */}
                      <div className="relative w-16 h-16 rounded-2xl bg-brand-background border border-brand-border overflow-hidden flex items-center justify-center shrink-0">
                        <span className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none z-0">
                          {monster.avatarIcon}
                        </span>
                        <img
                          src={monster.imageSrc}
                          alt={monster.name}
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
                      </div>

                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider block">
                          Day {startDay}–{endDay}
                        </span>
                        <span className="text-[10px] font-bold text-brand-muted mt-1 block">
                          Stage #{monster.order}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {monster.subtitle}
                      </div>
                      <h3 className="text-lg font-black text-brand-text group-hover:text-emerald-400 transition mt-0.5">
                        {monster.name}
                      </h3>
                      <p className="text-xs text-brand-muted line-clamp-2 mt-1">
                        {monster.description}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-brand-background border border-brand-border text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-brand-muted">Flaw:</span>
                        <span className="font-bold text-rose-400">{monster.problem}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-brand-muted">Counter:</span>
                        <span className="font-bold text-emerald-400 truncate max-w-[140px]">
                          {monster.defeatHabit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-500">+{Math.round(monster.xpRewardScale * 250)} XP</span>
                    <span className="text-emerald-500 font-extrabold flex items-center gap-1 group-hover:underline">
                      <span>View Abilities</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Tab 3: Combat History                                     */}
      {/* ========================================================= */}
      {activeTab === 'history' && (
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
          <h2 className="font-extrabold text-base text-brand-text">Recent Battle Events</h2>
          <div className="space-y-2.5">
            {battleEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl bg-brand-background border border-brand-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 font-extrabold text-xs">
                    -{evt.damage} HP
                  </div>
                  <div>
                    <div className="font-bold text-sm text-brand-text">{evt.description}</div>
                    <div className="text-[11px] text-brand-muted">
                      {new Date(evt.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-amber-500">+{evt.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Tab 4: Achievements                                       */}
      {/* ========================================================= */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition ${
                ach.unlocked
                  ? 'bg-brand-surface border-amber-500/30 shadow-sm'
                  : 'bg-brand-background border-brand-border opacity-60'
              }`}
            >
              <div className="text-3xl mb-2">{ach.icon}</div>
              <h3 className="font-black text-sm text-brand-text">{ach.title}</h3>
              <p className="text-xs text-brand-muted mt-1">{ach.description}</p>
              {ach.unlocked && (
                <div className="mt-3 text-[10px] font-extrabold text-amber-500">
                  UNLOCKED {ach.unlockedAt ? `(${ach.unlockedAt})` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Monster Details Modal */}
      {selectedMonsterForCodex && (
        <MonsterDetailModal
          monster={selectedMonsterForCodex}
          currentStreak={userStreak}
          onClose={() => setSelectedMonsterForCodex(null)}
        />
      )}

      {/* Level Details Modal */}
      {showLevelModal && (
        <LevelDetailsModal
          level="Medium"
          onClose={() => setShowLevelModal(false)}
          onSelectMonster={(monster) => {
            setShowLevelModal(false);
            setSelectedMonsterForCodex(monster);
          }}
        />
      )}

      {/* Focus Shield Modal */}
      {showFocusShieldModal && (
        <FocusShieldModal
          onClose={() => setShowFocusShieldModal(false)}
        />
      )}

      {/* Create Boss Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h2 className="font-extrabold text-base text-brand-text">Summon New Boss</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-brand-muted hover:text-brand-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBoss} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-brand-muted mb-1">Boss Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Chemistry Hydra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-brand-background border border-brand-border text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-brand-muted mb-1">Description / Goal</label>
                <textarea
                  placeholder="What milestone must be conquered to defeat this boss?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-brand-background border border-brand-border text-sm text-brand-text focus:outline-none focus:border-brand-primary h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-brand-muted mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as BossDifficulty)}
                    className="w-full px-3 py-2 rounded-xl bg-brand-background border border-brand-border text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                  >
                    <option value="Easy">Easy (500 HP)</option>
                    <option value="Medium">Medium (1000 HP)</option>
                    <option value="Hard">Hard (1500 HP)</option>
                    <option value="Epic">Epic (2500 HP)</option>
                    <option value="Legendary">Legendary (5000 HP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-brand-muted mb-1">Avatar Emoji</label>
                  <input
                    type="text"
                    value={avatarIcon}
                    onChange={(e) => setAvatarIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-brand-background border border-brand-border text-sm text-brand-text text-center focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <SubjectSelect
                  label="Linked Subject (Optional)"
                  value={subjectId}
                  onChange={setSubjectId}
                  placeholder="General / All Subjects"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold text-brand-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover"
                >
                  Summon Boss
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
