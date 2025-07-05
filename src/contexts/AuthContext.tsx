
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase, checkSubscription } from '../lib/supabase'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  hasSubscription: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSubscription: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasSubscription, setHasSubscription] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        checkSubscription().then(hasActive => {
          setHasSubscription(hasActive)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          checkSubscription().then(hasActive => {
            setHasSubscription(hasActive)
          })
        } else {
          setHasSubscription(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const refreshSubscription = async () => {
    if (user) {
      const hasActive = await checkSubscription()
      setHasSubscription(hasActive)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await refreshSubscription()
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    session,
    user,
    loading,
    hasSubscription,
    signIn,
    signUp,
    signOut,
    refreshSubscription
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}