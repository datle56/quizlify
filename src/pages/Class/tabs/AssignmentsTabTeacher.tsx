import React, { useState } from 'react';
import { Plus, FileText, MoreVertical, Edit, Trash2, Users, Calendar, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

interface AssignmentsTabTeacherProps {
  assignments: any[];
}

const AssignmentsTabTeacher: React.FC<AssignmentsTabTeacherProps> = ({ assignments }) => {
  const { isDarkMode } = useThemeStore();
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const handleCreateAssignment = () => {
    console.log('Create assignment');
  };

  const handleEditAssignment = (assignmentId: string) => {
    console.log('Edit assignment:', assignmentId);
    setShowContextMenu(null);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    console.log('Delete assignment:', assignmentId);
    setShowContextMenu(null);
  };

  const handleViewProgress = (assignmentId: string) => {
    console.log('View progress:', assignmentId);
  };

  return (
    <div className={themeClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quản lý bài tập</h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tạo và quản lý bài tập cho học sinh
            </p>
          </div>
          
          <button
            onClick={handleCreateAssignment}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo bài tập</span>
          </button>
        </div>

        {/* Assignments Grid */}
        {assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${cardClasses} rounded-lg p-6 border transition-all hover:shadow-lg relative`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowContextMenu(showContextMenu === assignment.id ? null : assignment.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    <AnimatePresence>
                      {showContextMenu === assignment.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-10 ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => handleViewProgress(assignment.id)}
                              className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-300 hover:bg-gray-700' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Xem tiến độ</span>
                            </button>
                            <button
                              onClick={() => handleEditAssignment(assignment.id)}
                              className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-300 hover:bg-gray-700' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Chỉnh sửa</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAssignment(assignment.id)}
                              className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                                isDarkMode 
                                  ? 'text-red-400 hover:bg-gray-700' 
                                  : 'text-red-600 hover:bg-gray-100'
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{assignment.study_set?.title || 'Bài tập'}</h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {assignment.study_set?.description || 'Mô tả bài tập'}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{assignment.completed_students || 0}/{assignment.total_students || 0} học sinh</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        assignment.is_optional 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {assignment.is_optional ? 'Tùy chọn' : 'Bắt buộc'}
                      </span>
                    </div>

                    {assignment.due_date && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Hạn: {new Date(assignment.due_date).toLocaleDateString()}</span>
                      </div>
                    )}

                    {assignment.completion_rate !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tiến độ hoàn thành</span>
                          <span>{assignment.completion_rate}%</span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${assignment.completion_rate}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className={`h-16 w-16 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className="text-xl font-semibold mb-2">Chưa có bài tập nào</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tạo bài tập đầu tiên để học sinh có thể thực hành
            </p>
            <button
              onClick={handleCreateAssignment}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo bài tập đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsTabTeacher; 