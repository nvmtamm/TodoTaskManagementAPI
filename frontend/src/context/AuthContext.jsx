import { createContext, useState, useCallback } from 'react'
import { apiService } from '../services/apiService'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const data = await apiService.login({ email, password })
      setToken(data.token)
      localStorage.setItem('token', data.token)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (fullName, email, password) => {
    setLoading(true)
    try {
      const data = await apiService.register({ fullName, email, password })
      setToken(data.token)
      localStorage.setItem('token', data.token)
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
