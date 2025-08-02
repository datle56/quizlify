import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Home,
  Edit,
  Palette,
  Share2,
  Download,
  Trash2,
  Settings,
  Plus,
  Folder,
  Search,
  Grid,
  List,
  MoreHorizontal,
  Star,
  Eye,
  Clock,
  BarChart3,
  Target,
  TrendingUp,
  BookOpen,
  Volume2,
  Calendar,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFolders } from '../hooks/useFolders';
import { useQuizSets } from '../hooks/useQuizSets';
import { useThemeStore } from '../store/themeStore';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from '../components/NotFound';
import QuizCard from '../components/QuizCard';

const FolderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFolderById, loading: foldersLoading } = useFolders();
  const { quizSets, loading: quizSetsLoading } = useQuizSets();
  const { isDarkMode } = useThemeStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const loading = foldersLoading || quizSetsLoading;

  if (loading) {
    return <LoadingSpinner />;
  }

  const folder = getFolderById(id!);

  if (!folder) {
    return <NotFound />;
  }

  // Mock data for folder contents
  const folderStudySets = [
    {
      id: '1',
      title: 'Basic English Vocabulary',
      description: 'Essential English words for beginners',
      termCount: 45,
      creator: 'You',
      userId: 'user_001',
      createdAt: '2024-01-15',
      color: 'bg-blue-500',
      cards: [],
      progress: 89,
      lastStudied: '2 giờ trước',
      rating: 4.6,
      views: 234
    },
    {
      id: '2',
      title: 'Advanced Grammar Rules',
      description: 'Complex grammar structures and usage',
      termCount: 67,
      creator: 'You',
      userId: 'user_001',
      createdAt: '2024-01-10',
      color: 'bg-green-500',
      cards: [],
      progress: 96,
      lastStudied: '1 ngày trước',
      rating: 4.8,
      views: 156
    }
  ];

  const subfolders = [
    {
      id: 'subfolder_1',
      name: 'Ngữ pháp',
      studySetCount: 3,
      progress: 82,
      updatedAt: '3 ngày trước',
      color: 'bg-purple-500',
      icon: '📚'
    }
  ];

  const handleBack = () => {
    navigate('/app/folders');
  };

  const handleQuizSetClick = (setId: string) => {
    navigate(`/app/quiz/${setId}`);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';
  
  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
  
  const headerClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  // Calculate folder stats
  const totalTerms = folderStudySets.reduce((acc, set) => acc + set.termCount, 0);
  const totalStudyTime = 8.5; // Mock data
  const averageProgress = Math.round(folderStudySets.reduce((acc, set) => acc + set.progress, 0) / folderStudySets.length);
  const recentStudySet = folderStudySets.find(set => set.lastStudied === '2 giờ trước');
  const bestStudySet = folderStudySets.reduce((best, current) => current.progress > best.progress ? current : best);

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Header */}
      <div className={`${headerClasses} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6 text-sm">
            <button
              onClick={() => navigate('/app')}
              className={`flex items-center space-x-1 transition-colors ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Trang chủ</span>
            </button>
            <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <button
              onClick={handleBack}
              className={`transition-colors ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📁 Thư mục của tôi
            </button>
            <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <span className="font-medium">{folder.icon} {folder.name}</span>
          </div>

          {/* Folder Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 ${folder.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                {folder.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{folder.name}</h1>
                <div className="flex items-center space-x-4 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    folder.type === 'personal' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {folder.type === 'personal' ? 'Thư mục cá nhân' : 'Thư mục lớp'}
                  </span>
                  <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Calendar className="h-4 w-4" />
                    <span>Tạo: {new Date(folder.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock className="h-4 w-4" />
                    <span>Sửa lần cuối: 2 ngày trước</span>
                  </div>
                </div>
                {folder.description && (
                  <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {folder.description}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Edit className="h-5 w-5" />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Palette className="h-5 w-5" />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Share2 className="h-5 w-5" />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Download className="h-5 w-5" />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Trash2 className="h-5 w-5" />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Folder Stats */}
        <div className={`rounded-lg p-6 mb-8 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">📊 Thống kê thư mục</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">📚 {folderStudySets.length}</div>
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
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>tiến độ</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                🏃‍♂️ <strong>Học gần đây:</strong> {recentStudySet?.title} ({recentStudySet?.lastStudied})
              </p>
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ⭐ <strong>Bộ học hay nhất:</strong> {bestStudySet?.title} ({bestStudySet?.progress}% hoàn thành)
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className={`rounded-lg p-4 mb-6 border ${cardClasses}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Thêm bộ học</span>
              </button>
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <Folder className="h-4 w-4" />
                <span>Tạo thư mục con</span>
              </button>
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                <MoreHorizontal className="h-4 w-4" />
                <span>Di chuyển</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm trong thư mục..."
                  className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

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

        {/* Folder Contents */}
        <div className="space-y-6">
          {/* Subfolders */}
          {subfolders.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">📁 Thư mục con</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {subfolders.map((subfolder) => (
                  <motion.div
                    key={subfolder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border cursor-pointer hover:shadow-lg transition-all ${cardClasses}`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 ${subfolder.color} rounded-lg flex items-center justify-center text-white`}>
                        {subfolder.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{subfolder.name}</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          📚 {subfolder.studySetCount} bộ học
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tiến độ chung: {subfolder.progress}%</span>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          📅 {subfolder.updatedAt}
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${subfolder.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        <Eye className="h-3 w-3" />
                        <span>Mở thư mục</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors">
                        <Edit className="h-3 w-3" />
                        <span>Sửa</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Study Sets */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📚 Bộ học ({folderStudySets.length})</h3>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {folderStudySets.map((studySet, index) => (
                <motion.div
                  key={studySet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleQuizSetClick(studySet.id)}
                  className={`rounded-lg border cursor-pointer hover:shadow-lg transition-all ${cardClasses} ${
                    viewMode === 'list' ? 'p-4' : 'overflow-hidden'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className={`h-3 ${studySet.color}`}></div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-semibold line-clamp-2">{studySet.title}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{studySet.rating}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>🔤 {studySet.termCount} thuật ngữ</span>
                            <span>📈 Tiến độ: {studySet.progress}%</span>
                          </div>
                          
                          <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${studySet.progress}%` }}
                            ></div>
                          </div>
                          
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            📅 Học lần cuối: {studySet.lastStudied}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{studySet.views} lượt xem</span>
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
                              // Edit functionality
                            }}
                            className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Sửa</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/app/analytics`);
                            }}
                            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                          >
                            <BarChart3 className="h-3 w-3" />
                            <span>Thống kê</span>
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
                          <h4 className="font-semibold">{studySet.title}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{studySet.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>🔤 {studySet.termCount} thuật ngữ</span>
                          <span>📈 {studySet.progress}%</span>
                          <span>📅 {studySet.lastStudied}</span>
                          <span>👁️ {studySet.views} lượt xem</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {folderStudySets.length === 0 && (
          <div className="text-center py-16">
            <Folder className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className="text-xl font-semibold mb-2">Thư mục trống</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Thêm bộ học vào thư mục này để bắt đầu tổ chức nội dung học tập
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Thêm bộ học đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderDetail;