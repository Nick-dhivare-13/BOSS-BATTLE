export type Appearance = 'light' | 'dark' | 'system';
export type ColorTheme = 'green' | 'white' | 'gray';

export type ModuleId =
  | 'tasks'
  | 'habits'
  | 'study'
  | 'bosses'
  | 'calendar'
  | 'academic'
  | 'analytics'
  | 'notes'
  | 'settings';

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  subjectId?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  status: TaskStatus;
  subtasks: Subtask[];
  estimatedMinutes?: number;
  completedAt?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  subjectId?: string;
  frequency: 'daily' | 'weekly';
  targetValue: number;
  unit: string;
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  userId: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  value: number;
  completed: boolean;
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  color: string;
  code?: string;
  category?: string;
  isCustom?: boolean;
}

export interface Exam {
  id: string;
  userId: string;
  subjectId: string;
  name: string;
  date: string; // YYYY-MM-DD
  topicsRemaining: number;
  totalTopics?: number;
  progressPercentage?: number;
  recommendedSessions: number;
  priority?: Priority;
  syllabus?: string;
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  subjectId?: string;
  targetDate: string;
  targetCount: number; // e.g. 30 study sessions or 20 tasks
  currentCount: number; // e.g. 18
  unit: string; // e.g. 'study sessions', 'tasks', 'chapters'
  linkedModule?: 'tasks' | 'study' | 'habits' | 'calendar' | 'none';
  milestones: Milestone[];
  createdAt: string;
}

export type BlockType = 'task' | 'habit' | 'study' | 'goal' | 'checklist' | 'note' | 'custom';
export type BlockRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TimeBlock {
  id: string;
  userId: string;
  title: string;
  blockType: BlockType;
  subjectId?: string;
  taskId?: string;
  habitId?: string;
  goalId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  recurrence: BlockRecurrence;
  completed: boolean;
  notes?: string;
  checklist?: ChecklistItem[];
  reminderEnabled?: boolean;
}

export type StudyPreset = 'pomodoro' | 'productive' | 'deep_focus' | 'long_focus' | 'stopwatch' | 'custom';

export type AlarmSoundType = 'bell' | 'digital' | 'classic' | 'strong_alert' | 'arcade' | 'chime' | 'victory';

export interface AlarmSettings {
  studyAlarmEnabled: boolean;
  breakAlarmEnabled: boolean;
  reminderAlarmEnabled: boolean;
  completionSoundEnabled: boolean;
  volume: number; // 0 - 100
  alarmType: AlarmSoundType;
}

export interface StudyTimerSettings {
  studyDuration: number; // minutes (e.g. 25 or 30 or 50)
  breakDuration: number; // minutes (e.g. 5 or 10)
  longBreakDuration: number; // minutes
  rounds: number; // total rounds (e.g. 4)
  autoStartBreak: boolean;
  autoStartStudy: boolean;
  alarmSound: AlarmSoundType;
  soundVolume: number; // 0.0 - 1.0
  vibrateEnabled: boolean;
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId?: string;
  taskId?: string;
  durationSeconds: number;
  type: StudyPreset;
  rating: number; // 1-5 stars
  timestamp: string; // ISO string
  notes?: string;
}

export interface Note {
  id: string;
  userId: string;
  subjectId?: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface FlashcardDeck {
  id: string;
  userId: string;
  subjectId?: string;
  title: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  userId: string;
  subjectId?: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export type BossDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic' | 'Legendary';
export type BossStatus = 'ACTIVE' | 'DEFEATED' | 'EXPIRED' | 'PAUSED';

export interface BossRequirement {
  type: 'study_sessions' | 'tasks' | 'habits';
  targetCount: number;
  currentCount: number;
}

export interface BossBattle {
  id: string;
  userId: string;
  name: string;
  description: string;
  subjectId?: string;
  goalId?: string;
  examId?: string;
  difficulty: BossDifficulty;
  maxHp: number;
  currentHp: number;
  xpReward: number;
  status: BossStatus;
  startDate: string;
  targetDate?: string;
  avatarIcon: string;
  monsterId?: string;
  rewardTitle?: string;
  requirements?: BossRequirement[];
  createdAt: string;
  defeatedAt?: string;
}

export interface BattleEvent {
  id: string;
  userId: string;
  bossId?: string;
  type: 'TASK' | 'HABIT' | 'STUDY' | 'GOAL_MILESTONE' | 'STREAK_BONUS';
  damage: number;
  xp: number;
  timestamp: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type ReminderType = 'study' | 'habit' | 'task' | 'assignment' | 'goal' | 'exam' | 'boss' | 'custom';
export type ReminderFrequency = 'one_time' | 'daily' | 'weekly' | 'custom';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  reminderType: ReminderType;
  subjectId?: string;
  targetDate?: string; // YYYY-MM-DD
  targetTime: string; // HH:mm
  frequency: ReminderFrequency;
  daysOfWeek?: number[]; // [0, 1, 2, 3, 4, 5, 6]
  enabled: boolean;
  moduleId?: ModuleId;
  completed?: boolean;
  lastFiredDate?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  category: 'study' | 'streak' | 'boss' | 'goal' | 'exam' | 'task' | 'habit' | 'reminder' | 'system';
  targetTab?: string;
  timestamp: string; // ISO string
  read: boolean;
  data?: Record<string, any>;
}

export interface LiveAlarmData {
  id: string;
  title: string;
  message: string;
  type: 'study_complete' | 'break_complete' | 'reminder' | 'test';
  subjectName?: string;
  targetTab?: string;
  onConfirm?: () => void;
  onSnooze?: () => void;
  onDismiss?: () => void;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  level: number;
  xp: number;
  xpForNextLevel: number;
  currentStreak: number;
  bestStreak: number;
  todayDamage: number;
  lastDamageDate: string;
  aiConsent: boolean;
  gamificationConsent: boolean;
  createdAt: string;
}

export interface FeedbackNotification {
  id: string;
  text: string;
  type: 'xp' | 'damage' | 'level' | 'achievement' | 'boss_defeat' | 'alarm' | 'streak';
  subtext?: string;
}
