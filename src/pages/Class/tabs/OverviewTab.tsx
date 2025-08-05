import React from 'react';
import { 
  CheckCircle, 
  Plus, 
  Award, 
  FileText, 
  Folder, 
  UserPlus, 
  BarChart3 
} from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';

interface OverviewTabProps {
  classData: any;
  assignments: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ classData, assignments }) => {
  const { isDarkMode } = useThemeStore();
  
  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Recent Activity */}
        <div className={`rounded-lg p-6 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Nguyễn Văn A đã hoàn thành "Basic Grammar"</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Bộ học mới "Advanced Vocabulary" đã được thêm</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>5 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Trần Thị B đạt điểm cao nhất tuần này</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>1 ngày trước</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className={`rounded-lg p-6 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">Bài tập sắp hết hạn</h3>
          <div className="space-y-3">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <div key={assignment.id} className={`p-4 rounded-lg border ${
                  isDarkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{assignment.study_set.title}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {assignment.due_date ? `Hạn nộp: ${assignment.due_date}` : 'Không có hạn nộp'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {assignment.study_set.terms_count} thuật ngữ
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {assignment.is_optional ? 'Tùy chọn' : 'Bắt buộc'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Chưa có bài tập nào được giao
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className={`rounded-lg p-6 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">🚀 Hành động nhanh</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Tạo bộ học mới</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Folder className="h-5 w-5 text-green-600" />
              <span>Tạo thư mục bài tập</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <UserPlus className="h-5 w-5 text-purple-600" />
              <span>Mời thêm học sinh</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <span>Xem báo cáo lớp</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`rounded-lg p-6 border ${cardClasses}`}>
          <h3 className="text-lg font-semibold mb-4">📈 Thống kê nhanh</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Bộ học:</span>
              <span className="font-semibold">{classData.study_set_count || 0} bộ</span>
            </div>
            <div className="flex justify-between">
              <span>Thành viên:</span>
              <span className="font-semibold">{classData.member_count || 0} người</span>
            </div>
            <div className="flex justify-between">
              <span>Ngày tạo:</span>
              <span className="font-semibold">{new Date(classData.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab; 