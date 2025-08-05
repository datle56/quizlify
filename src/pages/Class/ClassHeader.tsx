import React from 'react';
import { ArrowLeft, Users, Calendar, Copy, Settings, Crown, User } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface ClassHeaderProps {
  classData: any;
  onBack: () => void;
  onCopyJoinCode: () => void;
  userRole?: 'teacher' | 'student' | null;
}

const ClassHeader: React.FC<ClassHeaderProps> = ({ classData, onBack, onCopyJoinCode, userRole }) => {
  const { isDarkMode } = useThemeStore();
  
  const headerClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const getTeacherInfo = () => {
    if (classData.teacher) {
      return `${classData.teacher.first_name} ${classData.teacher.last_name}`;
    }
    return 'Không xác định';
  };

  return (
    <div className={`${headerClasses} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
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
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{classData.name}</h1>
                {userRole && (
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    userRole === 'teacher' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {userRole === 'teacher' ? (
                      <>
                        <Crown className="h-3 w-3" />
                        <span>Giáo viên</span>
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3" />
                        <span>Học sinh</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <p className={`text-lg mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {classData.description}
              </p>
              <div className={`flex items-center space-x-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {classData.subject && (
                  <div className="flex items-center space-x-1">
                    <span>📚</span>
                    <span>Môn: {classData.subject}</span>
                  </div>
                )}
                {classData.school && (
                  <div className="flex items-center space-x-1">
                    <span>🏫</span>
                    <span>Trường: {classData.school}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{classData.member_count || classData.members?.length || 0} thành viên</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Tạo: {new Date(classData.created_at).toLocaleDateString()}</span>
                </div>
                {userRole === 'student' && (
                  <div className="flex items-center space-x-1">
                    <Crown className="h-4 w-4" />
                    <span>GV: {getTeacherInfo()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Join Code and Settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {userRole === 'teacher' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">🔗 Mã lớp:</span>
                  <code className={`px-3 py-1 rounded font-mono ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {classData.join_code}
                  </code>
                  <button
                    onClick={onCopyJoinCode}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                    title="Sao chép mã lớp"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {userRole === 'teacher' && (
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Settings className="h-4 w-4" />
                <span>Cài đặt lớp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassHeader; 