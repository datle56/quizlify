import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Crown, 
  GraduationCap, 
  Mail, 
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';

interface MembersTabProps {
  classData: any;
}

const MembersTab: React.FC<MembersTabProps> = ({ classData }) => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'teacher' | 'student'>('all');
  
  const cardClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const mockMembers = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'teacher',
      avatar: '👨‍🏫',
      status: 'active',
      joinedAt: '2024-01-01',
      lastActive: '2 giờ trước',
      studySetsCompleted: 15,
      averageScore: 85
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      role: 'student',
      avatar: '👩‍🎓',
      status: 'active',
      joinedAt: '2024-01-02',
      lastActive: '1 giờ trước',
      studySetsCompleted: 12,
      averageScore: 92
    },
    {
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      role: 'student',
      avatar: '👨‍🎓',
      status: 'pending',
      joinedAt: '2024-01-03',
      lastActive: '1 ngày trước',
      studySetsCompleted: 8,
      averageScore: 78
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      role: 'student',
      avatar: '👩‍🎓',
      status: 'inactive',
      joinedAt: '2024-01-04',
      lastActive: '3 ngày trước',
      studySetsCompleted: 5,
      averageScore: 65
    }
  ];

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'teacher' ? <Crown className="h-4 w-4 text-yellow-600" /> : <GraduationCap className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg p-6 border ${cardClasses}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold mb-2">Thành viên lớp học</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredMembers.length} thành viên trong lớp
            </p>
          </div>
          
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus className="h-4 w-4" />
            <span>Mời thành viên</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-lg p-4 border ${cardClasses}`}>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm thành viên..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterRole === 'all'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterRole('teacher')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterRole === 'teacher'
                  ? 'bg-yellow-600 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Giáo viên
            </button>
            <button
              onClick={() => setFilterRole('student')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterRole === 'student'
                  ? 'bg-green-600 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Học sinh
            </button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {filteredMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`rounded-lg p-4 border ${cardClasses}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
                  {member.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{member.name}</h4>
                    {getRoleIcon(member.role)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(member.status)}`}>
                      {member.status === 'active' ? 'Hoạt động' :
                       member.status === 'pending' ? 'Chờ duyệt' : 'Không hoạt động'}
                    </span>
                  </div>
                  
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{member.email}</span>
                      </span>
                      <span>Tham gia: {new Date(member.joinedAt).toLocaleDateString()}</span>
                      <span>Hoạt động cuối: {member.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm">
                    <span className="font-medium">{member.studySetsCompleted}</span> bộ học hoàn thành
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{member.averageScore}%</span> điểm trung bình
                  </div>
                </div>
                
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}>
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-16">
          <Users className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className="text-xl font-semibold mb-2">Không tìm thấy thành viên</h3>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Không có thành viên nào phù hợp với bộ lọc hiện tại
          </p>
        </div>
      )}
    </div>
  );
};

export default MembersTab; 