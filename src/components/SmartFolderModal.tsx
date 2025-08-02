import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Eye, Save, Plus, Trash2 } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface SmartFolderRule {
  id: string;
  type: 'score' | 'lastStudied' | 'keyword' | 'difficulty' | 'subject';
  operator: 'less' | 'greater' | 'equals' | 'contains';
  value: string | number;
}

interface SmartFolderModalProps {
  onClose: () => void;
  onSubmit: (folderData: any) => void;
}

const SmartFolderModal: React.FC<SmartFolderModalProps> = ({ onClose, onSubmit }) => {
  const { isDarkMode } = useThemeStore();
  const [folderName, setFolderName] = useState('Ôn tập cần cải thiện');
  const [rules, setRules] = useState<SmartFolderRule[]>([
    { id: '1', type: 'score', operator: 'less', value: 70 },
    { id: '2', type: 'lastStudied', operator: 'greater', value: 7 }
  ]);
  const [updateFrequency, setUpdateFrequency] = useState('daily');
  const [previewCount] = useState(12); // Mock preview count

  const ruleTypes = [
    { value: 'score', label: 'Điểm số', unit: '%' },
    { value: 'lastStudied', label: 'Chưa học trong', unit: 'ngày' },
    { value: 'keyword', label: 'Chứa từ khóa', unit: '' },
    { value: 'difficulty', label: 'Độ khó', unit: '' },
    { value: 'subject', label: 'Chủ đề', unit: '' }
  ];

  const operators = {
    score: [
      { value: 'less', label: 'nhỏ hơn' },
      { value: 'greater', label: 'lớn hơn' },
      { value: 'equals', label: 'bằng' }
    ],
    lastStudied: [
      { value: 'greater', label: 'lớn hơn' },
      { value: 'equals', label: 'bằng' }
    ],
    keyword: [
      { value: 'contains', label: 'chứa' }
    ],
    difficulty: [
      { value: 'equals', label: 'là' }
    ],
    subject: [
      { value: 'equals', label: 'là' }
    ]
  };

  const difficultyOptions = ['Cơ bản', 'Trung bình', 'Nâng cao'];
  const subjectOptions = ['Tiếng Anh', 'Toán học', 'Khoa học', 'Lịch sử', 'Địa lý'];

  const addRule = () => {
    const newRule: SmartFolderRule = {
      id: Date.now().toString(),
      type: 'score',
      operator: 'less',
      value: 70
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const updateRule = (id: string, field: keyof SmartFolderRule, value: any) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: folderName,
      isSmartFolder: true,
      rules,
      updateFrequency,
      color: 'bg-purple-500',
      icon: '⚡'
    });
  };

  const modalClasses = isDarkMode 
    ? 'bg-gray-800 text-white' 
    : 'bg-white text-gray-900';

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
        className={`${modalClasses} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Tạo thư mục thông minh</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Folder Name */}
          <div>
            <label htmlFor="folderName" className="block text-sm font-medium mb-2">
              📋 Tên thư mục
            </label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          {/* Smart Rules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium">
                🎯 Quy tắc tự động
              </label>
              <button
                type="button"
                onClick={addRule}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm quy tắc</span>
              </button>
            </div>

            <div className="space-y-3">
              {rules.map((rule, index) => (
                <div key={rule.id} className={`p-4 rounded-lg border ${
                  isDarkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 flex-1">
                      <select
                        value={rule.type}
                        onChange={(e) => updateRule(rule.id, 'type', e.target.value)}
                        className={`px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {ruleTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>

                      <select
                        value={rule.operator}
                        onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                        className={`px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {operators[rule.type as keyof typeof operators]?.map(op => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>

                      {rule.type === 'difficulty' ? (
                        <select
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                          className={`px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          {difficultyOptions.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : rule.type === 'subject' ? (
                        <select
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                          className={`px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        >
                          {subjectOptions.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <input
                            type={rule.type === 'keyword' ? 'text' : 'number'}
                            value={rule.value}
                            onChange={(e) => updateRule(rule.id, 'value', 
                              rule.type === 'keyword' ? e.target.value : Number(e.target.value)
                            )}
                            className={`px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder={rule.type === 'keyword' ? 'nhập từ khóa...' : ''}
                          />
                          {ruleTypes.find(t => t.value === rule.type)?.unit && (
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {ruleTypes.find(t => t.value === rule.type)?.unit}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(rule.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Update Frequency */}
          <div>
            <label className="block text-sm font-medium mb-2">
              🔄 Cập nhật tự động
            </label>
            <select
              value={updateFrequency}
              onChange={(e) => setUpdateFrequency(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="realtime">Thời gian thực</option>
              <option value="daily">Mỗi ngày</option>
              <option value="weekly">Mỗi tuần</option>
              <option value="manual">Thủ công</option>
            </select>
          </div>

          {/* Preview */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'border-purple-700 bg-purple-900/20' : 'border-purple-200 bg-purple-50'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-700 dark:text-purple-300">
                Xem trước: {previewCount} bộ học phù hợp
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>
              Thư mục sẽ tự động chứa các bộ học thỏa mãn tất cả quy tắc đã thiết lập
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
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
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Tạo thư mục</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SmartFolderModal;