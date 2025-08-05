import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star,
  Eye,
  User,
  BookOpen,
  Target,
  Trash2,
  Folder
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { QuizSet } from '../../types';

interface StudySetListProps {
  studySets: QuizSet[];
  viewMode: 'grid' | 'list';
  onRemoveStudySet: (setId: string, setName: string) => void;
  removingSetId: string | null;
}

const StudySetList: React.FC<StudySetListProps> = ({
  studySets,
  viewMode,
  onRemoveStudySet,
  removingSetId
}) => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const handleQuizSetClick = (setId: string) => {
    navigate(`/app/quiz/${setId}`);
  };

  if (studySets.length === 0) {
    return (
      <div className="text-center py-16">
        <Folder className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className="text-xl font-semibold mb-2">Thư mục trống</h3>
        <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Thêm bộ học vào thư mục này để bắt đầu tổ chức nội dung học tập
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">📚 Bộ học ({studySets.length})</h3>
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {studySets.map((studySet, index) => (
          <motion.div
            key={studySet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-lg border hover:shadow-lg transition-all ${cardClasses} ${
              viewMode === 'list' ? 'p-4' : 'overflow-hidden'
            }`}
          >
            {viewMode === 'grid' ? (
              <>
                <div className={`h-3 ${studySet.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleQuizSetClick(studySet.id)}>
                      {studySet.title}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{studySet.average_rating || 0}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>🔤 {studySet.termCount} thuật ngữ</span>
                      <span>📈 Tiến độ: {studySet.progress || 0}%</span>
                    </div>
                    
                    <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${studySet.progress || 0}%` }}
                      ></div>
                    </div>
                    
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      📅 Tạo: {new Date(studySet.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{studySet.views_count || 0} lượt xem</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{studySet.creator}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/quiz/${studySet.id}/flashcards`);
                      }}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>Thẻ ghi nhớ</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/quiz/${studySet.id}/learn`);
                      }}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <Target className="h-3 w-3" />
                      <span>Học</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStudySet(studySet.id, studySet.title);
                      }}
                      disabled={removingSetId === studySet.id}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>{removingSetId === studySet.id ? 'Đang xóa...' : 'Xóa'}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${studySet.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {studySet.termCount}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleQuizSetClick(studySet.id)}>
                      {studySet.title}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{studySet.average_rating || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>🔤 {studySet.termCount} thuật ngữ</span>
                    <span>📈 {studySet.progress || 0}%</span>
                    <span>📅 {new Date(studySet.createdAt).toLocaleDateString()}</span>
                    <span>👁️ {studySet.views_count || 0} lượt xem</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/quiz/${studySet.id}/flashcards`);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/quiz/${studySet.id}/learn`);
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    <Target className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveStudySet(studySet.id, studySet.title);
                    }}
                    disabled={removingSetId === studySet.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudySetList; 