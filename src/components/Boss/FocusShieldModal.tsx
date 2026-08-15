import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Monster, MONSTERS_STREAK_LIST, getMonsterById } from '../../data/monsters';
import { playSound } from '../../utils/audio';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Sword,
  Flame,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react';

export interface DistractionSite {
  id: string;
  name: string;
  category: string;
  isCustom?: boolean;
}

export const DEFAULT_DISTRACTIONS: DistractionSite[] = [
  { id: 'youtube', name: 'YouTube', category: 'Video Stream' },
  { id: 'instagram', name: 'Instagram', category: 'Social Media' },
  { id: 'facebook', name: 'Facebook', category: 'Social Media' },
  { id: 'reddit', name: 'Reddit', category: 'Forums & Feeds' },
  { id: 'twitter', name: 'X / Twitter', category: 'Social Feeds' },
  { id: 'tiktok', name: 'TikTok', category: 'Short Video' },
  { id: 'gaming', name: 'Gaming websites (Twitch, Steam, etc.)', category: 'Gaming' },
];

interface FocusShieldModalProps {
  initialTaskId?: string;
  initialTaskTitle?: string;
  onClose: () => void;
  onSessionComplete?: (mins: number) => void;
}

export const FocusShieldModal: React.FC<FocusShieldModalProps> = ({
  initialTaskId,
  initialTaskTitle,
  onClose,
  onSessionComplete,
}) => {
  const { user } = useAuth();
  const { tasks, bossBattles, recordStudySession, triggerFeedback } = useData();
  const { soundEnabled } = useTheme();

  // Active Boss
  const activeBoss = bossBattles.find((b) => b.status === 'ACTIVE') || bossBattles[0];
  const monsterData =
    (activeBoss?.monsterId && getMonsterById(activeBoss.monsterId)) ||
    MONSTERS_STREAK_LIST[0];

  // Step 1: Config vs Step 2: Active Session
  const [sessionActive, setSessionActive] = useState<boolean>(false);

  // Form State
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTaskId || '');
  const [customTaskTitle, setCustomTaskTitle] = useState<string>(initialTaskTitle || '');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('45');

  // Distraction Selection
  const [availableDistractions, setAvailableDistractions] =
    useState<DistractionSite[]>(DEFAULT_DISTRACTIONS);
  const [selectedDistractionIds, setSelectedDistractionIds] = useState<string[]>([
    'youtube',
    'instagram',
    'reddit',
    'twitter',
    'tiktok',
    'gaming',
  ]);
  const [newCustomSite, setNewCustomSite] = useState<string>('');

  // Active Timer State
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [initialTotalSeconds, setInitialTotalSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [temptationsResisted, setTemptationsResisted] = useState<number>(0);
  const [showExtensionInfo, setShowExtensionInfo] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle distraction item
  const toggleDistraction = (id: string) => {
    setSelectedDistractionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add custom website
  const handleAddCustomDistraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomSite.trim()) return;
    const cleanName = newCustomSite.trim();
    const newId = `custom_${Date.now()}`;
    const newSite: DistractionSite = {
      id: newId,
      name: cleanName,
      category: 'Custom Shield Target',
      isCustom: true,
    };
    setAvailableDistractions((prev) => [...prev, newSite]);
    setSelectedDistractionIds((prev) => [...prev, newId]);
    setNewCustomSite('');
  };

  // Resolve Effective Task Title
  const effectiveTaskTitle =
    (selectedTaskId && tasks.find((t) => t.id === selectedTaskId)?.title) ||
    customTaskTitle ||
    'Deep Focus & Study Mastery';

  // Duration selection
  const handleSelectDuration = (mins: number) => {
    setIsCustomDuration(false);
    setDurationMinutes(mins);
  };

  // Start Focus Shield
  const handleActivateFocusShield = () => {
    const finalMinutes = isCustomDuration
      ? Math.max(1, parseInt(customMinutesInput) || 25)
      : durationMinutes;

    const totalSecs = finalMinutes * 60;
    setDurationMinutes(finalMinutes);
    setInitialTotalSeconds(totalSecs);
    setSecondsRemaining(totalSecs);
    setSessionActive(true);
    setIsTimerRunning(true);
    setTemptationsResisted(0);

    if (soundEnabled) {
      playSound('xp', true, 0.4);
    }
  };

  // Timer loop
  useEffect(() => {
    if (sessionActive && isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleCompleteFocusShield();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionActive, isTimerRunning]);

  // Complete Session Successfully
  const handleCompleteFocusShield = (isManualEarly = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);

    const elapsedSeconds = initialTotalSeconds - secondsRemaining;
    const finalElapsedMinutes = isManualEarly
      ? Math.max(1, Math.round(elapsedSeconds / 60))
      : durationMinutes;

    // Record study session using existing XP & Boss combat architecture
    recordStudySession({
      durationSeconds: finalElapsedMinutes * 60,
      type: 'deep_focus',
      taskId: selectedTaskId || undefined,
      rating: 5,
    });

    if (soundEnabled) {
      playSound('boss_defeat', true, 0.5);
    }

    triggerFeedback(
      `🛡️ Focus Shield Victorious! Defended against ${selectedDistractionIds.length} distraction sources for ${finalElapsedMinutes} mins!`,
      'level',
      `+${finalElapsedMinutes * 5} XP • ${finalElapsedMinutes * 4} Boss Damage`,
      'shield'
    );

    if (onSessionComplete) {
      onSessionComplete(finalElapsedMinutes);
    }

    onClose();
  };

  // Handle resisted temptation click
  const handleLogTemptationResisted = () => {
    setTemptationsResisted((prev) => prev + 1);
    if (soundEnabled) {
      playSound('subtask', true, 0.3);
    }
    triggerFeedback('🛡️ Focus Defended! +10 Willpower Bonus', 'xp', 'Temptation conquered', 'shield');
  };

  // Format time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Boss Damage Preview
  const previewDamage = Math.max(15, durationMinutes * 4);
  const previewXP = Math.max(20, durationMinutes * 5);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((initialTotalSeconds - secondsRemaining) / initialTotalSeconds) * 100))
  );

  return (
    <div
      id="focus-shield-backdrop"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'focus-shield-backdrop' && !sessionActive) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div
        id="focus-shield-modal"
        className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-2xl w-full my-6 shadow-2xl overflow-hidden flex flex-col relative text-white transition-all"
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Focus Shield System
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                  Anti-Distraction Protocol
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                {sessionActive ? '🛡️ Focus Shield Active' : 'Configure Focus Shield'}
              </h2>
            </div>
          </div>

          {!sessionActive && (
            <button
              id="close-focus-shield-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ========================================================= */}
        {/* STEP 1: CONFIGURATION PANEL                               */}
        {/* ========================================================= */}
        {!sessionActive ? (
          <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Target Task Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                1. Select Task to Defend
              </label>
              {tasks.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={selectedTaskId}
                    onChange={(e) => {
                      setSelectedTaskId(e.target.value);
                      if (e.target.value) setCustomTaskTitle('');
                    }}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Choose from your active tasks --</option>
                    {tasks
                      .filter((t) => t.status !== 'completed')
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} ({t.priority.toUpperCase()})
                        </option>
                      ))}
                  </select>

                  {!selectedTaskId && (
                    <input
                      type="text"
                      placeholder="Or enter custom focus objective..."
                      value={customTaskTitle}
                      onChange={(e) => setCustomTaskTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="What is your focus objective? (e.g. Master Calculus Limits)"
                  value={customTaskTitle}
                  onChange={(e) => setCustomTaskTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              )}
            </div>

            {/* Focus Duration Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                  2. Choose Focus Duration
                </label>
                <span className="text-xs font-bold text-emerald-400">
                  +{previewXP} XP • {previewDamage} Boss DMG
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { mins: 25, label: '25 min', sub: 'Pomodoro Sprint' },
                  { mins: 50, label: '50 min', sub: 'Deep Focus' },
                  { mins: 90, label: '90 min', sub: 'Ultra Block' },
                ].map((item) => (
                  <button
                    key={item.mins}
                    type="button"
                    onClick={() => handleSelectDuration(item.mins)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      !isCustomDuration && durationMinutes === item.mins
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-black'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-sm font-black text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{item.sub}</div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomDuration(true)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    isCustomDuration
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-black'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-sm font-black text-white">Custom</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">Any Minutes</div>
                </button>
              </div>

              {isCustomDuration && (
                <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-400">Custom Duration:</span>
                  <input
                    type="number"
                    min="1"
                    max="240"
                    value={customMinutesInput}
                    onChange={(e) => setCustomMinutesInput(e.target.value)}
                    className="w-20 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-black text-white text-center focus:border-emerald-500"
                  />
                  <span className="text-xs text-slate-400 font-medium">Minutes</span>
                </div>
              )}
            </div>

            {/* Distraction Selection Panel */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                  3. Select Distractions to Shield Against
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDistractionIds(availableDistractions.map((d) => d.id))
                    }
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    Select All
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedDistractionIds([])}
                    className="text-slate-400 hover:underline font-bold"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableDistractions.map((site) => {
                  const isChecked = selectedDistractionIds.includes(site.id);
                  return (
                    <label
                      key={site.id}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer select-none ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                          : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleDistraction(site.id)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                        />
                        <div>
                          <span className="text-xs font-bold block">{site.name}</span>
                          <span className="text-[10px] text-slate-500">{site.category}</span>
                        </div>
                      </div>
                      <Shield
                        size={15}
                        className={isChecked ? 'text-emerald-400' : 'text-slate-700'}
                      />
                    </label>
                  );
                })}
              </div>

              {/* Add Custom Website input */}
              <form onSubmit={handleAddCustomDistraction} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom distraction (e.g. Netflix, Twitch, Discord)..."
                  value={newCustomSite}
                  onChange={(e) => setNewCustomSite(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!newCustomSite.trim()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 transition"
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </form>
            </div>

            {/* Connected Boss Battle Preview */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                  <span className="absolute inset-0 flex items-center justify-center text-xl pointer-events-none z-0">
                    {monsterData.avatarIcon}
                  </span>
                  <img
                    src={monsterData.imageSrc}
                    alt={monsterData.name}
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
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-rose-400">
                      Boss Target
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {activeBoss ? `${activeBoss.currentHp} / ${activeBoss.maxHp} HP` : ''}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">{monsterData.name}</h4>
                  <p className="text-[11px] text-slate-400">Flaw: {monsterData.problem}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-black text-emerald-400">
                  {monsterData.name === 'Dopa-Hound' ? '🎯 High Vulnerability' : '⚔️ Active Target'}
                </div>
                <div className="text-[11px] text-slate-400">Takes direct focus damage</div>
              </div>
            </div>

            {/* Technical Sandbox Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Web Shield Commitment Notice
                </span>
                <button
                  type="button"
                  onClick={() => setShowExtensionInfo(!showExtensionInfo)}
                  className="text-[11px] text-emerald-400 hover:underline font-bold"
                >
                  {showExtensionInfo ? 'Hide Details' : 'Extension Info'}
                </button>
              </div>
              <p className="text-[11px] leading-relaxed">
                Focus Shield defends your attention via active session tracking, pledge validation, and combat rewards. Because this runs as a secure web application, system-level tab blocking will pair with our optional companion Browser Extension.
              </p>
              {showExtensionInfo && (
                <div className="pt-2 text-[11px] text-slate-300 border-t border-slate-800 space-y-1">
                  <p>
                    • <strong>Current Web App:</strong> Tracks your focus pledge, logs resistance against temptation, awards XP, and delivers direct boss combat damage.
                  </p>
                  <p>
                    • <strong>Companion Extension:</strong> When installed, it will read your selected shield sites and provide hard-blocking redirect loops.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* STEP 2: ACTIVE FOCUS SHIELD VIEW & HUD                    */
          /* ========================================================= */
          <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Shield Badge & Active Task Banner */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                    Shield Protocol Engaged
                  </span>
                  <span className="text-xs text-emerald-300 font-bold">
                    {temptationsResisted > 0 ? `• ${temptationsResisted} Urges Conquered` : ''}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">{effectiveTaskTitle}</h3>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 text-2xl animate-pulse">
                🛡️
              </div>
            </div>

            {/* Huge Timer Countdown Display */}
            <div className="text-center py-4 space-y-3 bg-slate-900/60 rounded-3xl border border-slate-800">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Time Remaining In Shield Cycle
              </p>

              <div className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono tabular-nums">
                {formatTime(secondsRemaining)}
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto px-6">
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1.5">
                  <span>Progress: {progressPercent}%</span>
                  <span>Target: {durationMinutes} Mins</span>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isTimerRunning ? 'Pause Shield' : 'Resume Shield'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogTemptationResisted}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
                  title="Resisted opening a distracting tab? Click to log willpower bonus!"
                >
                  <Zap size={14} className="text-amber-400" />
                  <span>Resisted Distraction (+10 XP)</span>
                </button>
              </div>
            </div>

            {/* Distractions Protected List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Distractions Protected ({selectedDistractionIds.length})
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">Defended</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableDistractions
                  .filter((d) => selectedDistractionIds.includes(d.id))
                  .map((d) => (
                    <span
                      key={d.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Shield size={12} className="text-emerald-400" />
                      <span>{d.name}</span>
                    </span>
                  ))}
                {selectedDistractionIds.length === 0 && (
                  <span className="text-xs text-slate-500 italic">No specific websites selected</span>
                )}
              </div>
            </div>

            {/* Boss Battle Combat HUD */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sword size={15} className="text-rose-400" />
                  <span className="font-black uppercase tracking-wider text-slate-300">
                    Active Study Boss: {monsterData.name}
                  </span>
                </div>
                <span className="font-bold text-amber-400">
                  +{Math.round((progressPercent / 100) * previewDamage)} / {previewDamage} Damage Dealt
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                  <span className="absolute inset-0 flex items-center justify-center text-xl pointer-events-none z-0">
                    {monsterData.avatarIcon}
                  </span>
                  <img
                    src={monsterData.imageSrc}
                    alt={monsterData.name}
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

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>{monsterData.subtitle}</span>
                    <span>Flaw: {monsterData.problem}</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${100 - (progressPercent * 0.4)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {!sessionActive ? (
            <>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                <span>Rewards: +{previewXP} XP • {previewDamage} Boss DMG</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition flex-1 sm:flex-initial"
                >
                  Cancel
                </button>
                <button
                  id="start-focus-shield-btn"
                  type="button"
                  onClick={handleActivateFocusShield}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 flex-1 sm:flex-initial"
                >
                  <Shield size={16} />
                  <span>Activate Focus Shield</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="text-xs text-slate-400">
                Focus Shield is defending your study session in real time.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleCompleteFocusShield(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 flex-1 sm:flex-initial shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle2 size={15} />
                  <span>Claim Early & Finish</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Cancel Focus Shield session? Progress so far will be dismissed.')) {
                      if (timerRef.current) clearInterval(timerRef.current);
                      onClose();
                    }
                  }}
                  className="px-3 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 text-xs font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
