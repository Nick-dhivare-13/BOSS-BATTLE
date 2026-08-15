import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { AlarmSoundType, playSound } from '../utils/audio';
import { useNotification } from '../hooks/useNotification';
import { SubjectSelect } from '../components/Subject/SubjectSelect';
import { NewReminderModal } from '../components/Modals/NewReminderModal';
import { FocusShieldModal } from '../components/Boss/FocusShieldModal';
import {
  Play,
  Pause,
  RotateCcw,
  Timer as TimerIcon,
  Star,
  CheckCircle2,
  Sparkles,
  Coffee,
  Flame,
  Volume2,
  Bell,
  BellRing,
  Settings,
  ChevronRight,
  Zap,
  VolumeX,
  Plus,
  Shield,
} from 'lucide-react';
import { StudyPreset } from '../types';

export const StudyTimer: React.FC = () => {
  const { subjects, tasks, recordStudySession, studySettings, updateStudySettings, alarmSettings, updateAlarmSettings } = useData();
  const { soundEnabled } = useTheme();
  const { isSupported, permission, requestPermission: requestDesktopPermission, sendNotification } = useNotification();

  // Mode Selection
  const [preset, setPreset] = useState<StudyPreset>('productive');
  const [phase, setPhase] = useState<'study' | 'break' | 'long_break'>('study');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(4);

  // Time durations in seconds
  const [studySecs, setStudySecs] = useState<number>(30 * 60); // 30 min default for Productive
  const [breakSecs, setBreakSecs] = useState<number>(10 * 60); // 10 min default for Productive
  const [secondsLeft, setSecondsLeft] = useState<number>(30 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Linkers
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<string>('');

  // Alarm & Completion Overlay
  const [showAlarmOverlay, setShowAlarmOverlay] = useState<boolean>(false);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [sessionCompletedDuration, setSessionCompletedDuration] = useState<number>(0);
  const [sessionRating, setSessionRating] = useState<number>(5);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [showNewReminderModal, setShowNewReminderModal] = useState<boolean>(false);
  const [showFocusShieldModal, setShowFocusShieldModal] = useState<boolean>(false);

  // Alarm interval ref for repeating alert sound
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Configure durations when preset changes
  const applyPreset = (newPreset: StudyPreset) => {
    setIsRunning(false);
    setPreset(newPreset);
    setPhase('study');
    setCurrentRound(1);

    let s = 30 * 60;
    let b = 10 * 60;
    let r = 4;

    if (newPreset === 'pomodoro') {
      s = 25 * 60;
      b = 5 * 60;
      r = 4;
    } else if (newPreset === 'productive') {
      s = 30 * 60;
      b = 10 * 60;
      r = 4;
    } else if (newPreset === 'deep_focus') {
      s = 50 * 60;
      b = 10 * 60;
      r = 2;
    } else if (newPreset === 'long_focus') {
      s = 90 * 60;
      b = 15 * 60;
      r = 2;
    } else if (newPreset === 'stopwatch') {
      s = 0;
      b = 0;
      r = 1;
    } else if (newPreset === 'custom') {
      s = studySettings.studyDuration * 60;
      b = studySettings.breakDuration * 60;
      r = studySettings.rounds;
    }

    setStudySecs(s);
    setBreakSecs(b);
    setTotalRounds(r);
    setSecondsLeft(s);
  };

  // Main countdown/up loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (preset === 'stopwatch') {
            return prev + 1;
          }

          if (prev <= 1) {
            triggerPhaseCompletion();
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, preset, phase, currentRound]);

  // Handle phase completion & trigger Alarm
  const triggerPhaseCompletion = () => {
    setIsRunning(false);
    const duration = phase === 'study' ? studySecs : breakSecs;
    setSessionCompletedDuration(duration);

    const isAlarmAllowed =
      (phase === 'study' && alarmSettings.studyAlarmEnabled) ||
      (phase !== 'study' && alarmSettings.breakAlarmEnabled);

    // Play loud alarm tone
    if (isAlarmAllowed) {
      playSound('alarm', soundEnabled, (alarmSettings.volume || 80) / 100, alarmSettings.alarmType);

      // Continuous alarm interval until stopped or snoozed
      if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = setInterval(() => {
        playSound('alarm', soundEnabled, (alarmSettings.volume || 80) / 100, alarmSettings.alarmType);
      }, 2800);
    }

    // Vibration support
    if (typeof navigator !== 'undefined' && navigator.vibrate && studySettings.vibrateEnabled) {
      navigator.vibrate([300, 150, 300, 150, 400]);
    }

    // Native Desktop Notification
    sendNotification(
      phase === 'study' ? '🎉 Focus Round Completed!' : '⚡ Break Time Finished!',
      {
        body: phase === 'study' ? 'Awesome focus! Time to recharge your brain.' : 'Ready for the next focus sprint?',
        tag: `studytimer_${Date.now()}`,
        onClick: () => {
          window.focus();
        },
      }
    );

    setShowAlarmOverlay(true);
  };

  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    setShowAlarmOverlay(false);

    if (phase === 'study') {
      setShowRatingModal(true);
    } else {
      // Transition back to study round
      setPhase('study');
      setSecondsLeft(studySecs);
      if (studySettings.autoStartStudy) {
        setIsRunning(true);
      }
    }
  };

  const snoozeTimer = (extraMinutes: number = 5) => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    setShowAlarmOverlay(false);
    setSecondsLeft(extraMinutes * 60);
    setIsRunning(true);
  };

  const startBreakDirectly = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    setShowAlarmOverlay(false);

    // Save study session
    recordStudySession({
      durationSeconds: studySecs,
      type: preset,
      subjectId: selectedSubject || undefined,
      taskId: selectedTask || undefined,
      rating: 5,
    });

    // Advance to break
    const isLongBreak = currentRound >= totalRounds;
    const nextPhase = isLongBreak ? 'long_break' : 'break';
    const nextSecs = isLongBreak ? studySettings.longBreakDuration * 60 : breakSecs;

    setPhase(nextPhase);
    setSecondsLeft(nextSecs);
    if (studySettings.autoStartBreak) {
      setIsRunning(true);
    }
  };

  const handleFinishRating = () => {
    recordStudySession({
      durationSeconds: sessionCompletedDuration > 0 ? sessionCompletedDuration : studySecs - secondsLeft,
      type: preset,
      subjectId: selectedSubject || undefined,
      taskId: selectedTask || undefined,
      rating: sessionRating,
    });
    setShowRatingModal(false);

    // Next round progression
    if (currentRound < totalRounds) {
      setCurrentRound((prev) => prev + 1);
      setPhase('break');
      setSecondsLeft(breakSecs);
      if (studySettings.autoStartBreak) {
        setIsRunning(true);
      }
    } else {
      // Completed all rounds
      setCurrentRound(1);
      setPhase('study');
      setSecondsLeft(studySecs);
    }
  };

  const handleRequestNotificationPermission = () => {
    requestDesktopPermission();
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const selectedSubjectObj = subjects.find((s) => s.id === selectedSubject);

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto select-none">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-[#10b981] font-black text-xs uppercase tracking-widest">
          <TimerIcon size={16} />
          <span>Advanced Focus & Time Manager</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
          Productive Study Engine
        </h1>
        <p className="text-xs md:text-sm text-[#64748b] dark:text-slate-400">
          Earn XP, level up, and deal heavy RPG damage to active bosses for every completed focus minute.
        </p>
      </div>

      {/* Focus Shield Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs font-black uppercase text-emerald-400">🛡️ Focus Shield</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Anti-Distraction
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Block digital urges, defend selected websites, and deal bonus damage to active study bosses!
            </p>
          </div>
        </div>

        <button
          id="open-focus-shield-btn"
          type="button"
          onClick={() => setShowFocusShieldModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition shrink-0 shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
        >
          <Shield size={14} />
          <span>Activate Shield</span>
        </button>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 shadow-sm text-xs font-black">
        <button
          onClick={() => applyPreset('productive')}
          className={`px-3.5 py-2 rounded-xl transition ${
            preset === 'productive'
              ? 'bg-[#10b981] text-white shadow-sm'
              : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
          }`}
        >
          ⚡ 30m / 10m Productive
        </button>
        <button
          onClick={() => applyPreset('pomodoro')}
          className={`px-3.5 py-2 rounded-xl transition ${
            preset === 'pomodoro'
              ? 'bg-[#10b981] text-white shadow-sm'
              : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
          }`}
        >
          🍅 25m Pomodoro
        </button>
        <button
          onClick={() => applyPreset('deep_focus')}
          className={`px-3.5 py-2 rounded-xl transition ${
            preset === 'deep_focus'
              ? 'bg-[#10b981] text-white shadow-sm'
              : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
          }`}
        >
          🎯 50m Deep Focus
        </button>
        <button
          onClick={() => applyPreset('long_focus')}
          className={`px-3.5 py-2 rounded-xl transition ${
            preset === 'long_focus'
              ? 'bg-[#10b981] text-white shadow-sm'
              : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
          }`}
        >
          ⏳ 90m Long Focus
        </button>
        <button
          onClick={() => applyPreset('stopwatch')}
          className={`px-3.5 py-2 rounded-xl transition ${
            preset === 'stopwatch'
              ? 'bg-[#10b981] text-white shadow-sm'
              : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
          }`}
        >
          ⏱️ Stopwatch
        </button>
        <button
          onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
          className={`p-2 rounded-xl transition ${
            showSettingsDrawer
              ? 'bg-[#10b981]/20 text-[#10b981]'
              : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
          }`}
          title="Custom Timer Settings"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Custom Timer Settings Drawer */}
      {showSettingsDrawer && (
        <div className="bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 p-5 rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0f172a] dark:text-white">
              Timer Customization & Alarms
            </h3>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="text-xs font-bold text-[#64748b] hover:text-[#0f172a]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#64748b] dark:text-slate-400 mb-1">Focus (min)</label>
              <input
                type="number"
                min="5"
                max="180"
                value={studySettings.studyDuration}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateStudySettings({ studyDuration: val });
                  if (preset === 'custom') {
                    setStudySecs(val * 60);
                    if (phase === 'study') setSecondsLeft(val * 60);
                  }
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#64748b] dark:text-slate-400 mb-1">Break (min)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={studySettings.breakDuration}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateStudySettings({ breakDuration: val });
                  if (preset === 'custom') {
                    setBreakSecs(val * 60);
                  }
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#64748b] dark:text-slate-400 mb-1">Rounds</label>
              <input
                type="number"
                min="1"
                max="12"
                value={totalRounds}
                onChange={(e) => setTotalRounds(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#64748b] dark:text-slate-400 mb-1">Alarm Sound Tone</label>
              <select
                value={alarmSettings.alarmType}
                onChange={(e) => updateAlarmSettings({ alarmType: e.target.value as AlarmSoundType })}
                className="w-full px-3 py-1.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              >
                <option value="bell">🔔 Temple Bell (Clear resonance)</option>
                <option value="digital">📟 Digital Clock Beep</option>
                <option value="classic">⏰ Classic Twin-Bell Alarm</option>
                <option value="strong_alert">🚨 Strong Alert Siren</option>
                <option value="arcade">👾 8-Bit Arcade Victory</option>
                <option value="chime">🍃 Zen Wind Chime</option>
                <option value="victory">🎺 Victory Fanfare</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#64748b] dark:text-slate-400 mb-1">
                Volume: {alarmSettings.volume}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={alarmSettings.volume}
                onChange={(e) => updateAlarmSettings({ volume: Number(e.target.value) })}
                className="w-full accent-[#10b981]"
              />
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#e2e8f0] dark:border-slate-700 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0f172a] dark:text-white">
              <input
                type="checkbox"
                checked={alarmSettings.studyAlarmEnabled}
                onChange={(e) => updateAlarmSettings({ studyAlarmEnabled: e.target.checked })}
                className="rounded accent-[#10b981]"
              />
              Study Alarm
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0f172a] dark:text-white">
              <input
                type="checkbox"
                checked={alarmSettings.breakAlarmEnabled}
                onChange={(e) => updateAlarmSettings({ breakAlarmEnabled: e.target.checked })}
                className="rounded accent-[#10b981]"
              />
              Break Alarm
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0f172a] dark:text-white">
              <input
                type="checkbox"
                checked={alarmSettings.completionSoundEnabled}
                onChange={(e) => updateAlarmSettings({ completionSoundEnabled: e.target.checked })}
                className="rounded accent-[#10b981]"
              />
              Feedback Sounds
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e2e8f0] dark:border-slate-700">
            <button
              onClick={() => playSound('alarm', true, (alarmSettings.volume || 80) / 100, alarmSettings.alarmType)}
              className="text-xs font-bold text-[#10b981] hover:underline flex items-center gap-1"
            >
              <Bell size={13} /> Test Alarm Audio
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNewReminderModal(true)}
                className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
              >
                <Plus size={13} /> Schedule Daily Reminder
              </button>

              <button
                onClick={handleRequestNotificationPermission}
                className="text-xs font-bold text-[#06b6d4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <BellRing size={13} /> Enable Desktop Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Clock Card */}
      <div
        className={`border rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-sm relative overflow-hidden transition-all ${
          phase === 'study'
            ? 'bg-white dark:bg-slate-900 border-[#e2e8f0] dark:border-slate-800'
            : 'bg-[#10b981]/5 border-[#10b981]/40'
        }`}
      >
        {/* Phase & Round Badge */}
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                phase === 'study'
                  ? 'bg-[#10b981]/15 text-[#10b981]'
                  : 'bg-[#3b82f6]/15 text-[#3b82f6]'
              }`}
            >
              {phase === 'study' ? '🔥 Focus Sprint' : '☕ Rest & Hydration'}
            </span>

            {preset !== 'stopwatch' && (
              <span className="text-xs font-bold text-[#64748b] dark:text-slate-400">
                Round {currentRound} / {totalRounds}
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-[#f59e0b] flex items-center gap-1">
            <Flame size={14} /> +{Math.max(20, Math.round(studySecs / 60) * 5)} XP on Finish
          </span>
        </div>

        {/* Big Digital Numbers */}
        <div className="py-2">
          <span className="text-7xl md:text-8xl font-black font-mono tracking-tighter text-[#0f172a] dark:text-white">
            {formatTime(secondsLeft)}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(phase === 'study' ? studySecs : breakSecs);
            }}
            className="p-4 rounded-2xl bg-[#f1f5f9] dark:bg-slate-800 text-[#64748b] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-white transition"
            title="Reset Timer"
          >
            <RotateCcw size={22} />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 rounded-2xl font-black text-base uppercase tracking-wider flex items-center gap-3 text-white shadow-lg transition transform active:scale-95 ${
              isRunning
                ? 'bg-[#f43f5e] hover:bg-[#e11d48] shadow-[#f43f5e]/30'
                : 'bg-[#10b981] hover:bg-[#059669] shadow-[#10b981]/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={20} />
                <span>Pause Focus</span>
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" />
                <span>Start Session</span>
              </>
            )}
          </button>

          <button
            onClick={() => triggerPhaseCompletion()}
            className="px-4 py-4 rounded-2xl bg-[#f1f5f9] dark:bg-slate-800 text-[#64748b] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-white text-xs font-black uppercase tracking-wider transition"
            title="Finish & Save Session"
          >
            End Now
          </button>
        </div>

        {/* Linked Subject & Task Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left pt-4 border-t border-[#f1f5f9] dark:border-slate-800">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#64748b] dark:text-slate-400 mb-1">
              Link Subject
            </label>
            <SubjectSelect
              value={selectedSubject}
              onChange={setSelectedSubject}
              showLabel={false}
              placeholder="No Subject Linked"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#64748b] dark:text-slate-400 mb-1">
              Link Task
            </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white truncate"
            >
              <option value="">No Task Linked</option>
              {tasks
                .filter((t) => t.status !== 'completed')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* LOUD ON-SCREEN ALARM OVERLAY MODAL */}
      {showAlarmOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#10b981] rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl animate-bounce">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#10b981]/20 flex items-center justify-center text-4xl animate-pulse">
              🔔
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#0f172a] dark:text-white">
                {phase === 'study' ? 'Focus Round Completed!' : 'Break Time Finished!'}
              </h2>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                {phase === 'study'
                  ? 'Outstanding discipline! Boss hit with massive focus attack damage.'
                  : 'Time to jump back into your study groove.'}
              </p>
            </div>

            {/* Alarm Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={stopAlarm}
                className="w-full py-3.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#10b981]/25 transition"
              >
                STOP ALARM
              </button>

              {phase === 'study' && (
                <button
                  onClick={startBreakDirectly}
                  className="w-full py-3 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <Coffee size={15} /> Start 10-Min Break
                </button>
              )}

              <button
                onClick={() => snoozeTimer(5)}
                className="w-full py-2.5 rounded-xl border border-[#cbd5e1] dark:border-slate-700 hover:bg-[#f1f5f9] dark:hover:bg-slate-800 text-[#64748b] dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition"
              >
                Snooze (+5 Minutes)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Star Rating & Reflection Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#f59e0b]/20 flex items-center justify-center text-2xl">
              ⭐
            </div>

            <div>
              <h3 className="text-xl font-black text-[#0f172a] dark:text-white">Session Quality</h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
                How productive was this focus sprint?
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSessionRating(s)}
                  className={`p-2 transition ${s <= sessionRating ? 'text-[#f59e0b]' : 'text-[#cbd5e1] dark:text-slate-700'}`}
                >
                  <Star size={28} fill={s <= sessionRating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>

            <button
              onClick={handleFinishRating}
              className="w-full py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider shadow-md transition"
            >
              Save & Claim XP
            </button>
          </div>
        </div>
      )}

      {/* Schedule Reminder Modal */}
      <NewReminderModal
        isOpen={showNewReminderModal}
        onClose={() => setShowNewReminderModal(false)}
        initialType="study"
        initialSubjectId={selectedSubject}
      />

      {/* Focus Shield Modal */}
      {showFocusShieldModal && (
        <FocusShieldModal
          initialTaskId={selectedTask || undefined}
          onClose={() => setShowFocusShieldModal(false)}
        />
      )}
    </div>
  );
};
