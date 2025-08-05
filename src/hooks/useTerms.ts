import { useState, useEffect } from 'react';
import { Term } from '../types';
import { apiRequest, getAuthToken } from '../utils/api';

export const useTerms = (studySetId: string | undefined) => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
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

        const data = await apiRequest<Term[]>(
          `/study-sets/${studySetId}/terms/`,
          {
            method: 'GET',
          },
          token
        );

        // Sort terms by position
        const sortedTerms = data.sort((a, b) => a.position - b.position);
        setTerms(sortedTerms);
      } catch (err) {
        console.error('Error fetching terms:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch terms');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [studySetId]);

  return {
    terms,
    loading,
    error
  };
}; 