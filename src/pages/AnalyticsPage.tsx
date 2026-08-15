import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Award, Calendar, CheckCircle2, Flame, HelpCircle } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { studySessions, tasks, habits, habitLogs, subjects } = useData();
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Chart Data Preparation
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const now = new Date();

  const studyTimeData = Array.from({ length: days }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().split('T')[0];

    const daySessions = studySessions.filter((s) => s.timestamp.startsWith(dateStr));
    const totalMins = Math.round(daySessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60);

    return {
      date: range === '7d' ? d.toLocaleDateString('en-US', { weekday: 'short' }) : dateStr.slice(5),
      minutes: totalMins,
    };
  });

  // Subject Breakdown
  const subjectBreakdown = subjects.map((sub) => {
    const subSessions = studySessions.filter((s) => s.subjectId === sub.id);
    const totalMins = Math.round(subSessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60);
    return {
      name: sub.name,
      value: totalMins || 10,
      color: sub.color,
    };
  });

  // Consistency Score formula breakdown
  const taskRate = tasks.length > 0 ? (tasks.filter((t) => t.status === 'completed').length / tasks.length) * 30 : 25;
  const habitRate = habits.length > 0 ? (habitLogs.filter((l) => l.completed).length / Math.max(1, habits.length * 7)) * 40 : 35;
  const consistencyScore = Math.min(100, Math.round(taskRate + habitRate + 20));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-surface border border-brand-border p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-black text-brand-text">Analytics & Consistency Score</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Transparent insights into your study habits, time allocation, and consistency.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex p-1 rounded-xl bg-brand-background border border-brand-border text-xs font-bold">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg transition ${
                range === r ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Consistency Score Transparency Card */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-brand-text">{consistencyScore}%</div>
              <div className="text-xs font-bold text-brand-muted">Overall Consistency Rating</div>
            </div>
          </div>
        </div>

        {/* Formula breakdown */}
        <div className="pt-3 border-t border-brand-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1">
            <div className="font-bold text-brand-text">Habit Streaks (40% Weight)</div>
            <p className="text-[11px] text-brand-muted">Based on daily check-ins vs target frequencies.</p>
          </div>
          <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1">
            <div className="font-bold text-brand-text">Task Completion (30% Weight)</div>
            <p className="text-[11px] text-brand-muted">Ratio of finished tasks on or before due date.</p>
          </div>
          <div className="p-3 rounded-xl bg-brand-background border border-brand-border space-y-1">
            <div className="font-bold text-brand-text">Study Session Minutes (20% Weight)</div>
            <p className="text-[11px] text-brand-muted">Regularity of Pomodoro & Focus sessions.</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Time Chart */}
        <div className="lg:col-span-2 bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
          <h2 className="font-black text-base text-brand-text">Study Minutes per Day</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyTimeData}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '12px',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="minutes" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Pie Chart */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
          <h2 className="font-black text-base text-brand-text">Time by Subject</h2>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subjectBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                  {subjectBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2">
            {subjectBreakdown.map((sb, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sb.color }} />
                  <span className="text-brand-text font-bold">{sb.name}</span>
                </div>
                <span className="text-brand-muted">{sb.value} mins</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
