import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, AlertCircle } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface JoinClassModalProps {
  onClose: () => void;
  onSubmit: (joinCode: string) => Promise<boolean>;
  isLoading?: boolean;
}

const JoinClassModal: React.FC<JoinClassModalProps> = ({ onClose, onSubmit, isLoading: externalLoading }) => {
  const { isDarkMode } = useThemeStore();
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading || internalLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setError('Vui lòng nhập mã lớp');
      return;
    }

    setInternalLoading(true);
    setError('');

    try {
      const success = await onSubmit(joinCode.trim().toUpperCase());
      
      if (!success) {
        setError('Mã lớp không hợp lệ hoặc không tồn tại');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tham gia lớp học');
    } finally {
      setInternalLoading(false);
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
        className={`${modalClasses} rounded-lg shadow-xl max-w-md w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Tham gia lớp học</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Nhập mã lớp mà giáo viên đã cung cấp để tham gia lớp học.
            </p>

            <div>
              <label htmlFor="joinCode" className="block text-sm font-medium mb-2">
                Mã lớp học
              </label>
              <input
                type="text"
                id="joinCode"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  setError('');
                }}
                className={`w-full px-4 py-3 border rounded-lg text-center text-lg font-mono tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error
                    ? 'border-red-500'
                    : isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="VD: ABC123"
                maxLength={10}
                disabled={isLoading}
              />
              
              {error && (
                <div className="mt-2 flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className={`p-4 rounded-lg mb-6 ${
            isDarkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
          }`}>
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
              💡 Cách tìm mã lớp
            </h4>
            <ul className={`text-sm space-y-1 ${
              isDarkMode ? 'text-blue-200' : 'text-blue-600'
            }`}>
              <li>• Hỏi giáo viên hoặc người tạo lớp</li>
              <li>• Kiểm tra email mời tham gia</li>
              <li>• Xem trên bảng thông báo của lớp</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } disabled:opacity-50`}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !joinCode.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isLoading ? 'Đang tham gia...' : 'Tham gia lớp'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JoinClassModal;