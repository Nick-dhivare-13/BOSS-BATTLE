import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Priority, Task } from '../types';
import { SubjectSelect } from '../components/Subject/SubjectSelect';
import { NewReminderModal } from '../components/Modals/NewReminderModal';
import { LevelDetailsModal, TaskDifficultyLevel } from '../components/Modals/LevelDetailsModal';
import { MonsterDetailModal } from '../components/Modals/MonsterDetailModal';
import { FocusShieldModal } from '../components/Boss/FocusShieldModal';
import { Monster } from '../data/monsters';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Sparkles,
  Clock,
  Filter,
  Calendar,
  Layers,
  Bell,
  Shield,
  Info,
  Zap,
} from 'lucide-react';

export const Tasks: React.FC = () => {
  const { user } = useAuth();
  const { tasks, addTask, toggleTask, deleteTask, updateTask, subjects, isModuleEnabled } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  const [aiLoadingTaskId, setAiLoadingTaskId] = useState<string | null>(null);
  const [activeReminderTask, setActiveReminderTask] = useState<{ title: string; subjectId?: string } | null>(null);

  // Modals state
  const [selectedLevelForDetails, setSelectedLevelForDetails] = useState<TaskDifficultyLevel | null>(null);
  const [selectedMonsterForCodex, setSelectedMonsterForCodex] = useState<Monster | null>(null);
  const [shieldTargetTask, setShieldTargetTask] = useState<Task | null>(null);

  const priorityToDifficulty = (p: Priority): TaskDifficultyLevel => {
    if (p === 'low') return 'Easy';
    if (p === 'high') return 'Hard';
    return 'Medium';
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      priority,
      subjectId: subjectId || undefined,
      dueDate,
    });

    setTitle('');
    setDescription('');
  };

  const handleBreakIntoSteps = async (taskId: string, currentTitle: string) => {
    setAiLoadingTaskId(taskId);
    try {
      const sanitizedTitle = (currentTitle || 'Main Task').slice(0, 150);
      const response = await fetch('/api/ai/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'break_steps',
          payload: { taskTitle: sanitizedTitle },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.steps && Array.isArray(data.steps)) {
          const newSubtasks = data.steps.map((st: string, idx: number) => ({
            id: `sub_${Date.now()}_${idx}`,
            title: st,
            completed: false,
          }));
          updateTask(taskId, { subtasks: newSubtasks });
          setAiLoadingTaskId(null);
          return;
        }
      }
    } catch (e) {
      console.warn('AI break steps fallback', e);
    }

    // Local smart fallback
    const fallbackSubtasks = [
      'Gather required study materials and references',
      'Complete core exercise / reading section',
      'Review and summarize key findings',
    ].map((st, idx) => ({ id: `sub_${Date.now()}_${idx}`, title: st, completed: false }));

    updateTask(taskId, { subtasks: fallbackSubtasks });
    setAiLoadingTaskId(null);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterSubject !== 'all' && t.subjectId !== filterSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-surface border border-brand-border p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-black text-brand-text">Tasks & Assignments</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Organize study tasks with priorities, custom subjects, alarms, and anti-distraction Focus Shield.
          </p>
        </div>

        {/* Global Level Details Quick Info */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedLevelForDetails('Medium')}
            className="px-3 py-1.5 rounded-xl bg-brand-background border border-brand-border hover:border-brand-primary text-xs font-black text-brand-text transition flex items-center gap-1.5 shadow-sm"
          >
            <Layers size={14} className="text-brand-primary" />
            <span>All Level Details</span>
          </button>
        </div>
      </div>

      {/* Quick Create Form */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-sm">
        <form onSubmit={handleAddTask} className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="What needs to get done? (e.g., Complete Physics Problem Set 3)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-brand-background border border-brand-border text-sm text-brand-text focus:outline-none focus:border-brand-primary"
            />
            <div className="flex flex-wrap md:flex-nowrap gap-2 items-center">
              <div className="flex items-center gap-1">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="px-3 py-2.5 rounded-xl bg-brand-background border border-brand-border text-xs font-bold text-brand-text"
                >
                  <option value="low">Easy / Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">Hard / High Priority</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSelectedLevelForDetails(priorityToDifficulty(priority))}
                  className="px-2 py-2 rounded-xl bg-brand-background border border-brand-border hover:border-brand-primary text-brand-muted hover:text-brand-primary text-[11px] font-bold transition"
                  title="View Level Details & XP/Damage rewards for this difficulty"
                >
                  Level Details
                </button>
              </div>

              <div className="min-w-[170px]">
                <SubjectSelect
                  value={subjectId}
                  onChange={setSubjectId}
                  showLabel={false}
                  placeholder="Link Subject"
                />
              </div>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-brand-background border border-brand-border text-xs font-bold text-brand-text"
              />

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-hover transition flex items-center gap-1 shadow-sm"
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-brand-muted border-b border-brand-border pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} />
          <span>Filter:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-brand-surface border border-brand-border text-brand-text"
          >
            <option value="all">All Priorities</option>
            <option value="high">High (Hard)</option>
            <option value="medium">Medium</option>
            <option value="low">Low (Easy)</option>
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-brand-surface border border-brand-border text-brand-text max-w-[200px]"
          >
            <option value="all">All Subjects ({subjects.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.isCustom ? '★' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>Showing {filteredTasks.length} tasks</div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'completed';
          const sub = subjects.find((s) => s.id === task.subjectId);
          const isAiLoading = aiLoadingTaskId === task.id;
          const levelTier = priorityToDifficulty(task.priority);

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl bg-brand-surface border border-brand-border space-y-3 transition ${
                isDone ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 text-brand-primary transition"
                  >
                    {isDone ? (
                      <CheckCircle2 size={22} className="fill-brand-primary text-white" />
                    ) : (
                      <Circle size={22} />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-base text-brand-text ${isDone ? 'line-through text-brand-muted' : ''}`}>
                        {task.title}
                      </span>

                      {/* Difficulty Badge with Clickable Level Details */}
                      <button
                        type="button"
                        onClick={() => setSelectedLevelForDetails(levelTier)}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 transition ${
                          task.priority === 'high'
                            ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                            : task.priority === 'medium'
                            ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                            : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
                        }`}
                        title={`Click to view ${levelTier} Level Details & Rewards`}
                      >
                        <span>{levelTier}</span>
                        <span className="opacity-70 underline text-[9px]">Level Details</span>
                      </button>

                      {sub && (
                        <span
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: sub.color }}
                        >
                          {sub.name}
                        </span>
                      )}
                    </div>

                    {task.description && <p className="text-xs text-brand-muted">{task.description}</p>}

                    <div className="flex items-center gap-3 text-xs text-brand-muted pt-1">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> {task.dueDate}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {task.estimatedMinutes || 30} mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Focus Shield Button */}
                  {!isDone && (
                    <button
                      type="button"
                      onClick={() => setShieldTargetTask(task)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black transition flex items-center gap-1 border border-emerald-500/20"
                      title="Activate anti-distraction Focus Shield for this task"
                    >
                      <Shield size={13} />
                      <span>Focus Shield</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveReminderTask({ title: task.title, subjectId: task.subjectId })}
                    className="p-1.5 text-brand-muted hover:text-amber-500 rounded-lg transition"
                    title="Set Alert Reminder"
                  >
                    <Bell size={16} />
                  </button>

                  {!isDone && task.subtasks.length === 0 && (
                    <button
                      onClick={() => handleBreakIntoSteps(task.id, task.title)}
                      disabled={isAiLoading}
                      className="px-2.5 py-1.5 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-bold hover:bg-brand-primary/20 transition flex items-center gap-1"
                    >
                      <Sparkles size={13} />
                      <span>{isAiLoading ? 'Decomposing...' : 'AI Steps'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-brand-muted hover:text-rose-500 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Subtasks */}
              {task.subtasks.length > 0 && (
                <div className="ml-8 pt-2 border-t border-brand-border/50 space-y-1.5">
                  <div className="text-[11px] font-bold text-brand-muted flex items-center gap-1">
                    <Layers size={12} /> SUBTASKS ({task.subtasks.filter((st) => st.completed).length}/
                    {task.subtasks.length})
                  </div>
                  {task.subtasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => {
                          const updated = task.subtasks.map((s) =>
                            s.id === st.id ? { ...s, completed: !s.completed } : s
                          );
                          updateTask(task.id, { subtasks: updated });
                        }}
                        className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                      />
                      <span className={`text-brand-text ${st.completed ? 'line-through text-brand-muted' : ''}`}>
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-brand-surface border border-brand-border rounded-2xl p-6">
            <CheckCircle2 size={32} className="mx-auto text-brand-primary mb-2" />
            <h3 className="font-extrabold text-base text-brand-text">No Tasks Found</h3>
            <p className="text-xs text-brand-muted mt-1">Add a task above to keep your study schedule on track.</p>
          </div>
        )}
      </div>

      {/* Task Reminder Modal */}
      {activeReminderTask && (
        <NewReminderModal
          isOpen={true}
          onClose={() => setActiveReminderTask(null)}
          initialTitle={`Task: ${activeReminderTask.title}`}
          initialType="task"
          initialSubjectId={activeReminderTask.subjectId}
        />
      )}

      {/* Level Details Modal */}
      {selectedLevelForDetails && (
        <LevelDetailsModal
          level={selectedLevelForDetails}
          onClose={() => setSelectedLevelForDetails(null)}
          onSelectLevel={(lvl) => setSelectedLevelForDetails(lvl)}
          onSelectMonster={(monster) => {
            setSelectedLevelForDetails(null);
            setSelectedMonsterForCodex(monster);
          }}
        />
      )}

      {/* Monster Details Modal */}
      {selectedMonsterForCodex && (
        <MonsterDetailModal
          monster={selectedMonsterForCodex}
          currentStreak={user?.currentStreak || 7}
          onClose={() => setSelectedMonsterForCodex(null)}
        />
      )}

      {/* Focus Shield Modal */}
      {shieldTargetTask && (
        <FocusShieldModal
          initialTaskId={shieldTargetTask.id}
          initialTaskTitle={shieldTargetTask.title}
          onClose={() => setShieldTargetTask(null)}
        />
      )}
    </div>
  );
};
