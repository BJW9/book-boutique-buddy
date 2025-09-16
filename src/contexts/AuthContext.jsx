import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, profiles, supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Obtenir la session initiale
    const getInitialSession = async () => {
      const { session } = await auth.getCurrentSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await profiles.get(userId)
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erreur lors du chargement du profil:', error)
        return
      }
      setProfile(data)
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      const { data, error } = await auth.signUp(email, password, userData)
      
      if (error) throw error
      
      // Si l'inscription réussit et qu'il y a un utilisateur, créer le profil
      if (data.user) {
        const profileData = {
          email: data.user.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          role: 'customer'
        }
        
        const { error: profileError } = await profiles.create(data.user.id, profileData)
        if (profileError) {
          console.error('Erreur lors de la création du profil:', profileError)
        }
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await auth.signIn(email, password)
      return { data, error }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await auth.signOut()
      if (!error) {
        setUser(null)
        setProfile(null)
        setSession(null)
      }
      return { error }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { data: null, error: new Error('Utilisateur non connecté') }
    
    try {
      const { data, error } = await profiles.update(user.id, updates)
      if (!error && data) {
        setProfile(data)
      }
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await auth.resetPassword(email)
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updatePassword = async (password) => {
    try {
      const { data, error } = await auth.updatePassword(password)
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const isAdmin = () => {
    return profile?.role === 'admin'
  }

  const isAuthenticated = () => {
    return !!user && !!session
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    isAdmin,
    isAuthenticated,
    loadUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

