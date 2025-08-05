import { useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import { getAuthToken } from "../utils/api"

export const useAuth = () => {
    const { user, isAuthenticated, isLoading, autoLogin, hasAttemptedAutoLogin } = useAuthStore()

    useEffect(() => {
        // Chỉ gọi autoLogin một lần khi chưa thử và không đang loading
        if (!hasAttemptedAutoLogin && !isLoading) {
            autoLogin()
        }
    }, [autoLogin, hasAttemptedAutoLogin, isLoading])

    const getToken = () => {
        return getAuthToken()
    }

    const isTokenValid = () => {
        const token = getToken()
        return !!token
    }

    return {
        user,
        isAuthenticated,
        isLoading,
        getToken,
        isTokenValid,
    }
} 