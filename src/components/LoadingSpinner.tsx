import React from 'react';
import { useThemeStore } from '../store/themeStore';

const LoadingSpinner: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  
  const bgClass = isDarkMode ? 'bg-slate-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-slate-300' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-slate-300' : 'border-blue-600';

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${borderClass} mx-auto mb-4`}></div>
        <p className={textClass}>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;