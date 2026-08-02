import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const GUEST_TOKEN = 'guest-demo-token'

interface AuthContextType {
  session: { accessToken: string; refreshToken: string } | null
  user: any
  isLoading: boolean
  isGuest: boolean
  signIn: (token: string, refreshToken: string, user: any) => Promise<void>
  signInAsGuest: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const GUEST_USER = {
  id: 'guest',
  email: 'guest@gray.space',
  username: 'you',
  avatar_url: 'https://i.pravatar.cc/150?u=gray.space.guest',
  verification_level: 'unverified',
  bio: 'Exploring the three spaces',
  trust_score: 0,
  reputation_score: 0,
  accuracy_percentage: 0,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{
    accessToken: string
    refreshToken: string
  } | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    bootstrapAsync()
  }, [])

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token')
      const refreshToken = await AsyncStorage.getItem('refresh_token')
      const userData = await AsyncStorage.getItem('user')

      if (token && refreshToken && userData) {
        setSession({
          accessToken: token,
          refreshToken: refreshToken,
        })
        setUser(JSON.parse(userData))
      }
    } catch (e) {
      console.error('Failed to restore session:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (token: string, refreshToken: string, userData: any) => {
    await AsyncStorage.setItem('access_token', token)
    await AsyncStorage.setItem('refresh_token', refreshToken)
    await AsyncStorage.setItem('user', JSON.stringify(userData))

    setSession({
      accessToken: token,
      refreshToken: refreshToken,
    })
    setUser(userData)
  }

  const signInAsGuest = async () => {
    await signIn(GUEST_TOKEN, GUEST_TOKEN, GUEST_USER)
  }

  const signOut = async () => {
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.removeItem('refresh_token')
    await AsyncStorage.removeItem('user')

    setSession(null)
    setUser(null)
  }

  const isGuest = session?.accessToken === GUEST_TOKEN

  return (
    <AuthContext.Provider
      value={{ session, user, isLoading, isGuest, signIn, signInAsGuest, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
