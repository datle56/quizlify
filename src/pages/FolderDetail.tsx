import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useFolderDetail } from '../hooks/useFolderDetail';
import { useThemeStore } from '../store/themeStore';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from '../components/NotFound';
import { 
  FolderHeader, 
  FolderStats, 
  FolderToolbar, 
  StudySetList, 
  AddStudySetModal, 
  RemoveConfirmModal 
} from './Folder';
import { getAuthToken, BASE_URL } from '../utils/api';

const FolderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    folder, 
    studySets, 
    userStudySets, 
    loading, 
    error, 
    addStudySetToFolder 
  } = useFolderDetail(id!);
  const { isDarkMode } = useThemeStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showAddStudySetModal, setShowAddStudySetModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<{ setId: string; setName: string } | null>(null);
  const [removingSetId, setRemovingSetId] = useState<string | null>(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !folder) {
    return <NotFound />;
  }

  const handleAddStudySet = async (studySetId: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/folders/${id}/study-sets/${studySetId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage('Đã thêm bộ học vào thư mục thành công!');
        setShowSuccessToast(true);
        setShowAddStudySetModal(false);
        
        // Refresh the folder data
        window.location.reload();
        
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 3000);
      } else {
        throw new Error('Failed to add study set to folder');
      }
    } catch (error) {
      console.error('Error adding study set to folder:', error);
      setSuccessMessage('Có lỗi xảy ra khi thêm bộ học!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const handleRemoveStudySet = async (studySetId: string) => {
    if (!showRemoveConfirm) return;
    
    setRemovingSetId(studySetId);
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/folders/${id}/study-sets/${studySetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage(`Đã xóa "${showRemoveConfirm.setName}" khỏi thư mục!`);
        setShowSuccessToast(true);
        setShowRemoveConfirm(null);
        
        // Refresh the folder data
        window.location.reload();
        
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 3000);
      } else {
        throw new Error('Failed to remove study set from folder');
      }
    } catch (error) {
      console.error('Error removing study set from folder:', error);
      setSuccessMessage('Có lỗi xảy ra khi xóa bộ học!');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } finally {
      setRemovingSetId(null);
    }
  };

  const handleTogglePublic = async (isPublic: boolean) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/folders/${id}/public`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_public: isPublic }),
      });

      if (response.ok) {
        setSuccessMessage(`Thư mục đã được ${isPublic ? 'công khai' : 'riêng tư'}!`);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        
        // Refresh the folder data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error toggling folder public status:', error);
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit folder');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share folder');
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download folder');
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete folder');
  };

  const handleSettings = () => {
    // TODO: Implement settings functionality
    console.log('Folder settings');
  };

  const handleCreateSubFolder = () => {
    // TODO: Implement create sub folder functionality
    console.log('Create sub folder');
  };

  const handleMove = () => {
    // TODO: Implement move functionality
    console.log('Move items');
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  // Filter and sort study sets
  const filteredStudySets = studySets
    .filter(set => 
      set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'terms':
          return b.termCount - a.termCount;
        case 'views':
          return (b.views_count || 0) - (a.views_count || 0);
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0);
        default:
          return 0;
      }
    });

  // Filter out already added study sets from userStudySets
  const availableStudySets = userStudySets.filter(userSet => 
    !studySets.some(folderSet => folderSet.id === userSet.id)
  );

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
              isDarkMode 
                ? 'bg-green-800 text-white border-green-600' 
                : 'bg-green-100 text-green-800 border-green-300'
            } border`}
          >
            <CheckCircle className="h-5 w-5" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folder Header */}
      <FolderHeader
        folder={folder}
        onTogglePublic={handleTogglePublic}
        onEdit={handleEdit}
        onShare={handleShare}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onSettings={handleSettings}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Folder Stats */}
        <FolderStats studySets={studySets} />

        {/* Toolbar */}
        <FolderToolbar
          viewMode={viewMode}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onViewModeChange={setViewMode}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onAddStudySet={() => setShowAddStudySetModal(true)}
          onCreateSubFolder={handleCreateSubFolder}
          onMove={handleMove}
        />

        {/* Study Sets */}
        <StudySetList
          studySets={filteredStudySets}
          viewMode={viewMode}
          onRemoveStudySet={(setId, setName) => setShowRemoveConfirm({ setId, setName })}
          removingSetId={removingSetId}
        />
      </div>

      {/* Add Study Set Modal */}
      <AddStudySetModal
        isOpen={showAddStudySetModal}
        onClose={() => setShowAddStudySetModal(false)}
        availableStudySets={availableStudySets}
        onAddStudySet={handleAddStudySet}
      />

      {/* Remove Confirmation Modal */}
      <RemoveConfirmModal
        isOpen={!!showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(null)}
        onConfirm={() => showRemoveConfirm && handleRemoveStudySet(showRemoveConfirm.setId)}
        studySetName={showRemoveConfirm?.setName || ''}
        isRemoving={!!removingSetId}
      />
    </div>
  );
};

export default FolderDetail;