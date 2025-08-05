import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Home,
  Edit,
  Palette,
  Share2,
  Download,
  Trash2,
  Settings,
  Globe,
  Lock,
  Calendar,
  Clock,
  Folder
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { Folder as FolderType } from '../../types';

interface FolderHeaderProps {
  folder: FolderType;
  onTogglePublic: (isPublic: boolean) => void;
  onEdit: () => void;
  onShare: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onSettings: () => void;
}

const FolderHeader: React.FC<FolderHeaderProps> = ({
  folder,
  onTogglePublic,
  onEdit,
  onShare,
  onDownload,
  onDelete,
  onSettings
}) => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  const handleBack = () => {
    navigate('/app/folders');
  };

  const headerClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  return (
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
            📁 Thư mục của tôi
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
                {folder.isPublic !== undefined && (
                  <button
                    onClick={() => onTogglePublic(!folder.isPublic)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      folder.isPublic 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {folder.isPublic ? (
                      <>
                        <Globe className="h-4 w-4 mr-1" />
                        Công khai
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-1" />
                        Riêng tư
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  folder.type === 'personal' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {folder.type === 'personal' ? 'Thư mục cá nhân' : 'Thư mục lớp'}
                </span>
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

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={onEdit}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Chỉnh sửa thư mục"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button 
              onClick={onShare}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Chia sẻ thư mục"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button 
              onClick={onDownload}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Tải xuống thư mục"
            >
              <Download className="h-5 w-5" />
            </button>
            <button 
              onClick={onSettings}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Cài đặt thư mục"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button 
              onClick={onDelete}
              className={`p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50 ${
                isDarkMode ? 'hover:bg-red-900' : 'hover:bg-red-50'
              }`}
              title="Xóa thư mục"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderHeader; 