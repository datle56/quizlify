import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../utils/api"

const CreateStudySet: React.FC = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
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
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !description.trim()) {
            alert("Vui lòng nhập tiêu đề và mô tả")
            return
        }
        setIsSubmitting(true)
        try {
            const token = api.getAuthToken()
            if (!token) {
                console.log("Không có token, điều hướng về /login")
                navigate("/login")
                return
            }
            const data = await api.apiRequest<{ id: string }>(
                "/study-sets/",
                {
                    method: "POST",
                    body: JSON.stringify({
                        title: title.trim(),
                        description: description.trim(),
                        is_public: isPublic,
                        language_from: languageFrom,
                        language_to: languageTo,
                        color: selectedColor,
                    }),
                },
                token
            )
            console.log("Tạo bộ học thành công, điều hướng tới:", `/app/study-sets/${data.id}/add-terms`)
            navigate(`/app/study-sets/${data.id}/add-terms`)
        } catch (error: any) {
            // Xử lý lỗi 401 hoặc 403: token hết hạn hoặc không hợp lệ
            const status = error?.status || error?.response?.status
            if (status === 401 || status === 403) {
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                console.log("Token hết hạn hoặc không hợp lệ, điều hướng về /login")
                navigate("/login")
                return
            }
            console.log("Lỗi tạo bộ học:", error)
            // Có thể show toast hoặc notification ở đây nếu muốn UX tốt hơn
            // alert(
            //     error?.response?.data?.message ||
            //         "Tạo bộ học thất bại. Vui lòng thử lại."
            // )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Tạo bộ học mới
                </h1>
                <p className="text-gray-600 mb-6 text-center">
                    Nhập thông tin để bắt đầu tạo bộ học của bạn
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tiêu đề cho bộ học của bạn"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả *
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Mô tả nội dung của bộ học này"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Công khai
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="isPublic"
                                    checked={isPublic}
                                    onChange={() => setIsPublic(true)}
                                    className="mr-2"
                                />
                                Công khai
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="isPublic"
                                    checked={!isPublic}
                                    onChange={() => setIsPublic(false)}
                                    className="mr-2"
                                />
                                Riêng tư
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngôn ngữ Thuật ngữ (Term)
                            </label>
                            <input
                                type="text"
                                value={languageFrom}
                                onChange={e => setLanguageFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ví dụ: English, Vietnamese, ..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngôn ngữ Định nghĩa (Define)
                            </label>
                            <input
                                type="text"
                                value={languageTo}
                                onChange={e => setLanguageTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ví dụ: English, Vietnamese, ..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Màu chủ đề
                        </label>
                        <div className="flex space-x-2">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-8 h-8 rounded-full ${color} ${
                                        selectedColor === color
                                            ? "ring-2 ring-offset-2 ring-gray-400"
                                            : ""
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                    >
                        {isSubmitting ? "Đang tạo..." : "Tạo bộ học"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateStudySet
