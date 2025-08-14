"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, Session } from "@supabase/supabase-js"
import {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  resetPassword,
  getCurrentUser,
  getCurrentSession,
  onAuthStateChange,
  type AuthResult,
  type SignUpData,
  type SignInData,
} from "@/lib/auth"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (data: SignInData) => Promise<AuthResult>
  signUp: (data: SignUpData) => Promise<AuthResult>
  signOutUser: () => Promise<AuthResult>
  resetPasswordUser: (email: string) => Promise<AuthResult>
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    initializeAuth()

    const { data: { subscription } } = onAuthStateChange((event, nextSession) => {
      if (nextSession) {
        setUser(nextSession.user)
        setSession(nextSession)
      } else {
        setUser(null)
        setSession(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      const sessionResult = await getCurrentSession()
      if (sessionResult.success && sessionResult.session) {
        setSession(sessionResult.session)
        setUser(sessionResult.session.user)
      }
      const userResult = await getCurrentUser()
      if (userResult.success) {
        setUser(userResult.user ?? null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    const result = await getCurrentUser()
    if (result.success) setUser(result.user ?? null)
  }

  const signIn = async (data: SignInData): Promise<AuthResult> => {
    const result = await signInWithEmail(data)
    if (result.success) {
      setUser(result.user ?? null)
      setSession(result.session ?? null)
    }
    return result
  }

  const signUp = async (data: SignUpData): Promise<AuthResult> => {
    const result = await signUpWithEmail(data)
    if (result.success) {
      setUser(result.user ?? null)
      setSession(result.session ?? null)
    }
    return result
  }

  const signOutUser = async (): Promise<AuthResult> => {
    const result = await signOut()
    if (result.success) {
      setUser(null)
      setSession(null)
    }
    return result
  }

  const resetPasswordUser = async (email: string): Promise<AuthResult> => {
    return resetPassword(email)
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOutUser,
    resetPasswordUser,
    isAuthenticated,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


