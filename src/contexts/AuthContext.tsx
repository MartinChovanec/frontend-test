'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    // API call simulation 
    if (email === 'test@test.com' && password === 'test123') {
      const userData = {
        id: '1',
        email,
        name: 'Test User'
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      throw new Error('Neplatné přihlašovací údaje')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth musí být použit uvnitř AuthProvider')
  }
  return context
} 