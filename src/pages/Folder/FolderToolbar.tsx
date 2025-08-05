import React from 'react';
import { 
  Plus,
  Folder,
  MoreHorizontal,
  Search,
  Grid,
  List,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface FolderToolbarProps {
  viewMode: 'grid' | 'list';
  searchQuery: string;
  sortBy: string;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sortBy: string) => void;
  onAddStudySet: () => void;
  onCreateSubFolder: () => void;
  onMove: () => void;
}

const FolderToolbar: React.FC<FolderToolbarProps> = ({
  viewMode,
  searchQuery,
  sortBy,
  onViewModeChange,
  onSearchChange,
  onSortChange,
  onAddStudySet,
  onCreateSubFolder,
  onMove
}) => {
  const { isDarkMode } = useThemeStore();

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  return (
    <div className={`rounded-lg p-4 mb-6 border ${cardClasses}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onAddStudySet}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm bộ học</span>
          </button>
          <button 
            onClick={onCreateSubFolder}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Folder className="h-4 w-4" />
            <span>Tạo thư mục con</span>
          </button>
          <button 
            onClick={onMove}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
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
              onChange={(e) => onSearchChange(e.target.value)}
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
              onChange={(e) => onSortChange(e.target.value)}
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
              <option value="views">Lượt xem</option>
              <option value="rating">Đánh giá</option>
            </select>
          </div>

          <div className={`flex items-center rounded-lg border ${
            isDarkMode ? 'border-gray-600' : 'border-gray-300'
          }`}>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Xem dạng lưới"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Xem dạng danh sách"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderToolbar; 