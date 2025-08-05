import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiRequest } from "../utils/api"

export interface LoginUser {
    id: number
    first_name: string
    last_name: string
    email: string
    avatar_url: string | null
    receive_tips: boolean
    is_premium: boolean
    created_at: string
    updated_at: string
    last_active_at: string | null
    total_study_sets_created: number
    total_terms_learned: number
    role?: 'teacher' | 'student' | 'admin'
}

interface AuthState {
    user: LoginUser | null
    isAuthenticated: boolean
    isLoading: boolean
    hasAttemptedAutoLogin: boolean
    login: (email: string, password: string) => Promise<boolean>
    autoLogin: () => Promise<void>
    logout: () => void
    register: (data: {
        first_name: string
        last_name: string
        email: string
        password: string
    }) => Promise<boolean>
    getCurrentUser: () => Promise<LoginUser | null>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            hasAttemptedAutoLogin: false,

            login: async (email: string, password: string) => {
                try {
                    const data = await apiRequest<{
                        access_token: string
                        refresh_token: string
                    }>("/auth/login", {
                        method: "POST",
                        body: JSON.stringify({ email, password }),
                    })
                    localStorage.setItem("access_token", data.access_token)
                    localStorage.setItem("refresh_token", data.refresh_token)
                    // Get user info
                    const user = await apiRequest<any>(
                        "/users/me",
                        { method: "GET" },
                        data.access_token
                    )
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        hasAttemptedAutoLogin: false,
                    })
                    return true
                } catch (error) {
                    console.error("Login error:", error)
                    return false
                }
            },

            autoLogin: async () => {
                const state = get()
                if (state.hasAttemptedAutoLogin) {
                    return
                }

                set({ hasAttemptedAutoLogin: true })

                try {
                    const access_token = localStorage.getItem("access_token")
                    if (!access_token) {
                        set({
                            isLoading: false,
                            isAuthenticated: false,
                            user: null,
                        })
                        return
                    }

                    const user = await apiRequest<any>(
                        "/users/me",
                        { method: "GET" },
                        access_token
                    )
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                    })
                } catch (error: any) {
                    console.error("Auto login error:", error)
                    // Clear invalid tokens and set as not authenticated
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("refresh_token")
                    set({
                        isLoading: false,
                        isAuthenticated: false,
                        user: null,
                    })
                }
            },

            getCurrentUser: async () => {
                try {
                    const access_token = localStorage.getItem("access_token")
                    if (!access_token) {
                        return null
                    }

                    const user = await apiRequest<any>(
                        "/users/me",
                        { method: "GET" },
                        access_token
                    )
                    return user
                } catch (error) {
                    console.error("Error getting current user:", error)
                    return null
                }
            },
            
            // Add register method
            register: async (data: {
                first_name: string
                last_name: string
                email: string
                password: string
            }) => {
                try {
                    await apiRequest("/auth/register", {
                        method: "POST",
                        body: JSON.stringify(data),
                    })
                    return true
                } catch (error) {
                    return false
                }
            },

            logout: () => {
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    hasAttemptedAutoLogin: false,
                })
            },
        }),
        {
            name: "auth-storage",
        }
    )
)
