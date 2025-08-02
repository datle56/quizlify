import React from 'react';
import { Users, Calendar } from 'lucide-react';
import { QuizSet } from '../types';

interface QuizCardProps {
  quizSet: QuizSet;
  onClick: (id: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quizSet, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
      onClick={() => onClick(quizSet.id)}
    >
      <div className={`h-3 ${quizSet.color}`}></div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {quizSet.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {quizSet.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-700">
              {quizSet.termCount} từ
            </span>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{quizSet.creator}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(quizSet.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;