import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { ModuleId } from '../types';
import { LEGAL_CONFIG, getMailtoLink } from '../config/legalConfig';
import {
  Settings,
  Shield,
  Download,
  Trash2,
  Sun,
  Moon,
  Volume2,
  User,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Layers,
  Sparkles,
  Timer,
  CheckSquare,
  RefreshCw,
  Sword,
  Calendar as CalendarIcon,
  BookOpenCheck,
  RotateCcw,
  Mail,
  MessageSquare,
  ExternalLink,
  HelpCircle,
  MapPin,
  Scale,
  Info,
  HeartHandshake,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout, deleteAccount, updateProfile } = useAuth();
  const {
    exportAllDataJSON,
    enabledModules,
    isModuleEnabled,
    toggleModule,
    setShowOnboardingModal,
    setAllModules,
  } = useData();
  const { appearance, setAppearance, colorTheme, setColorTheme, soundEnabled, setSoundEnabled } = useTheme();

  const [activeTab, setActiveTab] = useState<'modules' | 'privacy' | 'appearance' | 'legal'>('modules');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [showViewDataModal, setShowViewDataModal] = useState(false);

  const MODULE_ITEMS: {
    id: ModuleId;
    name: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    category: string;
  }[] = [
    {
      id: 'study',
      name: 'Study Timer & Focus Sessions',
      description: 'Pomodoro, 30/10 study modes, stopwatch, ambient focus audio.',
      icon: Timer,
      category: 'Core System',
    },
    {
      id: 'tasks',
      name: 'Tasks & Subtasks Manager',
      description: 'Priorities, due dates, checkboxes, estimated time & tags.',
      icon: CheckSquare,
      category: 'Core System',
    },
    {
      id: 'habits',
      name: 'Habit Tracker & Yearly Heatmaps',
      description: 'Daily consistency tracking, streaks, weekly & yearly visualization.',
      icon: RefreshCw,
      category: 'Optional System',
    },
    {
      id: 'bosses',
      name: 'Gamified Boss Battles & XP',
      description: 'Turn study hours and completed tasks into attacks against mega bosses.',
      icon: Sword,
      category: 'Core Gamification',
    },
    {
      id: 'calendar',
      name: 'Calendar & Notion-Style Time Blocks',
      description: 'Visual day/week timeline with drag-and-drop planning.',
      icon: CalendarIcon,
      category: 'Optional System',
    },
    {
      id: 'academic',
      name: 'Subjects, Exams & Long-Term Goals',
      description: 'Track academic subjects, upcoming exams countdowns, and goal milestones.',
      icon: BookOpenCheck,
      category: 'Optional System',
    },
    {
      id: 'notes',
      name: 'Notes & AI Study Deck',
      description: 'Markdown study notes and AI-generated flashcard decks.',
      icon: FileText,
      category: 'Optional System',
    },
  ];

  const handleExportData = () => {
    const jsonStr = exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyHabit_Data_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccountFinal = async () => {
    if (deleteConfirmationInput === 'DELETE MY ACCOUNT') {
      await deleteAccount();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-surface border border-brand-border p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-black text-brand-text">Settings & Privacy Center</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Manage your personal data, export backups, customize themes, and security preferences.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border gap-6 text-sm font-extrabold overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('modules')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'modules'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <Layers size={16} />
          <span>System Modules</span>
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <Shield size={16} />
          <span>Privacy & Data Controls</span>
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'appearance'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <Sun size={16} />
          <span>Theme & Sound</span>
        </button>
        <button
          onClick={() => setActiveTab('legal')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'legal'
              ? 'border-brand-primary text-brand-primary'
              : 'border-transparent text-brand-muted hover:text-brand-text'
          }`}
        >
          <FileText size={16} />
          <span>Support & Legal</span>
        </button>
      </div>

      {/* TAB 0: SYSTEM MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-base text-brand-text flex items-center gap-2">
                  <Layers size={18} className="text-brand-primary" />
                  <span>Choose Your Active Systems</span>
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  Customize Boss Battles to fit your workflow. Turn on only the modules you need or enable everything.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOnboardingModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-brand-primary text-white text-xs font-black shadow-md shadow-brand-primary/25 hover:bg-emerald-600 transition flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>System Setup Wizard</span>
                </button>

                <button
                  onClick={() => setAllModules(['study', 'tasks', 'habits', 'bosses', 'calendar', 'academic', 'notes'])}
                  className="px-3.5 py-2 rounded-xl bg-brand-background border border-brand-border text-xs font-bold text-brand-text hover:border-brand-primary transition"
                >
                  Enable All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {MODULE_ITEMS.map((item) => {
                const isEnabled = isModuleEnabled(item.id);
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                      isEnabled
                        ? 'bg-brand-surface border-brand-primary/40 shadow-sm'
                        : 'bg-brand-background/60 border-brand-border opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isEnabled
                            ? 'bg-brand-primary/10 text-brand-primary'
                            : 'bg-brand-border/40 text-brand-muted'
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-brand-text">{item.name}</span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-background border border-brand-border text-brand-muted">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleModule(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition whitespace-nowrap ${
                        isEnabled
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'bg-brand-background border border-brand-border text-brand-muted hover:text-brand-text'
                      }`}
                    >
                      {isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: PRIVACY & DATA CONTROLS */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          {/* User Profile & Local Authentication Card */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-extrabold text-base text-brand-text flex items-center gap-2">
                <User size={18} className="text-brand-primary" />
                <span>Student Account Info</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-background border border-brand-border text-[11px] font-bold text-brand-muted">
                Local Sandbox Mode
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-brand-muted mb-1">Display Name</label>
                <input
                  type="text"
                  value={user?.displayName || ''}
                  onChange={(e) => updateProfile({ displayName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-brand-background border border-brand-border font-bold text-brand-text"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-muted mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3 py-2 rounded-xl bg-brand-background border border-brand-border font-bold text-brand-muted cursor-not-allowed"
                />
              </div>
            </div>

            {/* Authentication Architecture Disclosure */}
            <div className="p-3.5 rounded-xl bg-brand-background border border-brand-border space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-brand-text font-bold">
                <Info size={14} className="text-brand-primary" />
                <span>Authentication & Storage Architecture Notice</span>
              </div>
              <p className="text-[11px] text-brand-muted leading-relaxed">
                Boss Battles currently utilizes client-side / local session management stored directly in your browser sandbox. Account data is persisted locally and is not synchronized to a remote server-side centralized credential database or multi-device account security system.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-brand-background border border-brand-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-extrabold text-[10px]">
                  AGE {LEGAL_CONFIG.minimumAge}
                </span>
                <span className="text-brand-muted">{LEGAL_CONFIG.minimumAgeNotice}</span>
              </div>
            </div>
          </div>

          {/* Privacy Actions & Rights */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <h2 className="font-extrabold text-base text-brand-text flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" />
              <span>Data Rights & Management</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setShowViewDataModal(true)}
                className="p-4 rounded-xl bg-brand-background border border-brand-border hover:border-brand-primary text-left space-y-1 transition"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-brand-text">
                  <Eye size={18} className="text-brand-primary" />
                  <span>View My Data Summary</span>
                </div>
                <p className="text-xs text-brand-muted">
                  Inspect all active collections, tasks, habits, and study logs stored locally.
                </p>
              </button>

              <button
                onClick={handleExportData}
                className="p-4 rounded-xl bg-brand-background border border-brand-border hover:border-brand-primary text-left space-y-1 transition"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-brand-text">
                  <Download size={18} className="text-brand-primary" />
                  <span>Export Complete Data (JSON)</span>
                </div>
                <p className="text-xs text-brand-muted">
                  Download a full machine-readable backup of all 14 local data collections.
                </p>
              </button>
            </div>

            {/* Consent Toggles */}
            <div className="pt-4 border-t border-brand-border space-y-3">
              <h3 className="font-bold text-xs text-brand-muted">PROCESSING CONSENT TOGGLES</h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-background border border-brand-border text-xs">
                <div className="pr-4">
                  <div className="font-bold text-brand-text">AI Study Coach & Smart Planner</div>
                  <div className="text-brand-muted text-[11px] mt-0.5 leading-relaxed">
                    When enabled, user-initiated requests transmit minimum required task or note text to the server-side Google Gemini endpoint. Passwords, tokens, API keys, and unrelated account data are never sent.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={user?.aiConsent ?? true}
                  onChange={(e) => updateProfile({ aiConsent: e.target.checked })}
                  className="rounded border-brand-border text-brand-primary focus:ring-brand-primary shrink-0"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-background border border-brand-border text-xs">
                <div className="pr-4">
                  <div className="font-bold text-brand-text">Gamified XP & Boss Battles</div>
                  <div className="text-brand-muted text-[11px] mt-0.5">
                    Track study activity locally to calculate boss damage, level progression, and monster unlocks.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={user?.gamificationConsent ?? true}
                  onChange={(e) => updateProfile({ gamificationConsent: e.target.checked })}
                  className="rounded border-brand-border text-brand-primary focus:ring-brand-primary shrink-0"
                />
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-brand-border space-y-3">
              <h3 className="font-bold text-xs text-rose-500">DANGER ZONE</h3>

              <div className="flex items-center justify-between">
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold text-brand-text hover:bg-brand-background"
                >
                  Sign Out
                </button>

                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Delete My Account</span>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Data Protection Controls Section */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 font-extrabold text-sm text-brand-text">
              <Shield size={18} className="text-brand-primary" />
              <span>Privacy & Data Protection Controls</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1">
                <span className="font-bold text-brand-text block">1. Local Storage Sovereignty</span>
                <p className="text-brand-muted text-[11px]">Core tasks, study logs, and habit records are stored directly in your local browser sandbox.</p>
              </div>

              <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1">
                <span className="font-bold text-brand-text block">2. Data Minimization in AI</span>
                <p className="text-brand-muted text-[11px]">Only minimal text required for the active prompt is processed. No passwords or auth tokens transmitted.</p>
              </div>

              <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1">
                <span className="font-bold text-brand-text block">3. One-Click JSON Export</span>
                <p className="text-brand-muted text-[11px]">Export a complete, transparent JSON file of all 14 data collections whenever needed.</p>
              </div>

              <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1">
                <span className="font-bold text-brand-text block">4. Direct Data Erasure</span>
                <p className="text-brand-muted text-[11px]">Permanently erase all local application state and cached profile records in real-time.</p>
              </div>
            </div>

            {/* Legal Review Recommended Callout */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-amber-600 dark:text-amber-400 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle size={15} />
                <span>Legal Review Recommended</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Security and privacy controls have been implemented at the technical level. Legal and regulatory review of policies, jurisdiction requirements, and specific operational practices is recommended prior to formal production launch. Boss Battles does not claim compliance with specific statutory frameworks without formal legal verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPEARANCE & SOUND */}
      {activeTab === 'appearance' && (
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-6">
          <div className="space-y-3">
            <h2 className="font-extrabold text-base text-brand-text">Appearance Theme</h2>
            <div className="grid grid-cols-3 gap-3 text-xs font-bold">
              {(['light', 'dark', 'system'] as const).map((app) => (
                <button
                  key={app}
                  onClick={() => setAppearance(app)}
                  className={`p-3 rounded-xl border capitalize transition ${
                    appearance === app
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-black'
                      : 'border-brand-border bg-brand-background text-brand-text'
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-brand-border">
            <h2 className="font-extrabold text-base text-brand-text">Color Accent Tokens</h2>
            <div className="grid grid-cols-3 gap-3 text-xs font-bold">
              <button
                onClick={() => setColorTheme('green')}
                className={`p-3 rounded-xl border transition flex items-center justify-center gap-2 ${
                  colorTheme === 'green' ? 'border-emerald-500 bg-emerald-500/10 font-black' : 'border-brand-border'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                <span>Emerald Green</span>
              </button>

              <button
                onClick={() => setColorTheme('gray')}
                className={`p-3 rounded-xl border transition flex items-center justify-center gap-2 ${
                  colorTheme === 'gray' ? 'border-slate-500 bg-slate-500/10 font-black' : 'border-brand-border'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-500" />
                <span>Slate Gray</span>
              </button>

              <button
                onClick={() => setColorTheme('white')}
                className={`p-3 rounded-xl border transition flex items-center justify-center gap-2 ${
                  colorTheme === 'white' ? 'border-slate-800 bg-slate-800/10 font-black' : 'border-brand-border'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-800" />
                <span>Minimal White</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-brand-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-base text-brand-text">Sound Effects</h2>
                <p className="text-xs text-brand-muted">Play Web Audio synthesized chimes for task completions & level ups.</p>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUPPORT & LEGAL GOVERNANCE */}
      {activeTab === 'legal' && (
        <div className="space-y-6 text-xs text-brand-text">
          {/* Header Card */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 font-extrabold text-xs uppercase tracking-wider">
              <Scale size={16} />
              <span>Platform Governance & Helpdesk</span>
            </div>
            <h2 className="text-xl font-black text-brand-text">Support, Privacy & Legal Center</h2>
            <p className="text-xs text-brand-muted leading-relaxed">
              Official contact channels, data access requests, grievance redressal, privacy governance, terms of service, and operator details for Boss Battles.
            </p>
          </div>

          {/* SECTION 1: SUPPORT & HELPDESK */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-brand-border pb-3">
              <div className="flex items-center gap-2 font-extrabold text-sm text-brand-text">
                <HelpCircle size={18} className="text-brand-primary" />
                <span>SUPPORT</span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-brand-background border border-brand-border text-brand-muted">
                Official Helpdesk
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-brand-text">Contact Boss Battles Support</h3>
              <p className="text-brand-muted mt-1 leading-relaxed">
                Need assistance with your study timers, habit tracking, boss battles, or experiencing unexpected behavior? Contact our dedicated support desk:
              </p>
              <div className="mt-2.5 p-3 rounded-xl bg-brand-background border border-brand-border font-mono text-xs text-brand-text flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-brand-muted font-bold block text-[10px] uppercase">Support Email:</span>
                  <span className="font-bold text-brand-primary">{LEGAL_CONFIG.supportEmail}</span>
                </div>
                <a
                  href={getMailtoLink('support')}
                  className="px-3 py-1.5 rounded-lg bg-brand-primary text-white font-bold text-xs hover:bg-emerald-600 transition flex items-center gap-1"
                >
                  <Mail size={13} />
                  <span>Email Support</span>
                </a>
              </div>
            </div>

            {/* Support Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <a
                href={getMailtoLink('support')}
                className="p-3.5 rounded-xl bg-brand-background border border-brand-border hover:border-brand-primary transition text-center flex flex-col items-center justify-center gap-1.5 group"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-105 transition">
                  <Mail size={16} />
                </div>
                <span className="font-extrabold text-xs text-brand-text">Contact Support</span>
                <span className="text-[10px] text-brand-muted">General inquiries & help</span>
              </a>

              <a
                href={getMailtoLink('problem')}
                className="p-3.5 rounded-xl bg-brand-background border border-brand-border hover:border-rose-500 transition text-center flex flex-col items-center justify-center gap-1.5 group"
              >
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 group-hover:scale-105 transition">
                  <AlertTriangle size={16} />
                </div>
                <span className="font-extrabold text-xs text-brand-text">Report a Problem</span>
                <span className="text-[10px] text-brand-muted">Bug reports & crashes</span>
              </a>

              <a
                href={getMailtoLink('feedback')}
                className="p-3.5 rounded-xl bg-brand-background border border-brand-border hover:border-amber-500 transition text-center flex flex-col items-center justify-center gap-1.5 group"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-105 transition">
                  <MessageSquare size={16} />
                </div>
                <span className="font-extrabold text-xs text-brand-text">Send Feedback</span>
                <span className="text-[10px] text-brand-muted">Feature ideas & suggestions</span>
              </a>
            </div>
          </div>

          {/* SECTION 2: PRIVACY & DATA REQUESTS */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-brand-border pb-3">
              <div className="flex items-center gap-2 font-extrabold text-sm text-brand-text">
                <Shield size={18} className="text-emerald-500" />
                <span>PRIVACY & DATA REQUESTS</span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-brand-background border border-brand-border text-brand-muted">
                User Rights
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-brand-text">Privacy & Data Requests</h3>
              <p className="text-brand-muted mt-1 leading-relaxed">
                For privacy questions, data access requests, correction requests, or deletion requests, contact:
              </p>
              <div className="mt-2.5 p-3 rounded-xl bg-brand-background border border-brand-border font-mono text-xs text-brand-text flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-brand-muted font-bold block text-[10px] uppercase">Privacy & Data Email:</span>
                  <span className="font-bold text-emerald-500">{LEGAL_CONFIG.privacyEmail}</span>
                </div>
                <a
                  href={getMailtoLink('data_request')}
                  className="px-3 py-1.5 rounded-lg bg-brand-background border border-brand-border hover:border-emerald-500 text-brand-text font-bold text-xs transition flex items-center gap-1"
                >
                  <Download size={13} className="text-emerald-500" />
                  <span>Request Data Access</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={getMailtoLink('data_request')}
                className="p-3.5 rounded-xl bg-brand-background border border-brand-border hover:border-emerald-500 transition text-left flex items-center justify-between gap-3 group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-brand-text block">[Request My Data]</span>
                  <span className="text-[11px] text-brand-muted block">Submit official data access or porting inquiry</span>
                </div>
                <ExternalLink size={15} className="text-brand-muted group-hover:text-emerald-500 shrink-0" />
              </a>

              <a
                href={getMailtoLink('data_deletion')}
                className="p-3.5 rounded-xl bg-brand-background border border-brand-border hover:border-rose-500 transition text-left flex items-center justify-between gap-3 group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-brand-text block">[Request Account/Data Deletion]</span>
                  <span className="text-[11px] text-brand-muted block">Submit formal account or record purge request</span>
                </div>
                <ExternalLink size={15} className="text-brand-muted group-hover:text-rose-500 shrink-0" />
              </a>
            </div>

            <div className="p-3 rounded-xl bg-brand-background/60 border border-brand-border text-[11px] text-brand-muted">
              <span className="font-bold text-brand-text">Instant In-App Controls:</span> You can also export your full local JSON archive or wipe all local storage data immediately right from the <button onClick={() => setActiveTab('privacy')} className="text-brand-primary underline font-bold">Privacy & Data Controls</button> tab without waiting.
            </div>
          </div>

          {/* SECTION 3 & 4: GRIEVANCE CONTACT & LEGAL INFORMATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grievance Contact */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 font-extrabold text-sm text-brand-text">
                  <HeartHandshake size={18} className="text-amber-500" />
                  <span>Grievance Contact</span>
                </div>
                <p className="text-brand-muted leading-relaxed">
                  For formal grievances, consumer dispute inquiries, or regulatory notices, reach our designated grievance representative:
                </p>
                <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1 font-mono text-xs">
                  <div>
                    <span className="text-brand-muted text-[10px] block uppercase font-bold">Contact Email:</span>
                    <span className="font-bold text-brand-text">{LEGAL_CONFIG.grievanceEmail}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-brand-muted text-[10px] block uppercase font-bold">Designated Representative / Operator:</span>
                    <span className="font-bold text-brand-text">{LEGAL_CONFIG.legalOperatorName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={getMailtoLink('grievance')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-extrabold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Mail size={14} />
                  <span>Contact Grievance Desk</span>
                </a>
              </div>
            </div>

            {/* Legal Information */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 font-extrabold text-sm text-brand-text">
                  <Scale size={18} className="text-cyan-500" />
                  <span>Legal Information</span>
                </div>
                <p className="text-brand-muted leading-relaxed">
                  Official operator identity and address details:
                </p>
                <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1.5 text-xs">
                  <div>
                    <span className="text-brand-muted text-[10px] block uppercase font-bold">Legal / Operator:</span>
                    <span className="font-black text-brand-text font-mono">{LEGAL_CONFIG.legalOperatorName}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted text-[10px] block uppercase font-bold">Location / Address:</span>
                    <div className="flex items-start gap-1 font-bold text-brand-text">
                      <MapPin size={13} className="text-cyan-500 shrink-0 mt-0.5" />
                      <span>{LEGAL_CONFIG.locationAddress}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-brand-muted text-[10px] block uppercase font-bold">Support Contact:</span>
                    <span className="font-mono text-brand-primary">{LEGAL_CONFIG.supportEmail}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-brand-background border border-brand-border flex items-center justify-between text-[11px]">
                <span className="font-bold text-brand-text">Minimum Age Requirement:</span>
                <span className="font-extrabold text-emerald-500 font-mono">{LEGAL_CONFIG.minimumAge}</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: AGE REQUIREMENT */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-extrabold text-sm text-brand-text flex items-center gap-2">
                <User size={16} className="text-brand-primary" />
                <span>Age Requirement & Eligibility</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-black text-xs">
                {LEGAL_CONFIG.minimumAge}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-brand-background border border-brand-border space-y-2">
              <p className="font-bold text-sm text-brand-text">
                &ldquo;{LEGAL_CONFIG.minimumAgeNotice}&rdquo;
              </p>
              <p className="text-brand-muted leading-relaxed">
                Boss Battles is designed for adult learners, university students, and self-directed learners aged 18 and older. We do not knowingly collect information from or target individuals below the age of 18. By using this service, you confirm that you satisfy this age eligibility threshold.
              </p>
            </div>
          </div>

          {/* SECTION 6: PRIVACY POLICY */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-brand-border pb-3">
              <div className="flex items-center gap-2 font-extrabold text-sm text-brand-text">
                <Shield size={18} className="text-emerald-500" />
                <span>Privacy Policy</span>
              </div>
              <span className="text-[10px] font-bold text-brand-muted">Last Updated: August 2026</span>
            </div>

            <div className="space-y-3 text-brand-muted leading-relaxed">
              <p>
                This Privacy Policy describes how Boss Battles collects, stores, and handles information across all modules.
              </p>

              <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1 font-mono text-xs">
                <div className="text-brand-text"><strong>Data / Privacy Contact:</strong> {LEGAL_CONFIG.privacyEmail}</div>
                <div className="text-brand-text"><strong>Legal / Operator:</strong> {LEGAL_CONFIG.legalOperatorName}</div>
                <div className="text-brand-text"><strong>Location:</strong> {LEGAL_CONFIG.locationAddress}</div>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 rounded-xl bg-brand-background border border-brand-border space-y-1">
                  <div className="font-extrabold text-xs text-brand-primary flex items-center gap-1.5">
                    <Shield size={14} />
                    <span>1. Local-First Browser Storage</span>
                  </div>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    Core application data—including tasks, study sessions, habits, boss battles, calendar blocks, notes, and flashcards—is stored directly in your browser&apos;s local storage.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-background border border-brand-border space-y-1">
                  <div className="font-extrabold text-xs text-emerald-500 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>2. AI Feature Data Transmission</span>
                  </div>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    When you explicitly trigger an AI feature (such as Day Planning, Task Breakdown, or Flashcard Generation), the minimum required text payload is transmitted to the server-side Google Gemini endpoint. Passwords, tokens, API keys, and unrelated account data are never sent.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-background border border-brand-border space-y-1">
                  <div className="font-extrabold text-xs text-cyan-500 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>3. Focus Shield Client Pledges</span>
                  </div>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    Focus Shield runs completely client-side to track user-declared study pledges. It does not monitor, record, or transmit your overall browsing history or network tabs.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-background border border-brand-border space-y-1">
                  <div className="font-extrabold text-xs text-amber-500 flex items-center gap-1.5">
                    <Download size={14} />
                    <span>4. Full Export & Erasure</span>
                  </div>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    You can export a full JSON archive of all 14 data collections at any time, or permanently erase all local storage records with one click in Privacy & Data Controls.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: TERMS OF SERVICE */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-brand-border pb-3">
              <div className="flex items-center gap-2 font-extrabold text-sm text-brand-text">
                <FileText size={18} className="text-brand-primary" />
                <span>Terms of Service</span>
              </div>
              <span className="text-[10px] font-bold text-brand-muted">Effective Date: August 2026</span>
            </div>

            <div className="space-y-3 text-brand-muted leading-relaxed">
              <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1 font-mono text-xs">
                <div className="text-brand-text"><strong>Operator:</strong> {LEGAL_CONFIG.legalOperatorName}</div>
                <div className="text-brand-text"><strong>Support Contact:</strong> {LEGAL_CONFIG.supportEmail}</div>
                <div className="text-brand-text"><strong>Minimum Age:</strong> {LEGAL_CONFIG.minimumAge}</div>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-brand-text">1. Acceptance & Age Eligibility</h4>
                <p>
                  By accessing or utilizing Boss Battles, you agree to these Terms. You acknowledge that Boss Battles is intended for users aged 18 and older. If you do not meet this eligibility standard, you must not use this application.
                </p>

                <h4 className="font-bold text-brand-text pt-2">2. Permitted Use & Productivity Tooling</h4>
                <p>
                  Boss Battles is provided as a modular study and time management platform. You agree to use the service for lawful personal, educational, and productivity goals only.
                </p>

                <h4 className="font-bold text-brand-text pt-2">3. Client-Side Data Responsibility</h4>
                <p>
                  Because Boss Battles utilizes local browser storage for persistence, you are responsible for maintaining backups using the built-in JSON export feature before clearing browser caches or switching devices.
                </p>

                <h4 className="font-bold text-brand-text pt-2">4. AI Coaching Terms</h4>
                <p>
                  AI study features are provided as educational aids. AI-generated study plans, task breakdowns, and flashcards should be evaluated independently and do not substitute for official educational curriculum guidance.
                </p>

                <h4 className="font-bold text-brand-text pt-2">5. Limitation of Liability</h4>
                <p>
                  To the maximum extent permitted by law, Boss Battles and its operator ({LEGAL_CONFIG.legalOperatorName}) provide this service &ldquo;as-is&rdquo; without warranties of any kind.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 8: LEGAL & TECHNICAL DISCLAIMER */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-amber-600 dark:text-amber-400">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle size={18} />
              <span>Technical & Regulatory Disclaimer</span>
            </div>
            <p className="text-xs leading-relaxed">
              Security controls implemented. Privacy controls implemented. Legal review recommended before production launch.
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-500 font-extrabold text-base">
              <AlertTriangle size={20} />
              <span>Permanent Account Deletion</span>
            </div>

            <p className="text-xs text-brand-muted">
              This action will permanently delete your account, all tasks, habits, study sessions, and boss battle progress. Type <strong>DELETE MY ACCOUNT</strong> to confirm.
            </p>

            <input
              type="text"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="w-full px-3 py-2 rounded-xl bg-brand-background border border-brand-border font-mono text-xs text-brand-text"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 rounded-xl border border-brand-border text-xs font-bold text-brand-text"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountFinal}
                disabled={deleteConfirmationInput !== 'DELETE MY ACCOUNT'}
                className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs disabled:opacity-50"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Data Modal */}
      {showViewDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h2 className="font-extrabold text-base text-brand-text">Active Local Data Summary</h2>
              <button onClick={() => setShowViewDataModal(false)} className="text-brand-muted hover:text-brand-text">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <pre className="p-4 bg-brand-background border border-brand-border rounded-xl text-brand-text overflow-x-auto text-[11px]">
                {exportAllDataJSON()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
