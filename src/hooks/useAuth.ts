import { useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import { getAuthToken } from "../utils/api"

export const useAuth = () => {
    const { isAuthenticated, isLoading, autoLogin, hasAttemptedAutoLogin } = useAuthStore()

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
        isAuthenticated,
        isLoading,
        getToken,
        isTokenValid,
    }
} 