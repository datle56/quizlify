import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Trash2, Save, BookOpen, Palette, Globe } from "lucide-react"
import { Card, QuizSet } from "../types"
import { useQuizSets } from "../hooks/useQuizSets"
import { generateId, getCurrentUserId } from "../utils/storage"

const CreateSet: React.FC = () => {
    const navigate = useNavigate()
    const { addQuizSet } = useQuizSets()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [cards, setCards] = useState<Card[]>([
        { id: generateId(), term: "", definition: "" },
        { id: generateId(), term: "", definition: "" },
    ])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isPublic, setIsPublic] = useState(true)
    const [languageFrom, setLanguageFrom] = useState("")
    const [languageTo, setLanguageTo] = useState("")

    const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-indigo-500",
        "bg-red-500",
        "bg-yellow-500",
        "bg-pink-500",
        "bg-teal-500",
    ]
    const [selectedColor, setSelectedColor] = useState(colors[0])

    const handleBack = () => {
        navigate("/app")
    }

    const addCard = () => {
        setCards([...cards, { id: generateId(), term: "", definition: "" }])
    }

    const removeCard = (id: string) => {
        if (cards.length > 2) {
            setCards(cards.filter(card => card.id !== id))
        }
    }

    const updateCard = (
        id: string,
        field: "term" | "definition",
        value: string
    ) => {
        setCards(
            cards.map(card =>
                card.id === id ? { ...card, [field]: value } : card
            )
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !description.trim()) {
            alert("Please fill in title and description")
            return
        }

        const validCards = cards.filter(
            card => card.term.trim() && card.definition.trim()
        )

        if (validCards.length < 2) {
            alert("Please create at least 2 complete cards")
            return
        }

        setIsSubmitting(true)

        try {
            const newQuizSet: QuizSet = {
                id: generateId(),
                title: title.trim(),
                description: description.trim(),
                termCount: validCards.length,
                creator: "You",
                userId: getCurrentUserId(),
                createdAt: new Date().toISOString().split("T")[0],
                color: selectedColor,
                cards: validCards,
                is_public: isPublic,
                language_from: languageFrom,
                language_to: languageTo,
            }

            addQuizSet(newQuizSet)
            navigate(`/app/quiz/${newQuizSet.id}`)
        } catch (error) {
            console.error("Error creating quiz set:", error)
            alert("Error creating quiz set. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={handleBack}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Quay lại trang chủ</span>
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Tạo bộ học mới
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Thêm từ và định nghĩa để tạo bộ thẻ ghi nhớ của bạn. Tạo nội dung học tập chất lượng để nâng cao kiến thức.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                Thông tin bộ học
                            </h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-semibold text-gray-700 mb-3"
                                >
                                    Tiêu đề *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Nhập tiêu đề cho bộ học của bạn"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-semibold text-gray-700 mb-3"
                                >
                                    Mô tả *
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={e =>
                                        setDescription(e.target.value)
                                    }
                                    rows={4}
                                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none"
                                    placeholder="Mô tả chi tiết nội dung của bộ học này"
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Công khai
                                    </label>
                                    <div className="flex items-center space-x-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="isPublic"
                                                checked={isPublic}
                                                onChange={() => setIsPublic(true)}
                                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 font-medium">Công khai</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="isPublic"
                                                checked={!isPublic}
                                                onChange={() => setIsPublic(false)}
                                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 font-medium">Riêng tư</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Màu chủ đề
                                    </label>
                                    <div className="flex space-x-3">
                                        {colors.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedColor(color)
                                                }
                                                className={`w-10 h-10 rounded-full ${color} transition-all duration-200 ${
                                                    selectedColor === color
                                                        ? "ring-4 ring-offset-2 ring-blue-400 scale-110"
                                                        : "hover:scale-105"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="languageFrom"
                                        className="block text-sm font-semibold text-gray-700 mb-3"
                                    >
                                        <Globe className="inline h-4 w-4 mr-2" />
                                        Ngôn ngữ Thuật ngữ (Term)
                                    </label>
                                    <input
                                        type="text"
                                        id="languageFrom"
                                        value={languageFrom}
                                        onChange={e =>
                                            setLanguageFrom(e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                        placeholder="Ví dụ: English, Vietnamese, ..."
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="languageTo"
                                        className="block text-sm font-semibold text-gray-700 mb-3"
                                    >
                                        <Globe className="inline h-4 w-4 mr-2" />
                                        Ngôn ngữ Định nghĩa (Define)
                                    </label>
                                    <input
                                        type="text"
                                        id="languageTo"
                                        value={languageTo}
                                        onChange={e =>
                                            setLanguageTo(e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                        placeholder="Ví dụ: English, Vietnamese, ..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Plus className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Thẻ học ({cards.length})
                                    </h2>
                                    <p className="text-gray-600">Thêm từ và định nghĩa cho bộ học</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addCard}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Thêm thẻ</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {cards.map((card, index) => (
                                <div
                                    key={card.id}
                                    className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 transition-all duration-200 bg-gray-50/50"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                                                {index + 1}
                                            </div>
                                            <span className="text-lg font-semibold text-gray-700">
                                                Thẻ {index + 1}
                                            </span>
                                        </div>
                                        {cards.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeCard(card.id)
                                                }
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
                                                value={card.term}
                                                onChange={e =>
                                                    updateCard(
                                                        card.id,
                                                        "term",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                                placeholder="Nhập từ hoặc thuật ngữ"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Định nghĩa / Giải thích
                                            </label>
                                            <input
                                                type="text"
                                                value={card.definition}
                                                onChange={e =>
                                                    updateCard(
                                                        card.id,
                                                        "definition",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                                placeholder="Nhập định nghĩa hoặc giải thích"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end space-x-4 pt-6">
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
                            className="flex items-center space-x-3 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
                        >
                            <Save className="h-5 w-5" />
                            <span>
                                {isSubmitting ? "Đang tạo..." : "Tạo bộ học"}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateSet