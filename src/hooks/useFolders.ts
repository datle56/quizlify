import { useState, useEffect } from 'react';
import { Folder, QuizSet } from '../types';

// Mock data for folders
const mockFolders: Folder[] = [
  {
    id: 'folder_1',
    name: 'Tiếng Anh',
    description: 'Tất cả bộ học tiếng Anh',
    color: 'bg-blue-500',
    icon: '🇺🇸',
    userId: 'user_001',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    studySetCount: 5,
    type: 'personal'
  },
  {
    id: 'folder_2',
    name: 'Khoa học',
    description: 'Sinh học, Hóa học, Vật lý',
    color: 'bg-green-500',
    icon: '🔬',
    userId: 'user_001',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-20',
    studySetCount: 3,
    type: 'personal'
  },
  {
    id: 'folder_3',
    name: 'Lịch sử',
    description: 'Lịch sử thế giới và Việt Nam',
    color: 'bg-purple-500',
    icon: '📚',
    userId: 'user_001',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25',
    studySetCount: 2,
    type: 'personal'
  },
  {
    id: 'folder_4',
    name: 'Bài tập tuần 1',
    description: 'Bài tập được giao trong tuần đầu tiên',
    color: 'bg-orange-500',
    icon: '📝',
    userId: 'user_001',
    classId: 'class_1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    studySetCount: 4,
    type: 'assignment'
  }
];

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFolders(mockFolders);
      setLoading(false);
    }, 500);
  }, []);

  const createFolder = (folderData: Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'studySetCount'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: `folder_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      studySetCount: 0
    };
    
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    setFolders(prev => prev.map(folder => 
      folder.id === id 
        ? { ...folder, ...updates, updatedAt: new Date().toISOString() }
        : folder
    ));
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
  };

  const moveStudySetToFolder = (studySetId: string, folderId: string | null) => {
    // This would typically update the study set's folderId
    console.log(`Moving study set ${studySetId} to folder ${folderId}`);
  };

  const getFolderById = (id: string) => {
    return folders.find(folder => folder.id === id);
  };

  const getFoldersByParent = (parentId?: string) => {
    return folders.filter(folder => folder.parentId === parentId);
  };

  const getPersonalFolders = () => {
    return folders.filter(folder => folder.type === 'personal' && !folder.classId);
  };

  const getClassFolders = (classId: string) => {
    return folders.filter(folder => folder.classId === classId);
  };

  return {
    folders,
    loading,
    createFolder,
    updateFolder,
    deleteFolder,
    moveStudySetToFolder,
    getFolderById,
    getFoldersByParent,
    getPersonalFolders,
    getClassFolders
  };
};