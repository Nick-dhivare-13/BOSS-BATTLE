import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Reminder, ReminderType, ReminderFrequency } from '../../types';
import { SubjectSelect } from '../Subject/SubjectSelect';
import { Clock, Calendar, Plus, X, Bell, Sparkles } from 'lucide-react';

interface NewReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReminder?: Reminder | null;
  initialTitle?: string;
  initialType?: ReminderType;
  initialSubjectId?: string;
  initialTime?: string;
  initialDate?: string;
}

const DAYS_OF_WEEK = [
  { id: 0, label: 'Sun' },
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
];

export const NewReminderModal: React.FC<NewReminderModalProps> = ({
  isOpen,
  onClose,
  initialReminder,
  initialTitle,
  initialType,
  initialSubjectId,
  initialTime,
  initialDate,
}) => {
  const { isModuleEnabled, addReminder, updateReminder } = useData();

  const [title, setTitle] = useState(initialReminder?.title || initialTitle || '');
  const [description, setDescription] = useState(initialReminder?.description || '');
  const [reminderType, setReminderType] = useState<ReminderType>(
    initialReminder?.reminderType || initialType || 'study'
  );
  const [subjectId, setSubjectId] = useState(initialReminder?.subjectId || initialSubjectId || '');
  const [targetTime, setTargetTime] = useState(initialReminder?.targetTime || initialTime || '19:00');
  const [targetDate, setTargetDate] = useState(
    initialReminder?.targetDate || initialDate || new Date().toISOString().split('T')[0]
  );
  const [frequency, setFrequency] = useState<ReminderFrequency>(
    initialReminder?.frequency || (initialDate ? 'one_time' : 'daily')
  );
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    initialReminder?.daysOfWeek || [1, 2, 3, 4, 5]
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Filter allowed reminder types based on modular system (Section 19, 35)
  const allowedReminderTypes: { type: ReminderType; label: string; icon: string }[] = [
    { type: 'study', label: 'Study Session', icon: '⏱️' },
    ...(isModuleEnabled('habits') ? [{ type: 'habit' as ReminderType, label: 'Habit Practice', icon: '🔥' }] : []),
    { type: 'task', label: 'Task Deadline', icon: '📋' },
    { type: 'assignment', label: 'Assignment Due', icon: '📝' },
    ...(isModuleEnabled('academic')
      ? [
          { type: 'exam' as ReminderType, label: 'Exam Countdown', icon: '📚' },
          { type: 'goal' as ReminderType, label: 'Goal Milestone', icon: '🎯' },
        ]
      : []),
    ...(isModuleEnabled('bosses') ? [{ type: 'boss' as ReminderType, label: 'Boss Battle', icon: '⚔️' }] : []),
    { type: 'custom', label: 'Custom Reminder', icon: '🔔' },
  ];

  const toggleDay = (day: number) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a reminder title');
      return;
    }

    if (initialReminder) {
      updateReminder(initialReminder.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        reminderType,
        subjectId: subjectId || undefined,
        targetTime,
        targetDate: frequency === 'one_time' ? targetDate : undefined,
        frequency,
        daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
      });
    } else {
      addReminder({
        title: title.trim(),
        description: description.trim() || undefined,
        reminderType,
        subjectId: subjectId || undefined,
        targetTime,
        targetDate: frequency === 'one_time' ? targetDate : undefined,
        frequency,
        daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
        enabled: true,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-lg">
            <Bell size={20} className="text-[#10b981]" />
            <span>{initialReminder ? 'EDIT REMINDER' : 'NEW REMINDER AUTOMATION'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:bg-[#f1f5f9] dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Reminder Type Picker */}
          <div>
            <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1.5">
              Reminder Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allowedReminderTypes.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setReminderType(item.type)}
                  className={`p-2 rounded-xl text-left border transition text-xs font-bold flex items-center gap-1.5 ${
                    reminderType === item.type
                      ? 'bg-[#10b981]/15 border-[#10b981] text-[#10b981]'
                      : 'bg-[#f8fafc] dark:bg-slate-800/60 border-[#e2e8f0] dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1.5">
              Reminder Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Study Java, Review Physics Formulas"
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] dark:bg-slate-800/80 border border-[#cbd5e1] dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10b981]"
            />
            {error && <p className="text-xs text-red-500 font-bold mt-1">{error}</p>}
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1.5">
              Attached Subject (Optional)
            </label>
            <SubjectSelect
              value={subjectId}
              onChange={(id) => setSubjectId(id)}
              placeholder="Select Subject (e.g. Java, Physics, C++)"
            />
          </div>

          {/* Schedule Frequency */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFrequency('daily')}
              className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                frequency === 'daily'
                  ? 'bg-[#10b981]/15 border-[#10b981] text-[#10b981]'
                  : 'bg-[#f8fafc] dark:bg-slate-800 border-[#e2e8f0] dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={() => setFrequency('weekly')}
              className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                frequency === 'weekly'
                  ? 'bg-[#10b981]/15 border-[#10b981] text-[#10b981]'
                  : 'bg-[#f8fafc] dark:bg-slate-800 border-[#e2e8f0] dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setFrequency('one_time')}
              className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                frequency === 'one_time'
                  ? 'bg-[#10b981]/15 border-[#10b981] text-[#10b981]'
                  : 'bg-[#f8fafc] dark:bg-slate-800 border-[#e2e8f0] dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              One-Time
            </button>
          </div>

          {/* Time & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1.5">
                Alarm Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] dark:bg-slate-800/80 border border-[#cbd5e1] dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-[#10b981]"
                />
              </div>
            </div>

            {frequency === 'one_time' && (
              <div>
                <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1.5">
                  Target Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] dark:bg-slate-800/80 border border-[#cbd5e1] dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-[#10b981]"
                />
              </div>
            )}
          </div>

          {/* Weekly Days selection */}
          {frequency === 'weekly' && (
            <div>
              <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1.5">
                Repeat on Days
              </label>
              <div className="flex items-center justify-between gap-1">
                {DAYS_OF_WEEK.map((d) => {
                  const isSelected = daysOfWeek.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDay(d.id)}
                      className={`w-10 h-10 rounded-xl font-bold text-xs transition ${
                        isSelected
                          ? 'bg-[#10b981] text-white shadow-md shadow-[#10b981]/20'
                          : 'bg-[#f1f5f9] dark:bg-slate-800 text-[#64748b] dark:text-slate-400 hover:bg-[#e2e8f0]'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes / Description */}
          <div>
            <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1.5">
              Description / Notes (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Focus on Java OOP inheritance lab"
              className="w-full px-3.5 py-2 bg-[#f8fafc] dark:bg-slate-800/80 border border-[#cbd5e1] dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium text-xs focus:outline-hidden focus:ring-2 focus:ring-[#10b981]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#e2e8f0] dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-black text-[#64748b] dark:text-slate-400 hover:bg-[#f1f5f9] dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-black shadow-md shadow-[#10b981]/20 transition flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>{initialReminder ? 'Save Changes' : 'Create Reminder'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
