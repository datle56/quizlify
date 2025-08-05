import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Home,
  Search,
  Grid,
  List,
  Star,
  Eye,
  Clock,
  BarChart3,
  Target,
  BookOpen,
  Calendar,
  User,
  Globe,
  Filter,
  SortAsc,
  SortDesc,
  Users,
  Heart,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from '../components/NotFound';
import { QuizSet } from '../types';
import { BASE_URL } from '../utils/api';

interface PublicFolder {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  studySetCount: number;
  isPublic: boolean;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const PublicFolderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  
  const [folder, setFolder] = useState<PublicFolder | null>(null);
  const [studySets, setStudySets] = useState<QuizSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const fetchPublicFolder = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch folder details
        const folderResponse = await fetch(`${BASE_URL}/folders/public/${id}`);
        if (!folderResponse.ok) {
          throw new Error('Folder not found or not public');
        }
        const folderData = await folderResponse.json();
        
        // Fetch study sets in folder
        const studySetsResponse = await fetch(`${BASE_URL}/folders/public/${id}/study-sets`);
        if (!studySetsResponse.ok) {
          throw new Error('Failed to fetch study sets');
        }
        const studySetsData = await studySetsResponse.json();
        
        const mappedFolder: PublicFolder = {
          id: folderData.id.toString(),
          name: folderData.name,
          description: folderData.description,
          color: folderData.color || 'bg-blue-500',
          icon: folderData.icon || '📁',
          createdAt: folderData.created_at,
          updatedAt: folderData.updated_at,
          studySetCount: folderData.study_sets_count || 0,
          isPublic: folderData.is_public,
          creator: {
            id: folderData.user_id.toString(),
            name: folderData.creator_name || 'Unknown',
            avatar: folderData.creator_avatar
          }
        };
        
        const mappedStudySets: QuizSet[] = studySetsData.map((set: any) => ({
          id: set.id.toString(),
          title: set.title,
          description: set.description,
          termCount: set.terms_count,
          creator: set.creator_name || 'Unknown',
          userId: set.user_id.toString(),
          createdAt: set.created_at,
          color: set.color,
          cards: [],
          is_public: set.is_public,
          language_from: set.language_from || '',
          language_to: set.language_to || '',
          average_rating: set.average_rating || 0,
          views_count: set.views_count || 0,
          favorites_count: set.favorites_count || 0,
          progress: 0
        }));
        
        setFolder(mappedFolder);
        setStudySets(mappedStudySets);
      } catch (error) {
        console.error('Error fetching public folder:', error);
        setError('Failed to load folder details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPublicFolder();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !folder) {
    return <NotFound />;
  }

  const handleBack = () => {
    navigate('/app/folders');
  };

  const handleQuizSetClick = (setId: string) => {
    navigate(`/app/quiz/${setId}`);
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
  const totalTerms = studySets.reduce((acc, set) => acc + set.termCount, 0);
  const totalStudyTime = 8.5; // Mock data
  const averageProgress = studySets.length > 0 
    ? Math.round(studySets.reduce((acc, set) => acc + (set.progress || 0), 0) / studySets.length)
    : 0;

  // Filter and sort study sets
  const filteredStudySets = studySets
    .filter(set => 
      set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'terms':
          return b.termCount - a.termCount;
        default:
          return 0;
      }
    });

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
              📁 Thư mục công khai
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
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{folder.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <Globe className="h-4 w-4 mr-1" />
                    Công khai
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-2">
                  <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <User className="h-4 w-4" />
                    <span>Tạo bởi: {folder.creator.name}</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Calendar className="h-4 w-4" />
                    <span>Tạo: {new Date(folder.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock className="h-4 w-4" />
                    <span>Sửa lần cuối: {new Date(folder.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {folder.description && (
                  <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {folder.description}
                  </p>
                )}
              </div>
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
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>tiến độ</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className={`rounded-lg p-4 mb-6 border ${cardClasses}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">
                {filteredStudySets.length} bộ học công khai
              </span>
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

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="recent">Mới nhất</option>
                  <option value="name">Tên A-Z</option>
                  <option value="progress">Tiến độ</option>
                  <option value="terms">Số thuật ngữ</option>
                </select>
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

        {/* Study Sets */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📚 Bộ học công khai ({filteredStudySets.length})</h3>
          {filteredStudySets.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredStudySets.map((studySet, index) => (
                <motion.div
                  key={studySet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-lg border cursor-pointer hover:shadow-lg transition-all ${cardClasses} ${
                    viewMode === 'list' ? 'p-4' : 'overflow-hidden'
                  }`}
                  onClick={() => handleQuizSetClick(studySet.id)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className={`h-3 ${studySet.color}`}></div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-semibold line-clamp-2">{studySet.title}</h4>
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
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Globe className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'Không tìm thấy bộ học' : 'Thư mục trống'}
              </h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchQuery
                  ? `Không có bộ học nào phù hợp với "${searchQuery}"`
                  : 'Thư mục này chưa có bộ học công khai nào'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicFolderDetail; 