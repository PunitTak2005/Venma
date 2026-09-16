import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Package, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-xs text-slate-900 dark:text-white">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-semibold text-[#C67C4E] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#DDD6CE]/50 dark:divide-[#3A3A40]/50">
            {notifications.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3.5 transition text-xs ${
                    !n.isRead ? 'bg-[#F8ECE3]/60 dark:bg-[#2B2B2F]' : ''
                  }`}
                >
                  <p className="font-bold text-[#1C1C1E] dark:text-[#F8F7F5] text-[11px]">{n.title}</p>
                  <p className="text-[11px] text-[#6B6B70] dark:text-[#A1A1AA] mt-0.5">{n.message}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => setIsOpen(false)}
                        className="text-[#C67C4E] font-bold hover:underline"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
