import { useState, useEffect } from 'react';
import { getAuthToken, BASE_URL } from '../utils/api';
import { Folder, QuizSet } from '../types';

interface FolderDetailResponse {
  folder: {
    name: string;
    description: string;
    color: string;
    icon: string;
    id: number;
    user_id: number;
    position: number;
    study_sets_count: number;
    created_at: string;
    updated_at: string;
    is_public: boolean;
  };
  study_sets: any[];
  total: number;
}

interface StudySetResponse {
  title: string;
  description: string;
  is_public: boolean;
  language_from: string;
  language_to: string;
  color: string;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  terms_count: number;
  views_count: number;
  favorites_count: number;
  average_rating: number;
  user: {
    id: number;
    last_name: string;
    first_name: string;
    avatar_url: string | null;
  };
}

interface FolderStudySetResponse {
  id: number;
  title: string;
  description: string;
  terms_count: number;
  color: string;
  added_at: string;
  is_public: boolean;
}

const mapApiStudySetToAppStudySet = (apiStudySet: StudySetResponse): QuizSet => {
  return {
    id: apiStudySet.id.toString(),
    title: apiStudySet.title,
    description: apiStudySet.description,
    termCount: apiStudySet.terms_count,
    creator: `${apiStudySet.user.first_name} ${apiStudySet.user.last_name}`,
    userId: apiStudySet.user_id.toString(),
    createdAt: apiStudySet.created_at,
    color: apiStudySet.color,
    cards: [],
    is_public: apiStudySet.is_public,
    language_from: apiStudySet.language_from,
    language_to: apiStudySet.language_to,
    average_rating: apiStudySet.average_rating,
    views_count: apiStudySet.views_count,
    favorites_count: apiStudySet.favorites_count,
    progress: 0, // Default progress, can be updated later
  };
};

const mapFolderStudySetToAppStudySet = (folderStudySet: FolderStudySetResponse): QuizSet => {
  return {
    id: folderStudySet.id.toString(),
    title: folderStudySet.title,
    description: folderStudySet.description,
    termCount: folderStudySet.terms_count,
    creator: 'Unknown', // Folder study sets don't include user info
    userId: '0', // Default user ID
    createdAt: folderStudySet.added_at,
    color: folderStudySet.color,
    cards: [],
    is_public: folderStudySet.is_public || true, // Use API value or default to public
    language_from: '', // Default empty
    language_to: '', // Default empty
    average_rating: 0, // Default rating
    views_count: 0, // Default views
    favorites_count: 0, // Default favorites
    progress: 0, // Default progress
  };
};

const mapApiFolderToAppFolder = (apiFolder: any): Folder => {
  return {
    id: apiFolder.id.toString(),
    name: apiFolder.name,
    description: apiFolder.description || '',
    color: apiFolder.color || 'bg-blue-500',
    icon: apiFolder.icon || '📁',
    userId: apiFolder.user_id.toString(),
    studySetCount: apiFolder.study_sets_count || 0,
    createdAt: apiFolder.created_at,
    updatedAt: apiFolder.updated_at,
    isPublic: apiFolder.is_public || false,
    type: 'personal',
    isSmartFolder: false,
  };
};

export const useFolderDetail = (folderId: string) => {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [studySets, setStudySets] = useState<QuizSet[]>([]);
  const [userStudySets, setUserStudySets] = useState<QuizSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      
      const response = await fetch(`${BASE_URL}/folders/${folderId}/study-sets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch folder detail');
      }

      const data: FolderDetailResponse = await response.json();
      
      const mappedFolder = mapApiFolderToAppFolder(data.folder);
      const mappedStudySets = data.study_sets.map(mapFolderStudySetToAppStudySet);
      
      setFolder(mappedFolder);
      setStudySets(mappedStudySets);
    } catch (error) {
      console.error('Error fetching folder detail:', error);
      setError('Failed to load folder details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStudySets = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/study-sets/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user study sets');
      }

      const data: StudySetResponse[] = await response.json();
      const mappedStudySets = data.map(mapApiStudySetToAppStudySet);
      setUserStudySets(mappedStudySets);
    } catch (error) {
      console.error('Error fetching user study sets:', error);
    }
  };

  const addStudySetToFolder = async (studySetId: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/folders/${folderId}/study-sets/${studySetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add study set to folder');
      }

      // Reload folder detail after adding study set
      await fetchFolderDetail();
      return true;
    } catch (error) {
      console.error('Error adding study set to folder:', error);
      return false;
    }
  };

  useEffect(() => {
    if (folderId) {
      fetchFolderDetail();
      fetchUserStudySets();
    }
  }, [folderId]);

  return {
    folder,
    studySets,
    userStudySets,
    loading,
    error,
    fetchFolderDetail,
    addStudySetToFolder,
  };
}; 