import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RecruiterNotificationsPage() {
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Recruiter Alerts</h1>
          <p className="text-gray-500 text-sm mt-1">
            Incoming application submissions, candidate status updates, and administrative approvals.
          </p>
        </div>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-brand-50 text-brand-700 font-semibold rounded-xl text-xs hover:bg-brand-100 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        {loading ? (
          <LoadingSpinner text="Checking notifications..." />
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`py-4 flex items-start justify-between gap-4 transition-colors ${
                  !notif.read ? 'bg-blue-50/50 -mx-4 px-4 rounded-xl' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    !notif.read ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    i
                  </div>
                  <div>
                    <p className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                      {notif.message}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex-shrink-0"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm">
            <p>You have no notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
