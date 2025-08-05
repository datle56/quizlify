import { useState, useEffect } from 'react';
import { getAuthToken, BASE_URL } from '../utils/api';
import { Folder } from '../types';

/**
 * Hàm này chuyển đổi dữ liệu thô từ API (snake_case)
 * sang định dạng mà ứng dụng React sử dụng (camelCase).
 */
const mapApiFolderToAppFolder = (apiFolder: any): Folder => {
  return {
    id: apiFolder.id.toString(),
    name: apiFolder.name,
    description: apiFolder.description || '',
    color: apiFolder.color || 'bg-blue-500',
    icon: apiFolder.icon || '📁',
    
    // ✨ Chuyển đổi snake_case sang camelCase
    userId: apiFolder.user_id,
    studySetCount: apiFolder.study_sets_count || 0,
    createdAt: apiFolder.created_at,
    updatedAt: apiFolder.updated_at,
    isPublic: apiFolder.is_public || false,

    // Các trường mà frontend cần nhưng API có thể không có
    type: 'personal',
    isSmartFolder: false,
    classId: undefined,
  };
};

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const response = await fetch(`${BASE_URL}/folders/user/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch folders');
        }

        const data = await response.json();
        
        // Sử dụng hàm map để chuẩn hóa dữ liệu
        const mappedFolders = data.map(mapApiFolderToAppFolder);
        setFolders(mappedFolders);

      } catch (error) {
        console.error('Error fetching folders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  const updateFolder = async (id: string, updates: Partial<Folder>) => {
    try {
      const token = getAuthToken();
      
      // Convert camelCase to snake_case for API
      const apiUpdates: any = {};
      if (updates.name !== undefined) apiUpdates.name = updates.name;
      if (updates.description !== undefined) apiUpdates.description = updates.description;
      if (updates.color !== undefined) apiUpdates.color = updates.color;
      if (updates.icon !== undefined) apiUpdates.icon = updates.icon;
      if (updates.isPublic !== undefined) apiUpdates.is_public = updates.isPublic;
      
      const response = await fetch(`${BASE_URL}/folders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(apiUpdates),
      });

      if (!response.ok) {
        throw new Error('Failed to update folder');
      }

      const updatedApiFolder = await response.json();
      // ✨ Tái sử dụng hàm map ở đây để đảm bảo dữ liệu luôn nhất quán
      const mappedUpdatedFolder = mapApiFolderToAppFolder(updatedApiFolder);

      setFolders(folders.map(folder =>
        folder.id === id ? mappedUpdatedFolder : folder
      ));
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/folders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      setFolders(folders.filter(folder => folder.id !== id));
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const getFolderById = (id: string): Folder | undefined => {
    return folders.find(folder => folder.id === id);
  };

  return { folders, loading, updateFolder, deleteFolder, setFolders, getFolderById };
};