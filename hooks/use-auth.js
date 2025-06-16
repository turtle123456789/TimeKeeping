/**
 * Hook quản lý xác thực và vai trò người dùng
 */
"use client"

import { useState, useEffect } from "react"
import { getAuthToken } from "@/lib/api"
import api from "@/lib/api"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken()
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        const response = await api.get('/auth/me')
        setUser(response.data.data)
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const isSuperAdmin = () => {
    return user?.role === 'superadmin'
  }

  return {
    user,
    isLoading,
    isSuperAdmin
  }
} 