import React, { useState } from 'react';
import { FileText, Play, CheckCircle, Clock, Eye, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

interface AssignmentsTabStudentProps {
  assignments: any[];
}

const AssignmentsTabStudent: React.FC<AssignmentsTabStudentProps> = ({ assignments }) => {
  const { isDarkMode } = useThemeStore();

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const handleStartAssignment = (assignmentId: string) => {
    console.log('Start assignment:', assignmentId);
  };

  const handleContinueAssignment = (assignmentId: string) => {
    console.log('Continue assignment:', assignmentId);
  };

  const handleViewAssignment = (assignmentId: string) => {
    console.log('View assignment:', assignmentId);
  };

  const getAssignmentStatus = (assignment: any) => {
    if (assignment.is_completed) return 'completed';
    if (assignment.progress > 0) return 'in_progress';
    return 'not_started';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'in_progress':
        return 'Đang làm';
      case 'not_started':
        return 'Chưa bắt đầu';
      default:
        return 'Chưa bắt đầu';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'not_started':
        return <Play className="h-4 w-4 text-gray-600" />;
      default:
        return <Play className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className={themeClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Bài tập của tôi</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Xem và thực hiện các bài tập được giáo viên giao
          </p>
        </div>

        {/* Assignments Grid */}
        {assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment, index) => {
              const status = getAssignmentStatus(assignment);
              
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${cardClasses} rounded-lg p-6 border transition-all hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-orange-600" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </span>
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
                          <FileText className="h-4 w-4" />
                          <span>{assignment.study_set?.terms_count || 0} thuật ngữ</span>
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

                      {assignment.progress !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Tiến độ của tôi</span>
                            <span>{assignment.progress}%</span>
                          </div>
                          <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${assignment.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 pt-2">
                        {status === 'not_started' && (
                          <button
                            onClick={() => handleStartAssignment(assignment.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            <Play className="h-3 w-3" />
                            <span>Bắt đầu</span>
                          </button>
                        )}
                        {status === 'in_progress' && (
                          <button
                            onClick={() => handleContinueAssignment(assignment.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            <Clock className="h-3 w-3" />
                            <span>Tiếp tục</span>
                          </button>
                        )}
                        {status === 'completed' && (
                          <button
                            onClick={() => handleViewAssignment(assignment.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Xem lại</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleViewAssignment(assignment.id)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                            isDarkMode 
                              ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Eye className="h-3 w-3" />
                          <span>Chi tiết</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className={`h-16 w-16 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className="text-xl font-semibold mb-2">Chưa có bài tập nào</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Giáo viên chưa giao bài tập nào cho lớp học này
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentsTabStudent; 