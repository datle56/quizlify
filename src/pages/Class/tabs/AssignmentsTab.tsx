import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import AssignmentsTabTeacher from './AssignmentsTabTeacher';
import AssignmentsTabStudent from './AssignmentsTabStudent';

interface AssignmentsTabProps {
  assignments: any[];
}

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ assignments }) => {
  const { user } = useAuth();

  // Kiểm tra vai trò user và render component phù hợp
  // Mặc định là student nếu không có role hoặc role không phải teacher
  if (user?.role === 'teacher') {
    return <AssignmentsTabTeacher assignments={assignments} />;
  }
  
  return <AssignmentsTabStudent assignments={assignments} />;
};

export default AssignmentsTab; 