import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Card, QuizSet } from '../types';
import { useQuizSets } from '../hooks/useQuizSets';
import { generateId, getCurrentUserId } from '../utils/storage';

const CreateSet: React.FC = () => {
  const navigate = useNavigate();
  const { addQuizSet } = useQuizSets();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<Card[]>([
    { id: generateId(), term: '', definition: '' },
    { id: generateId(), term: '', definition: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-teal-500'
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleBack = () => {
    navigate('/app');
  };

  const addCard = () => {
    setCards([...cards, { id: generateId(), term: '', definition: '' }]);
  };

  const removeCard = (id: string) => {
    if (cards.length > 2) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const updateCard = (id: string, field: 'term' | 'definition', value: string) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert('Please fill in title and description');
      return;
    }

    const validCards = cards.filter(card => card.term.trim() && card.definition.trim());
    
    if (validCards.length < 2) {
      alert('Please create at least 2 complete cards');
      return;
    }

    setIsSubmitting(true);

    try {
      const newQuizSet: QuizSet = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        termCount: validCards.length,
        creator: 'You',
        userId: getCurrentUserId(),
        createdAt: new Date().toISOString().split('T')[0],
        color: selectedColor,
        cards: validCards
      };

      addQuizSet(newQuizSet);
      navigate(`/app/quiz/${newQuizSet.id}`);
    } catch (error) {
      console.error('Error creating quiz set:', error);
      alert('Error creating quiz set. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại trang chủ</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Tạo bộ học mới</h1>
          <p className="text-gray-600 mt-2">Thêm từ và định nghĩa để tạo bộ thẻ ghi nhớ của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin bộ học</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề cho bộ học của bạn"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả nội dung của bộ học này"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu chủ đề
                </label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full ${color} ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Thẻ ({cards.length})
              </h2>
              <button
                type="button"
                onClick={addCard}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm thẻ</span>
              </button>
            </div>

            <div className="space-y-4">
              {cards.map((card, index) => (
                <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">Thẻ {index + 1}</span>
                    {cards.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeCard(card.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Từ
                      </label>
                      <input
                        type="text"
                        value={card.term}
                        onChange={(e) => updateCard(card.id, 'term', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập từ"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Định nghĩa
                      </label>
                      <input
                        type="text"
                        value={card.definition}
                        onChange={(e) => updateCard(card.id, 'definition', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập định nghĩa"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Đang tạo...' : 'Tạo bộ học'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSet;