import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Check, X, Clock, AlertTriangle } from 'lucide-react';

interface AIPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SuggestedBlock {
  title: string;
  startTime: string;
  endTime: string;
  subjectId?: string;
  reason: string;
}

export const AIPlanModal: React.FC<AIPlanModalProps> = ({ isOpen, onClose }) => {
  const { tasks, habits, exams, addTimeBlock, subjects, enabledModules, isModuleEnabled } = useData();
  const [loading, setLoading] = useState(false);
  const [suggestedPlan, setSuggestedPlan] = useState<SuggestedBlock[] | null>(null);

  if (!isOpen) return null;

  const generatePlan = async () => {
    setLoading(true);
    try {
      // Enforce strict client-side data minimization
      const minimizedTasks = tasks
        .filter((t) => t.status !== 'completed')
        .slice(0, 12)
        .map((t) => ({
          title: t.title.slice(0, 100),
          priority: t.priority,
          subjectId: t.subjectId,
        }));

      const minimizedHabits = isModuleEnabled('habits')
        ? habits.slice(0, 8).map((h) => ({ name: h.name.slice(0, 80) }))
        : [];

      const minimizedExams = isModuleEnabled('exams')
        ? exams.slice(0, 6).map((e) => ({ name: e.name.slice(0, 80), date: e.date }))
        : [];

      const response = await fetch('/api/ai/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'plan_day',
          payload: {
            tasks: minimizedTasks,
            habits: minimizedHabits,
            exams: minimizedExams,
            enabledModules,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.plan && Array.isArray(data.plan)) {
          setSuggestedPlan(data.plan);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('AI API fallback to local smart planner', e);
    }

    // Smart Fallback Local Planner
    const todayStr = new Date().toISOString().split('T')[0];
    const pendingTasks = tasks.filter((t) => t.status !== 'completed');
    const smartBlocks: SuggestedBlock[] = [];

    if (isModuleEnabled('habits')) {
      smartBlocks.push({
        title: 'Morning Focus & Habit Routine',
        startTime: '08:30',
        endTime: '09:15',
        reason: 'Optimal energy window for habit formation.',
      });
    }

    pendingTasks.slice(0, 3).forEach((t, idx) => {
      const startHour = 10 + idx * 2;
      smartBlocks.push({
        title: t.title,
        startTime: `${startHour < 10 ? '0' : ''}${startHour}:00`,
        endTime: `${startHour < 10 ? '0' : ''}${startHour}:45`,
        subjectId: t.subjectId,
        reason: `High priority task (${t.priority} priority).`,
      });
    });

    if (isModuleEnabled('exams') && exams.length > 0) {
      smartBlocks.push({
        title: 'Exam Review & Practice Questions',
        startTime: '16:00',
        endTime: '17:00',
        reason: 'Consolidates memory retention before evening.',
      });
    } else {
      smartBlocks.push({
        title: 'Deep Study & Reflection Session',
        startTime: '16:00',
        endTime: '17:00',
        reason: 'Consolidates day progress and reflection.',
      });
    }

    setSuggestedPlan(smartBlocks);
    setLoading(false);
  };

  const applyPlanToSchedule = () => {
    if (!suggestedPlan) return;
    const today = new Date().toISOString().split('T')[0];

    suggestedPlan.forEach((block) => {
      addTimeBlock({
        title: block.title,
        startTime: block.startTime,
        endTime: block.endTime,
        subjectId: block.subjectId,
        date: today,
      });
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-brand-text">AI Daily Study Planner</h2>
                <p className="text-xs text-brand-muted">Optimizes your schedule based on exams and priorities.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-brand-muted hover:text-brand-text rounded-lg">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="py-5 flex-1 overflow-y-auto space-y-4">
            {!suggestedPlan && !loading && (
              <div className="text-center py-8 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
                  <Calendar size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text text-base">Ready to build today's study roadmap?</h3>
                  <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
                    AI will analyze your {tasks.filter((t) => t.status !== 'completed').length} pending tasks, active habits, and upcoming exams to generate a time-blocked schedule.
                  </p>
                </div>
                <button
                  onClick={generatePlan}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition"
                >
                  Generate AI Schedule
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-12 space-y-3">
                <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-extrabold text-brand-text">Crafting optimal study blocks...</p>
                <p className="text-xs text-brand-muted">Balancing task priorities & exam deadlines</p>
              </div>
            )}

            {suggestedPlan && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-brand-muted">
                  <span>PROPOSED TIME BLOCKS ({suggestedPlan.length})</span>
                  <span>TODAY</span>
                </div>

                <div className="space-y-2.5">
                  {suggestedPlan.map((block, i) => {
                    const sub = subjects.find((s) => s.id === block.subjectId);
                    return (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-brand-background border border-brand-border flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-brand-surface border border-brand-border text-brand-primary font-mono text-xs font-bold flex items-center gap-1">
                            <Clock size={12} />
                            {block.startTime} - {block.endTime}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-brand-text">{block.title}</div>
                            <div className="text-xs text-brand-muted mt-0.5">{block.reason}</div>
                            {sub && (
                              <span
                                className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold text-white"
                                style={{ backgroundColor: sub.color }}
                              >
                                {sub.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {suggestedPlan && (
            <div className="pt-4 border-t border-brand-border flex items-center justify-between">
              <button
                onClick={() => setSuggestedPlan(null)}
                className="px-4 py-2 text-xs font-bold text-brand-muted hover:text-brand-text"
              >
                Regenerate
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold text-brand-text hover:bg-brand-background"
                >
                  Cancel
                </button>
                <button
                  onClick={applyPlanToSchedule}
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover flex items-center gap-1.5 shadow-sm"
                >
                  <Check size={14} />
                  <span>Apply Schedule</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
