import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { TimeBlock, BlockType, BlockRecurrence } from '../types';
import { SubjectSelect } from '../components/Subject/SubjectSelect';
import { NewReminderModal } from '../components/Modals/NewReminderModal';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  ListTodo,
  Sparkles,
  Repeat,
  CheckSquare,
  Timer,
  RefreshCw,
  BookOpenCheck,
  FileText,
  Bell,
} from 'lucide-react';

const BLOCK_TYPE_CONFIG: Record<BlockType, { label: string; icon: any; color: string; badgeBg: string }> = {
  task: { label: 'Task Block', icon: CheckSquare, color: '#3b82f6', badgeBg: 'bg-blue-500/10 text-blue-500' },
  habit: { label: 'Habit Block', icon: RefreshCw, color: '#f59e0b', badgeBg: 'bg-amber-500/10 text-amber-500' },
  study: { label: 'Study Session', icon: Timer, color: '#10b981', badgeBg: 'bg-emerald-500/10 text-emerald-500' },
  goal: { label: 'Goal Milestone', icon: BookOpenCheck, color: '#06b6d4', badgeBg: 'bg-cyan-500/10 text-cyan-500' },
  checklist: { label: 'Checklist Block', icon: ListTodo, color: '#8b5cf6', badgeBg: 'bg-purple-500/10 text-purple-500' },
  note: { label: 'Note / Reflection', icon: FileText, color: '#64748b', badgeBg: 'bg-slate-500/10 text-slate-500' },
  custom: { label: 'Custom Block', icon: CalendarIcon, color: '#ec4899', badgeBg: 'bg-pink-500/10 text-pink-500' },
};

export const Calendar: React.FC = () => {
  const {
    timeBlocks,
    addTimeBlock,
    toggleTimeBlock,
    toggleBlockChecklistItem,
    deleteTimeBlock,
    subjects,
    tasks,
    habits,
    goals,
  } = useData();

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [activeReminderBlock, setActiveReminderBlock] = useState<{ title: string; time: string; subjectId?: string } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [blockType, setBlockType] = useState<BlockType>('study');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('19:30');
  const [recurrence, setRecurrence] = useState<BlockRecurrence>('none');
  const [subjectId, setSubjectId] = useState('');
  const [notes, setNotes] = useState('');
  const [checklistItemsText, setChecklistItemsText] = useState('');

  const dateBlocks = timeBlocks.filter((tb) => tb.date === selectedDate);

  // Conflict Detection
  const hasConflict = (b1: TimeBlock, b2: TimeBlock) => {
    return (
      (b1.startTime >= b2.startTime && b1.startTime < b2.endTime) ||
      (b1.endTime > b2.startTime && b1.endTime <= b2.endTime)
    );
  };

  const conflictingBlockIds = new Set<string>();
  for (let i = 0; i < dateBlocks.length; i++) {
    for (let j = i + 1; j < dateBlocks.length; j++) {
      if (hasConflict(dateBlocks[i], dateBlocks[j])) {
        conflictingBlockIds.add(dateBlocks[i].id);
        conflictingBlockIds.add(dateBlocks[j].id);
      }
    }
  }

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse checklist items if checklist or any block
    const parsedChecklist = checklistItemsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, idx) => ({
        id: `chk_${Date.now()}_${idx}`,
        text: line,
        completed: false,
      }));

    // Calculate duration
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const dur = Math.max(15, (endH * 60 + endM) - (startH * 60 + startM));

    addTimeBlock({
      title,
      blockType,
      startTime,
      endTime,
      durationMinutes: dur,
      date: selectedDate,
      recurrence,
      subjectId: subjectId || undefined,
      notes: notes || undefined,
      checklist: parsedChecklist.length > 0 ? parsedChecklist : undefined,
    });

    setShowModal(false);
    setTitle('');
    setNotes('');
    setChecklistItemsText('');
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#8b5cf6] font-black text-xs uppercase tracking-widest">
            <CalendarIcon size={16} />
            <span>Notion-Style Productivity Engine</span>
          </div>
          <h1 className="text-2xl font-black text-[#0f172a] dark:text-white mt-1">Calendar & Time Blocks</h1>
          <p className="text-xs md:text-sm text-[#64748b] dark:text-slate-400 mt-0.5">
            Structure your day into dedicated focus sessions, checklists, and recurring blocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white shadow-sm"
          />

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#8b5cf6]/25 transition"
          >
            <Plus size={16} />
            <span>+ Add Block</span>
          </button>
        </div>
      </div>

      {/* Conflict Warning Header */}
      {conflictingBlockIds.size > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-600 dark:text-amber-400 text-xs font-bold animate-fadeIn">
          <AlertTriangle size={18} />
          <span>Schedule Conflict Detected: Two or more time blocks overlap on this date.</span>
        </div>
      )}

      {/* Blocks Timeline / Notion Grid */}
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-base text-[#0f172a] dark:text-white">
            Blocks for {selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : selectedDate} (
            {dateBlocks.length})
          </h2>
          <span className="text-xs font-bold text-[#64748b] dark:text-slate-400">
            {dateBlocks.filter((b) => b.completed).length} / {dateBlocks.length} completed
          </span>
        </div>

        <div className="space-y-3">
          {dateBlocks.map((block) => {
            const isConflict = conflictingBlockIds.has(block.id);
            const sub = subjects.find((s) => s.id === block.subjectId);
            const cfg = BLOCK_TYPE_CONFIG[block.blockType] || BLOCK_TYPE_CONFIG.custom;
            const Icon = cfg.icon;

            return (
              <div
                key={block.id}
                className={`p-5 rounded-2xl border transition space-y-3 ${
                  isConflict
                    ? 'border-amber-500 bg-amber-500/5'
                    : block.completed
                    ? 'bg-[#f8fafc] dark:bg-slate-800/40 border-[#e2e8f0] dark:border-slate-800/60 opacity-70'
                    : 'bg-white dark:bg-slate-900 border-[#e2e8f0] dark:border-slate-800 hover:border-[#8b5cf6]/40 shadow-sm'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-[#8b5cf6] font-mono text-xs font-bold flex items-center gap-1.5 shrink-0">
                      <Clock size={13} />
                      <span>
                        {block.startTime} - {block.endTime}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-black text-base ${
                            block.completed ? 'line-through text-[#94a3b8]' : 'text-[#0f172a] dark:text-white'
                          }`}
                        >
                          {block.title}
                        </span>

                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${cfg.badgeBg}`}>
                          {cfg.label}
                        </span>

                        {sub && (
                          <span
                            className="text-[10px] font-black px-2 py-0.5 rounded-md text-white"
                            style={{ backgroundColor: sub.color }}
                          >
                            {sub.name}
                          </span>
                        )}

                        {block.recurrence !== 'none' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#64748b] bg-[#f1f5f9] dark:bg-slate-800 px-2 py-0.5 rounded">
                            <Repeat size={10} /> {block.recurrence}
                          </span>
                        )}
                      </div>

                      {block.notes && (
                        <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">{block.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setActiveReminderBlock({
                          title: block.title,
                          time: block.startTime,
                          subjectId: block.subjectId,
                        })
                      }
                      className="p-1.5 text-[#94a3b8] hover:text-amber-500 rounded-lg transition"
                      title="Set Alarm / Reminder for this block"
                    >
                      <Bell size={16} />
                    </button>

                    <button
                      onClick={() => toggleTimeBlock(block.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                        block.completed
                          ? 'bg-[#10b981] text-white shadow-sm'
                          : 'bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-[#0f172a] dark:text-white hover:border-[#10b981]'
                      }`}
                    >
                      {block.completed ? 'Completed' : 'Mark Done'}
                    </button>

                    <button
                      onClick={() => deleteTimeBlock(block.id)}
                      className="p-1.5 text-[#94a3b8] hover:text-rose-500 rounded-lg transition"
                      title="Delete block"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Sub-checklist inside block if present */}
                {block.checklist && block.checklist.length > 0 && (
                  <div className="pt-3 border-t border-[#f1f5f9] dark:border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-wider block">
                      Block Checklist Items
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {block.checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleBlockChecklistItem(block.id, item.id)}
                          className={`cursor-pointer p-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                            item.completed
                              ? 'bg-[#10b981]/10 border-[#10b981]/30 line-through text-[#94a3b8]'
                              : 'bg-[#f8fafc] dark:bg-slate-800/50 border-[#e2e8f0] dark:border-slate-700 text-[#0f172a] dark:text-slate-200'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              item.completed
                                ? 'bg-[#10b981] border-[#10b981] text-white'
                                : 'border-[#cbd5e1] dark:border-slate-600'
                            }`}
                          >
                            {item.completed && <CheckCircle2 size={11} />}
                          </div>
                          <span className="truncate">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {dateBlocks.length === 0 && (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center mx-auto text-xl">
                🗓️
              </div>
              <h3 className="font-bold text-sm text-[#0f172a] dark:text-white">No time blocks scheduled</h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                Click "+ Add Block" to schedule study sessions, tasks, checklists, or habit slots.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE BLOCK MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#0f172a] dark:text-white">Add Productivity Block</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                  Block Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Study Java OOP Lab & Solve Problems"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-sm font-bold text-[#0f172a] dark:text-white focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                    Block Type
                  </label>
                  <select
                    value={blockType}
                    onChange={(e) => setBlockType(e.target.value as BlockType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white"
                  >
                    <option value="study">Study Session</option>
                    <option value="task">Task / Homework</option>
                    <option value="habit">Habit Routine</option>
                    <option value="checklist">Checklist Block</option>
                    <option value="goal">Goal Milestone</option>
                    <option value="note">Note / Revision</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <SubjectSelect
                    label="Subject Link"
                    value={subjectId}
                    onChange={setSubjectId}
                    placeholder="No Subject Link"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                    Recurrence
                  </label>
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as BlockRecurrence)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white"
                  >
                    <option value="none">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1">
                  Checklist Items (Optional — One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Read Chapter 1\nSolve 20 problems\nRevise formulas\nTake test`}
                  value={checklistItemsText}
                  onChange={(e) => setChecklistItemsText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-mono text-[#0f172a] dark:text-white focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#f1f5f9] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-black text-xs uppercase tracking-wider shadow-md transition"
                >
                  Save Time Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar Block Reminder Modal */}
      {activeReminderBlock && (
        <NewReminderModal
          isOpen={true}
          onClose={() => setActiveReminderBlock(null)}
          initialTitle={`Time Block: ${activeReminderBlock.title}`}
          initialType="calendar"
          initialTime={activeReminderBlock.time}
          initialSubjectId={activeReminderBlock.subjectId}
        />
      )}
    </div>
  );
};
