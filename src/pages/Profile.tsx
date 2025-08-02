import React from "react"
import { motion } from "framer-motion"
import { Calendar, Award, Clock, Target, TrendingUp } from "lucide-react"
import { useUserStore } from "../store/userStore"

const Profile: React.FC = () => {
    const { user, performanceStats } = useUserStore()

    if (!user) return null

    const unlockedAchievements = Array.isArray(user.achievements)
        ? user.achievements.filter(a => a.unlocked)
        : []
    const lockedAchievements = Array.isArray(user.achievements)
        ? user.achievements.filter(a => !a.unlocked)
        : []

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
                >
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {user.username}
                            </h1>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-500">
                                    Joined{" "}
                                    {new Date(
                                        user.joinDate
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Math.floor(
                                        (performanceStats?.totalStudyTime ||
                                            0) / 60
                                    )}
                                    h
                                </p>
                                <p className="text-gray-600">Study Time</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center">
                            <Target className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Math.round(
                                        (performanceStats?.correctRate || 0) *
                                            100
                                    )}
                                    %
                                </p>
                                <p className="text-gray-600">Accuracy</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center">
                            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {performanceStats?.dailyStreak || 0}
                                </p>
                                <p className="text-gray-600">Day Streak</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center">
                            <Award className="h-8 w-8 text-yellow-600 mr-3" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {unlockedAchievements.length}
                                </p>
                                <p className="text-gray-600">Achievements</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Achievements
                    </h2>

                    {/* Unlocked Achievements */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Unlocked ({unlockedAchievements.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {unlockedAchievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg"
                                >
                                    <span className="text-2xl">
                                        {achievement.badge}
                                    </span>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {achievement.title}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {achievement.description}
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            Unlocked{" "}
                                            {new Date(
                                                achievement.date
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Locked Achievements */}
                    {lockedAchievements.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Locked ({lockedAchievements.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {lockedAchievements.map(achievement => (
                                    <div
                                        key={achievement.id}
                                        className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
                                    >
                                        <span className="text-2xl grayscale">
                                            {achievement.badge}
                                        </span>
                                        <div>
                                            <p className="font-medium text-gray-700">
                                                {achievement.title}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Study Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Study Preferences
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">
                                Language
                            </h3>
                            <p className="text-gray-600 capitalize">
                                {user.preferences?.language || "N/A"}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">
                                Theme
                            </h3>
                            <p className="text-gray-600">
                                {user.preferences?.darkMode ? "Dark" : "Light"}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">
                                Notifications
                            </h3>
                            <p className="text-gray-600">
                                {user.preferences?.notifications
                                    ? "Enabled"
                                    : "Disabled"}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">
                                Study Reminders
                            </h3>
                            <p className="text-gray-600">
                                {user.preferences?.studyReminders
                                    ? "Enabled"
                                    : "Disabled"}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Profile
