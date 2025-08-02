import React, { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react"
import { Link } from "react-router-dom"

import { useAuthStore } from "../../store/authStore"
import { useNavigate } from "react-router-dom"

const SignupForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
        subscribeNewsletter: true,
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuthStore()
    const navigate = useNavigate()

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required"
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required"
        }

        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password =
                "Password must contain uppercase, lowercase, and number"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms =
                "You must agree to the terms and conditions"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        setIsLoading(true)
        try {
            const success = await register({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
            })
            setIsLoading(false)
            if (success) {
                navigate("/login", {
                    state: {
                        email: formData.email,
                        password: formData.password,
                    },
                })
            } else {
                setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." })
            }
        } catch (error) {
            setIsLoading(false)
            setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    const passwordStrength = () => {
        const password = formData.password
        let strength = 0

        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++

        return strength
    }

    const getStrengthColor = () => {
        const strength = passwordStrength()
        if (strength <= 2) return "bg-red-500"
        if (strength <= 3) return "bg-yellow-500"
        return "bg-green-500"
    }

    const getStrengthText = () => {
        const strength = passwordStrength()
        if (strength <= 2) return "Weak"
        if (strength <= 3) return "Medium"
        return "Strong"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full space-y-8"
            >
                {/* Header */}
                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 mb-8"
                    >
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                Q
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                            Quizlify
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Create your account
                    </h2>
                    <p className="text-gray-600">
                        Tham gia cùng hàng triệu học sinh đang học với Quizlify
                    </p>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6"
                >
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Họ
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        errors.firstName
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Nhập họ"
                                />
                            </div>
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Tên
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.lastName
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Nhập tên"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Địa chỉ Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.email
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Nhập email của bạn"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Tạo mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                                            style={{
                                                width: `${
                                                    (passwordStrength() / 5) *
                                                    100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {getStrengthText()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.confirmPassword
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Xác nhận mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <input
                                id="agreeToTerms"
                                name="agreeToTerms"
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                            />
                            <label
                                htmlFor="agreeToTerms"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                Tôi đồng ý với{" "}
                                <Link
                                    to="/terms"
                                    className="text-blue-600 hover:text-blue-500"
                                >
                                    Điều khoản dịch vụ
                                </Link>{" "}
                                và{" "}
                                <Link
                                    to="/privacy"
                                    className="text-blue-600 hover:text-blue-500"
                                >
                                    Chính sách bảo mật
                                </Link>
                            </label>
                        </div>
                        {errors.agreeToTerms && (
                            <p className="text-sm text-red-600">
                                {errors.agreeToTerms}
                            </p>
                        )}

                        <div className="flex items-start">
                            <input
                                id="subscribeNewsletter"
                                name="subscribeNewsletter"
                                type="checkbox"
                                checked={formData.subscribeNewsletter}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                            />
                            <label
                                htmlFor="subscribeNewsletter"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                Gửi cho tôi mẹo học tập và cập nhật sản phẩm
                                (tùy chọn)
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <span>Tạo tài khoản</span>
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>

                    {/* Benefits */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                            Những gì bạn nhận được với tài khoản miễn phí:
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li className="flex items-center">
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                                Tạo bộ học không giới hạn
                            </li>
                            <li className="flex items-center">
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                                Truy cập ứng dụng di động
                            </li>
                            <li className="flex items-center">
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                                Theo dõi tiến độ cơ bản
                            </li>
                        </ul>
                    </div>
                </motion.form>

                {/* Sign In Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center"
                >
                    <p className="text-gray-600">
                        Đã có tài khoản?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default SignupForm
