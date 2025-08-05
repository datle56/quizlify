import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import FoldersTabTeacher from './FoldersTabTeacher';
import FoldersTabStudent from './FoldersTabStudent';

interface FoldersTabProps {
  onCreateFolder: () => void;
}

const FoldersTab: React.FC<FoldersTabProps> = ({ onCreateFolder }) => {
  const { user } = useAuth();

  // Kiểm tra vai trò user và render component phù hợp
  // Mặc định là student nếu không có role hoặc role không phải teacher
  if (user?.role === 'teacher') {
    return <FoldersTabTeacher onCreateFolder={onCreateFolder} />;
  }
  
  return <FoldersTabStudent onCreateFolder={onCreateFolder} />;
};

export default FoldersTab; 