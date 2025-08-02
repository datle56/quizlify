import React from 'react';
import { Folder as Folder2, MoreVertical, Users, Calendar } from 'lucide-react';
import { Folder } from '../types';
import { motion } from 'framer-motion';

interface FolderCardProps {
  folder: Folder;
  onClick: (id: string) => void;
  onContextMenu?: (folder: Folder, event: React.MouseEvent) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, onClick, onContextMenu }) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu?.(folder, e);
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'assignment': return 'Bài tập';
      case 'resource': return 'Tài liệu';
      case 'test': return 'Kiểm tra';
      case 'topic': return 'Chủ đề';
      default: return 'Thư mục';
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'assignment': return 'bg-orange-100 text-orange-700';
      case 'resource': return 'bg-blue-100 text-blue-700';
      case 'test': return 'bg-red-100 text-red-700';
      case 'topic': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-200 overflow-hidden group"
      onClick={() => onClick(folder.id)}
      onContextMenu={handleContextMenu}
    >
      {/* Folder Color Bar */}
      <div className={`h-3 ${folder.color}`}></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${folder.color} rounded-lg flex items-center justify-center text-white text-xl`}>
              {folder.icon || <Folder2 className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {folder.name}
              </h3>
              {folder.type && (
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(folder.type)}`}>
                  {getTypeLabel(folder.type)}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContextMenu?.(folder, e);
            }}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Description */}
        {folder.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {folder.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-700">
              {folder.studySetCount} bộ học
            </span>
            {folder.isSmartFolder && (
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                <span className="mr-1">⚡</span>
                Thông minh
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(folder.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Class Info */}
        {folder.classId && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Users className="h-3 w-3" />
              <span>Lớp học</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FolderCard;