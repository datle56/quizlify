import { useState, useEffect } from 'react';
import { QuizSet } from '../types';
import { loadQuizSets, saveQuizSets } from '../utils/storage';

export const useQuizSets = () => {
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = () => {
      const stored = loadQuizSets();
      setQuizSets(stored);
      setLoading(false);
    };

    initializeData();
  }, []);

  const addQuizSet = (newQuizSet: QuizSet) => {
    const updatedSets = [...quizSets, newQuizSet];
    setQuizSets(updatedSets);
    saveQuizSets(updatedSets);
  };

  const updateQuizSet = (updatedQuizSet: QuizSet) => {
    const updatedSets = quizSets.map(set => 
      set.id === updatedQuizSet.id ? updatedQuizSet : set
    );
    setQuizSets(updatedSets);
    saveQuizSets(updatedSets);
  };

  const deleteQuizSet = (id: string) => {
    const updatedSets = quizSets.filter(set => set.id !== id);
    setQuizSets(updatedSets);
    saveQuizSets(updatedSets);
  };

  return {
    quizSets,
    loading,
    addQuizSet,
    updateQuizSet,
    deleteQuizSet
  };
};