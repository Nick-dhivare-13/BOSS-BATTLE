import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PRESET_SUBJECT_CATEGORIES } from '../../data/subjects';
import { CustomSubjectModal } from './CustomSubjectModal';
import { Plus, BookOpen } from 'lucide-react';

interface SubjectSelectProps {
  value: string;
  onChange: (subjectId: string, subjectName?: string) => void;
  label?: string;
  showLabel?: boolean;
  placeholder?: string;
  allowClear?: boolean;
  clearLabel?: string;
  className?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
}

export const SubjectSelect: React.FC<SubjectSelectProps> = ({
  value,
  onChange,
  label,
  showLabel = true,
  placeholder = 'Select Subject',
  allowClear = true,
  clearLabel = 'No Specific Subject',
  className = '',
  id,
  required = false,
  disabled = false,
}) => {
  const { subjects, customSubjects } = useData();
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVal = e.target.value;
    if (selectedVal === '__NEW_CUSTOM_SUBJECT__') {
      setShowCustomModal(true);
      return;
    }

    // Find matching subject to pass name if desired
    const matched =
      subjects.find((s) => s.id === selectedVal || s.name.toLowerCase() === selectedVal.toLowerCase()) ||
      customSubjects?.find((s) => s.id === selectedVal || s.name.toLowerCase() === selectedVal.toLowerCase());

    onChange(selectedVal, matched?.name);
  };

  const handleCustomCreated = (newId: string) => {
    onChange(newId);
  };

  return (
    <>
      <div className="w-full space-y-1">
        {label && showLabel && (
          <label className="block text-xs font-black uppercase text-[#64748b] dark:text-slate-400">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative w-full">
          <select
            id={id}
            value={value || ''}
            onChange={handleSelectChange}
            required={required}
            disabled={disabled}
            className={`w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-[#cbd5e1] dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-[#10b981] appearance-none cursor-pointer transition ${className}`}
          >
            {allowClear && <option value="">{placeholder || clearLabel}</option>}
            {!allowClear && !value && <option value="">{placeholder}</option>}

            {/* Grouped Default Subjects */}
            {PRESET_SUBJECT_CATEGORIES.map((cat) => (
              <optgroup key={cat.category} label={`── ${cat.category} ──`}>
                {cat.subjects.map((sub) => {
                  const matchedSub = subjects.find(
                    (s) => s.name.toLowerCase() === sub.name.toLowerCase()
                  );
                  const optionValue = matchedSub ? matchedSub.id : `default_${sub.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

                  return (
                    <option key={sub.name} value={optionValue}>
                      {sub.name} {sub.code ? `(${sub.code})` : ''}
                    </option>
                  );
                })}
              </optgroup>
            ))}

            {/* My Custom Subjects */}
            {customSubjects && customSubjects.length > 0 && (
              <optgroup label="── My Custom Subjects ──">
                {customSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} {sub.code ? `(${sub.code})` : ''} ★
                  </option>
                ))}
              </optgroup>
            )}

            {/* Prompt requirement: At the bottom of every subject dropdown: "+ Custom Subject" */}
            <optgroup label="─────────────────">
              <option value="__NEW_CUSTOM_SUBJECT__" className="font-black text-[#10b981]">
                ➕ + Custom Subject...
              </option>
            </optgroup>
          </select>

          {/* Custom Chevron Indicator */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {showCustomModal && (
        <CustomSubjectModal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          onCreated={handleCustomCreated}
        />
      )}
    </>
  );
};
