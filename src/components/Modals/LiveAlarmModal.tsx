import React, { useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { LiveAlarmData } from '../../types';
import { useNotification } from '../../hooks/useNotification';
import { playSound } from '../../utils/audio';
import { BellRing, Play, Coffee, RotateCcw, Volume2, VolumeX, Bell } from 'lucide-react';

interface LiveAlarmModalProps {
  alarm?: LiveAlarmData | null;
  onStop?: () => void;
  onStartBreak?: () => void;
  onSnooze?: () => void;
  onStartStudy?: () => void;
  onNavigate?: (tab: string) => void;
}

export const LiveAlarmModal: React.FC<LiveAlarmModalProps> = ({
  alarm: propAlarm,
  onStop: propOnStop,
  onStartBreak,
  onSnooze: propOnSnooze,
  onStartStudy,
  onNavigate,
}) => {
  const { liveAlarm, dismissLiveAlarm, alarmSettings } = useData();
  const { soundEnabled } = useTheme();
  const { isSupported, permission, requestPermission, sendNotification } = useNotification();

  const alarm = propAlarm !== undefined ? propAlarm : liveAlarm;
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextUnlockedRef = useRef(false);

  const isStudyComplete = alarm?.type === 'study_complete';
  const isBreakComplete = alarm?.type === 'break_complete';
  const isReminder = alarm?.type === 'reminder';

  // 1. Continuous sound loop while alarm modal is visible until user interacts
  useEffect(() => {
    if (!alarm) {
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
      return;
    }

    const soundAllowed = soundEnabled && (
      (isStudyComplete && alarmSettings.studyAlarmEnabled) ||
      (isBreakComplete && alarmSettings.breakAlarmEnabled) ||
      (isReminder && alarmSettings.reminderAlarmEnabled) ||
      alarm.type === 'test' ||
      alarm.type === 'alarm'
    );

    const volumeLevel = (alarmSettings?.volume ?? 80) / 100;
    const soundType = alarmSettings?.alarmType ?? 'bell';

    // Play immediate first chime/alarm
    if (soundAllowed) {
      playSound('alarm', true, volumeLevel, soundType);

      // Continuous loop every 2.4 seconds until dismissed/stopped
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = setInterval(() => {
        playSound('alarm', true, volumeLevel, soundType);
      }, 2400);
    }

    // 2. Trigger native desktop alert when session ends / alarm triggers
    const notificationTitle = alarm.title || (
      isStudyComplete
        ? '🎉 Study Session Complete!'
        : isBreakComplete
        ? '⚡ Break Time Finished!'
        : '🔔 Boss Battles Alert'
    );

    const notificationBody = alarm.message || (
      isStudyComplete
        ? 'Great job! Time to take a restful break or start a new sprint.'
        : 'Ready to continue your focus session?'
    );

    sendNotification(notificationTitle, {
      body: notificationBody,
      tag: `alarm_${alarm.id || alarm.type || Date.now()}`,
      onClick: () => {
        window.focus();
      },
    });

    // 3. Vibration if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([400, 200, 400, 200, 500]);
    }

    return () => {
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
    };
  }, [alarm, soundEnabled, alarmSettings, isStudyComplete, isBreakComplete, isReminder, sendNotification]);

  const stopLoopSound = () => {
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
  };

  if (!alarm) return null;

  const handleStop = () => {
    stopLoopSound();
    alarm.onDismiss?.();
    if (propOnStop) propOnStop();
    dismissLiveAlarm();
  };

  const handleStartBreak = () => {
    stopLoopSound();
    alarm.onConfirm?.();
    if (onStartBreak) onStartBreak();
    if (onNavigate) onNavigate('study');
    dismissLiveAlarm();
  };

  const handleStartStudy = () => {
    stopLoopSound();
    alarm.onConfirm?.();
    if (onStartStudy) onStartStudy();
    if (onNavigate) onNavigate(alarm.targetTab || 'study');
    dismissLiveAlarm();
  };

  const handleSnooze = () => {
    stopLoopSound();
    if (propOnSnooze) propOnSnooze();
    else alarm.onSnooze?.();
    dismissLiveAlarm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-2 border-[#10b981] dark:border-[#10b981] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl shadow-[#10b981]/25 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Ambient pulsing aura glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#10b981]/25 rounded-full blur-2xl animate-pulse pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#06b6d4]/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

        {/* Animated Bell Header Icon */}
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#10b981] to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-[#10b981]/40 mx-auto animate-bounce">
            <BellRing size={40} className="animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#10b981]"></span>
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          {alarm.title || (isStudyComplete ? '🔔 STUDY SESSION COMPLETE' : '🔔 ALARM ALERT')}
        </h2>

        {/* Message */}
        <p className="mt-2 text-sm sm:text-base font-semibold text-[#64748b] dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
          {alarm.message}
        </p>

        {/* Subject Tag if present */}
        {alarm.subjectName && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 rounded-xl text-xs font-black">
            <span>📚 Subject: {alarm.subjectName}</span>
          </div>
        )}

        {/* Notification Permission Prompt if not granted */}
        {isSupported && permission === 'default' && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl flex items-center justify-between text-left">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              <Bell size={15} className="text-[#10b981] shrink-0" />
              <span>Enable native desktop notifications for future alerts?</span>
            </div>
            <button
              onClick={() => requestPermission()}
              className="ml-2 px-2.5 py-1 bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-black rounded-lg transition whitespace-nowrap cursor-pointer"
            >
              Allow
            </button>
          </div>
        )}

        {/* Audio status indicator badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#10b981] dark:text-emerald-400">
          <Volume2 size={13} className="animate-pulse" />
          <span>Alarm sound looping until stopped</span>
        </div>

        {/* Action Controls */}
        <div className="mt-5 space-y-2.5">
          {isStudyComplete && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleStartBreak}
                className="w-full py-3.5 px-4 bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#10b981]/30 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
              >
                <Coffee size={16} />
                <span>START BREAK</span>
              </button>
              <button
                onClick={handleStop}
                className="w-full py-3.5 px-4 bg-[#f1f5f9] dark:bg-slate-800 hover:bg-[#e2e8f0] dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black text-xs sm:text-sm rounded-2xl transition transform active:scale-95 cursor-pointer"
              >
                <span>STOP ALARM</span>
              </button>
            </div>
          )}

          {isBreakComplete && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleStartStudy}
                className="w-full py-3.5 px-4 bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#10b981]/30 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
              >
                <Play size={16} />
                <span>START SPRINT</span>
              </button>
              <button
                onClick={handleStop}
                className="w-full py-3.5 px-4 bg-[#f1f5f9] dark:bg-slate-800 hover:bg-[#e2e8f0] dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black text-xs sm:text-sm rounded-2xl transition transform active:scale-95 cursor-pointer"
              >
                <span>STOP ALARM</span>
              </button>
            </div>
          )}

          {isReminder && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleStartStudy}
                className="w-full py-3.5 px-4 bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#10b981]/30 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
              >
                <Play size={16} />
                <span>START</span>
              </button>
              <button
                onClick={handleSnooze}
                className="w-full py-3.5 px-4 bg-[#f1f5f9] dark:bg-slate-800 hover:bg-[#e2e8f0] dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black text-xs sm:text-sm rounded-2xl transition transform active:scale-95 cursor-pointer"
              >
                <span>LATER (5m)</span>
              </button>
            </div>
          )}

          {alarm.type === 'test' && (
            <button
              onClick={handleStop}
              className="w-full py-3.5 px-4 bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#10b981]/30 transition transform active:scale-95 cursor-pointer"
            >
              <span>DISMISS TEST ALARM</span>
            </button>
          )}

          {!isReminder && !isStudyComplete && !isBreakComplete && alarm.type !== 'test' && (
            <button
              onClick={handleSnooze}
              className="w-full py-2.5 text-xs font-black text-[#64748b] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Snooze (+5 min)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

