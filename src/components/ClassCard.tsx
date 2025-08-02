import React from 'react';
import { Users, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { Class } from '../types';
import { motion } from 'framer-motion';

interface ClassCardProps {
  classData: Class;
  onClick: (id: string) => void;
  userRole?: 'teacher' | 'student';
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, onClick, userRole = 'student' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-200 overflow-hidden"
      onClick={() => onClick(classData.id)}
    >
      {/* Banner */}
      {classData.bannerImage ? (
        <img 
          src={classData.bannerImage} 
          alt={classData.name}
          className="w-full h-32 object-cover"
        />
      ) : (
        <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <GraduationCap className="h-12 w-12 text-white" />
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {classData.name}
            </h3>
            {userRole === 'teacher' && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Giáo viên
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {classData.description}
          </p>

          {/* Subject & School */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {classData.subject}
            </span>
            {classData.school && (
              <span>{classData.school}</span>
            )}
          </div>
        </div>

        {/* Teacher Info */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {classData.teacherName.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-gray-700">{classData.teacherName}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{classData.memberCount} học sinh</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{classData.studySetCount} bộ học</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(classData.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Join Code */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Mã lớp:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
              {classData.joinCode}
            </code>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassCard;