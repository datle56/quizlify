import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Copy, 
  Settings, 
  Plus,
  Upload,
  Sparkles,
  BookOpen,
  Search,
  Grid,
  List,
  Eye,
  Edit,
  BarChart3,
  Share2,
  Target,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  FileText,
  Folder,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClasses } from '../hooks/useClasses';
import { useThemeStore } from '../store/themeStore';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from '../components/NotFound';
import CreateFolderModal from '../components/CreateFolderModal';

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClassById, getClassAssignments, loading } = useClasses();
  const { isDarkMode } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  const classData = getClassById(id!);
  const assignments = getClassAssignments(id!);

  if (!classData) {
    return <NotFound />;
  }

  const handleBack = () => {
    navigate('/app/classes');
  };

  const handleCopyJoinCode = () => {
    navigator.clipboard.writeText(classData.joinCode);
    // Add toast notification here
  };

  const mockFolders = [
    {
      id: 'folder_1',
      name: 'Tuần 1 - Ngữ pháp cơ bản',
      type: 'assignment',
      studySetCount: 5,
      dueDate: '2024-01-20',
      completionRate: 72,
      completedStudents: 18,
      totalStudents: 25,
      color: 'bg-orange-500',
      icon: '📝'
    },
    {
      id: 'folder_2',
      name: 'Tuần 2 - Từ vựng chủ đề',
      type: 'resource',
      studySetCount: 3,
      updatedAt: '2024-01-22',
      color: 'bg-blue-500',
      icon: '📚'
    },
    {
      id: 'folder_3',
      name: 'Ôn tập giữa kỳ',
      type: 'smart',
      studySetCount: 7,
      isSmartFolder: true,
      smartRule: 'Bộ học < 70% điểm',
      color: 'bg-purple-500',
      icon: '⚡'
    }
  ];

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';
  
  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
  
  const headerClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'folders', label: 'Thư mục', icon: Folder },
    { id: 'assignments', label: 'Bài tập', icon: FileText },
    { id: 'members', label: 'Thành viên', icon: Users },
    { id: 'progress', label: 'Tiến độ', icon: TrendingUp }
  ];

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Recent Activity */}
        <div className={`rounded-lg p-6 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Nguyễn Văn A đã hoàn thành "Basic Grammar"</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Bộ học mới "Advanced Vocabulary" đã được thêm</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>5 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Trần Thị B đạt điểm cao nhất tuần này</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>1 ngày trước</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className={`rounded-lg p-6 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">Bài tập sắp hết hạn</h3>
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div key={assignment.id} className={`p-4 rounded-lg border ${
                isDarkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{assignment.name}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Hạn nộp: {assignment.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {assignment.completionStats.completed}/{assignment.completionStats.total}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      đã hoàn thành
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className={`rounded-lg p-6 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">🚀 Hành động nhanh</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Tạo bộ học mới</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Folder className="h-5 w-5 text-green-600" />
              <span>Tạo thư mục bài tập</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <UserPlus className="h-5 w-5 text-purple-600" />
              <span>Mời thêm học sinh</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <span>Xem báo cáo lớp</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`rounded-lg p-6 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">📈 Thống kê nhanh</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Bộ học:</span>
              <span className="font-semibold">23 bộ</span>
            </div>
            <div className="flex justify-between">
              <span>Hoạt động hôm nay:</span>
              <span className="font-semibold">156 lượt học</span>
            </div>
            <div className="flex justify-between">
              <span>Điểm trung bình:</span>
              <span className="font-semibold text-green-600">78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFoldersTab = () => (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className={`rounded-lg p-4 border ${cardClasses}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo thư mục</span>
            </button>
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Upload className="h-4 w-4" />
              <span>Giao bài tập</span>
            </button>
            <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <Sparkles className="h-4 w-4" />
              <span>Thư mục thông minh</span>
            </button>
            <button className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              <BookOpen className="h-4 w-4" />
              <span>Mẫu thư mục</span>
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
                placeholder="Tìm kiếm trong lớp..."
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

      {/* Folders Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {mockFolders.map((folder) => (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-6 border cursor-pointer hover:shadow-lg transition-all ${cardClasses}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${folder.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {folder.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{folder.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    folder.type === 'assignment' ? 'bg-orange-100 text-orange-700' :
                    folder.type === 'resource' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {folder.type === 'assignment' ? 'Thư mục bài tập' :
                     folder.type === 'resource' ? 'Thư mục tài liệu' :
                     'Thư mục thông minh'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span>📝 {folder.studySetCount} bộ học</span>
                {folder.dueDate && (
                  <span className="text-orange-600">⏰ Hạn: {folder.dueDate}</span>
                )}
              </div>
              
              {folder.completionRate && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>✅ {folder.completedStudents}/{folder.totalStudents} hoàn thành</span>
                    <span>{folder.completionRate}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${folder.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {folder.isSmartFolder && (
                <div className={`text-xs p-2 rounded ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                  🤖 {folder.smartRule}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                <Eye className="h-3 w-3" />
                <span>Xem</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors">
                <Edit className="h-3 w-3" />
                <span>Sửa</span>
              </button>
              {folder.type === 'assignment' && (
                <button className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                  <BarChart3 className="h-3 w-3" />
                  <span>Tiến độ</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Header */}
      <div className={`${headerClasses} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBack}
            className={`flex items-center space-x-2 mb-4 transition-colors ${
              isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại danh sách lớp</span>
          </button>

          {/* Class Info */}
          <div className="mb-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl">
                🏫
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{classData.name}</h1>
                <p className={`text-lg mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {classData.description}
                </p>
                <div className={`flex items-center space-x-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center space-x-1">
                    <span>👨‍🏫</span>
                    <span>Giáo viên: {classData.teacherName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{classData.memberCount} học sinh</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Tạo: {new Date(classData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Join Code and Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">🔗 Mã lớp:</span>
                  <code className={`px-3 py-1 rounded font-mono ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {classData.joinCode}
                  </code>
                  <button
                    onClick={handleCopyJoinCode}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                    title="Sao chép mã lớp"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Settings className="h-4 w-4" />
                <span>Cài đặt lớp</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'folders' && renderFoldersTab()}
            {activeTab === 'assignments' && (
              <div className="text-center py-16">
                <FileText className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className="text-xl font-semibold mb-2">Bài tập</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Tính năng đang được phát triển
                </p>
              </div>
            )}
            {activeTab === 'members' && (
              <div className="text-center py-16">
                <Users className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className="text-xl font-semibold mb-2">Thành viên</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Tính năng đang được phát triển
                </p>
              </div>
            )}
            {activeTab === 'progress' && (
              <div className="text-center py-16">
                <TrendingUp className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className="text-xl font-semibold mb-2">Tiến độ</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Tính năng đang được phát triển
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {showCreateFolderModal && (
          <CreateFolderModal
            onClose={() => setShowCreateFolderModal(false)}
            onSubmit={(folderData) => {
              console.log('Create folder:', folderData);
              setShowCreateFolderModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassDetail;