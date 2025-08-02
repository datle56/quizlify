import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizSets } from '../hooks/useQuizSets';
import { useThemeStore } from '../store/themeStore';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Tìm kiếm bộ học, sách giáo khoa, câu hỏi và nhiều hơn nữa",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { quizSets } = useQuizSets();
  const { isDarkMode } = useThemeStore();

  // Mock trending searches
  const trendingSearches = [
    'Tiếng Anh cơ bản',
    'Toán học lớp 12',
    'Lịch sử Việt Nam',
    'Sinh học tế bào',
    'Hóa học hữu cơ'
  ];

  // Filter quiz sets based on query
  const filteredResults = query.length > 0 
    ? quizSets.filter(set => 
        set.title.toLowerCase().includes(query.toLowerCase()) ||
        set.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      
      // Navigate to search results
      navigate(`/app/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleResultClick = (setId: string) => {
    navigate(`/app/quiz/${setId}`);
    setIsOpen(false);
    setQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  const themeClasses = {
    container: isDarkMode 
      ? 'bg-gray-800 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900',
    dropdown: isDarkMode 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    item: isDarkMode 
      ? 'hover:bg-gray-700 text-gray-300' 
      : 'hover:bg-gray-50 text-gray-700',
    placeholder: isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className={`relative border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${themeClasses.container}`}>
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-400'
        }`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
          className={`w-full pl-10 pr-10 py-2 bg-transparent focus:outline-none ${themeClasses.placeholder}`}
          placeholder={placeholder}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto ${themeClasses.dropdown}`}
          >
            {query.length > 0 ? (
              // Search Results
              <div className="p-4">
                {filteredResults.length > 0 ? (
                  <>
                    <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Kết quả tìm kiếm
                    </h3>
                    {filteredResults.map((set) => (
                      <button
                        key={set.id}
                        onClick={() => handleResultClick(set.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${themeClasses.item}`}
                      >
                        <div className="font-medium">{set.title}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {set.termCount} từ • {set.creator}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => handleSearch(query)}
                      className={`w-full text-left p-3 rounded-lg transition-colors border-t mt-2 pt-3 ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                      } ${themeClasses.item}`}
                    >
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4" />
                        <span>Tìm kiếm "{query}"</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Search className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Không tìm thấy kết quả cho "{query}"
                    </p>
                    <button
                      onClick={() => handleSearch(query)}
                      className="mt-2 text-blue-500 hover:text-blue-600"
                    >
                      Tìm kiếm trên toàn bộ Quizlify
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Default dropdown content
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Tìm kiếm gần đây
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className={`text-xs ${isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-500 hover:text-gray-600'}`}
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className={`w-full text-left p-2 rounded-lg transition-colors flex items-center space-x-2 ${themeClasses.item}`}
                      >
                        <Clock className="h-4 w-4" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div>
                  <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tìm kiếm phổ biến
                  </h3>
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex items-center space-x-2 ${themeClasses.item}`}
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;