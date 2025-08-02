import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Grid, List, Filter, FolderPlus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFolders } from '../hooks/useFolders';
import { useThemeStore } from '../store/themeStore';
import FolderCard from '../components/FolderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateFolderModal from '../components/CreateFolderModal';
import FolderContextMenu from '../components/FolderContextMenu';
import { Folder } from '../types';

const Folders: React.FC = () => {
  const navigate = useNavigate();
  const { folders, loading, createFolder, updateFolder, deleteFolder } = useFolders();
  const { isDarkMode } = useThemeStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    folder: Folder;
    x: number;
    y: number;
  } | null>(null);

  const personalFolders = folders.filter(folder => folder.type === 'personal' && !folder.classId);
  
  const filteredFolders = personalFolders.filter(folder => {
    const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         folder.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'smart' && folder.isSmartFolder) ||
                         (filterType === 'regular' && !folder.isSmartFolder);
    
    return matchesSearch && matchesFilter;
  });

  const handleFolderClick = (id: string) => {
    navigate(`/app/folders/${id}`);
  };

  const handleContextMenu = (folder: Folder, event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      folder,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleCreateFolder = (folderData: any) => {
    createFolder({
      ...folderData,
      userId: 'user_001',
      type: 'personal'
    });
    setShowCreateModal(false);
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Thư mục của tôi</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Tổ chức bộ học của bạn với thư mục
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo thư mục</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={`rounded-lg p-4 border ${cardClasses} mb-6`}>
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm thư mục..."
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">Tất cả</option>
                  <option value="regular">Thư mục thường</option>
                  <option value="smart">Thư mục thông minh</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className={`flex items-center rounded-lg border ${
                isDarkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className={`p-6 rounded-lg border-2 border-dashed transition-colors ${
              isDarkMode 
                ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-800' 
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <FolderPlus className={`h-8 w-8 mx-auto mb-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <p className="font-medium">Tạo thư mục mới</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tổ chức bộ học của bạn
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-lg border-2 border-dashed transition-colors ${
              isDarkMode 
                ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-800' 
                : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
            }`}
          >
            <Sparkles className={`h-8 w-8 mx-auto mb-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <p className="font-medium">Thư mục thông minh</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tự động tổ chức theo quy tắc
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-lg border-2 border-dashed transition-colors ${
              isDarkMode 
                ? 'border-gray-600 hover:border-green-500 hover:bg-gray-800' 
                : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
            }`}
          >
            <div className="text-2xl mb-2">📚</div>
            <p className="font-medium">Mẫu thư mục</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sử dụng mẫu có sẵn
            </p>
          </motion.button>
        </div>

        {/* Folders Grid/List */}
        {filteredFolders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredFolders.map((folder, index) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FolderCard
                  folder={folder}
                  onClick={handleFolderClick}
                  onContextMenu={handleContextMenu}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <FolderPlus className={`h-16 w-16 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'Không tìm thấy thư mục' : 'Chưa có thư mục nào'}
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery 
                ? `Không có thư mục nào phù hợp với "${searchQuery}"`
                : 'Tạo thư mục đầu tiên để tổ chức bộ học của bạn'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo thư mục đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateFolderModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateFolder}
          />
        )}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <FolderContextMenu
            folder={contextMenu.folder}
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onUpdate={updateFolder}
            onDelete={deleteFolder}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Folders;