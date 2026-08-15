import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { PRESET_SUBJECT_CATEGORIES } from '../data/subjects';
import { SubjectSelect } from '../components/Subject/SubjectSelect';
import { NewReminderModal } from '../components/Modals/NewReminderModal';
import {
  BookOpenCheck,
  Plus,
  Trash2,
  Calendar,
  Target,
  CheckSquare,
  Square,
  AlertCircle,
  Clock,
  Flame,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Layers,
  Bell,
} from 'lucide-react';
import { Priority } from '../types';

export const SubjectsExamsGoals: React.FC = () => {
  const {
    subjects,
    customSubjects,
    exams,
    goals,
    addSubject,
    deleteSubject,
    addExam,
    updateExam,
    deleteExam,
    addGoal,
    updateGoal,
    toggleMilestone,
    incrementGoalProgress,
    deleteGoal,
  } = useData();

  const [activeTab, setActiveTab] = useState<'exams' | 'goals' | 'subjects'>('exams');
  const [activeReminderTarget, setActiveReminderTarget] = useState<{
    title: string;
    type: 'exam' | 'goal';
    subjectId?: string;
    targetDate?: string;
  } | null>(null);

  // Exam Form State
  const [examName, setExamName] = useState('');
  const [examSubjectId, setExamSubjectId] = useState('');
  const [examDate, setExamDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [topicsRemaining, setTopicsRemaining] = useState(6);
  const [totalTopics, setTotalTopics] = useState(15);
  const [examPriority, setExamPriority] = useState<Priority>('high');
  const [syllabus, setSyllabus] = useState('');
  const [showAddExamModal, setShowAddExamModal] = useState(false);

  // Goal Form State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalSubjectId, setGoalSubjectId] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [targetCount, setTargetCount] = useState(30);
  const [currentCount, setCurrentCount] = useState(0);
  const [goalUnit, setGoalUnit] = useState('study sessions');
  const [milestonesText, setMilestonesText] = useState('');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // Custom Subject Form
  const [subName, setSubName] = useState('');
  const [subColor, setSubColor] = useState('#10b981');
  const [subCode, setSubCode] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim() || !examSubjectId) return;

    const progress = Math.round(((totalTopics - topicsRemaining) / Math.max(1, totalTopics)) * 100);

    addExam({
      name: examName,
      subjectId: examSubjectId,
      date: examDate,
      topicsRemaining,
      totalTopics,
      progressPercentage: progress,
      recommendedSessions: Math.ceil(topicsRemaining * 1.5),
      priority: examPriority,
      syllabus: syllabus || undefined,
    });

    setExamName('');
    setSyllabus('');
    setShowAddExamModal(false);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const initialMilestones = milestonesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((mTitle, idx) => ({ id: `m_${Date.now()}_${idx}`, title: mTitle, completed: false }));

    addGoal({
      title: goalTitle,
      subjectId: goalSubjectId || undefined,
      targetDate: goalTargetDate,
      targetCount: Number(targetCount) || 30,
      currentCount: Number(currentCount) || 0,
      unit: goalUnit || 'sessions',
      linkedModule: goalUnit.includes('session') ? 'study' : 'tasks',
      milestones:
        initialMilestones.length > 0
          ? initialMilestones
          : [{ id: `m_${Date.now()}`, title: 'Complete foundations phase', completed: false }],
    });

    setGoalTitle('');
    setMilestonesText('');
    setShowAddGoalModal(false);
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;
    addSubject({ name: subName, color: subColor, code: subCode, isCustom: true });
    setSubName('');
    setSubCode('');
  };

  const handleAddPresetSubject = (preset: { name: string; code?: string; color: string }) => {
    const exists = subjects.some((s) => s.name.toLowerCase() === preset.name.toLowerCase());
    if (!exists) {
      addSubject({ name: preset.name, color: preset.color, code: preset.code, isCustom: false });
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#06b6d4] font-black text-xs uppercase tracking-widest">
            <BookOpenCheck size={16} />
            <span>Academic Target Engine</span>
          </div>
          <h1 className="text-2xl font-black text-[#0f172a] dark:text-white mt-1">Exams, Goals & Subjects</h1>
          <p className="text-xs md:text-sm text-[#64748b] dark:text-slate-400 mt-0.5">
            Organize programming and school subjects, syllabus countdowns, and measurable learning targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'exams' && (
            <button
              onClick={() => setShowAddExamModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#06b6d4] hover:bg-[#0891b2] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#06b6d4]/25 transition"
            >
              <Plus size={16} />
              <span>+ Add Exam</span>
            </button>
          )}

          {activeTab === 'goals' && (
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#10b981]/25 transition"
            >
              <Plus size={16} />
              <span>+ Add Goal</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e2e8f0] dark:border-slate-800 gap-6 text-sm font-black">
        <button
          onClick={() => setActiveTab('exams')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'exams'
              ? 'border-[#06b6d4] text-[#06b6d4]'
              : 'border-transparent text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
          }`}
        >
          <Calendar size={16} />
          <span>Exams & Countdowns ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'goals'
              ? 'border-[#10b981] text-[#10b981]'
              : 'border-transparent text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
          }`}
        >
          <Target size={16} />
          <span>Learning Goals ({goals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3.5 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'subjects'
              ? 'border-[#8b5cf6] text-[#8b5cf6]'
              : 'border-transparent text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white'
          }`}
        >
          <Layers size={16} />
          <span>Subjects & Library ({subjects.length})</span>
        </button>
      </div>

      {/* TAB 1: EXAMS */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => {
              const sub = subjects.find((s) => s.id === exam.subjectId);
              const daysLeft = Math.ceil(
                (new Date(exam.date).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24)
              );
              const isUrgent = daysLeft <= 7;

              return (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:border-[#06b6d4]/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-[#0f172a] dark:text-white">{exam.name}</h3>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            exam.priority === 'high'
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {exam.priority || 'high'}
                        </span>
                      </div>

                      {sub && (
                        <span
                          className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                          style={{ backgroundColor: sub.color }}
                        >
                          {sub.name}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-xl block ${
                          isUrgent ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#06b6d4]/15 text-[#06b6d4]'
                        }`}
                      >
                        {daysLeft > 0 ? `${daysLeft} Days Left` : daysLeft === 0 ? 'Today!' : 'Past'}
                      </span>
                      <span className="text-[10px] font-bold text-[#64748b] dark:text-slate-400 mt-1 block">
                        {exam.date}
                      </span>
                    </div>
                  </div>

                  {exam.syllabus && (
                    <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700/60 text-xs">
                      <span className="font-black text-[#64748b] dark:text-slate-400 block mb-1">Syllabus Scope:</span>
                      <p className="text-[#0f172a] dark:text-slate-200">{exam.syllabus}</p>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-[#64748b] dark:text-slate-400">
                      <span>{exam.topicsRemaining} topics remaining</span>
                      <span>{exam.recommendedSessions} recommended sessions</span>
                    </div>
                    <div className="h-2 bg-[#f1f5f9] dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#06b6d4]"
                        style={{ width: `${exam.progressPercentage || 60}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() =>
                        setActiveReminderTarget({
                          title: `Exam: ${exam.name}`,
                          type: 'exam',
                          subjectId: exam.subjectId,
                          targetDate: exam.date,
                        })
                      }
                      className="text-xs font-bold text-[#64748b] dark:text-slate-400 hover:text-amber-500 transition flex items-center gap-1"
                      title="Set Exam Study Countdown Alarm"
                    >
                      <Bell size={13} /> Set Reminder
                    </button>
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="text-xs font-bold text-[#94a3b8] hover:text-rose-500 transition flex items-center gap-1"
                    >
                      <Trash2 size={13} /> Delete Exam
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GOALS */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const sub = subjects.find((s) => s.id === goal.subjectId);
              const percent = Math.min(100, Math.round((goal.currentCount / Math.max(1, goal.targetCount)) * 100));

              return (
                <div
                  key={goal.id}
                  className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:border-[#10b981]/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-base text-[#0f172a] dark:text-white">{goal.title}</h3>
                      {sub && (
                        <span
                          className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                          style={{ backgroundColor: sub.color }}
                        >
                          {sub.name}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#10b981]">{percent}% Complete</span>
                      <span className="text-[10px] font-bold text-[#64748b] dark:text-slate-400 block mt-0.5">
                        Target: {goal.targetDate}
                      </span>
                    </div>
                  </div>

                  {/* Progress Tracker (e.g. 18 / 30 study sessions) */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-[#f8fafc] dark:bg-slate-800/40 border border-[#e2e8f0] dark:border-slate-700/60">
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="text-[#0f172a] dark:text-white">
                        {goal.currentCount} / {goal.targetCount} {goal.unit}
                      </span>
                      <button
                        onClick={() => incrementGoalProgress(goal.id, 1)}
                        className="px-2.5 py-1 rounded-lg bg-[#10b981]/15 text-[#10b981] hover:bg-[#10b981]/25 text-[11px] font-black transition"
                      >
                        + Log 1 {goal.unit.slice(0, -1)}
                      </button>
                    </div>
                    <div className="h-2.5 bg-[#e2e8f0] dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#10b981]" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>

                  {/* Milestones Checkbox List */}
                  {goal.milestones.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-wider block">
                        Milestones & Key Deliverables
                      </span>
                      {goal.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleMilestone(goal.id, m.id)}
                          className={`cursor-pointer p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition ${
                            m.completed
                              ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#94a3b8] line-through'
                              : 'bg-white dark:bg-slate-900 border-[#e2e8f0] dark:border-slate-800 text-[#0f172a] dark:text-slate-200 hover:border-[#10b981]'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              m.completed
                                ? 'bg-[#10b981] border-[#10b981] text-white'
                                : 'border-[#cbd5e1] dark:border-slate-600'
                            }`}
                          >
                            {m.completed && <CheckCircle2 size={11} />}
                          </div>
                          <span className="truncate">{m.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() =>
                        setActiveReminderTarget({
                          title: `Goal: ${goal.title}`,
                          type: 'goal',
                          subjectId: goal.subjectId,
                          targetDate: goal.targetDate,
                        })
                      }
                      className="text-xs font-bold text-[#64748b] dark:text-slate-400 hover:text-amber-500 transition flex items-center gap-1"
                      title="Set Goal Progress Reminder"
                    >
                      <Bell size={13} /> Set Reminder
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-xs font-bold text-[#94a3b8] hover:text-rose-500 transition flex items-center gap-1"
                    >
                      <Trash2 size={13} /> Delete Goal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SUBJECTS & COMPREHENSIVE LIBRARY */}
      {activeTab === 'subjects' && (
        <div className="space-y-8">
          {/* Active User Subjects */}
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="font-black text-base text-[#0f172a] dark:text-white">
              My Active Subjects ({subjects.length})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/40 flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: sub.color }}></div>
                    <span className="font-black text-xs text-[#0f172a] dark:text-white truncate">{sub.name}</span>
                  </div>

                  <button
                    onClick={() => deleteSubject(sub.id)}
                    className="text-[#94a3b8] hover:text-rose-500 transition p-1"
                    title="Remove subject"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Subject Creation Form */}
            <form
              onSubmit={handleAddCustomSubject}
              className="pt-4 border-t border-[#f1f5f9] dark:border-slate-800 flex flex-wrap items-center gap-3"
            >
              <span className="text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mr-2">
                + Custom Subject:
              </span>
              <input
                type="text"
                required
                placeholder="Subject Name (e.g. Data Structures)"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white"
              />
              <input
                type="color"
                value={subColor}
                onChange={(e) => setSubColor(e.target.value)}
                className="w-9 h-9 rounded-xl border border-[#e2e8f0] dark:border-slate-700 cursor-pointer p-0.5"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black text-xs uppercase tracking-wider transition"
              >
                Add Custom Subject
              </button>
            </form>
          </div>

          {/* Preset Subject Library */}
          <div className="space-y-6">
            <div>
              <h2 className="font-black text-lg text-[#0f172a] dark:text-white">Preset Subject Library</h2>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                Click any subject to instantly add it to your active study list.
              </p>
            </div>

            {PRESET_SUBJECT_CATEGORIES.map((cat) => (
              <div
                key={cat.category}
                className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm"
              >
                <h3 className="font-black text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  <span>{cat.category}</span>
                </h3>

                <div className="flex flex-wrap gap-2">
                  {cat.subjects.map((item) => {
                    const alreadyAdded = subjects.some((s) => s.name.toLowerCase() === item.name.toLowerCase());

                    return (
                      <button
                        key={item.name}
                        onClick={() => handleAddPresetSubject(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                          alreadyAdded
                            ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40 opacity-70'
                            : 'bg-[#f8fafc] dark:bg-slate-800 border-[#e2e8f0] dark:border-slate-700 text-[#0f172a] dark:text-white hover:border-[#10b981]'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span>{item.name}</span>
                        {alreadyAdded && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD EXAM MODAL */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-4 shadow-2xl">
            <h2 className="text-xl font-black text-[#0f172a] dark:text-white">Register Upcoming Exam</h2>
            <form onSubmit={handleAddExam} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                  Exam Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. C++ Final Semester Exam"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-sm font-bold text-[#0f172a] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <SubjectSelect
                    label="Subject"
                    value={examSubjectId}
                    onChange={setExamSubjectId}
                    placeholder="Select Subject"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                  Syllabus / Key Topics
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. OOP, Classes, Memory Management, Templates, STL Containers"
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs text-[#0f172a] dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#f1f5f9] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#06b6d4] hover:bg-[#0891b2] text-white font-black text-xs uppercase tracking-wider transition"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD GOAL MODAL */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-4 shadow-2xl">
            <h2 className="text-xl font-black text-[#0f172a] dark:text-white">Create Learning Goal</h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 100 Data Structures & Algorithm Problems"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-sm font-bold text-[#0f172a] dark:text-white"
                />
              </div>

              <div>
                <SubjectSelect
                  label="Linked Subject (Optional)"
                  value={goalSubjectId}
                  onChange={setGoalSubjectId}
                  placeholder="Link Subject (e.g. Java, C++)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                    Target Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={targetCount}
                    onChange={(e) => setTargetCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                    Unit / Metric
                  </label>
                  <input
                    type="text"
                    value={goalUnit}
                    onChange={(e) => setGoalUnit(e.target.value)}
                    placeholder="e.g. study sessions, problems, chapters"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                  Key Milestones (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Arrays & Pointers Practice\nBinary Search & Trees\nDynamic Programming & Graph Problems`}
                  value={milestonesText}
                  onChange={(e) => setMilestonesText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-mono text-[#0f172a] dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#f1f5f9] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider transition"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminder Modal for Exam/Goal */}
      {activeReminderTarget && (
        <NewReminderModal
          isOpen={true}
          onClose={() => setActiveReminderTarget(null)}
          initialTitle={activeReminderTarget.title}
          initialType={activeReminderTarget.type}
          initialSubjectId={activeReminderTarget.subjectId}
          initialDate={activeReminderTarget.targetDate}
        />
      )}
    </div>
  );
};
