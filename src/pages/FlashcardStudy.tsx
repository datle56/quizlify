import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Volume2, X, Check, Settings, Eye, EyeOff, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from '../components/NotFound';
import { useTerms } from '../hooks/useTerms';

const FlashcardStudy: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { terms, loading, error } = useTerms(id);
  const { isDarkMode } = useThemeStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTerm, setShowTerm] = useState(true);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());
  const [reviewCards, setReviewCards] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [trackProgress, setTrackProgress] = useState(true);
  const [remainingCards, setRemainingCards] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showBothSides, setShowBothSides] = useState(false);
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(true);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);

  // Filter terms based on starred setting
  const filteredTerms = onlyStarred ? terms?.filter(term => term.starred) : terms;
  const displayTerms = filteredTerms || [];

  // Initialize remaining cards when terms load
  useEffect(() => {
    if (displayTerms && displayTerms.length > 0) {
      setRemainingCards(displayTerms.map(term => term.id.toString()));
    }
  }, [displayTerms]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!keyboardShortcuts || showCelebration || showSettings) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          handleFlip();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'x':
        case 'X':
          if (isFlipped && trackProgress) {
            handleReviewAgain();
          }
          break;
        case 'v':
        case 'V':
          if (isFlipped && trackProgress) {
            handleGotIt();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isFlipped, trackProgress, showCelebration, showSettings, keyboardShortcuts]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading terms</div>
          <div className="text-gray-600">{error}</div>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!displayTerms || displayTerms.length === 0) {
    return <NotFound />;
  }

  const currentCard = displayTerms[currentIndex];
  const progress = ((currentIndex + 1) / displayTerms.length) * 100;
  const masteredCount = masteredCards.size;
  const reviewCount = reviewCards.size;
  const remainingCount = remainingCards.length;

  const handleNext = () => {
    if (currentIndex < displayTerms.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setShowCelebration(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowCelebration(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReviewAgain = () => {
    const cardId = currentCard.id.toString();
    setReviewCards(prev => new Set([...prev, cardId]));
    setMasteredCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
    setRemainingCards(prev => prev.filter(id => id !== cardId));
    handleNext();
  };

  const handleGotIt = () => {
    const cardId = currentCard.id.toString();
    setMasteredCards(prev => new Set([...prev, cardId]));
    setReviewCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
    setRemainingCards(prev => prev.filter(id => id !== cardId));
    handleNext();
  };

  const handleBack = () => {
    navigate(`/app/quiz/${id}`);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards(new Set());
    setReviewCards(new Set());
    setShowCelebration(false);
    setRemainingCards(displayTerms.map(term => term.id.toString()));
  };

  const playAudio = (text: string) => {
    if (textToSpeech && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  // Fireworks animation component
  const Fireworks = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          initial={{
            x: '50%',
            y: '50%',
            scale: 0,
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-2xl"
          initial={{
            x: '50%',
            y: '50%',
            scale: 0,
            rotate: 0,
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 80}%`,
            y: `${50 + (Math.random() - 0.5) * 80}%`,
            scale: [0, 1.5, 0],
            rotate: 360,
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${themeClasses} relative`}>
      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className={`absolute top-4 right-4 p-3 rounded-full transition-colors ${
          isDarkMode 
            ? 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700' 
            : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        } shadow-lg`}
      >
        <Settings className="h-6 w-6" />
      </button>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className={`absolute top-4 left-4 p-3 rounded-full transition-colors ${
          isDarkMode 
            ? 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700' 
            : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        } shadow-lg`}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-4xl">
          {showCelebration ? (
            // Celebration Card
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-gradient-to-br from-green-600 to-green-700 rounded-2xl border-2 border-green-500 shadow-2xl p-12 text-center min-h-[400px] flex flex-col justify-center"
            >
              <Fireworks />
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                
                <h3 className="text-3xl font-bold mb-4 text-white">
                  Congratulations!
                </h3>
                
                <p className="text-green-100 mb-8 text-lg">
                  You've completed this study set! You mastered {masteredCount} out of {displayTerms.length} terms.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <motion.button
                    onClick={handleRestart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-green-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                  >
                    Study Again
                  </motion.button>
                  
                  <motion.button
                    onClick={handleBack}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-800 text-white px-8 py-3 rounded-lg hover:bg-green-900 transition-colors font-semibold"
                  >
                    Back to Set
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            // Regular Flashcard
            <motion.div
              className="relative cursor-pointer"
              onClick={handleFlip}
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
                  className={`rounded-2xl border-2 shadow-2xl flex flex-col justify-center items-center p-16 min-h-[500px] ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                      : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                  }`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-center w-full">
                    <div className="flex items-center justify-center mb-8">
                      <span className={`text-lg font-medium uppercase tracking-wide mr-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {isFlipped ? (showTerm ? 'Definition' : 'Term') : (showTerm ? 'Term' : 'Definition')}
                      </span>
                      {textToSpeech && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(isFlipped 
                              ? (showTerm ? currentCard.definition : currentCard.term)
                              : (showTerm ? currentCard.term : currentCard.definition)
                            );
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                          }`}
                        >
                          <Volume2 className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                    
                    <div className="text-4xl md:text-5xl font-medium leading-relaxed mb-8">
                      {isFlipped 
                        ? (showTerm ? currentCard.definition : currentCard.term)
                        : (showTerm ? currentCard.term : currentCard.definition)
                      }
                    </div>

                    {showBothSides && isFlipped && (
                      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Term:</div>
                        <div className="text-xl font-medium">{currentCard.term}</div>
                      </div>
                    )}
                    
                    <div className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                      <p className="text-sm">Nhấn phím cách hoặc nhấp vào thẻ để lật</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Card Controls */}
      {isFlipped && trackProgress && !showCelebration && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-8 mt-8"
        >
          <motion.button
            onClick={handleReviewAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl transition-colors font-semibold text-white shadow-lg"
          >
            <X className="h-6 w-6" />
            <span>Học lại</span>
          </motion.button>
          
          <motion.button
            onClick={handleGotIt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 px-8 py-4 bg-green-600 hover:bg-green-700 rounded-xl transition-colors font-semibold text-white shadow-lg"
          >
            <Check className="h-6 w-6" />
            <span>Đã biết</span>
          </motion.button>
        </motion.div>
      )}

      {/* Navigation */}
      {!showCelebration && (
        <div className="flex items-center justify-between mt-12 px-8">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              currentIndex === 0
                ? isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                : isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>
          
          <div className="text-center">
            <div className="text-lg font-semibold mb-1">
              {currentIndex + 1} / {displayTerms.length}
            </div>
            {trackProgress && (
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.round((masteredCount / displayTerms.length) * 100)}% mastered
              </div>
            )}
          </div>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === displayTerms.length - 1 && !showCelebration}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              currentIndex === displayTerms.length - 1 && !showCelebration
                ? isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                : isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Cài đặt</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Track Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium">Theo dõi tiến độ</label>
                    <button
                      onClick={() => setTrackProgress(!trackProgress)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        trackProgress 
                          ? 'bg-blue-600' 
                          : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          trackProgress ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Sắp xếp các thẻ ghi nhớ của bạn để theo dõi những gì bạn đã biết và những gì đang học.
                  </p>
                </div>

                {/* Only Starred */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium">Chỉ học thuật ngữ có gắn sao</label>
                    <button
                      onClick={() => setOnlyStarred(!onlyStarred)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        onlyStarred 
                          ? 'bg-blue-600' 
                          : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          onlyStarred ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Show Both Sides */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium">Hiển thị cả hai mặt của thẻ</label>
                    <button
                      onClick={() => setShowBothSides(!showBothSides)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showBothSides 
                          ? 'bg-blue-600' 
                          : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showBothSides ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Text to Speech */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium">Chuyển văn bản thành lời nói</label>
                    <button
                      onClick={() => setTextToSpeech(!textToSpeech)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        textToSpeech 
                          ? 'bg-blue-600' 
                          : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          textToSpeech ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium">Phím tắt bàn phím</label>
                    <button
                      onClick={() => setKeyboardShortcuts(!keyboardShortcuts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        keyboardShortcuts 
                          ? 'bg-blue-600' 
                          : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          keyboardShortcuts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Restart Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleRestart}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span>Khởi động lại Thẻ ghi nhớ</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlashcardStudy;