import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BossBattleDashboardCard } from '../components/Boss/BossBattleDashboardCard';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Flame,
  Zap,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  Timer,
  CheckSquare,
  RefreshCw,
  Calendar as CalendarIcon,
  BookOpenCheck,
  PlusCircle,
} from 'lucide-react';

interface DashboardProps {
  onSelectTab: (tab: string) => void;
  onOpenAIPilot: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectTab, onOpenAIPilot }) => {
  const { user } = useAuth();
  const {
    isModuleEnabled,
    tasks,
    habits,
    habitLogs,
    bossBattles,
    toggleTask,
    logHabit,
    subjects,
    exams,
    goals,
    timeBlocks,
    studySessions,
    setShowStreakJourneyModal,
    setShowOnboardingModal,
    nextMonster,
    daysToNextMonster,
  } = useData();

  const todayStr = new Date().toISOString().split('T')[0];

  // Active Boss
  const activeBoss = bossBattles.find((b) => b.status === 'ACTIVE') || bossBattles[0];

  // Tasks
  const todayTasks = tasks.filter((t) => !t.dueDate || t.dueDate === todayStr || t.status === 'todo');
  const completedTasksToday = tasks.filter(
    (t) => t.status === 'completed' && t.completedAt?.startsWith(todayStr)
  ).length;

  // Study time
  const todaySessions = studySessions.filter((s) => s.timestamp.startsWith(todayStr));
  const totalStudyMinutesToday = Math.round(
    todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
  );

  // Consistency Score formula (0 - 100)
  const taskRate = tasks.length > 0 ? (tasks.filter((t) => t.status === 'completed').length / tasks.length) * 30 : 25;
  const habitRate = habits.length > 0 ? (habitLogs.filter((l) => l.completed).length / Math.max(1, habits.length * 7)) * 40 : 35;
  const consistencyScore = Math.min(100, Math.round(taskRate + habitRate + 20));

  // Upcoming Exam
  const upcomingExam = exams
    .filter((e) => new Date(e.date) >= new Date(todayStr))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const examDaysLeft = upcomingExam
    ? Math.ceil((new Date(upcomingExam.date).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Active Goals
  const activeGoal = goals[0];

  // Today's Timeblocks
  const todayBlocks = timeBlocks.filter((b) => b.date === todayStr);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Stats Row — Adaptive to Enabled Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* XP & Level */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-1">
            Current Level & XP
          </p>
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-black text-[#0f172a] dark:text-white">
              {(user?.xp || 2450).toLocaleString()}
            </h3>
            <p className="text-xs text-[#10b981] font-bold mb-1">Lvl {user?.level || 8}</p>
          </div>
          <div className="mt-2 h-2 bg-[#f1f5f9] dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10b981]"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(((user?.xp || 2450) / (user?.xpForNextLevel || 3000)) * 100)
                )}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Boss Damage Cap (if bosses enabled) or Completed Tasks */}
        {isModuleEnabled('bosses') ? (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-1">
              Daily Boss Damage
            </p>
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-black text-[#0f172a] dark:text-white">
                {user?.todayDamage || 85} / 300 DMG
              </h3>
              <p className="text-xs text-[#f43f5e] font-bold mb-1">Active</p>
            </div>
            <div className="mt-2 h-2 bg-[#f1f5f9] dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#f43f5e]"
                style={{ width: `${Math.min(100, (((user?.todayDamage || 85) / 300) * 100))}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-1">
              Tasks Completed
            </p>
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-black text-[#0f172a] dark:text-white">
                {tasks.filter((t) => t.status === 'completed').length} Tasks
              </h3>
              <p className="text-xs text-[#10b981] font-bold mb-1">Total</p>
            </div>
            <div className="mt-2 h-2 bg-[#f1f5f9] dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#10b981]" style={{ width: '65%' }}></div>
            </div>
          </div>
        )}

        {/* Battle Streak (Clickable to view 10 Monsters) */}
        <button
          onClick={() => setShowStreakJourneyModal(true)}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm text-left hover:border-amber-500/50 transition group"
        >
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-1">
              Battle Streak
            </p>
            <span className="text-[10px] font-bold text-[#f59e0b] group-hover:underline">10 Monsters &gt;</span>
          </div>
          <h3 className="text-2xl font-black text-[#f59e0b]">🔥 {user?.currentStreak || 7} Days</h3>
          <p className="text-[10px] font-bold text-[#64748b] dark:text-slate-400 mt-1">
            {nextMonster ? `Next: ${nextMonster.name} (${daysToNextMonster}d left)` : 'Max Evolution Ascended'}
          </p>
        </button>

        {/* Study Time (if study enabled) or Consistency Score */}
        {isModuleEnabled('study') ? (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-1">
              Today's Focus Time
            </p>
            <h3 className="text-2xl font-black text-[#0f172a] dark:text-white">
              {totalStudyMinutesToday > 0 ? `${totalStudyMinutesToday}m` : '30m'}{' '}
              <span className="text-xs text-[#64748b] font-normal">
                ({todaySessions.length > 0 ? todaySessions.length : 1} sessions)
              </span>
            </h3>
            <button
              onClick={() => onSelectTab('study')}
              className="text-[10px] font-bold text-[#10b981] hover:underline mt-1 flex items-center gap-1"
            >
              Start Focus Session <ArrowRight size={11} />
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider mb-1">
              Overall Consistency
            </p>
            <h3 className="text-2xl font-black text-[#10b981]">{consistencyScore}%</h3>
            <p className="text-[10px] font-bold text-[#64748b] dark:text-slate-400 mt-1">Productivity Rating</p>
          </div>
        )}
      </div>

      {/* Main Grid: Adaptive Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Primary Action Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Boss Card (Only if Boss module enabled) */}
          {isModuleEnabled('bosses') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-lg text-[#0f172a] dark:text-white flex items-center gap-2">
                  <span>⚔️ Active Boss Battle</span>
                </h2>
                <button
                  onClick={() => onSelectTab('bosses')}
                  className="text-xs font-bold text-[#10b981] hover:underline flex items-center gap-1"
                >
                  View All Bosses <ArrowRight size={13} />
                </button>
              </div>
              <BossBattleDashboardCard
                onSelectTab={onSelectTab}
                onAttack={() => onSelectTab(isModuleEnabled('tasks') ? 'tasks' : 'study')}
              />
            </div>
          )}

          {/* Today's Tasks (Only if Tasks module enabled) */}
          {isModuleEnabled('tasks') && (
            <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-base text-[#0f172a] dark:text-white flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#10b981]" />
                  <span>Today's Tasks & Assignments</span>
                </h2>
                <button
                  onClick={() => onSelectTab('tasks')}
                  className="text-xs font-bold text-[#10b981] hover:underline"
                >
                  Manage Tasks
                </button>
              </div>

              <div className="space-y-2">
                {todayTasks.slice(0, 4).map((task) => {
                  const isDone = task.status === 'completed';
                  const subject = subjects.find((s) => s.id === task.subjectId);

                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition ${
                        isDone
                          ? 'bg-[#f8fafc] dark:bg-slate-800/40 border-transparent opacity-60'
                          : 'bg-white dark:bg-slate-900 border-[#e2e8f0] dark:border-slate-800 hover:border-[#10b981]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                            isDone
                              ? 'bg-[#10b981] border-[#10b981] text-white'
                              : 'border-[#cbd5e1] dark:border-slate-700 hover:border-[#10b981]'
                          }`}
                        >
                          {isDone && <CheckCircle2 size={13} />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-bold truncate ${
                              isDone
                                ? 'line-through text-[#94a3b8] dark:text-slate-500'
                                : 'text-[#0f172a] dark:text-white'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {subject && (
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                                style={{ backgroundColor: subject.color }}
                              >
                                {subject.name}
                              </span>
                            )}
                            {task.subtasks.length > 0 && (
                              <span className="text-[10px] text-[#64748b] dark:text-slate-400 font-semibold">
                                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          task.priority === 'high'
                            ? 'bg-rose-500/10 text-rose-500'
                            : task.priority === 'medium'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  );
                })}

                {todayTasks.length === 0 && (
                  <p className="text-xs text-[#64748b] dark:text-slate-400 text-center py-4">
                    All tasks completed! Great work today.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Today's Calendar Timeblocks (Only if Calendar module enabled) */}
          {isModuleEnabled('calendar') && (
            <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-base text-[#0f172a] dark:text-white flex items-center gap-2">
                  <CalendarIcon size={18} className="text-[#8b5cf6]" />
                  <span>Today's Time Blocks</span>
                </h2>
                <button
                  onClick={() => onSelectTab('calendar')}
                  className="text-xs font-bold text-[#8b5cf6] hover:underline"
                >
                  View Calendar
                </button>
              </div>

              <div className="space-y-2">
                {todayBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="p-3 rounded-xl border border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#8b5cf6] px-2 py-1 bg-[#8b5cf6]/10 rounded-lg">
                        {block.startTime} - {block.endTime}
                      </span>
                      <span className="text-sm font-bold text-[#0f172a] dark:text-white">{block.title}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">
                      {block.blockType}
                    </span>
                  </div>
                ))}

                {todayBlocks.length === 0 && (
                  <p className="text-xs text-[#64748b] dark:text-slate-400 text-center py-3">
                    No time blocks scheduled for today yet.{' '}
                    <button onClick={() => onSelectTab('calendar')} className="text-[#8b5cf6] font-bold hover:underline">
                      + Add Time Block
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Secondary Modules (Habits, Exams, Quick Planner) */}
        <div className="space-y-6">
          {/* AI Daily Planner Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#10b981]/15 to-[#06b6d4]/10 border border-[#10b981]/30">
            <div className="flex items-center gap-2 text-[#10b981] font-black text-xs uppercase tracking-wider mb-2">
              <Sparkles size={16} />
              <span>Smart AI Day Planner</span>
            </div>
            <h3 className="font-extrabold text-sm text-[#0f172a] dark:text-white">
              Optimize your study sessions & tasks with AI
            </h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
              Adapts automatically to your active modules and pending syllabus items.
            </p>
            <button
              onClick={onOpenAIPilot}
              className="mt-3 w-full py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider shadow-sm transition"
            >
              Generate Today's Plan
            </button>
          </div>

          {/* Habit Tracker Card (Only if Habits enabled) */}
          {isModuleEnabled('habits') && (
            <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
                  <RefreshCw size={16} className="text-[#f59e0b]" />
                  <span>Daily Habits</span>
                </h3>
                <button
                  onClick={() => onSelectTab('habits')}
                  className="text-xs font-bold text-[#f59e0b] hover:underline"
                >
                  Full Tracker
                </button>
              </div>

              <div className="space-y-2">
                {habits.slice(0, 4).map((habit) => {
                  const isDone = habitLogs.some(
                    (l) => l.habitId === habit.id && l.date === todayStr && l.completed
                  );

                  return (
                    <div
                      key={habit.id}
                      onClick={() => logHabit(habit.id, todayStr)}
                      className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition select-none ${
                        isDone
                          ? 'bg-[#10b981]/10 border-[#10b981]/40'
                          : 'bg-[#f8fafc] dark:bg-slate-800/40 border-[#e2e8f0] dark:border-slate-800 hover:border-[#f59e0b]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                            isDone
                              ? 'bg-[#10b981] border-[#10b981] text-white'
                              : 'border-[#cbd5e1] dark:border-slate-700'
                          }`}
                        >
                          {isDone && <CheckCircle2 size={13} />}
                        </div>
                        <span
                          className={`text-xs font-bold truncate ${
                            isDone ? 'line-through text-[#94a3b8]' : 'text-[#0f172a] dark:text-white'
                          }`}
                        >
                          {habit.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-[#f59e0b] shrink-0">
                        🔥 {habit.currentStreak}d
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Academic Countdown & Goal (Only if Academic enabled) */}
          {isModuleEnabled('academic') && upcomingExam && (
            <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
                  <BookOpenCheck size={16} className="text-[#06b6d4]" />
                  <span>Upcoming Exam</span>
                </h3>
                <button
                  onClick={() => onSelectTab('academic')}
                  className="text-xs font-bold text-[#06b6d4] hover:underline"
                >
                  View Exams
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-[#0f172a] dark:text-white">{upcomingExam.name}</h4>
                  <span className="text-xs font-black text-[#06b6d4]">
                    {examDaysLeft !== null ? `${examDaysLeft} days left` : ''}
                  </span>
                </div>
                <p className="text-xs text-[#64748b] dark:text-slate-400">
                  {upcomingExam.topicsRemaining} topics remaining ({upcomingExam.recommendedSessions} recommended focus
                  sessions)
                </p>
              </div>
            </div>
          )}

          {/* Quick System Customizer */}
          <div className="p-4 rounded-2xl border border-dashed border-[#cbd5e1] dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-[#64748b] dark:text-slate-400">Customize Active Systems</span>
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="font-black text-[#10b981] hover:underline flex items-center gap-1"
            >
              <PlusCircle size={14} /> Toggle Modules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
