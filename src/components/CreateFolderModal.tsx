import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Folder, Sparkles, Palette } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface CreateFolderModalProps {
  onClose: () => void;
  onSubmit: (folderData: any) => void;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ onClose, onSubmit }) => {
  const { isDarkMode } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-blue-500',
    icon: '📁',
    isSmartFolder: false
  });

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];

  const icons = ['📁', '📚', '🎓', '🔬', '🌍', '💼', '🎨', '🏆', '⭐', '🚀'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  const modalClasses = isDarkMode 
    ? 'bg-gray-800 text-white' 
    : 'bg-white text-gray-900';

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
        className={`${modalClasses} rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold">Tạo thư mục mới</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Folder Type */}
          <div>
            <label className="block text-sm font-medium mb-3">Loại thư mục</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isSmartFolder: false }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  !formData.isSmartFolder
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : isDarkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Folder className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">Thư mục thường</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tổ chức thủ công
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isSmartFolder: true }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.isSmartFolder
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : isDarkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Sparkles className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">Thư mục thông minh</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tự động tổ chức
                </p>
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Tên thư mục *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Nhập tên thư mục"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Mô tả
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Mô tả ngắn về thư mục này"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium mb-3">
              <Palette className="h-4 w-4 inline mr-2" />
              Màu sắc
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-12 h-12 rounded-lg ${color} ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium mb-3">Biểu tượng</label>
            <div className="grid grid-cols-5 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`w-12 h-12 rounded-lg border-2 text-xl transition-colors ${
                    formData.icon === icon
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isDarkMode
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium mb-3">Xem trước</label>
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${formData.color} rounded-lg flex items-center justify-center text-white`}>
                  {formData.icon}
                </div>
                <div>
                  <p className="font-medium">{formData.name || 'Tên thư mục'}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formData.description || 'Mô tả thư mục'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo thư mục
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateFolderModal;