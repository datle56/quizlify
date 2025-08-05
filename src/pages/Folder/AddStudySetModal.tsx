import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { QuizSet } from '../../types';

interface AddStudySetModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStudySets: QuizSet[];
  onAddStudySet: (studySetId: string) => void;
}

const AddStudySetModal: React.FC<AddStudySetModalProps> = ({
  isOpen,
  onClose,
  availableStudySets,
  onAddStudySet
}) => {
  const navigate = useNavigate();
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
            className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden ${cardClasses}`}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Thêm bộ học vào thư mục</h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {availableStudySets.length > 0 ? (
                <div className="space-y-4">
                  {availableStudySets.map((studySet) => (
                    <div
                      key={studySet.id}
                      className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                        isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => onAddStudySet(studySet.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${studySet.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                          {studySet.termCount}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{studySet.title}</h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {studySet.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs mt-2">
                            <span>🔤 {studySet.termCount} thuật ngữ</span>
                            <span>📅 {new Date(studySet.createdAt).toLocaleDateString()}</span>
                            <span>📈 {studySet.progress || 0}% tiến độ</span>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                          Thêm
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Bạn chưa có bộ học nào hoặc tất cả bộ học đã được thêm vào thư mục này.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/app/create');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tạo bộ học mới
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddStudySetModal; 