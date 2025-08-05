import React, { useState } from 'react';
import { Plus, Folder, MoreVertical, Edit, Trash2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

interface FoldersTabTeacherProps {
  onCreateFolder: () => void;
}

const FoldersTabTeacher: React.FC<FoldersTabTeacherProps> = ({ onCreateFolder }) => {
  const { isDarkMode } = useThemeStore();
  const [folders, setFolders] = useState<any[]>([]);
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const handleCreateFolder = () => {
    onCreateFolder();
  };

  const handleEditFolder = (folderId: string) => {
    console.log('Edit folder:', folderId);
    setShowContextMenu(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    console.log('Delete folder:', folderId);
    setShowContextMenu(null);
  };

  return (
    <div className={themeClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quản lý thư mục</h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tạo và quản lý thư mục học tập cho lớp học
            </p>
          </div>
          
          <button
            onClick={handleCreateFolder}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo thư mục</span>
          </button>
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
                className={`${cardClasses} rounded-lg p-6 border transition-all hover:shadow-lg relative`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowContextMenu(showContextMenu === folder.id ? null : folder.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {showContextMenu === folder.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-10 ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => handleEditFolder(folder.id)}
                              className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-300 hover:bg-gray-700' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Chỉnh sửa</span>
                            </button>
                            <button
                              onClick={() => handleDeleteFolder(folder.id)}
                              className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                                isDarkMode 
                                  ? 'text-red-400 hover:bg-gray-700' 
                                  : 'text-red-600 hover:bg-gray-100'
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{folder.name}</h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {folder.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
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
              Tạo thư mục đầu tiên để tổ chức học liệu cho lớp học
            </p>
            <button
              onClick={handleCreateFolder}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo thư mục đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoldersTabTeacher; 