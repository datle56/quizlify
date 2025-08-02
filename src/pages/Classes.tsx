import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClasses } from '../hooks/useClasses';
import { useThemeStore } from '../store/themeStore';
import ClassCard from '../components/ClassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateClassModal from '../components/CreateClassModal';
import JoinClassModal from '../components/JoinClassModal';

const Classes: React.FC = () => {
  const navigate = useNavigate();
  const { classes, loading, createClass, joinClass } = useClasses();
  const { isDarkMode } = useThemeStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClassClick = (id: string) => {
    navigate(`/app/classes/${id}`);
  };

  const handleCreateClass = (classData: any) => {
    createClass(classData);
    setShowCreateModal(false);
  };

  const handleJoinClass = (joinCode: string) => {
    const joinedClass = joinClass(joinCode);
    if (joinedClass) {
      setShowJoinModal(false);
      navigate(`/app/classes/${joinedClass.id}`);
    }
    return !!joinedClass;
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Lớp học</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Tham gia hoặc tạo lớp học để học cùng nhau
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => setShowJoinModal(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Tham gia lớp</span>
              </button>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo lớp học</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className={`rounded-lg p-4 border ${cardClasses}`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm lớp học..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className={`p-8 rounded-lg border-2 border-dashed transition-colors text-left ${
              isDarkMode 
                ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-800' 
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Tạo lớp học mới</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tạo lớp học và mời học sinh tham gia
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowJoinModal(true)}
            className={`p-8 rounded-lg border-2 border-dashed transition-colors text-left ${
              isDarkMode 
                ? 'border-gray-600 hover:border-green-500 hover:bg-gray-800' 
                : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Tham gia lớp học</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Nhập mã lớp để tham gia học cùng nhau
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredClasses.map((classData, index) => (
              <motion.div
                key={classData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ClassCard
                  classData={classData}
                  onClick={handleClassClick}
                  userRole="student" // This would come from user context
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className={`h-16 w-16 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? 'Không tìm thấy lớp học' : 'Chưa tham gia lớp học nào'}
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery 
                ? `Không có lớp học nào phù hợp với "${searchQuery}"`
                : 'Tạo lớp học mới hoặc tham gia lớp học có sẵn'
              }
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tạo lớp học
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className={`px-6 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Tham gia lớp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateClassModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateClass}
          />
        )}
      </AnimatePresence>

      {/* Join Class Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <JoinClassModal
            onClose={() => setShowJoinModal(false)}
            onSubmit={handleJoinClass}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Classes;