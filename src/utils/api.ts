// src/utils/api.ts

export const BASE_URL = "http://localhost:8000/api/v1"

// Utility function để lấy token từ localStorage
export const getAuthToken = (): string | null => {
    return localStorage.getItem("access_token")
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    authToken?: string
): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...options.headers,
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
    })
    if (!response.ok) {
        const errorText = await response.text()
        const error = new Error(errorText)
        ;(error as any).status = response.status
        throw error
    }
    return response.json()
}

export default {
    BASE_URL,
    apiRequest,
    getAuthToken,
}
