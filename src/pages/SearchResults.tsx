import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, Grid, List, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuizSets } from '../hooks/useQuizSets';
import { useThemeStore } from '../store/themeStore';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { quizSets, loading } = useQuizSets();
  const { isDarkMode } = useThemeStore();
  
  const query = searchParams.get('q') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  // Filter and sort results
  const filteredResults = quizSets.filter(set => {
    const matchesQuery = query === '' || 
      set.title.toLowerCase().includes(query.toLowerCase()) ||
      set.description.toLowerCase().includes(query.toLowerCase()) ||
      set.cards.some(card => 
        card.term.toLowerCase().includes(query.toLowerCase()) ||
        card.definition.toLowerCase().includes(query.toLowerCase())
      );
    
    // Add more filters here based on subject, level, etc.
    return matchesQuery;
  });

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'terms':
        return b.termCount - a.termCount;
      default: // relevance
        return 0;
    }
  });

  const handleQuizSetClick = (id: string) => {
    navigate(`/app/quiz/${id}`);
  };

  const handleBack = () => {
    navigate('/app');
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className={`flex items-center space-x-2 mb-4 transition-colors ${
              isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {query ? `Kết quả tìm kiếm cho "${query}"` : 'Tất cả bộ học'}
              </h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Tìm thấy {sortedResults.length} kết quả
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className={`flex items-center rounded-lg border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-300'
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

        {/* Filters and Sort */}
        <div className={`rounded-lg p-4 mb-8 border ${cardClasses}`}>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <SortAsc className="h-5 w-5" />
              <span className="font-medium">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-1 rounded border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="relevance">Liên quan</option>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="title">Tên A-Z</option>
                <option value="terms">Số từ</option>
              </select>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Lọc:</span>
              
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className={`px-3 py-1 rounded border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">Tất cả môn học</option>
                <option value="language">Ngôn ngữ</option>
                <option value="science">Khoa học</option>
                <option value="math">Toán học</option>
                <option value="history">Lịch sử</option>
                <option value="other">Khác</option>
              </select>

              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className={`px-3 py-1 rounded border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {sortedResults.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {sortedResults.map((quizSet, index) => (
              <motion.div
                key={quizSet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {viewMode === 'grid' ? (
                  <QuizCard
                    quizSet={quizSet}
                    onClick={handleQuizSetClick}
                  />
                ) : (
                  <div
                    onClick={() => handleQuizSetClick(quizSet.id)}
                    className={`p-6 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${cardClasses}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`h-2 ${quizSet.color} rounded-full mb-3 w-16`}></div>
                        <h3 className="text-xl font-semibold mb-2">{quizSet.title}</h3>
                        <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {quizSet.description}
                        </p>
                        <div className={`flex items-center space-x-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="font-medium">{quizSet.termCount} từ</span>
                          <span>Tạo bởi {quizSet.creator}</span>
                          <span>{new Date(quizSet.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <Search className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className="text-xl font-semibold mb-2">Không tìm thấy kết quả</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {query 
                ? `Không có bộ học nào phù hợp với "${query}"`
                : 'Không có bộ học nào được tìm thấy'
              }
            </p>
            <button
              onClick={handleBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;