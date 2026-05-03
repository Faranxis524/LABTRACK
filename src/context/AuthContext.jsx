import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, googleProvider } from '../assets/firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loginWithEmail = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  }

  const registerWithEmail = async (email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    return credential.user
  }

  const loginWithGoogle = async () => {
    const provider = googleProvider ?? new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)
    return credential.user
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
