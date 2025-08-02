import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Settings, Trophy, LogOut, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

const UserProfileDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const defaultAvatar =
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = () => {
        logout()
        setIsOpen(false)
        navigate("/")
    }

    const handleNavigation = (path: string) => {
        navigate(path)
        setIsOpen(false)
    }

    if (!user) return null

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={e => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <img
                    src={user.avatar || user.avatar_url || defaultAvatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                        {user.username || user.first_name || user.email}
                    </p>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={
                                        user.avatar ||
                                        user.avatar_url ||
                                        defaultAvatar
                                    }
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {user.username ||
                                            user.first_name ||
                                            user.email}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <button
                                onClick={() => handleNavigation("/app/profile")}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                            >
                                <User className="h-5 w-5 text-gray-500" />
                                <span className="text-gray-700">Hồ sơ</span>
                            </button>

                            <button
                                onClick={() =>
                                    handleNavigation("/app/analytics")
                                }
                                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                            >
                                <Trophy className="h-5 w-5 text-gray-500" />
                                <span className="text-gray-700">Thống kê</span>
                            </button>

                            <button
                                onClick={() =>
                                    handleNavigation("/app/settings")
                                }
                                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                            >
                                <Settings className="h-5 w-5 text-gray-500" />
                                <span className="text-gray-700">Cài đặt</span>
                            </button>
                        </div>

                        {/* Achievements Preview */}
                        <div className="px-4 py-3 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-500 mb-2">
                                Thành tích gần đây
                            </p>
                            <div className="flex space-x-1">
                                {Array.isArray(user.achievements) &&
                                    user.achievements
                                        .filter(a => a.unlocked)
                                        .slice(0, 4)
                                        .map(achievement => (
                                            <span
                                                key={achievement.id}
                                                className="text-lg"
                                                title={achievement.title}
                                            >
                                                {achievement.badge}
                                            </span>
                                        ))}
                            </div>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 pt-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-red-50 transition-colors text-red-600"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default UserProfileDropdown
