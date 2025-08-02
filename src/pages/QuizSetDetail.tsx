import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Target, 
  Shuffle, 
  Star, 
  Share2, 
  Volume2,
  User,
  Calendar,
  BarChart3,
  Trophy,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from '../components/NotFound';
import { useQuizSets } from '../hooks/useQuizSets';

const QuizSetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quizSets, loading } = useQuizSets();
  const { isDarkMode } = useThemeStore();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  const quizSet = quizSets.find(set => set.id === id);

  if (!quizSet) {
    return <NotFound />;
  }

  const handleBack = () => {
    navigate('/app');
  };

  const handleStudyFlashcards = () => {
    navigate(`/app/quiz/${id}/flashcards`);
  };

  const handleLearnMode = () => {
    navigate(`/app/quiz/${id}/learn`);
  };

  const handleTestMode = () => {
    navigate(`/app/quiz/${id}/test`);
  };

  const handleMatchMode = () => {
    navigate(`/app/quiz/${id}/match`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  const studyModes = [
    {
      id: 'flashcards',
      title: 'Thẻ ghi nhớ',
      subtitle: 'Thẻ ghi nhớ',
      description: 'Học với thẻ ghi nhớ tương tác',
      icon: Play,
      color: 'from-blue-500 to-blue-600',
      action: handleStudyFlashcards
    },
    {
      id: 'learn',
      title: 'Học',
      subtitle: 'Tự học',
      description: 'Chế độ học thích ứng',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      action: handleLearnMode
    },
    {
      id: 'test',
      title: 'Kiểm tra',
      subtitle: 'Kiểm tra',
      description: 'Chế độ kiểm tra thực hành',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      action: handleTestMode
    },
    {
      id: 'match',
      title: 'Ghép thẻ',
      subtitle: 'Ghép thẻ',
      description: 'Ghép từ với định nghĩa',
      icon: Shuffle,
      color: 'from-pink-500 to-pink-600',
      action: handleMatchMode
    }
  ];

  const currentCard = quizSet.cards[currentCardIndex];

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < quizSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReviewAgain = () => {
    // Logic for marking card as needs review
    handleNextCard();
  };

  const handleGotIt = () => {
    // Logic for marking card as mastered
    handleNextCard();
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

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Header */}
      <div className={`${headerClasses} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Quay lại trang chủ</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowControls(!showControls)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorited 
                    ? 'text-yellow-400 bg-yellow-400/10' 
                    : isDarkMode 
                      ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                      : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-600/10'
                }`}
              >
                <Star className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Share2 className="h-4 w-4" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`h-1 ${quizSet.color} rounded-full mb-6 mx-auto max-w-md`}></div>
            <h1 className="text-4xl font-bold mb-3">{quizSet.title}</h1>
            <p className={`text-xl mb-6 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {quizSet.description}
            </p>
            
            <div className={`flex items-center justify-center space-x-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {quizSet.termCount}
                </span>
                <span>từ</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Tạo bởi {quizSet.creator}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(quizSet.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Study Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Chọn chế độ học của bạn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyModes.map((mode, index) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={mode.action}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl border ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-gray-600' 
                    : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-br ${mode.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <mode.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold mb-1">{mode.title}</h3>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {mode.subtitle}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {mode.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Interactive Flashcard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Xem trước thẻ ghi nhớ</h2>
            <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Thẻ {currentCardIndex + 1} / {quizSet.cards.length}
            </div>
          </div>

          {/* Flashcard */}
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-2xl">
              <motion.div
                className="relative h-80 cursor-pointer"
                onClick={handleCardFlip}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isFlipped ? 'back' : 'front'}
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 rounded-2xl border shadow-2xl flex flex-col justify-center items-center p-8 ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                    }`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <span className={`text-sm font-medium uppercase tracking-wide mr-3 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {isFlipped ? 'Định nghĩa' : 'Từ'}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(isFlipped ? currentCard.definition : currentCard.term);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                          }`}
                        >
                          <Volume2 className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="text-3xl font-medium mb-6 leading-relaxed">
                        {isFlipped ? currentCard.definition : currentCard.term}
                      </div>
                      
                      <div className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                        <p className="text-sm">Nhấp để lật</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Card Controls */}
          {showControls && (
            <div className="flex items-center justify-center space-x-8 mb-8">
              <button
                onClick={handleReviewAgain}
                className="flex items-center space-x-3 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl transition-colors font-semibold text-white"
              >
                <span className="text-2xl">✗</span>
                <span>Xem lại</span>
              </button>
              
              <button
                onClick={handleGotIt}
                className="flex items-center space-x-3 px-8 py-4 bg-green-600 hover:bg-green-700 rounded-xl transition-colors font-semibold text-white"
              >
                <span className="text-2xl">✓</span>
                <span>Hiểu rồi</span>
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                currentCardIndex === 0
                  ? isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                  : isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Trước</span>
            </button>
            
            <button
              onClick={handleNextCard}
              disabled={currentCardIndex === quizSet.cards.length - 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                currentCardIndex === quizSet.cards.length - 1
                  ? isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                  : isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>Tiếp</span>
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </button>
          </div>
        </motion.div>

        {/* Progress & Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-8"
        >
          {/* Mastery Progress */}
          <div className={`rounded-2xl p-6 border ${cardClasses}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Tiến độ thành thạo</h3>
              <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Trophy className="h-5 w-5" />
                <span>0% thành thạo</span>
              </div>
            </div>
            
            <div className={`w-full rounded-full h-3 mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: '0%' }}
              ></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-400">0</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chưa học</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">0</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quen thuộc</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">0</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Thành thạo</div>
              </div>
            </div>
          </div>

          {/* Terms List */}
          <div className={`rounded-2xl border ${cardClasses}`}>
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Từ trong bộ học này ({quizSet.termCount})
                </h3>
                <div className="flex items-center space-x-2">
                  <button className={`p-2 transition-colors ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}>
                    <Shuffle className="h-5 w-5" />
                  </button>
                  <button className={`p-2 transition-colors ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}>
                    <BarChart3 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {quizSet.cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="font-medium">{card.term}</p>
                          <button 
                            onClick={() => playAudio(card.term)}
                            className={`transition-colors ${
                              isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                            }`}
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Từ</p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{card.definition}</p>
                          <button 
                            onClick={() => playAudio(card.definition)}
                            className={`transition-colors ${
                              isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                            }`}
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Định nghĩa</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizSetDetail;