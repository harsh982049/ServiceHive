import { create } from 'zustand'

type User = { id: string; name: string; email: string } | null

type AuthState = {
  token: string | null
  user: User
  login: (token: string, user: NonNullable<User>) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  login: (token, user) => {
    localStorage.setItem('token', token)
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  }
}))
