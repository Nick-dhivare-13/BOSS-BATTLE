import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Sparkles, X, Plus, BookOpen } from 'lucide-react';

interface CustomSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (newSubjectId: string) => void;
  initialName?: string;
}

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#ea580c', // Orange
  '#64748b', // Slate
  '#e11d48', // Rose
  '#9333ea', // Purple
];

export const CustomSubjectModal: React.FC<CustomSubjectModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  initialName = '',
}) => {
  const { addSubject } = useData();
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState('#2563eb');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a subject name');
      return;
    }

    const generatedCode = code.trim() || trimmed.slice(0, 4).toUpperCase();
    const createdSubject = addSubject({
      name: trimmed,
      color,
      code: generatedCode,
      category: 'My Custom Subjects',
      isCustom: true,
    });

    setName('');
    setCode('');
    setError('');
    onClose();

    if (createdSubject && onCreated) {
      onCreated(createdSubject.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-lg">
            <BookOpen size={20} className="text-[#10b981]" />
            <span>CUSTOM SUBJECT</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:bg-[#f1f5f9] dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1.5">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Web Development, Data Structures"
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] dark:bg-slate-800/80 border border-[#cbd5e1] dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10b981]"
            />
            {error && <p className="text-xs text-red-500 font-bold mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1.5">
                Subject Code (Optional)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. WEB-DEV"
                className="w-full px-3 py-2 bg-[#f8fafc] dark:bg-slate-800/80 border border-[#cbd5e1] dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-[#10b981]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400 mb-1.5">
                Badge Color
              </label>
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {PRESET_COLORS.slice(0, 6).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      color === c ? 'ring-2 ring-offset-2 ring-[#10b981] scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

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
              <span>Add Subject</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
