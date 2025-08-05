import { useState, useEffect } from 'react';
import { apiRequest, getAuthToken } from '../utils/api';

interface User {
  id: number;
  last_name: string;
  first_name: string;
  avatar_url: string;
}

interface QuizSetDetail {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  language_from: string;
  language_to: string;
  color: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  terms_count: number;
  views_count: number;
  favorites_count: number;
  average_rating: number;
  user: User;
}

export const useQuizSetDetail = (studySetId: string | undefined) => {
  const [quizSet, setQuizSet] = useState<QuizSetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizSetDetail = async () => {
      if (!studySetId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const data = await apiRequest<QuizSetDetail>(
          `/study-sets/${studySetId}/`,
          {
            method: 'GET',
          },
          token
        );

        setQuizSet(data);
      } catch (err) {
        console.error('Error fetching quiz set detail:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch quiz set detail');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizSetDetail();
  }, [studySetId]);

  return {
    quizSet,
    loading,
    error
  };
}; 