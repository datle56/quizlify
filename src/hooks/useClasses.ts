import { useState, useEffect } from 'react';
import { apiRequest, getAuthToken } from '../utils/api';

export interface Class {
  id: number;
  name: string;
  description: string;
  subject?: string;
  school?: string;
  teacher_id: number;
  join_code: string;
  created_at: string;
  is_active: boolean;
  member_count?: number;
  study_set_count?: number;
  teacher?: {
    id: number;
    last_name: string;
    first_name: string;
    avatar_url: string | null;
  };
  members?: ClassMember[];
  study_sets?: any[];
}

export interface ClassMember {
  id: number;
  class_id: number;
  user_id: number;
  role: 'teacher' | 'student';
  joined_at: string;
  user: {
    id: number;
    last_name: string;
    first_name: string;
    avatar_url: string | null;
  };
}

export interface Assignment {
  id: number;
  class_id: number;
  study_set_id: number;
  assigned_at: string;
  due_date?: string;
  is_optional: boolean;
  study_set: {
    id: number;
    title: string;
    description: string;
    terms_count: number;
  };
}

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const data = await apiRequest<Class[]>('/classes/', {
        method: 'GET'
      }, token);
      
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const createClass = async (classData: {
    name: string;
    description: string;
    subject?: string;
    school?: string;
  }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const data = await apiRequest<Class>('/classes/', {
        method: 'POST',
        body: JSON.stringify(classData)
      }, token);

      setClasses(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  };

  const joinClass = async (joinCode: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const data = await apiRequest<Class>('/classes/join', {
        method: 'POST',
        body: JSON.stringify({ join_code: joinCode })
      }, token);

      // Refresh classes list after joining
      await fetchClasses();
      return data;
    } catch (error) {
      console.error('Error joining class:', error);
      throw error;
    }
  };

  const getClassById = async (id: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const data = await apiRequest<Class>(`/classes/${id}`, {
        method: 'GET'
      }, token)

      return data;
    } catch (error) {
      console.error('Error fetching class details:', error);
      return null;
    }
  };

  const getClassAssignments = async (classId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const data = await apiRequest<Assignment[]>(`/classes/${classId}/assignments`, {
        method: 'GET'
      }, token);

      return data;
    } catch (error) {
      console.error('Error fetching class assignments:', error);
      return [];
    }
  };

  const getClassMembers = async (classId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const data = await apiRequest<ClassMember[]>(`/classes/${classId}/members`, {
        method: 'GET'
      }, token);

      return data;
    } catch (error) {
      console.error('Error fetching class members:', error);
      return [];
    }
  };

  const getClassProgress = async (classId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const data = await apiRequest<any>(`/classes/${classId}/progress`, {
        method: 'GET'
      }, token);

      return data;
    } catch (error) {
      console.error('Error fetching class progress:', error);
      return null;
    }
  };

  const assignStudySet = async (classId: string, studySetId: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const data = await apiRequest<any>(`/classes/${classId}/study-sets`, {
        method: 'POST',
        body: JSON.stringify({ study_set_id: studySetId })
      }, token);

      return data;
    } catch (error) {
      console.error('Error assigning study set:', error);
      throw error;
    }
  };

  const removeAssignment = async (classId: string, assignmentId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      await apiRequest(`/classes/${classId}/assignments/${assignmentId}`, {
        method: 'DELETE'
      }, token);

      // Refresh assignments
      const updatedAssignments = await getClassAssignments(classId);
      setAssignments(updatedAssignments);
    } catch (error) {
      console.error('Error removing assignment:', error);
      throw error;
    }
  };

  const updateClass = async (id: string, updates: Partial<Class>) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const data = await apiRequest<Class>(`/classes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      }, token);

      setClasses(prev => prev.map(cls => 
        cls.id === parseInt(id) ? data : cls
      ));

      return data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      await apiRequest(`/classes/${id}`, {
        method: 'DELETE'
      }, token);

      setClasses(prev => prev.filter(cls => cls.id !== parseInt(id)));
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  };

  // Helper function to determine user role in a class
  const getUserRoleInClass = (classData: Class, currentUserId: number): 'teacher' | 'student' | null => {
    if (!classData.members) return null;
    
    const member = classData.members.find(m => m.user_id === currentUserId);
    return member ? member.role : null;
  };

  return {
    classes,
    assignments,
    loading,
    createClass,
    joinClass,
    getClassById,
    getClassAssignments,
    getClassMembers,
    getClassProgress,
    assignStudySet,
    removeAssignment,
    updateClass,
    deleteClass,
    fetchClasses,
    getUserRoleInClass
  };
};