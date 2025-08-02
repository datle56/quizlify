import { useState, useEffect } from 'react';
import { Class, ClassMember, Assignment } from '../types';

// Mock data for classes
const mockClasses: Class[] = [
  {
    id: 'class_1',
    name: 'Tiếng Anh 12A1',
    description: 'Lớp học tiếng Anh nâng cao cho học sinh lớp 12',
    subject: 'Tiếng Anh',
    school: 'THPT Nguyễn Huệ',
    teacherId: 'teacher_001',
    teacherName: 'Cô Nguyễn Thị Lan',
    joinCode: 'ENG12A1',
    isPublic: false,
    allowStudentSets: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20',
    memberCount: 35,
    studySetCount: 12,
    folders: []
  },
  {
    id: 'class_2',
    name: 'Sinh học cơ bản',
    description: 'Khóa học sinh học dành cho người mới bắt đầu',
    subject: 'Sinh học',
    teacherId: 'teacher_002',
    teacherName: 'Thầy Trần Văn Nam',
    joinCode: 'BIO101',
    isPublic: true,
    allowStudentSets: false,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-25',
    memberCount: 28,
    studySetCount: 8,
    folders: []
  }
];

const mockAssignments: Assignment[] = [
  {
    id: 'assignment_1',
    name: 'Từ vựng Unit 1-3',
    description: 'Ôn tập từ vựng các bài 1, 2, 3',
    classId: 'class_1',
    studySetIds: ['1', '2'],
    dueDate: '2024-02-15',
    type: 'practice',
    allowRetakes: true,
    showAnswers: true,
    createdAt: '2024-01-20',
    createdBy: 'teacher_001',
    completionStats: {
      total: 35,
      completed: 28,
      averageScore: 85
    }
  }
];

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClasses(mockClasses);
      setAssignments(mockAssignments);
      setLoading(false);
    }, 500);
  }, []);

  const createClass = (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'studySetCount' | 'folders'>) => {
    const newClass: Class = {
      ...classData,
      id: `class_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      memberCount: 1,
      studySetCount: 0,
      folders: []
    };
    
    setClasses(prev => [...prev, newClass]);
    return newClass;
  };

  const joinClass = (joinCode: string) => {
    const classToJoin = classes.find(c => c.joinCode === joinCode);
    if (classToJoin) {
      // In real app, this would add the user to the class
      setClasses(prev => prev.map(c => 
        c.id === classToJoin.id 
          ? { ...c, memberCount: c.memberCount + 1 }
          : c
      ));
      return classToJoin;
    }
    return null;
  };

  const updateClass = (id: string, updates: Partial<Class>) => {
    setClasses(prev => prev.map(cls => 
      cls.id === id 
        ? { ...cls, ...updates, updatedAt: new Date().toISOString() }
        : cls
    ));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
  };

  const createAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'completionStats'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assignment_${Date.now()}`,
      createdAt: new Date().toISOString(),
      completionStats: {
        total: 0,
        completed: 0
      }
    };
    
    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  };

  const getClassById = (id: string) => {
    return classes.find(cls => cls.id === id);
  };

  const getClassAssignments = (classId: string) => {
    return assignments.filter(assignment => assignment.classId === classId);
  };

  return {
    classes,
    assignments,
    loading,
    createClass,
    joinClass,
    updateClass,
    deleteClass,
    createAssignment,
    getClassById,
    getClassAssignments
  };
};