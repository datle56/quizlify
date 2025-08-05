import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Share2,
  Volume2,
  User,
  Maximize,
  X,
  Shuffle,
  Settings,
  Lightbulb,
  MoreHorizontal,
  Save,
  BookOpen,
  Target,
  CopyCheck,
  Zap,
  Blocks,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from '../components/NotFound';
import { useQuizSetDetail } from '../hooks/useQuizSetDetail';
import { useTerms } from '../hooks/useTerms';

const QuizSetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { quizSet, loading, error } = useQuizSetDetail(id);
  const { terms, loading: termsLoading, error: termsError } = useTerms(id);

  const [isFavorited, setIsFavorited] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sử dụng LoadingSpinner component thay vì custom loading
  if (loading || termsLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    const bgClass = isDarkMode ? 'bg-slate-900' : 'bg-gray-50';
    const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
    const errorTextClass = isDarkMode ? 'text-slate-400' : 'text-gray-600';
    
    return (
      <div className={`${bgClass} min-h-screen flex items-center justify-center ${textClass}`}>
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Lỗi tải bộ câu hỏi</div>
          <div className={errorTextClass}>{error}</div>
        </div>
      </div>
    );
  }

  if (!quizSet) {
    return <NotFound />;
  }

  const handleNextCard = () => {
    if (terms && currentCardIndex < terms.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else if (terms) {
      // Quay về thẻ đầu tiên nếu hết
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  const handleCardFlip = () => setIsFlipped(!isFlipped);
  const handleToggleFullScreen = () => setIsFullScreen(!isFullScreen);

  const playAudio = (text: string | undefined) => {
    if ('speechSynthesis' in window && text) {
      speechSynthesis.cancel(); // Hủy các lần phát âm trước
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const studyModes = [
    { id: 'flashcards', title: 'Thẻ ghi nhớ', icon: BookOpen },
    { id: 'learn', title: 'Tự học', icon: Target },
    { id: 'test', title: 'Kiểm tra', icon: CopyCheck },
    { id: 'blocks', title: 'Blocks', icon: Blocks },
    { id: 'blast', title: 'Blast', icon: Zap },
    { id: 'match', title: 'Ghép thẻ', icon: Shuffle },
  ];

  const currentCard = terms?.[currentCardIndex];

  // Theme classes
  const bgClass = isDarkMode ? 'bg-slate-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-900';
  const cardBgClass = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-slate-700' : 'border-gray-200';
  const hoverClass = isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100';
  const buttonBgClass = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const buttonHoverClass = isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100';

  const Flashcard = () => (
    <motion.div
      className="relative w-full aspect-[16/9] cursor-pointer"
      onClick={handleCardFlip}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isFlipped ? 'back' : 'front'}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 ${cardBgClass} rounded-xl p-6 flex flex-col justify-between border ${borderClass}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`flex justify-between items-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            <div className="flex items-center space-x-2 text-sm">
              <Lightbulb className="w-4 h-4" />
              <span>{isFlipped ? 'Định nghĩa' : 'Thuật ngữ'}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio(isFlipped ? currentCard?.definition : currentCard?.term);
              }}
              className={`p-1 ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-700'} transition-colors`}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <p className={`text-3xl md:text-4xl lg:text-5xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentCard && (isFlipped ? currentCard.definition : currentCard.term)}
            </p>
          </div>
          <div className={`text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
            Nhấn <kbd className={`px-2 py-1.5 text-xs font-semibold ${isDarkMode ? 'text-gray-300 bg-slate-700 border-slate-600' : 'text-gray-700 bg-gray-100 border-gray-300'} border rounded-md`}>phím cách</kbd> hoặc nhấp vào thẻ để lật
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className={`${bgClass} min-h-screen ${textClass} p-4 sm:p-6 lg:p-8 font-sans`}>
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className={`p-2 ${buttonBgClass} ${buttonHoverClass} border ${borderClass} rounded-lg transition-colors`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{quizSet.title}</h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Cho điểm đánh giá đầu tiên</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className={`flex items-center space-x-2 ${buttonBgClass} ${buttonHoverClass} border ${borderClass} px-4 py-2 rounded-lg text-sm font-semibold transition-colors`}>
              <Save className="w-4 h-4" />
              <span>Lưu</span>
            </button>
            <button className={`p-2 ${buttonBgClass} ${buttonHoverClass} border ${borderClass} rounded-lg transition-colors`}>
              <Share2 className="w-5 h-5" />
            </button>
            <button className={`p-2 ${buttonBgClass} ${buttonHoverClass} border ${borderClass} rounded-lg transition-colors`}>
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {studyModes.map(mode => (
            <button key={mode.id} className={`${buttonBgClass} ${buttonHoverClass} border ${borderClass} rounded-lg p-3 flex items-center space-x-3 transition-colors`}>
              <mode.icon className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`} />
              <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{mode.title}</span>
            </button>
          ))}
        </div>

        <main className="mb-8">
          <Flashcard />
        </main>

        <footer className={`flex justify-between items-center ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/50'} border ${borderClass} rounded-xl p-3 mb-8`}>
          <div className="w-1/3"></div>
          <div className="w-1/3 flex justify-center items-center space-x-4">
            <button onClick={handleNextCard} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors">
              <XCircle className="w-7 h-7" />
            </button>
            <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} tabular-nums`}>{currentCardIndex + 1} / {terms?.length || 0}</span>
            <button onClick={handleNextCard} className="p-2 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30 transition-colors">
              <CheckCircle2 className="w-7 h-7" />
            </button>
          </div>
          <div className={`w-1/3 flex justify-end items-center space-x-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            <button className={`${isDarkMode ? 'hover:text-white' : 'hover:text-gray-700'} transition-colors`}><Shuffle className="w-5 h-5" /></button>
            <button className={`${isDarkMode ? 'hover:text-white' : 'hover:text-gray-700'} transition-colors`}><Settings className="w-5 h-5" /></button>
            <button onClick={handleToggleFullScreen} className={`${isDarkMode ? 'hover:text-white' : 'hover:text-gray-700'} transition-colors`}><Maximize className="w-5 h-5" /></button>
          </div>
        </footer>
        
        <div className={`flex items-center space-x-3 mb-8 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100/50'} border ${borderClass} rounded-xl p-4`}>
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xl">
            {quizSet.user.first_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Tạo bởi</p>
            <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{quizSet.user.first_name} {quizSet.user.last_name}</p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Đã tạo {new Date(quizSet.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex-grow flex justify-end">
            <Star className={`w-6 h-6 transition-colors cursor-pointer ${isFavorited ? 'text-yellow-400 fill-yellow-400' : isDarkMode ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-yellow-400'}`} onClick={() => setIsFavorited(!isFavorited)} />
          </div>
        </div>

        {/* ---- DANH SÁCH THUẬT NGỮ ĐÃ SỬA LẠI BỐ CỤC ---- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${cardBgClass} border ${borderClass} rounded-xl overflow-hidden`}
        >
          <div className={`p-4 sm:p-5 border-b ${borderClass}`}>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Các thuật ngữ trong học phần này ({terms?.length || 0})
            </h2>
          </div>

          {/* Vòng lặp map được sửa đổi để tạo bố cục 2 cột */}
          <div>
            {terms?.map((term) => (
              <div key={term.id} className={`flex min-h-[80px] border-b ${borderClass} last:border-b-0 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors`}>
                {/* Cột Thuật ngữ (Trái) */}
                <div className={`w-5/12 flex justify-between items-center p-4 sm:p-5 border-r ${borderClass}`}>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex-grow`}>{term.term}</p>
                  <button
                    onClick={() => playAudio(term.term)}
                    className={`ml-4 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'} transition-colors flex-shrink-0`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Cột Định nghĩa (Phải) */}
                <div className="w-7/12 flex justify-between items-center p-4 sm:p-5">
                  <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'} flex-grow`}>{term.definition}</p>
                  <button
                    onClick={() => playAudio(term.definition)}
                    className={`ml-4 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'} transition-colors flex-shrink-0`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-slate-900/90' : 'bg-gray-900/90'} backdrop-blur-sm flex items-center justify-center p-4`}
          >
            <div className="w-full max-w-5xl">
              <Flashcard />
            </div>
            <button onClick={handleToggleFullScreen} className={`absolute top-6 right-6 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-white'}`}>
              <X className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizSetDetail;