export interface SubjectCategory {
  category: string;
  subjects: { name: string; code?: string; color: string }[];
}

export const PRESET_SUBJECT_CATEGORIES: SubjectCategory[] = [
  {
    category: 'Programming Languages',
    subjects: [
      { name: 'C', code: 'PROG-C', color: '#64748b' },
      { name: 'C++', code: 'PROG-CPP', color: '#0284c7' },
      { name: 'Java', code: 'PROG-JAVA', color: '#ea580c' },
      { name: 'Python', code: 'PROG-PY', color: '#16a34a' },
      { name: 'JavaScript', code: 'PROG-JS', color: '#ca8a04' },
      { name: 'TypeScript', code: 'PROG-TS', color: '#2563eb' },
      { name: 'C#', code: 'PROG-CS', color: '#9333ea' },
      { name: 'Go', code: 'PROG-GO', color: '#06b6d4' },
      { name: 'Rust', code: 'PROG-RS', color: '#c2410c' },
      { name: 'Kotlin', code: 'PROG-KT', color: '#7c3aed' },
      { name: 'Swift', code: 'PROG-SWIFT', color: '#f97316' },
      { name: 'PHP', code: 'PROG-PHP', color: '#6366f1' },
      { name: 'Ruby', code: 'PROG-RB', color: '#e11d48' },
      { name: 'Dart', code: 'PROG-DART', color: '#0284c7' },
      { name: 'SQL', code: 'DB-SQL', color: '#0d9488' },
      { name: 'HTML', code: 'WEB-HTML', color: '#f43f5e' },
      { name: 'CSS', code: 'WEB-CSS', color: '#3b82f6' },
    ],
  },
  {
    category: '11th & 12th — Science',
    subjects: [
      { name: 'Physics', code: 'SCI-PHY', color: '#8b5cf6' },
      { name: 'Chemistry', code: 'SCI-CHEM', color: '#ec4899' },
      { name: 'Mathematics', code: 'SCI-MATH', color: '#3b82f6' },
      { name: 'Biology', code: 'SCI-BIO', color: '#10b981' },
      { name: 'Computer Science', code: 'SCI-CS', color: '#06b6d4' },
      { name: 'Information Technology', code: 'SCI-IT', color: '#6366f1' },
    ],
  },
  {
    category: '11th & 12th — Commerce',
    subjects: [
      { name: 'Accountancy', code: 'COM-ACC', color: '#f59e0b' },
      { name: 'Economics', code: 'COM-ECO', color: '#10b981' },
      { name: 'Business Studies', code: 'COM-BST', color: '#3b82f6' },
      { name: 'Mathematics', code: 'COM-MATH', color: '#6366f1' },
      { name: 'Computer Science', code: 'COM-CS', color: '#06b6d4' },
      { name: 'Information Technology', code: 'COM-IT', color: '#8b5cf6' },
    ],
  },
  {
    category: '11th & 12th — Arts / Humanities',
    subjects: [
      { name: 'English', code: 'ARTS-ENG', color: '#e11d48' },
      { name: 'Hindi', code: 'ARTS-HIN', color: '#f97316' },
      { name: 'Marathi', code: 'ARTS-MAR', color: '#ea580c' },
      { name: 'History', code: 'ARTS-HIST', color: '#d97706' },
      { name: 'Geography', code: 'ARTS-GEO', color: '#059669' },
      { name: 'Political Science', code: 'ARTS-POL', color: '#4f46e5' },
      { name: 'Sociology', code: 'ARTS-SOC', color: '#9333ea' },
      { name: 'Psychology', code: 'ARTS-PSY', color: '#db2777' },
      { name: 'Economics', code: 'ARTS-ECO', color: '#10b981' },
    ],
  },
  {
    category: 'Other Default Subjects',
    subjects: [
      { name: 'General Studies', code: 'GEN-ST', color: '#64748b' },
      { name: 'Other', code: 'GEN-OTH', color: '#475569' },
    ],
  },
];

export const getAllDefaultSubjects = () => {
  const list: { id: string; name: string; code?: string; color: string; category: string }[] = [];
  PRESET_SUBJECT_CATEGORIES.forEach((cat) => {
    cat.subjects.forEach((sub) => {
      // Create a deterministic id based on sanitized name
      const id = `default_${sub.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      if (!list.some((item) => item.name.toLowerCase() === sub.name.toLowerCase())) {
        list.push({
          id,
          name: sub.name,
          code: sub.code,
          color: sub.color,
          category: cat.category,
        });
      }
    });
  });
  return list;
};
