import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { getAuthToken, BASE_URL } from "../utils/api"
import { ArrowLeft, Plus, Trash2, Save, BookOpen, Info, CheckCircle } from "lucide-react"

interface Term {
    id?: number
    term: string
    definition: string
    image_url?: string
    audio_url?: string
    position?: number
    study_set_id?: number
    created_at?: string
    updated_at?: string
}

interface User {
    id: number
    last_name: string
    first_name: string
    avatar_url: string
}

interface StudySet {
    id: number
    title: string
    description: string
    is_public: boolean
    language_from: string
    language_to: string
    color: string | null
    user_id: number
    created_at: string
    updated_at: string
    terms_count: number
    views_count: number
    favorites_count: number
    average_rating: number
    user: User
    terms: Term[]
}

const AddTerms: React.FC = () => {
    const { studySetId } = useParams()
    const navigate = useNavigate()
    const [terms, setTerms] = useState<Term[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [studySet, setStudySet] = useState<StudySet | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [savingTerms, setSavingTerms] = useState<Set<number>>(new Set())

    useEffect(() => {
        const fetchStudySet = async () => {
            try {
                const token = getAuthToken()
                const response = await axios.get(`${BASE_URL}/study-sets/${studySetId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const data = response.data
                setStudySet(data)
                
                // Initialize terms with existing terms from the study set
                if (data.terms && data.terms.length > 0) {
                    setTerms(data.terms.map((term: Term) => ({
                        id: term.id,
                        term: term.term,
                        definition: term.definition,
                        image_url: term.image_url,
                        audio_url: term.audio_url,
                        position: term.position
                    })))
                } else {
                    // If no existing terms, start with 2 empty terms
                    setTerms([
                        { term: "", definition: "" },
                        { term: "", definition: "" },
                    ])
                }
            } catch (error) {
                console.error("Error fetching study set:", error)
            } finally {
                setLoading(false)
            }
        }

        if (studySetId) {
            fetchStudySet()
        }
    }, [studySetId])

    const addTerm = () => {
        setTerms([...terms, { term: "", definition: "" }])
    }
    
    const removeTerm = async (idx: number) => {
        const term = terms[idx]
        
        // If term has an ID, delete it from the server
        if (term.id) {
            try {
                const token = getAuthToken()
                await axios.delete(
                    `${BASE_URL}/study-sets/${studySetId}/terms/${term.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
            } catch (error) {
                console.error("Error deleting term:", error)
            }
        }
        
        if (terms.length > 2) {
            setTerms(terms.filter((_, i) => i !== idx))
        }
    }
    
    const updateTerm = async (
        idx: number,
        field: "term" | "definition",
        value: string
    ) => {
        const updatedTerms = terms.map((t, i) => (i === idx ? { ...t, [field]: value } : t))
        setTerms(updatedTerms)
        
        const term = updatedTerms[idx]
        
        // Check if both term and definition are filled
        if (term.term.trim() && term.definition.trim()) {
            // If term already has an ID, update it
            if (term.id) {
                await updateExistingTerm(idx, term)
            } else {
                // If term doesn't have an ID, create new term
                await createNewTerm(idx, term)
            }
        }
    }
    
    const createNewTerm = async (idx: number, term: Term) => {
        if (savingTerms.has(idx)) return // Prevent duplicate requests
        
        setSavingTerms(prev => new Set(prev).add(idx))
        
        try {
            const token = getAuthToken()
            const response = await axios.post(
                `${BASE_URL}/study-sets/${studySetId}/terms`,
                {
                    term: term.term.trim(),
                    definition: term.definition.trim(),
                    image_url: term.image_url || "",
                    audio_url: term.audio_url || ""
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            
            // Update the term with the response data
            const createdTerm = response.data
            setTerms(prev => prev.map((t, i) => 
                i === idx ? { ...t, ...createdTerm } : t
            ))
            
        } catch (error: any) {
            console.error("Error creating term:", error)
            alert(`Lỗi khi tạo thẻ: ${error?.response?.data?.message || "Vui lòng thử lại"}`)
        } finally {
            setSavingTerms(prev => {
                const newSet = new Set(prev)
                newSet.delete(idx)
                return newSet
            })
        }
    }
    
    const updateExistingTerm = async (idx: number, term: Term) => {
        if (savingTerms.has(idx)) return // Prevent duplicate requests
        
        setSavingTerms(prev => new Set(prev).add(idx))
        
        try {
            const token = getAuthToken()
            const response = await axios.put(
                `${BASE_URL}/study-sets/${studySetId}/terms/${term.id}`,
                {
                    term: term.term.trim(),
                    definition: term.definition.trim(),
                    image_url: term.image_url || "",
                    audio_url: term.audio_url || ""
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            
            // Update the term with the response data
            const updatedTerm = response.data
            setTerms(prev => prev.map((t, i) => 
                i === idx ? { ...t, ...updatedTerm } : t
            ))
            
        } catch (error: any) {
            console.error("Error updating term:", error)
            alert(`Lỗi khi cập nhật thẻ: ${error?.response?.data?.message || "Vui lòng thử lại"}`)
        } finally {
            setSavingTerms(prev => {
                const newSet = new Set(prev)
                newSet.delete(idx)
                return newSet
            })
        }
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validTerms = terms.filter(
            t => t.term.trim() && t.definition.trim()
        )
        if (validTerms.length < 2) {
            alert("Cần ít nhất 2 thẻ hoàn chỉnh")
            return
        }
        
        // Check if there are any unsaved terms
        const unsavedTerms = validTerms.filter(term => !term.id)
        if (unsavedTerms.length > 0) {
            alert("Vui lòng đợi tất cả thẻ được lưu trước khi tiếp tục")
            return
        }
        
        alert("Tất cả thẻ đã được lưu thành công!")
        navigate(`/app/quiz/${studySetId}`)
    }

    const handleBack = () => {
        navigate(`/app/quiz/${studySetId}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin bộ học...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Quay lại bộ học</span>
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            {studySet?.terms && studySet.terms.length > 0 ? "Chỉnh sửa thẻ" : "Thêm thẻ cho bộ học"}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {studySet?.terms && studySet.terms.length > 0 
                                ? "Chỉnh sửa từ và định nghĩa trong bộ học của bạn."
                                : "Bổ sung thêm từ và định nghĩa vào bộ học của bạn để tạo nội dung học tập phong phú hơn."
                            }
                        </p>
                    </div>
                </div>

                {/* Study Set Info */}
                {studySet && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className={`w-12 h-12 rounded-xl ${studySet.color || 'bg-blue-500'} flex items-center justify-center`}>
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {studySet.title}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {studySet.description}
                                </p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <span>Ngôn ngữ: {studySet.language_from} → {studySet.language_to}</span>
                                    <span>•</span>
                                    <span>{studySet.terms_count} thẻ</span>
                                    <span>•</span>
                                    <span>{studySet.views_count} lượt xem</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-3 rounded-xl">
                            <Info className="h-5 w-5" />
                            <span className="font-medium">
                                Thẻ sẽ được tự động lưu khi bạn nhập đầy đủ từ và định nghĩa
                            </span>
                        </div>
                    </div>
                )}

                {/* Add/Edit Terms Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Plus className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {studySet?.terms && studySet.terms.length > 0 ? "Chỉnh sửa thẻ" : "Thẻ mới"} ({terms.length})
                                </h2>
                                <p className="text-gray-600">
                                    {studySet?.terms && studySet.terms.length > 0 
                                        ? "Chỉnh sửa từ và định nghĩa hiện có"
                                        : "Thêm từ và định nghĩa mới"
                                    }
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={addTerm}
                            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Thêm thẻ</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-6">
                            {terms.map((term, idx) => (
                                <div
                                    key={idx}
                                    className={`border-2 rounded-xl p-6 transition-all duration-200 ${
                                        term.id 
                                            ? 'border-green-200 bg-green-50/50' 
                                            : 'border-gray-100 bg-gray-50/50 hover:border-green-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold ${
                                                term.id ? 'bg-green-600' : 'bg-gray-400'
                                            }`}>
                                                {idx + 1}
                                            </div>
                                            <span className="text-lg font-semibold text-gray-700">
                                                {term.id ? `Thẻ ${idx + 1} (Đã lưu)` : `Thẻ mới ${idx + 1}`}
                                            </span>
                                            {term.id && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center space-x-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    <span>Đã lưu</span>
                                                </span>
                                            )}
                                            {savingTerms.has(idx) && (
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                                    Đang lưu...
                                                </span>
                                            )}
                                        </div>
                                        {terms.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTerm(idx)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Từ / Thuật ngữ
                                            </label>
                                            <input
                                                type="text"
                                                value={term.term}
                                                onChange={e =>
                                                    updateTerm(
                                                        idx,
                                                        "term",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200"
                                                placeholder="Nhập từ hoặc thuật ngữ"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Định nghĩa / Giải thích
                                            </label>
                                            <input
                                                type="text"
                                                value={term.definition}
                                                onChange={e =>
                                                    updateTerm(
                                                        idx,
                                                        "definition",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200"
                                                placeholder="Nhập định nghĩa hoặc giải thích"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center space-x-3 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
                            >
                                <Save className="h-5 w-5" />
                                <span>
                                    {isSubmitting 
                                        ? "Đang kiểm tra..." 
                                        : "Hoàn thành"
                                    }
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddTerms