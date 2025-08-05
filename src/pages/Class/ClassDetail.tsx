import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useClasses } from '../../hooks/useClasses';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotFound from '../../components/NotFound';
import CreateFolderModal from '../../components/CreateFolderModal';

// Import các component con
import ClassHeader from './ClassHeader';
import ClassTabs from './ClassTabs';
import OverviewTab from './tabs/OverviewTab';
import FoldersTab from './tabs/FoldersTab';
import FoldersTabTeacher from './tabs/FoldersTabTeacher';
import FoldersTabStudent from './tabs/FoldersTabStudent';
import MembersTab from './tabs/MembersTab';
import AssignmentsTab from './tabs/AssignmentsTab';
import AssignmentsTabTeacher from './tabs/AssignmentsTabTeacher';
import AssignmentsTabStudent from './tabs/AssignmentsTabStudent';
import ProgressTab from './tabs/ProgressTab';

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClassById, getClassAssignments, getUserRoleInClass, loading } = useClasses();
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [classData, setClassData] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);

  const fetchClassData = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const [classResult, assignmentsResult] = await Promise.all([
        getClassById(id),
        getClassAssignments(id)
      ]);
      
      setClassData(classResult);
      setAssignments(assignmentsResult);

      // Determine user role in this class
      if (classResult && user) {
        const role = getUserRoleInClass(classResult, user.id);
        setUserRole(role);
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  if (!classData) {
    return <NotFound />;
  }

  const handleBack = () => {
    navigate('/app/classes');
  };

  const handleCopyJoinCode = () => {
    navigator.clipboard.writeText(classData.join_code);
    // Add toast notification here
  };

  const handleCreateFolder = () => {
    setShowCreateFolderModal(true);
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab classData={classData} assignments={assignments} />;
      case 'folders':
        if (userRole === 'teacher') {
          return <FoldersTabTeacher onCreateFolder={handleCreateFolder} />;
        } else {
          return <FoldersTabStudent />;
        }
      case 'assignments':
        if (userRole === 'teacher') {
          return <AssignmentsTabTeacher assignments={assignments} />;
        } else {
          return <AssignmentsTabStudent assignments={assignments} />;
        }
      case 'members':
        return <MembersTab classData={classData} />;
      case 'progress':
        return <ProgressTab classData={classData} />;
      default:
        return <OverviewTab classData={classData} assignments={assignments} />;
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Header */}
      <ClassHeader 
        classData={classData}
        onBack={handleBack}
        onCopyJoinCode={handleCopyJoinCode}
        userRole={userRole}
      />

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ClassTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={userRole}
        />
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {showCreateFolderModal && (
          <CreateFolderModal
            onClose={() => setShowCreateFolderModal(false)}
            onSubmit={(folderData) => {
              console.log('Create folder:', folderData);
              setShowCreateFolderModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassDetail; 