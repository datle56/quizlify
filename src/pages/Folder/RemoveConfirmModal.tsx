import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';

interface RemoveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studySetName: string;
  isRemoving: boolean;
}

const RemoveConfirmModal: React.FC<RemoveConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studySetName,
  isRemoving
}) => {
  const { isDarkMode } = useThemeStore();

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`rounded-lg shadow-xl max-w-md w-full ${cardClasses}`}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Bạn có chắc muốn xóa "{studySetName}" khỏi thư mục này?
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  disabled={isRemoving}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  Hủy
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isRemoving}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isRemoving ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RemoveConfirmModal; 