import React from 'react';
import { useThemeStore } from '../../store/themeStore';
import { QuizSet } from '../../types';

interface FolderStatsProps {
  studySets: QuizSet[];
}

const FolderStats: React.FC<FolderStatsProps> = ({ studySets }) => {
  const { isDarkMode } = useThemeStore();

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  // Calculate folder stats
  const totalTerms = studySets.reduce((acc, set) => acc + set.termCount, 0);
  const totalStudyTime = 8.5; // Mock data - should be calculated from actual study sessions
  const averageProgress = studySets.length > 0 
    ? Math.round(studySets.reduce((acc, set) => acc + (set.progress || 0), 0) / studySets.length)
    : 0;
  const totalViews = studySets.reduce((acc, set) => acc + (set.views_count || 0), 0);
  const averageRating = studySets.length > 0
    ? (studySets.reduce((acc, set) => acc + (set.average_rating || 0), 0) / studySets.length).toFixed(1)
    : '0.0';

  return (
    <div className={`rounded-lg p-6 mb-8 border ${cardClasses}`}>
      <h3 className="text-lg font-semibold mb-4">📊 Thống kê thư mục</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">📚 {studySets.length}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>bộ học</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">📝 {totalTerms}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>thuật ngữ</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">⏱️ {totalStudyTime}h</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>thời gian học</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">📈 {averageProgress}%</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>tiến độ TB</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">👁️ {totalViews}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>lượt xem</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">⭐ {averageRating}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>đánh giá TB</div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3">📈 Tổng quan tiến độ</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Hoàn thành
              </span>
              <span className="text-sm font-medium text-green-600">
                {studySets.filter(set => (set.progress || 0) >= 100).length}/{studySets.length}
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${studySets.length > 0 
                    ? (studySets.filter(set => (set.progress || 0) >= 100).length / studySets.length) * 100 
                    : 0}%` 
                }}
              ></div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Đang học
              </span>
              <span className="text-sm font-medium text-blue-600">
                {studySets.filter(set => (set.progress || 0) > 0 && (set.progress || 0) < 100).length}/{studySets.length}
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${studySets.length > 0 
                    ? (studySets.filter(set => (set.progress || 0) > 0 && (set.progress || 0) < 100).length / studySets.length) * 100 
                    : 0}%` 
                }}
              ></div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Chưa học
              </span>
              <span className="text-sm font-medium text-gray-600">
                {studySets.filter(set => (set.progress || 0) === 0).length}/{studySets.length}
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${studySets.length > 0 
                    ? (studySets.filter(set => (set.progress || 0) === 0).length / studySets.length) * 100 
                    : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="text-md font-medium mb-3">🕒 Hoạt động gần đây</h4>
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between text-sm">
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Bộ học được truy cập gần nhất:
            </span>
            <span className="font-medium">
              {studySets.length > 0 
                ? studySets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0].title
                : 'Chưa có hoạt động'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderStats; 