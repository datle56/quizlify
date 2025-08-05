import React from 'react';
import { 
  BarChart3, 
  Folder, 
  FileText, 
  Users, 
  TrendingUp 
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface ClassTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  userRole?: 'teacher' | 'student' | null;
}

const ClassTabs: React.FC<ClassTabsProps> = ({ activeTab, onTabChange, userRole }) => {
  const { isDarkMode } = useThemeStore();

  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
      { id: 'folders', label: 'Thư mục', icon: Folder },
      { id: 'assignments', label: 'Bài tập', icon: FileText },
      { id: 'members', label: 'Thành viên', icon: Users },
      { id: 'progress', label: 'Tiến độ', icon: TrendingUp }
    ];

    // If user is a teacher, show all tabs
    if (userRole === 'teacher') {
      return baseTabs;
    }

    // If user is a student, show limited tabs
    if (userRole === 'student') {
      return baseTabs.filter(tab => 
        tab.id === 'overview' || 
        tab.id === 'folders' || 
        tab.id === 'assignments' || 
        tab.id === 'progress'
      );
    }

    // Default to all tabs if role is not determined
    return baseTabs;
  };

  const tabs = getTabs();

  return (
    <div className="flex space-x-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white'
              : isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <tab.icon className="h-4 w-4" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ClassTabs; 