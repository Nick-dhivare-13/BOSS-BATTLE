import React from 'react';
import { useData } from '../../context/DataContext';
import { AppNotification } from '../../types';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  Timer,
  Flame,
  Sword,
  Target,
  BookOpen,
  CheckSquare,
  RefreshCw,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabId: string) => void;
  onNavigate?: (tabId: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onNavigate,
}) => {
  const {
    appNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteAppNotification,
    clearAllAppNotifications,
  } = useData();

  if (!isOpen) return null;

  const unreadCount = appNotifications.filter((n) => !n.read).length;

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'study':
        return <Timer size={16} className="text-[#10b981]" />;
      case 'streak':
        return <Flame size={16} className="text-[#f59e0b]" />;
      case 'boss':
        return <Sword size={16} className="text-[#ea580c]" />;
      case 'goal':
        return <Target size={16} className="text-[#3b82f6]" />;
      case 'exam':
        return <BookOpen size={16} className="text-[#8b5cf6]" />;
      case 'task':
        return <CheckSquare size={16} className="text-[#06b6d4]" />;
      case 'habit':
        return <RefreshCw size={16} className="text-[#10b981]" />;
      case 'reminder':
        return <Clock size={16} className="text-[#e11d48]" />;
      default:
        return <Bell size={16} className="text-[#64748b]" />;
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const handleNotificationClick = (item: AppNotification) => {
    markNotificationAsRead(item.id);
    if (item.targetTab) {
      if (onNavigateTab) onNavigateTab(item.targetTab);
      else if (onNavigate) onNavigate(item.targetTab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#10b981]/15 text-[#10b981] rounded-xl">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                NOTIFICATIONS
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#10b981] text-white text-[10px] font-black rounded-full">
                    {unreadCount} NEW
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                Alarms, study alerts, streak milestones & reminders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:bg-[#f1f5f9] dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        {appNotifications.length > 0 && (
          <div className="px-6 py-2.5 bg-[#f8fafc] dark:bg-slate-800/50 border-b border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 font-bold text-[#10b981] hover:text-[#059669] transition"
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
            <button
              onClick={clearAllAppNotifications}
              className="flex items-center gap-1.5 font-bold text-[#64748b] dark:text-slate-400 hover:text-red-500 transition"
            >
              <Trash2 size={13} />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {appNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#f1f5f9] dark:bg-slate-800 text-[#94a3b8] mx-auto flex items-center justify-center mb-3">
                <Bell size={22} />
              </div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200">No Notifications</p>
              <p className="text-xs text-[#64748b] dark:text-slate-400 max-w-xs mx-auto mt-1">
                You're all caught up! Session alarms and study reminders will appear right here.
              </p>
            </div>
          ) : (
            appNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative group ${
                  item.read
                    ? 'bg-white dark:bg-slate-800/40 border-[#e2e8f0] dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-[#10b981]/5 dark:bg-[#10b981]/10 border-[#10b981]/30 text-slate-900 dark:text-white shadow-xs'
                }`}
              >
                {/* Category Icon */}
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 shadow-2xs shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black truncate">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 bg-[#10b981] rounded-full shrink-0 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-[#94a3b8]">
                    <span>{formatTimestamp(item.timestamp)}</span>
                    {item.targetTab && (
                      <span className="flex items-center gap-0.5 text-[#10b981] font-black">
                        Open <ExternalLink size={10} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAppNotification(item.id);
                  }}
                  className="absolute right-2.5 top-2.5 p-1 rounded-md text-[#94a3b8] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition"
                  title="Remove notification"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafc] dark:bg-slate-800/80 border-t border-[#e2e8f0] dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs rounded-xl shadow-md shadow-[#10b981]/20 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
