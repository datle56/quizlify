import React, { useState } from 'react';
import { Folder, BookOpen, Users, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

const FoldersTabStudent: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [folders, setFolders] = useState<any[]>([]);

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const handleViewFolder = (folderId: string) => {
    console.log('View folder:', folderId);
  };

  return (
    <div className={themeClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Thư mục học tập</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Xem các thư mục học tập được giáo viên chia sẻ
          </p>
        </div>

        {/* Folders Grid */}
        {folders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder, index) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${cardClasses} rounded-lg p-6 border transition-all hover:shadow-lg cursor-pointer`}
                onClick={() => handleViewFolder(folder.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewFolder(folder.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{folder.name}</h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {folder.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{folder.studySetCount || 0} bộ học liệu</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      folder.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {folder.isPublic ? 'Công khai' : 'Riêng tư'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Folder className={`h-16 w-16 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className="text-xl font-semibold mb-2">Chưa có thư mục nào</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Giáo viên chưa chia sẻ thư mục học tập nào cho lớp học này
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoldersTabStudent; 