import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Star, Clock, Eye, Plus, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAuthToken, apiRequest } from "../utils/api";

interface User {
  id: number;
  last_name: string;
  first_name: string;
  avatar_url: string;
}

interface QuizSet {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  language_from: string;
  language_to: string;
  color: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  terms_count: number;
  views_count: number;
  favorites_count: number;
  average_rating: number;
  user: User;
}

const QuizCard: React.FC<{ quizSet: QuizSet; onClick: (id: string) => void }> = ({ quizSet, onClick }) => {
  const getGradientColor = (color: string | null) => {
    if (!color) return 'from-blue-500 to-purple-600';
    
    if (color.startsWith('bg-')) {
      const colorClass = color.replace('bg-', '');
      const colorMap: { [key: string]: string } = {
        'red-500': 'from-red-500 to-red-600',
        'blue-500': 'from-blue-500 to-blue-600',
        'green-500': 'from-green-500 to-green-600',
        'yellow-500': 'from-yellow-500 to-yellow-600',
        'purple-500': 'from-purple-500 to-purple-600',
        'pink-500': 'from-pink-500 to-pink-600',
        'indigo-500': 'from-indigo-500 to-indigo-600',
        'teal-500': 'from-teal-500 to-teal-600',
        'orange-500': 'from-orange-500 to-orange-600',
        'emerald-500': 'from-emerald-500 to-emerald-600',
        'cyan-500': 'from-cyan-500 to-cyan-600',
      };
      return colorMap[colorClass] || 'from-blue-500 to-purple-600';
    }
    
    const colorMap: { [key: string]: string } = {
      '#FF6B6B': 'from-red-500 to-pink-500',
      '#4ECDC4': 'from-teal-500 to-cyan-500',
      '#45B7D1': 'from-blue-500 to-indigo-500',
      '#96CEB4': 'from-green-500 to-emerald-500',
      '#FFEAA7': 'from-yellow-500 to-orange-500',
      '#DDA0DD': 'from-purple-500 to-pink-500',
      '#98D8C8': 'from-emerald-500 to-teal-500',
      '#F7DC6F': 'from-yellow-400 to-orange-400',
    };
    
    return colorMap[color] || 'from-blue-500 to-purple-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
    return `${Math.floor(diffInDays / 365)} năm trước`;
  };

  const truncatedDescription = quizSet.description.length > 30 
    ? quizSet.description.substring(0, 30) + '...' 
    : quizSet.description;

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 overflow-hidden h-48 flex flex-col"
      onClick={() => onClick(quizSet.id.toString())}
    >
      <div className={`h-3 bg-gradient-to-r ${getGradientColor(quizSet.color)} relative`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {quizSet.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              quizSet.is_public 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {quizSet.is_public ? 'Công khai' : 'Riêng tư'}
            </span>
          </div>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-current" />
            <span className="text-xs font-medium text-gray-600">
              {quizSet.average_rating > 0 ? quizSet.average_rating.toFixed(1) : '0.0'}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-2 leading-relaxed line-clamp-1">
          {truncatedDescription || 'Không có mô tả'}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <div className="flex items-center flex-1 min-w-0">
            <img
              src={quizSet.user.avatar_url || 'https://via.placeholder.com/28x28/6B7280/FFFFFF?text=U'}
              alt="User avatar"
              className="w-6 h-6 rounded-full mr-2 border-2 border-white shadow-sm flex-shrink-0"
            />
            <span className="text-xs font-medium text-gray-700 truncate">
              {quizSet.user.first_name} {quizSet.user.last_name}
            </span>
          </div>
          <div className="flex flex-col items-end ml-2 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-50 px-2 py-0.5 rounded-full">
                <Eye className="h-3 w-3 text-gray-500 mr-1" />
                <span className="text-xs font-medium text-gray-600">{quizSet.views_count}</span>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {quizSet.terms_count} từ
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium mt-1">
              {getRelativeTime(quizSet.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showAllCards, setShowAllCards] = useState(false);

  const { data: quizSets, isLoading: loading } = useQuery<QuizSet[]>({
    queryKey: ['quizSets'],
    queryFn: async () => {
      const token = await getAuthToken();
      return apiRequest('/study-sets/user/me', {
        method: 'GET',
      }, token || undefined);
    },
  });

  const handleQuizSetClick = (id: string) => {
    navigate(`/app/quiz/${id}`);
  };

  const handleCreateSet = () => {
    navigate('/app/create');
  };

  const handleViewMore = () => {
    setShowAllCards(true);
  };

  const displayedCards = showAllCards ? quizSets : quizSets?.slice(0, 6);
  const hasMoreCards = quizSets && quizSets.length > 6;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <Star className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Chào mừng đến với Quizlify
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Học tập tự tin với thẻ ghi nhớ, bài kiểm tra thực hành và nội dung do chuyên gia tạo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{quizSets?.length || 0}</p>
                <p className="text-gray-600 font-medium text-sm">Bộ học</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg mr-3">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {quizSets?.reduce((acc: number, set: QuizSet) => acc + set.terms_count, 0) || 0}
                </p>
                <p className="text-gray-600 font-medium text-sm">Tổng số từ</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600 font-medium text-sm">Giờ học</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Bộ học của bạn</h2>
            <button
              onClick={handleCreateSet}
              className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo bộ học mới
            </button>
          </div>
          
          {quizSets && quizSets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedCards?.map((quizSet: QuizSet) => (
                  <QuizCard
                    key={quizSet.id}
                    quizSet={quizSet}
                    onClick={handleQuizSetClick}
                  />
                ))}
              </div>
              
              {hasMoreCards && !showAllCards && (
                <div className="text-center mt-6">
                  <button
                    onClick={handleViewMore}
                    className="flex items-center justify-center bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 font-medium"
                  >
                    <ChevronDown className="h-5 w-5 mr-2" />
                    Xem thêm {quizSets.length - 6} bộ học
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Chưa có bộ học nào
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  Tạo bộ học đầu tiên để bắt đầu hành trình học tập của bạn
                </p>
                <button
                  onClick={handleCreateSet}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-sm"
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Tạo bộ học
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;