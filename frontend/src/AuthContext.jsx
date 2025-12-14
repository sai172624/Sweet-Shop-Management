import { createContext, useState } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user'))
  )

  const [token, setToken] = useState(
    localStorage.getItem('token')
  )

  const login = (userData, tokenData) => {
    // 🔥 STORE EVERYTHING
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', tokenData)

    setUser(userData)
    setToken(tokenData)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
