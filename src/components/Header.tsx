import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Moon, Sun, Folder, Users } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import SearchBar from './SearchBar';
import UserProfileDropdown from './UserProfileDropdown';
import NotificationDropdown from './NotificationDropdown';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const handleCreateSet = () => {
    navigate('/app/create');
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700 text-white' 
    : 'bg-white border-gray-200 text-gray-900';

  return (
    <header className={`${themeClasses} border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/app" className="flex items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">Quizlify</span>
            </div>
          </Link>
          
          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 mr-6">
            <Link
              to="/app/folders"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Folder className="h-4 w-4" />
              <span>Thư mục</span>
            </Link>
            
            <Link
              to="/app/classes"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Lớp học</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-600/10'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <NotificationDropdown />
            
            <button
              onClick={handleCreateSet}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo mới</span>
            </button>
            
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;