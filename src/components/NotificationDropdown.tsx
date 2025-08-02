import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Trash2, Settings } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'Thành tích mới!',
      message: 'Bạn đã hoàn thành 100 thẻ ghi nhớ',
      timestamp: '2 phút trước',
      read: false
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Nhắc nhở học tập',
      message: 'Đã đến lúc ôn tập bộ "Tiếng Anh cơ bản"',
      timestamp: '1 giờ trước',
      read: false
    },
    {
      id: '3',
      type: 'social',
      title: 'Bộ học mới được chia sẻ',
      message: 'Maria Garcia đã chia sẻ "Spanish Vocabulary" với bạn',
      timestamp: '3 giờ trước',
      read: true
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useThemeStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'reminder':
        return '⏰';
      case 'social':
        return '👥';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  const themeClasses = {
    dropdown: isDarkMode 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    item: isDarkMode 
      ? 'hover:bg-gray-700' 
      : 'hover:bg-gray-50',
    text: isDarkMode ? 'text-gray-300' : 'text-gray-700',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500'
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${
          isDarkMode 
            ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden ${themeClasses.dropdown}`}
          >
            {/* Header */}
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Thông báo</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        isDarkMode 
                          ? 'text-blue-400 hover:bg-blue-400/10' 
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                  <button
                    className={`p-1 rounded transition-colors ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b transition-colors ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-100'
                    } ${themeClasses.item} ${
                      !notification.read ? (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50') : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${themeClasses.text}`}>
                              {notification.title}
                            </p>
                            <p className={`text-sm mt-1 ${themeClasses.muted}`}>
                              {notification.message}
                            </p>
                            <p className={`text-xs mt-2 ${themeClasses.muted}`}>
                              {notification.timestamp}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className={`p-1 rounded transition-colors ${
                                  isDarkMode 
                                    ? 'text-gray-400 hover:text-green-400' 
                                    : 'text-gray-500 hover:text-green-600'
                                }`}
                                title="Đánh dấu đã đọc"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className={`p-1 rounded transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-400 hover:text-red-400' 
                                  : 'text-gray-500 hover:text-red-600'
                              }`}
                              title="Xóa thông báo"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell className={`h-8 w-8 mx-auto mb-2 ${themeClasses.muted}`} />
                  <p className={themeClasses.muted}>Không có thông báo nào</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={clearAll}
                  className={`w-full flex items-center justify-center space-x-2 py-2 rounded transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-red-400 hover:bg-red-400/10' 
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Xóa tất cả</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;