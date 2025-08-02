import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Star, Clock } from 'lucide-react';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuizSets } from '../hooks/useQuizSets';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { quizSets, loading } = useQuizSets();

  const handleQuizSetClick = (id: string) => {
    navigate(`/app/quiz/${id}`);
  };

  const handleCreateSet = () => {
    navigate('/app/create');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chào mừng đến với Quizlify
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Học tập tự tin với thẻ ghi nhớ, bài kiểm tra thực hành và nội dung do chuyên gia tạo
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{quizSets.length}</p>
                <p className="text-gray-600">Bộ học</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {quizSets.reduce((acc, set) => acc + set.termCount, 0)}
                </p>
                <p className="text-gray-600">Tổng số từ</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Giờ học</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Sets Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bộ học của bạn</h2>
          {quizSets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizSets.map((quizSet) => (
                <QuizCard
                  key={quizSet.id}
                  quizSet={quizSet}
                  onClick={handleQuizSetClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Chưa có bộ học nào
                </h3>
                <p className="text-gray-600 mb-6">
                  Tạo bộ học đầu tiên để bắt đầu học tập
                </p>
                <button 
                  onClick={handleCreateSet}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
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