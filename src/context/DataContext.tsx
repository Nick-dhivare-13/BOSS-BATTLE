import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Task,
  TaskStatus,
  Habit,
  HabitLog,
  Subject,
  Exam,
  Goal,
  TimeBlock,
  BlockType,
  StudySession,
  StudyTimerSettings,
  AlarmSettings,
  AlarmSoundType,
  AppNotification,
  LiveAlarmData,
  Note,
  FlashcardDeck,
  Quiz,
  BossBattle,
  BattleEvent,
  Achievement,
  FeedbackNotification,
  ModuleId,
  Reminder,
} from '../types';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { playSound, SoundEffect } from '../utils/audio';
import { sendDesktopNotification } from '../utils/notifications';
import { MONSTERS_STREAK_LIST, Monster } from '../data/monsters';
import { PRESET_SUBJECT_CATEGORIES, getAllDefaultSubjects } from '../data/subjects';

export interface DataContextType {
  // Modular System Settings
  enabledModules: ModuleId[];
  isModuleEnabled: (mod: ModuleId) => boolean;
  enableModule: (mod: ModuleId) => void;
  disableModule: (mod: ModuleId) => void;
  toggleModule: (mod: ModuleId) => void;
  setAllModules: (mods: ModuleId[]) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (selectedModules: ModuleId[]) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;

  // Streak & Monster Journey
  streakMonsters: Monster[];
  unlockedMonsters: Monster[];
  nextMonster: Monster | null;
  daysToNextMonster: number;
  showStreakJourneyModal: boolean;
  setShowStreakJourneyModal: (show: boolean) => void;

  // Core & Optional Data Collections
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLog[];
  subjects: Subject[];
  customSubjects: Subject[];
  exams: Exam[];
  goals: Goal[];
  timeBlocks: TimeBlock[];
  studySessions: StudySession[];
  studySettings: StudyTimerSettings;
  alarmSettings: AlarmSettings;
  appNotifications: AppNotification[];
  liveAlarm: LiveAlarmData | null;
  notes: Note[];
  flashcardDecks: FlashcardDeck[];
  quizzes: Quiz[];
  bossBattles: BossBattle[];
  battleEvents: BattleEvent[];
  achievements: Achievement[];
  reminders: Reminder[];
  feedbackNotifications: FeedbackNotification[];

  // Actions — Tasks
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'status' | 'subtasks'> & { subtasks?: string[] }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Actions — Habits
  addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'currentStreak' | 'bestStreak'>) => void;
  logHabit: (habitId: string, date: string, value?: number) => void;
  undoHabitLog: (habitId: string, date: string) => void;
  deleteHabit: (id: string) => void;
  syncHabitsToCalendar: () => void;

  // Actions — Subjects
  addSubject: (subject: Omit<Subject, 'id' | 'userId'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Actions — Exams
  addExam: (exam: Omit<Exam, 'id' | 'userId'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  // Actions — Goals
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  incrementGoalProgress: (goalId: string, amount?: number) => void;
  deleteGoal: (id: string) => void;

  // Actions — Calendar & Blocks
  addTimeBlock: (block: Omit<TimeBlock, 'id' | 'userId' | 'completed'>) => void;
  updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => void;
  toggleTimeBlock: (id: string) => void;
  toggleBlockChecklistItem: (blockId: string, itemId: string) => void;
  deleteTimeBlock: (id: string) => void;

  // Actions — Study Mode & Settings
  recordStudySession: (session: Omit<StudySession, 'id' | 'userId' | 'timestamp'>) => void;
  updateStudySettings: (settings: Partial<StudyTimerSettings>) => void;
  updateAlarmSettings: (settings: Partial<AlarmSettings>) => void;

  // Actions — Notifications & Alarms
  addAppNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteAppNotification: (id: string) => void;
  clearAllAppNotifications: () => void;
  triggerLiveAlarm: (alarm: LiveAlarmData) => void;
  dismissLiveAlarm: () => void;
  playCompletionFeedback: (type: 'task' | 'subtask' | 'habit' | 'block') => void;

  // Actions — Notes & AI
  addNote: (note: Omit<Note, 'id' | 'userId' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  addFlashcardDeck: (deck: Omit<FlashcardDeck, 'id' | 'userId' | 'createdAt'>) => void;
  deleteFlashcardDeck: (id: string) => void;

  addQuiz: (quiz: Omit<Quiz, 'id' | 'userId' | 'createdAt'>) => void;
  deleteQuiz: (id: string) => void;

  // Actions — Boss Battles
  addBossBattle: (boss: Omit<BossBattle, 'id' | 'userId' | 'createdAt' | 'currentHp' | 'status'>) => void;
  updateBossBattle: (id: string, updates: Partial<BossBattle>) => void;
  deleteBossBattle: (id: string) => void;
  abandonBoss: (id: string) => void;

  // Actions — Reminders
  addReminder: (reminder: Omit<Reminder, 'id' | 'userId' | 'createdAt'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  // Feedback & Utilities
  triggerFeedback: (text: string, type?: FeedbackNotification['type'], subtext?: string, sound?: SoundEffect) => void;
  dismissNotification: (id: string) => void;
  exportAllDataJSON: () => string;
}

const DEFAULT_ENABLED_MODULES: ModuleId[] = [
  'tasks',
  'study',
  'bosses',
  'habits',
  'calendar',
  'academic',
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub_java', userId: 'user_default_123', name: 'Java Programming', color: '#ea580c', code: 'PROG-JAVA' },
  { id: 'sub_cpp', userId: 'user_default_123', name: 'C++', color: '#0284c7', code: 'PROG-CPP' },
  { id: 'sub_math', userId: 'user_default_123', name: 'Mathematics', color: '#3b82f6', code: 'SCI-MATH' },
  { id: 'sub_physics', userId: 'user_default_123', name: 'Physics', color: '#8b5cf6', code: 'SCI-PHY' },
  { id: 'sub_cs', userId: 'user_default_123', name: 'Computer Science', color: '#06b6d4', code: 'SCI-CS' },
];

const INITIAL_BOSSES: BossBattle[] = [
  {
    id: 'boss_procrastar_prime',
    userId: 'user_default_123',
    name: 'Procrastar',
    description: 'The Sloth Ooze: Dissolve inertia and delay by taking immediate 2-minute micro actions.',
    subjectId: 'sub_java',
    difficulty: 'Medium',
    maxHp: 1000,
    currentHp: 620,
    xpReward: 500,
    status: 'ACTIVE',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    avatarIcon: '⏳',
    monsterId: 'boss_1_procrastar',
    rewardTitle: 'Procrastar Slayer',
    requirements: [
      { type: 'study_sessions', targetCount: 4, currentCount: 2 },
      { type: 'tasks', targetCount: 5, currentCount: 3 },
      { type: 'habits', targetCount: 7, currentCount: 4 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'boss_umbradoubt_master',
    userId: 'user_default_123',
    name: 'Umbra-Doubt',
    description: 'The Imposter Phantom: Silence paralyzing self-doubt by logging concrete proof of competence.',
    subjectId: 'sub_cpp',
    difficulty: 'Hard',
    maxHp: 1600,
    currentHp: 1400,
    xpReward: 800,
    status: 'ACTIVE',
    startDate: new Date().toISOString().split('T')[0],
    avatarIcon: '👤',
    monsterId: 'boss_3_umbradoubt',
    rewardTitle: 'Umbra-Doubt Conqueror',
    requirements: [
      { type: 'study_sessions', targetCount: 6, currentCount: 1 },
      { type: 'tasks', targetCount: 4, currentCount: 2 },
    ],
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_1', title: 'First Blood', description: 'Complete your first task or study session.', icon: '⚔️', unlocked: true, unlockedAt: '2026-08-01' },
  { id: 'ach_2', title: 'Consistency Warrior', description: 'Maintain a 7-day battle streak.', icon: '🔥', unlocked: true, unlockedAt: '2026-08-10' },
  { id: 'ach_3', title: 'Study Knight', description: 'Complete 10 focused study sessions.', icon: '🛡️', unlocked: true, unlockedAt: '2026-08-11' },
  { id: 'ach_4', title: 'Task Slayer', description: 'Complete 50 tasks.', icon: '🎯', unlocked: false },
  { id: 'ach_5', title: 'Boss Hunter', description: 'Defeat 5 Bosses.', icon: '🏆', unlocked: false },
  { id: 'ach_6', title: 'Legendary', description: 'Defeat an Epic or Legendary Boss.', icon: '👑', unlocked: false },
];

const INITIAL_STUDY_SETTINGS: StudyTimerSettings = {
  studyDuration: 30, // 30 min default
  breakDuration: 10, // 10 min break (30/10 Productive Study preset)
  longBreakDuration: 20,
  rounds: 4,
  autoStartBreak: true,
  autoStartStudy: false,
  alarmSound: 'bell',
  soundVolume: 0.8,
  vibrateEnabled: true,
};

const INITIAL_ALARM_SETTINGS: AlarmSettings = {
  studyAlarmEnabled: true,
  breakAlarmEnabled: true,
  reminderAlarmEnabled: true,
  completionSoundEnabled: true,
  volume: 80,
  alarmType: 'bell',
};

const INITIAL_APP_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_init_1',
    title: 'Study Session Complete',
    message: 'Great focus! Your 30-minute Java session is complete. Take a 10-minute break.',
    category: 'study',
    targetTab: 'study',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    read: false,
  },
  {
    id: 'notif_init_2',
    title: '7-Day Battle Streak Milestone',
    message: 'You unlocked Consistency Warrior! Keep logging daily sessions to defend against monsters.',
    category: 'streak',
    targetTab: 'tasks',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    read: false,
  },
  {
    id: 'notif_init_3',
    title: 'Boss Battle Alert',
    message: 'Pyroling Prime is at 50% HP! Complete tasks and study sprints to finish the battle.',
    category: 'boss',
    targetTab: 'bosses',
    timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
    read: true,
  },
  {
    id: 'notif_init_4',
    title: 'Goal Progress',
    message: 'You reached milestone in Solve 100 LeetCode Problems (42% completed).',
    category: 'goal',
    targetTab: 'academic',
    timestamp: new Date(Date.now() - 1440 * 60000).toISOString(),
    read: true,
  },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const { soundEnabled } = useTheme();

  // 1. Module Management
  const [enabledModules, setEnabledModules] = useState<ModuleId[]>(() => {
    const saved = localStorage.getItem('studyhabit_enabled_modules');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_ENABLED_MODULES;
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('studyhabit_onboarding_done') === 'true';
  });

  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(() => {
    return localStorage.getItem('studyhabit_onboarding_done') !== 'true';
  });

  const [showStreakJourneyModal, setShowStreakJourneyModal] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('studyhabit_enabled_modules', JSON.stringify(enabledModules));
  }, [enabledModules]);

  const isModuleEnabled = useCallback(
    (mod: ModuleId) => {
      return enabledModules.includes(mod);
    },
    [enabledModules]
  );

  const enableModule = (mod: ModuleId) => {
    setEnabledModules((prev) => (prev.includes(mod) ? prev : [...prev, mod]));
  };

  const disableModule = (mod: ModuleId) => {
    // Note: NEVER delete module data! Just hide it from active modules list.
    setEnabledModules((prev) => prev.filter((m) => m !== mod));
  };

  const toggleModule = (mod: ModuleId) => {
    if (enabledModules.includes(mod)) {
      disableModule(mod);
    } else {
      enableModule(mod);
    }
  };

  const setAllModules = (mods: ModuleId[]) => {
    setEnabledModules(mods);
  };

  const completeOnboarding = (selectedModules: ModuleId[]) => {
    setEnabledModules(selectedModules.length > 0 ? selectedModules : DEFAULT_ENABLED_MODULES);
    setHasCompletedOnboarding(true);
    setShowOnboardingModal(false);
    localStorage.setItem('studyhabit_onboarding_done', 'true');
  };

  // Feedback Notifications
  const [feedbackNotifications, setFeedbackNotifications] = useState<FeedbackNotification[]>([]);

  const triggerFeedback = useCallback(
    (text: string, type: FeedbackNotification['type'] = 'xp', subtext?: string, sound: SoundEffect = 'xp') => {
      const id = `notif_${Date.now()}_${Math.random()}`;
      setFeedbackNotifications((prev) => [...prev, { id, text, type, subtext }]);
      if (soundEnabled) {
        playSound(sound, true, 0.6);
      }
      setTimeout(() => {
        setFeedbackNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3200);
    },
    [soundEnabled]
  );

  const dismissNotification = (id: string) => {
    setFeedbackNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // 2. Data Stores
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('studyhabit_tasks');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'task_1',
            userId: user?.uid || 'user_default_123',
            title: 'Learn C++ OOP and Class Constructors',
            subjectId: 'sub_cpp',
            dueDate: new Date().toISOString().split('T')[0],
            priority: 'high',
            status: 'todo',
            subtasks: [
              { id: 'sub_1', title: 'Learn classes and objects', completed: true },
              { id: 'sub_2', title: 'Practice constructors and destructors', completed: false },
              { id: 'sub_3', title: 'Implement inheritance example', completed: false },
            ],
            estimatedMinutes: 45,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'task_2',
            userId: user?.uid || 'user_default_123',
            title: 'Complete Java Collections Framework Lab',
            subjectId: 'sub_java',
            dueDate: new Date().toISOString().split('T')[0],
            priority: 'medium',
            status: 'todo',
            subtasks: [],
            estimatedMinutes: 30,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'task_3',
            userId: user?.uid || 'user_default_123',
            title: 'Review Physics Mechanics Work & Energy',
            subjectId: 'sub_physics',
            dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            priority: 'low',
            status: 'completed',
            subtasks: [],
            completedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        ];
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('studyhabit_habits');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'habit_1',
            userId: user?.uid || 'user_default_123',
            name: 'Study Programming 30 Minutes',
            frequency: 'daily',
            targetValue: 1,
            unit: 'session',
            currentStreak: 7,
            bestStreak: 12,
            subjectId: 'sub_java',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'habit_2',
            userId: user?.uid || 'user_default_123',
            name: 'Daily Problem Solving Practice',
            frequency: 'daily',
            targetValue: 1,
            unit: 'problems',
            currentStreak: 5,
            bestStreak: 9,
            subjectId: 'sub_cpp',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'habit_3',
            userId: user?.uid || 'user_default_123',
            name: 'Review Formula Notes & Flashcards',
            frequency: 'daily',
            targetValue: 1,
            unit: 'review',
            currentStreak: 3,
            bestStreak: 6,
            subjectId: 'sub_math',
            createdAt: new Date().toISOString(),
          },
        ];
  });

  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(() => {
    const saved = localStorage.getItem('studyhabit_habit_logs');
    if (saved) return JSON.parse(saved);
    // Seed initial logs for last 7 days to showcase streak consistency
    const logs: HabitLog[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      logs.push({
        id: `log_1_${dateStr}`,
        userId: 'user_default_123',
        habitId: 'habit_1',
        date: dateStr,
        value: 1,
        completed: true,
      });
    }
    return logs;
  });

  const [customSubjects, setCustomSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('studyhabit_custom_subjects');
    return saved ? JSON.parse(saved) : [];
  });

  // Flat subjects array merging all grouped default subjects with user custom subjects
  const subjects: Subject[] = [
    ...getAllDefaultSubjects().map((sub) => ({
      id: sub.id,
      userId: user?.uid || 'user_default_123',
      name: sub.name,
      color: sub.color,
      code: sub.code,
      category: sub.category,
      isCustom: false,
    })),
    ...customSubjects,
  ];

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('studyhabit_exams');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'exam_cpp',
            userId: 'user_default_123',
            subjectId: 'sub_cpp',
            name: 'C++ Final Examination',
            date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            topicsRemaining: 6,
            totalTopics: 16,
            progressPercentage: 62,
            recommendedSessions: 12,
            priority: 'high',
            syllabus: 'OOP, Templates, Memory Pointers, STL Containers, Multi-threading',
            notes: 'Covers Chapters 1-10 with major focus on pointers & OOP.',
          },
          {
            id: 'exam_math',
            userId: 'user_default_123',
            subjectId: 'sub_math',
            name: 'Calculus & Vectors Mid-Term',
            date: new Date(Date.now() + 24 * 86400000).toISOString().split('T')[0],
            topicsRemaining: 4,
            totalTopics: 10,
            progressPercentage: 60,
            recommendedSessions: 8,
            priority: 'medium',
            syllabus: 'Integration by parts, Differential Equations, 3D Vectors',
          },
        ];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('studyhabit_goals');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'goal_1',
            userId: 'user_default_123',
            title: 'Complete Java OOP & Project',
            subjectId: 'sub_java',
            targetDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
            targetCount: 30,
            currentCount: 18,
            unit: 'study sessions',
            linkedModule: 'study',
            milestones: [
              { id: 'm1', title: 'Classes & Objects Practice', completed: true },
              { id: 'm2', title: 'Inheritance & Polymorphism', completed: true },
              { id: 'm3', title: 'Exception Handling & Generics', completed: false },
              { id: 'm4', title: 'Build Mini Banking App', completed: false },
            ],
            createdAt: new Date().toISOString(),
          },
          {
            id: 'goal_2',
            userId: 'user_default_123',
            title: 'Solve 100 Data Structures & Algorithm Problems',
            subjectId: 'sub_cpp',
            targetDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
            targetCount: 100,
            currentCount: 42,
            unit: 'problems',
            linkedModule: 'tasks',
            milestones: [
              { id: 'm10', title: 'Arrays & Two Pointers (20)', completed: true },
              { id: 'm11', title: 'Binary Search & Trees (30)', completed: true },
              { id: 'm12', title: 'Dynamic Programming & Graphs (50)', completed: false },
            ],
            createdAt: new Date().toISOString(),
          },
        ];
  });

  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => {
    const saved = localStorage.getItem('studyhabit_timeblocks');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'tb_1',
            userId: 'user_default_123',
            title: 'Study Java OOP Lab',
            blockType: 'study',
            subjectId: 'sub_java',
            date: new Date().toISOString().split('T')[0],
            startTime: '19:00',
            endTime: '19:30',
            durationMinutes: 30,
            recurrence: 'daily',
            completed: false,
            checklist: [
              { id: 'chk_1', text: 'Read Chapter 1', completed: true },
              { id: 'chk_2', text: 'Solve 20 problems', completed: false },
              { id: 'chk_3', text: 'Revise formulas', completed: false },
              { id: 'chk_4', text: 'Take practice test', completed: false },
            ],
          },
          {
            id: 'tb_2',
            userId: 'user_default_123',
            title: 'C++ Assignment Practice',
            blockType: 'task',
            subjectId: 'sub_cpp',
            date: new Date().toISOString().split('T')[0],
            startTime: '19:40',
            endTime: '20:10',
            durationMinutes: 30,
            recurrence: 'none',
            completed: false,
          },
        ];
  });

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('studyhabit_study_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [studySettings, setStudySettings] = useState<StudyTimerSettings>(() => {
    const saved = localStorage.getItem('studyhabit_study_settings');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_SETTINGS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('studyhabit_notes');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'note_1',
            userId: 'user_default_123',
            subjectId: 'sub_java',
            title: 'Java Memory Architecture: Stack vs Heap',
            content: 'Stack stores primitive variables and method frames. Heap holds dynamic objects and class instances.',
            updatedAt: new Date().toISOString(),
          },
        ];
  });

  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem('studyhabit_flashcards');
    return saved ? JSON.parse(saved) : [];
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('studyhabit_quizzes');
    return saved ? JSON.parse(saved) : [];
  });

  const [bossBattles, setBossBattles] = useState<BossBattle[]>(() => {
    const saved = localStorage.getItem('studyhabit_bosses');
    return saved ? JSON.parse(saved) : INITIAL_BOSSES;
  });

  const [battleEvents, setBattleEvents] = useState<BattleEvent[]>(() => {
    const saved = localStorage.getItem('studyhabit_battle_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('studyhabit_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [alarmSettings, setAlarmSettings] = useState<AlarmSettings>(() => {
    const saved = localStorage.getItem('studyhabit_alarm_settings');
    return saved ? JSON.parse(saved) : INITIAL_ALARM_SETTINGS;
  });

  const [appNotifications, setAppNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('studyhabit_app_notifications');
    return saved ? JSON.parse(saved) : INITIAL_APP_NOTIFICATIONS;
  });

  const [liveAlarm, setLiveAlarm] = useState<LiveAlarmData | null>(null);

  const triggerLiveAlarm = useCallback((data: LiveAlarmData) => {
    setLiveAlarm(data);
  }, []);

  const dismissLiveAlarm = useCallback(() => {
    setLiveAlarm(null);
  }, []);

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('studyhabit_reminders');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'rem_1',
            userId: 'user_default_123',
            title: 'Study Java Daily Sprint',
            description: 'Time to level up your OOP skills with a 30-min timer.',
            reminderType: 'study',
            subjectId: 'default_java',
            targetTime: '19:00',
            frequency: 'daily',
            enabled: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'rem_2',
            userId: 'user_default_123',
            title: 'Review Physics chapter formulas',
            description: 'Work & energy numerical problems practice',
            reminderType: 'task',
            subjectId: 'default_physics',
            targetTime: '21:00',
            frequency: 'one_time',
            targetDate: new Date().toISOString().split('T')[0],
            enabled: true,
            createdAt: new Date().toISOString(),
          },
        ];
  });

  // Local Storage Synchronizations
  useEffect(() => {
    localStorage.setItem('studyhabit_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('studyhabit_habits', JSON.stringify(habits));
  }, [habits]);
  useEffect(() => {
    localStorage.setItem('studyhabit_habit_logs', JSON.stringify(habitLogs));
  }, [habitLogs]);
  useEffect(() => {
    localStorage.setItem('studyhabit_custom_subjects', JSON.stringify(customSubjects));
  }, [customSubjects]);
  useEffect(() => {
    localStorage.setItem('studyhabit_alarm_settings', JSON.stringify(alarmSettings));
  }, [alarmSettings]);
  useEffect(() => {
    localStorage.setItem('studyhabit_app_notifications', JSON.stringify(appNotifications));
  }, [appNotifications]);
  useEffect(() => {
    localStorage.setItem('studyhabit_subjects', JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    localStorage.setItem('studyhabit_exams', JSON.stringify(exams));
  }, [exams]);
  useEffect(() => {
    localStorage.setItem('studyhabit_goals', JSON.stringify(goals));
  }, [goals]);
  useEffect(() => {
    localStorage.setItem('studyhabit_timeblocks', JSON.stringify(timeBlocks));
  }, [timeBlocks]);
  useEffect(() => {
    localStorage.setItem('studyhabit_study_sessions', JSON.stringify(studySessions));
  }, [studySessions]);
  useEffect(() => {
    localStorage.setItem('studyhabit_study_settings', JSON.stringify(studySettings));
  }, [studySettings]);
  useEffect(() => {
    localStorage.setItem('studyhabit_notes', JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem('studyhabit_flashcards', JSON.stringify(flashcardDecks));
  }, [flashcardDecks]);
  useEffect(() => {
    localStorage.setItem('studyhabit_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);
  useEffect(() => {
    localStorage.setItem('studyhabit_bosses', JSON.stringify(bossBattles));
  }, [bossBattles]);
  useEffect(() => {
    localStorage.setItem('studyhabit_battle_events', JSON.stringify(battleEvents));
  }, [battleEvents]);
  useEffect(() => {
    localStorage.setItem('studyhabit_achievements', JSON.stringify(achievements));
  }, [achievements]);
  useEffect(() => {
    localStorage.setItem('studyhabit_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Streak & Monster Journey calculation
  const currentStreak = user?.currentStreak || 7;
  const streakMonsters = MONSTERS_STREAK_LIST;
  const unlockedMonsters = MONSTERS_STREAK_LIST.filter((m) => currentStreak >= m.unlockStreakDays);
  const nextMonster = MONSTERS_STREAK_LIST.find((m) => currentStreak < m.unlockStreakDays) || null;
  const daysToNextMonster = nextMonster ? nextMonster.unlockStreakDays - currentStreak : 0;

  // Boss Damage and XP Helper
  const applyBossDamageAndXP = (damage: number, xp: number, type: BattleEvent['type'], description: string) => {
    // 1. Update user XP
    if (user) {
      const newXp = user.xp + xp;
      let newLevel = user.level;
      let nextLevelXp = user.xpForNextLevel;

      if (newXp >= nextLevelXp) {
        newLevel += 1;
        nextLevelXp = Math.round(nextLevelXp * 1.4);
        triggerFeedback(`LEVEL UP! You reached Level ${newLevel}!`, 'level', `+${xp} XP`, 'level');
      } else {
        triggerFeedback(`+${xp} XP gained!`, 'xp', description, 'xp');
      }

      updateProfile({
        xp: newXp,
        level: newLevel,
        xpForNextLevel: nextLevelXp,
        todayDamage: (user.todayDamage || 0) + damage,
      });
    }

    // 2. Deal damage to active Boss
    setBossBattles((prev) =>
      prev.map((boss) => {
        if (boss.status !== 'ACTIVE') return boss;
        const newHp = Math.max(0, boss.currentHp - damage);
        const isDefeated = newHp === 0;

        if (isDefeated) {
          triggerFeedback(
            `BOSS DEFEATED! Conquered ${boss.name}!`,
            'boss_defeat',
            `+${boss.xpReward} Bonus XP`,
            'boss_defeat'
          );
        }

        return {
          ...boss,
          currentHp: newHp,
          status: isDefeated ? 'DEFEATED' : 'ACTIVE',
          defeatedAt: isDefeated ? new Date().toISOString() : boss.defeatedAt,
        };
      })
    );

    // 3. Log Battle Event
    setBattleEvents((prev) => [
      {
        id: `event_${Date.now()}`,
        userId: user?.uid || 'user_default_123',
        type,
        damage,
        xp,
        timestamp: new Date().toISOString(),
        description,
      },
      ...prev.slice(0, 49),
    ]);
  };

  // ACTIONS: TASKS
  const addTask = (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'status' | 'subtasks'> & { subtasks?: string[] }) => {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user?.uid || 'user_default_123',
      title: taskData.title,
      description: taskData.description,
      subjectId: taskData.subjectId,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      priority: taskData.priority,
      status: 'todo',
      subtasks: (taskData.subtasks || []).map((st, i) => ({
        id: `sub_${Date.now()}_${i}`,
        title: st,
        completed: false,
      })),
      estimatedMinutes: taskData.estimatedMinutes || 25,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    triggerFeedback(`Task created: "${newTask.title}"`, 'xp', 'Organize and conquer', 'task');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const willComplete = t.status !== 'completed';
          const newStatus: TaskStatus = willComplete ? 'completed' : 'todo';

          if (willComplete) {
            applyBossDamageAndXP(35, 50, 'TASK', `Completed Task: ${t.title}`);
          }

          return {
            ...t,
            status: newStatus,
            completedAt: willComplete ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((st) => {
            if (st.id === subtaskId) {
              const nextVal = !st.completed;
              if (nextVal) {
                applyBossDamageAndXP(10, 15, 'TASK', `Completed subtask: ${st.title}`);
                if (soundEnabled) playSound('subtask', true, 0.4);
              }
              return { ...st, completed: nextVal };
            }
            return st;
          });
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newSub: { id: string; title: string; completed: boolean } = {
            id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            title: title.trim(),
            completed: false,
          };
          return { ...task, subtasks: [...task.subtasks, newSub] };
        }
        return task;
      })
    );
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return { ...task, subtasks: task.subtasks.filter((st) => st.id !== subtaskId) };
        }
        return task;
      })
    );
  };

  // ACTIONS: HABITS
  const addHabit = (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'currentStreak' | 'bestStreak'>) => {
    const newHabit: Habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user?.uid || 'user_default_123',
      name: habitData.name,
      description: habitData.description,
      subjectId: habitData.subjectId,
      frequency: habitData.frequency,
      targetValue: habitData.targetValue || 1,
      unit: habitData.unit || 'session',
      currentStreak: 0,
      bestStreak: 0,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
    triggerFeedback(`New habit added: "${newHabit.name}"`, 'xp', 'Track daily consistency', 'habit');
  };

  const logHabit = (habitId: string, date: string, value: number = 1) => {
    // Check if already completed today
    const existingLog = habitLogs.find((l) => l.habitId === habitId && l.date === date);

    if (existingLog && existingLog.completed) {
      // Habit is already completed today. Clicking again should NOT increase count repeatedly.
      // We offer undo completion.
      undoHabitLog(habitId, date);
      return;
    }

    // Mark completed for date
    const updatedLog: HabitLog = {
      id: existingLog ? existingLog.id : `log_${habitId}_${date}`,
      userId: user?.uid || 'user_default_123',
      habitId,
      date,
      value,
      completed: true,
    };

    setHabitLogs((prev) => {
      const filtered = prev.filter((l) => !(l.habitId === habitId && l.date === date));
      return [...filtered, updatedLog];
    });

    // Update habit streak count
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const nextStreak = h.currentStreak + 1;
          const nextBest = Math.max(h.bestStreak, nextStreak);
          return { ...h, currentStreak: nextStreak, bestStreak: nextBest };
        }
        return h;
      })
    );

    // Sync to Calendar TimeBlock if BOTH Habits and Calendar are enabled
    if (isModuleEnabled('calendar')) {
      const habit = habits.find((h) => h.id === habitId);
      if (habit) {
        setTimeBlocks((prev) => {
          const exists = prev.some((b) => b.habitId === habitId && b.date === date);
          if (exists) {
            return prev.map((b) => (b.habitId === habitId && b.date === date ? { ...b, completed: true } : b));
          } else {
            return [
              ...prev,
              {
                id: `tb_habit_${habitId}_${date}`,
                userId: user?.uid || 'user_default_123',
                title: habit.name,
                blockType: 'habit',
                habitId,
                subjectId: habit.subjectId,
                date,
                startTime: '09:00',
                endTime: '09:30',
                durationMinutes: 30,
                recurrence: 'daily',
                completed: true,
              },
            ];
          }
        });
      }
    }

    applyBossDamageAndXP(25, 40, 'HABIT', `Checked in habit for ${date}`);
    if (soundEnabled) playSound('habit', true, 0.5);
  };

  const undoHabitLog = (habitId: string, date: string) => {
    setHabitLogs((prev) =>
      prev.map((l) => (l.habitId === habitId && l.date === date ? { ...l, completed: false } : l))
    );

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const nextStreak = Math.max(0, h.currentStreak - 1);
          return { ...h, currentStreak: nextStreak };
        }
        return h;
      })
    );

    if (isModuleEnabled('calendar')) {
      setTimeBlocks((prev) =>
        prev.map((b) => (b.habitId === habitId && b.date === date ? { ...b, completed: false } : b))
      );
    }
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setHabitLogs((prev) => prev.filter((l) => l.habitId !== id));
  };

  const syncHabitsToCalendar = () => {
    const today = new Date().toISOString().split('T')[0];
    const newBlocks: TimeBlock[] = [];

    habits.forEach((h) => {
      const alreadyHasBlock = timeBlocks.some((b) => b.habitId === h.id && b.date === today);
      if (!alreadyHasBlock) {
        newBlocks.push({
          id: `tb_habit_${h.id}_${today}`,
          userId: user?.uid || 'user_default_123',
          title: h.name,
          blockType: 'habit',
          habitId: h.id,
          subjectId: h.subjectId,
          date: today,
          startTime: '09:00',
          endTime: '09:30',
          durationMinutes: 30,
          recurrence: 'daily',
          completed: habitLogs.some((l) => l.habitId === h.id && l.date === today && l.completed),
        });
      }
    });

    if (newBlocks.length > 0) {
      setTimeBlocks((prev) => [...prev, ...newBlocks]);
      triggerFeedback(`Synced ${newBlocks.length} habits to today's Calendar`, 'xp', 'Calendar automation active');
    }
  };

  // ACTIONS: SUBJECTS
  const addSubject = (subjectData: Omit<Subject, 'id' | 'userId'>): Subject => {
    const newSub: Subject = {
      id: `sub_custom_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: user?.uid || 'user_default_123',
      name: subjectData.name,
      color: subjectData.color,
      code: subjectData.code,
      category: subjectData.category || 'My Custom Subjects',
      isCustom: true,
    };
    setCustomSubjects((prev) => [...prev, newSub]);
    triggerFeedback(`Custom subject "${newSub.name}" added`, 'xp', 'Saved across all study modules');
    return newSub;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setCustomSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubject = (id: string) => {
    setCustomSubjects((prev) => prev.filter((s) => s.id !== id));
    triggerFeedback('Custom subject deleted', 'damage');
  };

  // ACTIONS: EXAMS
  const addExam = (examData: Omit<Exam, 'id' | 'userId'>) => {
    const newExam: Exam = {
      id: `exam_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: user?.uid || 'user_default_123',
      ...examData,
    };
    setExams((prev) => [...prev, newExam]);
    triggerFeedback(`Exam registered: "${newExam.name}"`, 'xp', 'Countdown and syllabus active');
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  // ACTIONS: GOALS
  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => {
    const newGoal: Goal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: user?.uid || 'user_default_123',
      ...goalData,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    triggerFeedback(`Goal created: "${newGoal.title}"`, 'xp', 'Milestones tracking active');
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedM = g.milestones.map((m) => {
            if (m.id === milestoneId) {
              const willComp = !m.completed;
              if (willComp) {
                applyBossDamageAndXP(40, 60, 'GOAL_MILESTONE', `Reached milestone in: ${g.title}`);
              }
              return { ...m, completed: willComp };
            }
            return m;
          });
          return { ...g, milestones: updatedM };
        }
        return g;
      })
    );
  };

  const incrementGoalProgress = (goalId: string, amount: number = 1) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const nextCount = Math.min(g.targetCount, g.currentCount + amount);
          applyBossDamageAndXP(20, 30, 'GOAL_MILESTONE', `Progress on goal: ${g.title}`);
          return { ...g, currentCount: nextCount };
        }
        return g;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // ACTIONS: CALENDAR & BLOCKS
  const addTimeBlock = (blockData: Omit<TimeBlock, 'id' | 'userId' | 'completed'>) => {
    const newBlock: TimeBlock = {
      id: `tb_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: user?.uid || 'user_default_123',
      ...blockData,
      completed: false,
    };
    setTimeBlocks((prev) => [...prev, newBlock]);
    triggerFeedback(`Time block scheduled: "${newBlock.title}"`, 'xp', `${newBlock.startTime} - ${newBlock.endTime}`, 'block');
  };

  const updateTimeBlock = (id: string, updates: Partial<TimeBlock>) => {
    setTimeBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const toggleTimeBlock = (id: string) => {
    setTimeBlocks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const willComplete = !b.completed;
          if (willComplete) {
            applyBossDamageAndXP(30, 45, 'STUDY', `Completed Block: ${b.title}`);
          }
          return { ...b, completed: willComplete };
        }
        return b;
      })
    );
  };

  const toggleBlockChecklistItem = (blockId: string, itemId: string) => {
    setTimeBlocks((prev) =>
      prev.map((block) => {
        if (block.id === blockId && block.checklist) {
          const updated = block.checklist.map((item) => {
            if (item.id === itemId) {
              const nextVal = !item.completed;
              if (nextVal) {
                applyBossDamageAndXP(10, 15, 'TASK', `Completed checklist item: ${item.text}`);
                if (soundEnabled) playSound('subtask', true, 0.4);
              }
              return { ...item, completed: nextVal };
            }
            return item;
          });
          return { ...block, checklist: updated };
        }
        return block;
      })
    );
  };

  const deleteTimeBlock = (id: string) => {
    setTimeBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // ACTIONS: STUDY MODE
  const recordStudySession = (sessionData: Omit<StudySession, 'id' | 'userId' | 'timestamp'>) => {
    const mins = Math.round(sessionData.durationSeconds / 60);
    const calculatedXP = Math.max(20, mins * 5);
    const calculatedDMG = Math.max(15, mins * 4);

    const newSession: StudySession = {
      id: `session_${Date.now()}`,
      userId: user?.uid || 'user_default_123',
      ...sessionData,
      timestamp: new Date().toISOString(),
    };

    setStudySessions((prev) => [newSession, ...prev]);
    applyBossDamageAndXP(calculatedDMG, calculatedXP, 'STUDY', `Completed ${mins}m focus session`);

    // Also update linked goal if any
    if (sessionData.subjectId) {
      goals.forEach((g) => {
        if (g.subjectId === sessionData.subjectId && g.linkedModule === 'study') {
          incrementGoalProgress(g.id, 1);
        }
      });
    }
  };

  const updateStudySettings = (settingsUpdate: Partial<StudyTimerSettings>) => {
    setStudySettings((prev) => ({ ...prev, ...settingsUpdate }));
  };

  const updateAlarmSettings = (settingsUpdate: Partial<AlarmSettings>) => {
    setAlarmSettings((prev) => ({ ...prev, ...settingsUpdate }));
  };

  // ACTIONS: NOTIFICATIONS
  const addAppNotification = useCallback(
    (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toISOString(),
        read: false,
        ...notif,
      };
      setAppNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const markNotificationAsRead = (id: string) => {
    setAppNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setAppNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteAppNotification = (id: string) => {
    setAppNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllAppNotifications = () => {
    setAppNotifications([]);
  };

  // SOUND COMPLETION FEEDBACK
  const playCompletionFeedback = useCallback(
    (type: 'task' | 'subtask' | 'habit' | 'block') => {
      if (alarmSettings.completionSoundEnabled && soundEnabled) {
        playSound(type, true, (alarmSettings.volume || 80) / 100);
      }
    },
    [alarmSettings, soundEnabled]
  );

  // ACTIVE AUTOMATION: REAL-TIME REMINDER MONITOR
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayStr = now.toISOString().split('T')[0];
      const currentDayOfWeek = now.getDay();

      reminders.forEach((rem) => {
        if (!rem.enabled) return;

        // Verify time matches
        if (rem.targetTime !== currentTimeStr) return;

        // Check if already fired today
        if (rem.lastFiredDate === todayStr) return;

        // Check frequency
        if (rem.frequency === 'one_time') {
          if (rem.targetDate && rem.targetDate !== todayStr) return;
        } else if (rem.frequency === 'weekly') {
          if (rem.daysOfWeek && !rem.daysOfWeek.includes(currentDayOfWeek)) return;
        }

        // Fire the reminder!
        setReminders((prev) =>
          prev.map((r) => (r.id === rem.id ? { ...r, lastFiredDate: todayStr } : r))
        );

        // 1. Play sound
        if (alarmSettings.reminderAlarmEnabled && soundEnabled) {
          playSound('alarm', true, (alarmSettings.volume || 80) / 100, alarmSettings.alarmType);
        }

        // 2. Browser Desktop Notification
        sendDesktopNotification(`🔔 ${rem.title}`, {
          body: rem.description || `Scheduled Reminder: ${rem.title}`,
        });

        // 3. In-App Notification Center item
        addAppNotification({
          title: `Reminder: ${rem.title}`,
          message: rem.description || `It's ${rem.targetTime}. Time to focus!`,
          category: rem.reminderType === 'study' ? 'study' : 'reminder',
          targetTab: rem.reminderType === 'study' ? 'study' : 'tasks',
        });

        // 4. Live Alarm Modal on active screen
        triggerLiveAlarm({
          id: rem.id,
          title: '🔔 STUDY TIME',
          message: rem.description || `Time to focus: ${rem.title}`,
          type: 'reminder',
          targetTab: rem.reminderType === 'study' ? 'study' : 'tasks',
        });
      });
    };

    const interval = setInterval(checkReminders, 8000);
    return () => clearInterval(interval);
  }, [reminders, alarmSettings, soundEnabled, addAppNotification, triggerLiveAlarm]);

  // ACTIONS: NOTES
  const addNote = (noteData: Omit<Note, 'id' | 'userId' | 'updatedAt'>) => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      userId: user?.uid || 'user_default_123',
      ...noteData,
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // ACTIONS: FLASHCARDS
  const addFlashcardDeck = (deckData: Omit<FlashcardDeck, 'id' | 'userId' | 'createdAt'>) => {
    const newDeck: FlashcardDeck = {
      id: `deck_${Date.now()}`,
      userId: user?.uid || 'user_default_123',
      ...deckData,
      createdAt: new Date().toISOString(),
    };
    setFlashcardDecks((prev) => [...prev, newDeck]);
  };

  const deleteFlashcardDeck = (id: string) => {
    setFlashcardDecks((prev) => prev.filter((d) => d.id !== id));
  };

  // ACTIONS: QUIZZES
  const addQuiz = (quizData: Omit<Quiz, 'id' | 'userId' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      id: `quiz_${Date.now()}`,
      userId: user?.uid || 'user_default_123',
      ...quizData,
      createdAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  // ACTIONS: BOSS BATTLES
  const addBossBattle = (bossData: Omit<BossBattle, 'id' | 'userId' | 'createdAt' | 'currentHp' | 'status'>) => {
    const newBoss: BossBattle = {
      id: `boss_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: user?.uid || 'user_default_123',
      ...bossData,
      currentHp: bossData.maxHp,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    setBossBattles((prev) => [newBoss, ...prev]);
    triggerFeedback(`Boss Summoned: "${newBoss.name}"!`, 'damage', 'Unleash your focus attacks', 'boss_hit');
  };

  const updateBossBattle = (id: string, updates: Partial<BossBattle>) => {
    setBossBattles((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBossBattle = (id: string) => {
    setBossBattles((prev) => prev.filter((b) => b.id !== id));
    triggerFeedback('Boss battle deleted', 'damage');
  };

  const abandonBoss = (id: string) => {
    setBossBattles((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'EXPIRED' } : b)));
  };

  // ACTIONS: REMINDERS
  const addReminder = (remData: Omit<Reminder, 'id' | 'userId' | 'createdAt'>) => {
    const newRem: Reminder = {
      id: `rem_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: user?.uid || 'user_default_123',
      title: remData.title,
      description: remData.description,
      reminderType: remData.reminderType || 'study',
      subjectId: remData.subjectId,
      targetTime: remData.targetTime,
      targetDate: remData.targetDate,
      frequency: remData.frequency || 'daily',
      daysOfWeek: remData.daysOfWeek,
      enabled: remData.enabled ?? true,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [newRem, ...prev]);
    triggerFeedback(`Reminder created: "${newRem.title}"`, 'xp', `Alarm at ${newRem.targetTime}`);
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    triggerFeedback('Reminder updated', 'xp');
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    triggerFeedback('Reminder deleted', 'damage');
  };

  // EXPORT ALL DATA
  const exportAllDataJSON = () => {
    const exportBundle = {
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      enabledModules,
      user,
      tasks,
      habits,
      habitLogs,
      subjects,
      customSubjects,
      alarmSettings,
      appNotifications,
      exams,
      goals,
      timeBlocks,
      studySessions,
      studySettings,
      bossBattles,
      battleEvents,
      achievements,
      reminders,
      notes,
      flashcardDecks,
      quizzes,
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  return (
    <DataContext.Provider
      value={{
        enabledModules,
        isModuleEnabled,
        enableModule,
        disableModule,
        toggleModule,
        setAllModules,
        hasCompletedOnboarding,
        completeOnboarding,
        showOnboardingModal,
        setShowOnboardingModal,

        streakMonsters,
        unlockedMonsters,
        nextMonster,
        daysToNextMonster,
        showStreakJourneyModal,
        setShowStreakJourneyModal,

        tasks,
        habits,
        habitLogs,
        subjects,
        customSubjects,
        exams,
        goals,
        timeBlocks,
        studySessions,
        studySettings,
        alarmSettings,
        appNotifications,
        liveAlarm,
        notes,
        flashcardDecks,
        quizzes,
        bossBattles,
        battleEvents,
        achievements,
        reminders,
        feedbackNotifications,

        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        toggleSubtask,
        addSubtask,
        deleteSubtask,

        addHabit,
        logHabit,
        undoHabitLog,
        deleteHabit,
        syncHabitsToCalendar,

        addSubject,
        updateSubject,
        deleteSubject,

        addExam,
        updateExam,
        deleteExam,

        addGoal,
        updateGoal,
        toggleMilestone,
        incrementGoalProgress,
        deleteGoal,

        addTimeBlock,
        updateTimeBlock,
        toggleTimeBlock,
        toggleBlockChecklistItem,
        deleteTimeBlock,

        recordStudySession,
        updateStudySettings,
        updateAlarmSettings,

        addAppNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteAppNotification,
        clearAllAppNotifications,
        triggerLiveAlarm,
        dismissLiveAlarm,
        playCompletionFeedback,

        addNote,
        updateNote,
        deleteNote,

        addFlashcardDeck,
        deleteFlashcardDeck,

        addQuiz,
        deleteQuiz,

        addBossBattle,
        updateBossBattle,
        deleteBossBattle,
        abandonBoss,

        addReminder,
        updateReminder,
        toggleReminder,
        deleteReminder,

        triggerFeedback,
        dismissNotification,
        exportAllDataJSON,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
