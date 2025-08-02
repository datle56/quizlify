export interface Card {
    id: string
    term: string
    definition: string
}

export interface QuizSet {
    id: string
    title: string
    description: string
    termCount: number
    creator: string
    userId: string
    createdAt: string
    color: string
    cards: Card[]
    is_public: boolean
    language_from: string
    language_to: string
    folderId?: string
    classId?: string
    tags?: string[]
    difficulty?: "beginner" | "intermediate" | "advanced"
    subject?: string
}

export type ViewMode =
    | "dashboard"
    | "quizDetail"
    | "flashcardStudy"
    | "createSet"

export interface Folder {
    id: string
    name: string
    description?: string
    color: string
    icon: string
    parentId?: string
    userId: string
    classId?: string
    createdAt: string
    updatedAt: string
    studySetCount: number
    isSmartFolder?: boolean
    smartRules?: SmartFolderRule[]
    permissions?: FolderPermissions
    type?: "personal" | "class" | "assignment" | "resource" | "test" | "topic"
}

export interface SmartFolderRule {
    id: string
    type:
        | "subject"
        | "difficulty"
        | "lastStudied"
        | "progress"
        | "creator"
        | "tags"
    operator: "equals" | "contains" | "greaterThan" | "lessThan" | "in"
    value: string | number | string[]
}

export interface FolderPermissions {
    canView: boolean
    canEdit: boolean
    canAddSets: boolean
    canManage: boolean
}

export interface Class {
    id: string
    name: string
    description: string
    subject: string
    school?: string
    teacherId: string
    teacherName: string
    joinCode: string
    isPublic: boolean
    allowStudentSets: boolean
    bannerImage?: string
    createdAt: string
    updatedAt: string
    memberCount: number
    studySetCount: number
    folders: Folder[]
}

export interface ClassMember {
    id: string
    userId: string
    classId: string
    role: "teacher" | "student"
    joinedAt: string
    user: {
        id: string
        username: string
        email: string
        avatar: string
    }
}

export interface Assignment {
    id: string
    name: string
    description: string
    classId: string
    folderId?: string
    studySetIds: string[]
    dueDate?: string
    type: "practice" | "graded" | "review"
    allowRetakes: boolean
    showAnswers: boolean
    createdAt: string
    createdBy: string
    completionStats: {
        total: number
        completed: number
        averageScore?: number
    }
}
