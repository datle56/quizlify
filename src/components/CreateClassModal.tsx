import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, GraduationCap, Settings, FolderTree } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface CreateClassModalProps {
  onClose: () => void;
  onSubmit: (classData: any) => void;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({ onClose, onSubmit }) => {
  const { isDarkMode } = useThemeStore();
  const [currentTab, setCurrentTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    school: '',
    isPublic: false,
    allowStudentSets: true,
    joinCode: '',
    createDefaultFolders: true
  });

  const subjects = [
    'Tiếng Anh', 'Toán học', 'Vật lý', 'Hóa học', 'Sinh học',
    'Lịch sử', 'Địa lý', 'Văn học', 'Tin học', 'Khác'
  ];

  const tabs = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: GraduationCap },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
    { id: 'organization', label: 'Tổ chức', icon: FolderTree }
  ];

  const generateJoinCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, joinCode: code }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.subject) {
      const finalData = {
        ...formData,
        teacherId: 'user_001', // This would come from auth context
        teacherName: 'Bạn',
        joinCode: formData.joinCode || Math.random().toString(36).substring(2, 8).toUpperCase()
      };
      onSubmit(finalData);
    }
  };

  const modalClasses = isDarkMode 
    ? 'bg-gray-800 text-white' 
    : 'bg-white text-gray-900';

  const tabClasses = (isActive: boolean) => 
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : isDarkMode
          ? 'text-gray-400 hover:text-white hover:bg-gray-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`${modalClasses} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold">Tạo lớp học mới</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex space-x-1 p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={tabClasses(currentTab === tab.id)}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {currentTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Tên lớp học *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Ví dụ: Tiếng Anh 12A1"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Mô tả về lớp học này"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Môn học *
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  >
                    <option value="">Chọn môn học</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="school" className="block text-sm font-medium mb-2">
                    Trường/Tổ chức
                  </label>
                  <input
                    type="text"
                    id="school"
                    value={formData.school}
                    onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Tên trường hoặc tổ chức"
                  />
                </div>
              </div>
            )}

            {currentTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4">Quyền riêng tư</label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="privacy"
                        checked={!formData.isPublic}
                        onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">Riêng tư</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Chỉ những người có mã lớp mới có thể tham gia
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="privacy"
                        checked={formData.isPublic}
                        onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">Công khai</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Mọi người có thể tìm thấy và tham gia lớp
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allowStudentSets}
                      onChange={(e) => setFormData(prev => ({ ...prev, allowStudentSets: e.target.checked }))}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">Cho phép học sinh thêm bộ học</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Học sinh có thể tạo và chia sẻ bộ học trong lớp
                      </p>
                    </div>
                  </label>
                </div>

                <div>
                  <label htmlFor="joinCode" className="block text-sm font-medium mb-2">
                    Mã tham gia lớp
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="joinCode"
                      value={formData.joinCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, joinCode: e.target.value.toUpperCase() }))}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Để trống để tự động tạo"
                    />
                    <button
                      type="button"
                      onClick={generateJoinCode}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Tạo mã
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'organization' && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.createDefaultFolders}
                      onChange={(e) => setFormData(prev => ({ ...prev, createDefaultFolders: e.target.checked }))}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <p className="font-medium">Tạo thư mục mặc định</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Tự động tạo các thư mục: "Bài tập", "Tài liệu", "Kiểm tra"
                      </p>
                    </div>
                  </label>
                </div>

                {formData.createDefaultFolders && (
                  <div className={`p-4 rounded-lg border ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <h4 className="font-medium mb-3">Thư mục sẽ được tạo:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-500">📝</span>
                        <span>Bài tập - Chứa các bài tập được giao</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-500">📚</span>
                        <span>Tài liệu - Tài liệu tham khảo và học liệu</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-red-500">📝</span>
                        <span>Kiểm tra - Bài kiểm tra và đánh giá</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                    💡 Mẹo tổ chức lớp học
                  </h4>
                  <ul className={`text-sm space-y-1 ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-600'
                  }`}>
                    <li>• Sử dụng thư mục để phân loại theo chủ đề hoặc tuần học</li>
                    <li>• Đặt hạn nộp cho các bài tập trong thư mục</li>
                    <li>• Theo dõi tiến độ học tập của từng học sinh</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={`flex justify-between p-6 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex space-x-3">
              {currentTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabIndex = tabs.findIndex(t => t.id === currentTab);
                    if (tabIndex > 0) {
                      setCurrentTab(tabs[tabIndex - 1].id);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Quay lại
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Hủy
              </button>
              
              {currentTab === 'organization' ? (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tạo lớp học
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const tabIndex = tabs.findIndex(t => t.id === currentTab);
                    if (tabIndex < tabs.length - 1) {
                      setCurrentTab(tabs[tabIndex + 1].id);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tiếp tục
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateClassModal;