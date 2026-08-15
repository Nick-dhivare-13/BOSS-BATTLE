import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sword, Trophy, Zap } from 'lucide-react';

export const FloatingFeedback: React.FC = () => {
  const { feedbackNotifications, dismissNotification } = useData();
  const { reducedMotion } = useTheme();

  if (feedbackNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-6 md:right-8 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {feedbackNotifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${
              notif.type === 'damage'
                ? 'bg-rose-500/90 text-white border-rose-400'
                : notif.type === 'xp'
                ? 'bg-amber-500/90 text-white border-amber-400'
                : notif.type === 'level'
                ? 'bg-emerald-600/95 text-white border-emerald-400 ring-2 ring-emerald-300'
                : 'bg-indigo-600/95 text-white border-indigo-400'
            }`}
            onClick={() => dismissNotification(notif.id)}
          >
            <div className="p-2 bg-white/20 rounded-xl">
              {notif.type === 'damage' ? (
                <Sword size={20} />
              ) : notif.type === 'xp' ? (
                <Zap size={20} />
              ) : notif.type === 'level' ? (
                <Sparkles size={20} />
              ) : (
                <Trophy size={20} />
              )}
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide">{notif.text}</div>
              {notif.subtext && <div className="text-xs opacity-90">{notif.subtext}</div>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
