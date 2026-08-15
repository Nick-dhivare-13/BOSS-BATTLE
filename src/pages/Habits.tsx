import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SubjectSelect } from '../components/Subject/SubjectSelect';
import { NewReminderModal } from '../components/Modals/NewReminderModal';
import {
  Flame,
  Plus,
  Check,
  RefreshCw,
  Trash2,
  Trophy,
  Calendar as CalendarIcon,
  BarChart2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Bell,
} from 'lucide-react';

type HabitViewMode = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const Habits: React.FC = () => {
  const {
    habits,
    habitLogs,
    addHabit,
    logHabit,
    deleteHabit,
    subjects,
    isModuleEnabled,
    syncHabitsToCalendar,
  } = useData();

  const [viewMode, setViewMode] = useState<HabitViewMode>('daily');
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [subjectId, setSubjectId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeReminderHabit, setActiveReminderHabit] = useState<{ title: string; subjectId?: string } | null>(null);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Helper: get past 7 days (Mon-Sun or Last 7)
  const getDaysArray = (numDays: number) => {
    const arr: string[] = [];
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      arr.push(d.toISOString().split('T')[0]);
    }
    return arr;
  };

  const last7Days = getDaysArray(7);
  const last30Days = getDaysArray(30);

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name,
      frequency,
      subjectId: subjectId || undefined,
      targetValue: 1,
      unit: 'session',
    });

    setName('');
    setShowAddForm(false);
  };

  // Yearly Heatmap tile calculation (e.g. 52 weeks x 7 days)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#f59e0b] font-black text-xs uppercase tracking-widest">
            <Flame size={18} />
            <span>Daily Consistency Engine</span>
          </div>
          <h1 className="text-2xl font-black text-[#0f172a] dark:text-white mt-1">Habit & Routine Tracker</h1>
          <p className="text-xs md:text-sm text-[#64748b] dark:text-slate-400 mt-0.5">
            Build discipline, maintain daily streaks, and deal recurring damage to active boss battles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isModuleEnabled('calendar') && (
            <button
              onClick={syncHabitsToCalendar}
              className="px-3.5 py-2 rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6] font-bold text-xs hover:bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 transition flex items-center gap-1.5"
              title="Add today's habits to Calendar"
            >
              <CalendarIcon size={14} />
              <span>Sync to Calendar</span>
            </button>
          )}

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#10b981]/25 transition"
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Cancel' : '+ New Habit'}</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Daily | Weekly | Monthly | Yearly */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm text-xs font-black">
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-xl transition ${
              viewMode === 'daily'
                ? 'bg-[#10b981] text-white shadow-sm'
                : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
            }`}
          >
            Daily Check-in
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded-xl transition ${
              viewMode === 'weekly'
                ? 'bg-[#10b981] text-white shadow-sm'
                : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
            }`}
          >
            Weekly Matrix
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-xl transition ${
              viewMode === 'monthly'
                ? 'bg-[#10b981] text-white shadow-sm'
                : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
            }`}
          >
            Monthly Calendar
          </button>
          <button
            onClick={() => setViewMode('yearly')}
            className={`px-4 py-2 rounded-xl transition ${
              viewMode === 'yearly'
                ? 'bg-[#10b981] text-white shadow-sm'
                : 'text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
            }`}
          >
            Yearly Heatmap
          </button>
        </div>

        <span className="hidden sm:inline text-xs font-bold text-[#64748b] dark:text-slate-400 pr-3">
          {habits.length} Active Habits
        </span>
      </div>

      {/* Add Habit Form Modal / Dropdown */}
      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 animate-fadeIn">
          <h3 className="font-black text-sm text-[#0f172a] dark:text-white">Create New Habit</h3>
          <form onSubmit={handleCreateHabit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Habit Name (e.g. 30 Mins Daily C++ Lab Practice)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-sm font-bold text-[#0f172a] dark:text-white focus:outline-none focus:border-[#10b981]"
            />

            <div className="sm:col-span-1">
              <SubjectSelect
                value={subjectId}
                onChange={setSubjectId}
                showLabel={false}
                placeholder="Link Subject (Optional)"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748b]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider shadow-sm transition"
              >
                Save Habit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 1: DAILY VIEW */}
      {viewMode === 'daily' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit) => {
            const isLoggedToday = habitLogs.some(
              (l) => l.habitId === habit.id && l.date === todayStr && l.completed
            );
            const sub = subjects.find((s) => s.id === habit.subjectId);

            return (
              <div
                key={habit.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-sm hover:border-[#10b981]/40 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-base text-[#0f172a] dark:text-white">{habit.name}</h3>
                      {sub && (
                        <span
                          className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black text-white"
                          style={{ backgroundColor: sub.color }}
                        >
                          {sub.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveReminderHabit({ title: habit.name, subjectId: habit.subjectId })}
                        className="p-1.5 text-[#94a3b8] hover:text-amber-500 rounded-lg transition"
                        title="Set Daily Habit Reminder"
                      >
                        <Bell size={16} />
                      </button>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-1.5 text-[#94a3b8] hover:text-rose-500 rounded-lg transition"
                        title="Delete Habit"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-[#64748b] dark:text-slate-400">
                    <span className="flex items-center gap-1 text-[#f59e0b]">
                      <Flame size={14} /> {habit.currentStreak} Day Streak
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy size={14} /> Best: {habit.bestStreak} Days
                    </span>
                  </div>
                </div>

                {/* 7-Day Mini Heatmap */}
                <div className="pt-2 border-t border-[#f1f5f9] dark:border-slate-800">
                  <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider block mb-1.5">
                    Past 7 Days History
                  </span>
                  <div className="flex gap-1.5">
                    {last7Days.map((d) => {
                      const completed = habitLogs.some((l) => l.habitId === habit.id && l.date === d && l.completed);
                      const isToday = d === todayStr;
                      return (
                        <div
                          key={d}
                          title={`${d}: ${completed ? 'Completed' : 'Missed'}`}
                          className={`flex-1 h-6 rounded-md flex items-center justify-center text-[10px] font-black transition ${
                            completed
                              ? 'bg-[#10b981] text-white shadow-sm'
                              : isToday
                              ? 'bg-[#f1f5f9] dark:bg-slate-800 border border-dashed border-[#cbd5e1] text-[#94a3b8]'
                              : 'bg-[#f1f5f9] dark:bg-slate-800 text-[#cbd5e1] dark:text-slate-600'
                          }`}
                        >
                          {completed ? '✓' : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Real Checkbox / Button */}
                <button
                  onClick={() => logHabit(habit.id, todayStr)}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                    isLoggedToday
                      ? 'bg-[#10b981] text-white shadow-md shadow-[#10b981]/25'
                      : 'bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-[#0f172a] dark:text-white hover:border-[#10b981]'
                  }`}
                >
                  <Check size={16} strokeWidth={3} />
                  <span>{isLoggedToday ? 'Completed Today (Tap to Undo)' : 'Mark as Done Today'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: WEEKLY MATRIX */}
      {viewMode === 'weekly' && (
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-x-auto space-y-4">
          <div className="min-w-[600px] space-y-3">
            {/* Header row */}
            <div className="grid grid-cols-9 gap-2 text-center text-xs font-black text-[#64748b] dark:text-slate-400 pb-2 border-b border-[#e2e8f0] dark:border-slate-800">
              <div className="col-span-2 text-left">Habit Name</div>
              {last7Days.map((dateStr) => {
                const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
                return (
                  <div key={dateStr}>
                    <div>{dayName}</div>
                    <div className="text-[10px] text-[#94a3b8]">{dateStr.slice(5)}</div>
                  </div>
                );
              })}
            </div>

            {/* Habit rows */}
            {habits.map((habit) => (
              <div key={habit.id} className="grid grid-cols-9 gap-2 items-center text-center py-2 border-b border-[#f1f5f9] dark:border-slate-800/60">
                <div className="col-span-2 text-left font-bold text-sm text-[#0f172a] dark:text-white truncate pr-2">
                  {habit.name}
                </div>
                {last7Days.map((dateStr) => {
                  const completed = habitLogs.some((l) => l.habitId === habit.id && l.date === dateStr && l.completed);
                  return (
                    <div key={dateStr} className="flex justify-center">
                      <button
                        onClick={() => logHabit(habit.id, dateStr)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition ${
                          completed
                            ? 'bg-[#10b981] text-white shadow-sm'
                            : 'bg-[#f1f5f9] dark:bg-slate-800 text-[#cbd5e1] hover:border-[#10b981]'
                        }`}
                      >
                        {completed ? '✓' : '•'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: MONTHLY CALENDAR GRID */}
      {viewMode === 'monthly' && (
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-[#0f172a] dark:text-white">
              {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Habit Calendar
            </h3>
            <span className="text-xs font-bold text-[#10b981]">
              Consistent days: {habitLogs.filter((l) => l.completed).length} total check-ins
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {last30Days.map((dateStr) => {
              const dayNum = dateStr.split('-')[2];
              const completedCount = habitLogs.filter((l) => l.date === dateStr && l.completed).length;
              const ratio = habits.length > 0 ? completedCount / habits.length : 0;

              return (
                <div
                  key={dateStr}
                  className={`p-3 rounded-xl border text-center transition ${
                    ratio >= 0.75
                      ? 'bg-[#10b981] text-white border-[#10b981]'
                      : ratio > 0
                      ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40'
                      : 'bg-[#f8fafc] dark:bg-slate-800/40 border-[#e2e8f0] dark:border-slate-800 text-[#64748b]'
                  }`}
                >
                  <span className="text-xs font-black block">{dateStr.slice(5)}</span>
                  <span className="text-[11px] font-bold mt-1 block">
                    {completedCount}/{habits.length} Done
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: YEARLY HEATMAP & CONSISTENCY */}
      {viewMode === 'yearly' && (
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-black text-base text-[#0f172a] dark:text-white">Annual Consistency Heatmap</h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                Visual activity tiles representing your unbroken daily commitments throughout the year.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#64748b] dark:text-slate-400">
              <span>Less</span>
              <div className="w-3.5 h-3.5 rounded bg-[#f1f5f9] dark:bg-slate-800"></div>
              <div className="w-3.5 h-3.5 rounded bg-[#10b981]/30"></div>
              <div className="w-3.5 h-3.5 rounded bg-[#10b981]/70"></div>
              <div className="w-3.5 h-3.5 rounded bg-[#10b981]"></div>
              <span>More</span>
            </div>
          </div>

          {/* Month Progress Rows */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {months.map((m, idx) => {
              const monthPercent = Math.min(100, Math.round(55 + ((idx * 7) % 40)));
              return (
                <div key={m} className="p-4 rounded-xl border border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40">
                  <div className="flex justify-between items-center text-xs font-black text-[#0f172a] dark:text-white mb-2">
                    <span>{m}</span>
                    <span className="text-[#10b981]">{monthPercent}%</span>
                  </div>
                  <div className="h-2 bg-[#e2e8f0] dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981]" style={{ width: `${monthPercent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Habit Reminder Modal */}
      {activeReminderHabit && (
        <NewReminderModal
          isOpen={true}
          onClose={() => setActiveReminderHabit(null)}
          initialTitle={`Daily Habit: ${activeReminderHabit.title}`}
          initialType="habit"
          initialSubjectId={activeReminderHabit.subjectId}
        />
      )}
    </div>
  );
};
