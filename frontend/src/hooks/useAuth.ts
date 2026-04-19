'use client'

import {
    useState,
    useEffect,
    useCallback,
    createContext,
    useContext,
} from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'

interface AuthState {
    user:     User | null
    session:  Session | null
    loading:  boolean
}

interface AuthActions {
    login:    (email: string, password: string) => Promise<{ error: string | null }>
    register: (email: string, password: string) => Promise<{ error: string | null }>
    logout:   () => Promise<void>
}

export type AuthContextValue = AuthState & AuthActions

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function useAuthState(): AuthState & AuthActions {
    const [user,    setUser]    = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

    // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const login = useCallback(async (
        email: string,
        password: string
    ): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { error: error?.message ?? null }
    }, [])

    const register = useCallback(async (
        email: string,
        password: string
    ): Promise<{ error: string | null }> => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })
        return { error: error?.message ?? null }
    }, [])

    const logout = useCallback(async () => {
        await supabase.auth.signOut()
    }, [])

    return { user, session, loading, login, register, logout }
}