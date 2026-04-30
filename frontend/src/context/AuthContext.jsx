import { createContext, useState, useCallback } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!response.ok) throw new Error('Login failed')
      const data = await response.json()
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      })
      if (!response.ok) throw new Error('Registration failed')
      const data = await response.json()
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
