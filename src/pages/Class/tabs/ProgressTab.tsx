import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Users, 
  Award, 
  Target, 
  CheckCircle,
  Clock,
  AlertCircle,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

interface ProgressTabProps {
  classData: any;
}

const ProgressTab: React.FC<ProgressTabProps> = ({ classData }) => {
  const { isDarkMode } = useThemeStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('week');
  
  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const mockProgressData = {
    overallCompletion: 78,
    averageScore: 82,
    activeStudents: 22,
    totalStudents: 25,
    studySetsCompleted: 45,
    totalStudySets: 60,
    weeklyProgress: [
      { week: 'Tuần 1', completion: 85, score: 88 },
      { week: 'Tuần 2', completion: 72, score: 79 },
      { week: 'Tuần 3', completion: 91, score: 85 },
      { week: 'Tuần 4', completion: 78, score: 82 },
      { week: 'Tuần 5', completion: 89, score: 87 },
      { week: 'Tuần 6', completion: 76, score: 81 }
    ],
    topPerformers: [
      { name: 'Trần Thị B', score: 95, completed: 18, avatar: '👩‍🎓' },
      { name: 'Nguyễn Văn A', score: 92, completed: 17, avatar: '👨‍🎓' },
      { name: 'Lê Văn C', score: 89, completed: 16, avatar: '👨‍🎓' },
      { name: 'Phạm Thị D', score: 87, completed: 15, avatar: '👩‍🎓' },
      { name: 'Hoàng Văn E', score: 85, completed: 14, avatar: '👨‍🎓' }
    ],
    recentActivity: [
      { type: 'completion', user: 'Trần Thị B', action: 'hoàn thành "Advanced Grammar"', time: '2 giờ trước', score: 95 },
      { type: 'new', user: 'Nguyễn Văn A', action: 'bắt đầu "Vocabulary Set 3"', time: '3 giờ trước' },
      { type: 'achievement', user: 'Lê Văn C', action: 'đạt điểm cao nhất tuần', time: '1 ngày trước', score: 89 },
      { type: 'completion', user: 'Phạm Thị D', action: 'hoàn thành "Reading Practice"', time: '1 ngày trước', score: 87 }
    ]
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-blue-600 bg-blue-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'new':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-yellow-600" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-6 border ${cardClasses}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`text-2xl font-bold ${getProgressColor(mockProgressData.overallCompletion).split(' ')[0]}`}>
              {mockProgressData.overallCompletion}%
            </span>
          </div>
          <h3 className="font-semibold mb-1">Hoàn thành tổng thể</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Tiến độ chung của lớp
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-lg p-6 border ${cardClasses}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">
              {mockProgressData.averageScore}%
            </span>
          </div>
          <h3 className="font-semibold mb-1">Điểm trung bình</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Điểm số trung bình của lớp
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-lg p-6 border ${cardClasses}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">
              {mockProgressData.activeStudents}/{mockProgressData.totalStudents}
            </span>
          </div>
          <h3 className="font-semibold mb-1">Học sinh hoạt động</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Số học sinh đang tham gia
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-lg p-6 border ${cardClasses}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">
              {mockProgressData.studySetsCompleted}/{mockProgressData.totalStudySets}
            </span>
          </div>
          <h3 className="font-semibold mb-1">Bộ học hoàn thành</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Số bộ học đã hoàn thành
          </p>
        </motion.div>
      </div>

      {/* Time Range Filter */}
      <div className={`rounded-lg p-4 border ${cardClasses}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tiến độ theo thời gian</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeRange === 'week'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeRange === 'month'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Tháng
            </button>
            <button
              onClick={() => setTimeRange('semester')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeRange === 'semester'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Học kỳ
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className={`rounded-lg p-6 border ${cardClasses}`}>
        <h3 className="text-lg font-semibold mb-4">Tiến độ theo tuần</h3>
        <div className="space-y-4">
          {mockProgressData.weeklyProgress.map((week, index) => (
            <motion.div
              key={week.week}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold">{week.week}</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Hoàn thành: {week.completion}% | Điểm TB: {week.score}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium">{week.completion}%</div>
                  <div className={`text-xs ${getProgressColor(week.completion).split(' ')[0]}`}>
                    Hoàn thành
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{week.score}%</div>
                  <div className={`text-xs ${getProgressColor(week.score).split(' ')[0]}`}>
                    Điểm TB
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Performers and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className={`rounded-lg p-6 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">🏆 Top học sinh</h3>
          <div className="space-y-3">
            {mockProgressData.topPerformers.map((performer, index) => (
              <motion.div
                key={performer.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-lg">
                    {performer.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{performer.name}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {performer.completed} bộ học hoàn thành
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{performer.score}%</div>
                  <div className="text-xs text-gray-500">Điểm TB</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`rounded-lg p-6 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">📊 Hoạt động gần đây</h3>
          <div className="space-y-3">
            {mockProgressData.recentActivity.map((activity, index) => (
              <motion.div
                key={`${activity.user}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-3 p-3 rounded-lg border"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.user}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {activity.action}
                    {activity.score && <span className="text-green-600 ml-1">({activity.score}%)</span>}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTab; 