import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Star, Users, Eye, Heart, Sparkles } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface FolderTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  folders: string[];
  users: number;
  rating: number;
  category: string;
}

interface FolderTemplateModalProps {
  onClose: () => void;
  onSubmit: (template: FolderTemplate) => void;
}

const FolderTemplateModal: React.FC<FolderTemplateModalProps> = ({ onClose, onSubmit }) => {
  const { isDarkMode } = useThemeStore();
  const [selectedTemplate, setSelectedTemplate] = useState<FolderTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: FolderTemplate[] = [
    {
      id: 'language',
      name: 'Học ngôn ngữ',
      description: 'Cấu trúc hoàn chỉnh cho việc học ngôn ngữ từ cơ bản đến nâng cao',
      icon: '🇺🇸',
      folders: ['Từ vựng cơ bản', 'Ngữ pháp', 'Luyện nghe', 'Luyện nói'],
      users: 12456,
      rating: 4.7,
      category: 'language'
    },
    {
      id: 'science',
      name: 'Khóa học khoa học',
      description: 'Tổ chức học tập khoa học một cách có hệ thống',
      icon: '🔬',
      folders: ['Lý thuyết', 'Thí nghiệm', 'Ôn tập', 'Kiểm tra'],
      users: 8234,
      rating: 4.5,
      category: 'science'
    },
    {
      id: 'medical',
      name: 'Y khoa',
      description: 'Cấu trúc học tập dành cho sinh viên y khoa',
      icon: '🏥',
      folders: ['Giải phẫu', 'Sinh lý', 'Bệnh lý', 'Dược lý'],
      users: 5678,
      rating: 4.8,
      category: 'medical'
    },
    {
      id: 'history',
      name: 'Lịch sử',
      description: 'Tổ chức kiến thức lịch sử theo thời gian và chủ đề',
      icon: '📚',
      folders: ['Thời kỳ', 'Nhân vật', 'Sự kiện', 'Niên đại'],
      users: 4567,
      rating: 4.4,
      category: 'history'
    },
    {
      id: 'business',
      name: 'Tiếng Anh thương mại',
      description: 'Kỹ năng tiếng Anh trong môi trường công sở',
      icon: '🏢',
      folders: ['Email', 'Thuyết trình', 'Đàm phán', 'Báo cáo'],
      users: 7890,
      rating: 4.6,
      category: 'business'
    },
    {
      id: 'programming',
      name: 'Kỹ năng lập trình',
      description: 'Lộ trình học lập trình từ cơ bản đến chuyên sâu',
      icon: '💼',
      folders: ['Cơ bản', 'Framework', 'Database', 'Deploy'],
      users: 9876,
      rating: 4.9,
      category: 'technology'
    },
    {
      id: 'exam-prep',
      name: 'Chuẩn bị thi đại học',
      description: 'Tổ chức ôn tập toàn diện cho kỳ thi đại học',
      icon: '🎓',
      folders: ['Toán', 'Lý', 'Hóa', 'Anh', 'Văn'],
      users: 15432,
      rating: 4.8,
      category: 'education'
    },
    {
      id: 'music',
      name: 'Học nhạc lý',
      description: 'Cấu trúc học tập âm nhạc có hệ thống',
      icon: '🎵',
      folders: ['Cơ bản', 'Hòa âm', 'Nhịp điệu', 'Thực hành'],
      users: 3456,
      rating: 4.3,
      category: 'arts'
    }
  ];

  const categories = [
    { value: 'all', label: 'Tất cả', count: templates.length },
    { value: 'language', label: 'Ngôn ngữ', count: templates.filter(t => t.category === 'language').length },
    { value: 'science', label: 'Khoa học', count: templates.filter(t => t.category === 'science').length },
    { value: 'medical', label: 'Y khoa', count: templates.filter(t => t.category === 'medical').length },
    { value: 'business', label: 'Kinh doanh', count: templates.filter(t => t.category === 'business').length },
    { value: 'technology', label: 'Công nghệ', count: templates.filter(t => t.category === 'technology').length },
    { value: 'education', label: 'Giáo dục', count: templates.filter(t => t.category === 'education').length },
    { value: 'arts', label: 'Nghệ thuật', count: templates.filter(t => t.category === 'arts').length }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template: FolderTemplate) => {
    onSubmit(template);
  };

  const modalClasses = isDarkMode 
    ? 'bg-gray-800 text-white' 
    : 'bg-white text-gray-900';

  const cardClasses = isDarkMode 
    ? 'bg-gray-700 border-gray-600' 
    : 'bg-white border-gray-200';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`${modalClasses} rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold">📚 Chọn mẫu thư mục</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar - Categories */}
          <div className={`w-64 border-r p-4 overflow-y-auto ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}>
            <h3 className="font-semibold mb-4">Danh mục</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.value
                        ? 'bg-blue-500'
                        : isDarkMode
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                    }`}>
                      {category.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Templates */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg border p-6 hover:shadow-lg transition-all cursor-pointer ${cardClasses}`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-3xl">{template.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
                      <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {template.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{template.users.toLocaleString()} người sử dụng</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{template.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Folder Structure Preview */}
                  <div className={`p-3 rounded-lg mb-4 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <h4 className="text-sm font-medium mb-2">Cấu trúc thư mục:</h4>
                    <div className="space-y-1">
                      {template.folders.map((folder, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <span className="text-blue-500">📁</span>
                          <span>{folder}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template);
                      }}
                      className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Sử dụng mẫu</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Preview functionality
                      }}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg border transition-colors text-sm ${
                        isDarkMode 
                          ? 'border-gray-600 hover:bg-gray-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                      <span>Xem trước</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Favorite functionality
                      }}
                      className={`p-2 rounded-lg border transition-colors ${
                        isDarkMode 
                          ? 'border-gray-600 hover:bg-gray-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className={`h-16 w-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className="text-xl font-semibold mb-2">Không có mẫu nào</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Không tìm thấy mẫu thư mục nào trong danh mục này
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Template Detail Modal */}
        <AnimatePresence>
          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`${modalClasses} rounded-lg shadow-xl max-w-2xl w-full p-6`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="text-4xl">{selectedTemplate.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{selectedTemplate.name}</h3>
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedTemplate.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{selectedTemplate.users.toLocaleString()} người sử dụng</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{selectedTemplate.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg mb-6 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <h4 className="font-semibold mb-3">Cấu trúc thư mục sẽ được tạo:</h4>
                  <div className="space-y-2">
                    {selectedTemplate.folders.map((folder, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-blue-500">📁</span>
                        <span className="font-medium">{folder}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => handleUseTemplate(selectedTemplate)}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Sử dụng mẫu này</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default FolderTemplateModal;