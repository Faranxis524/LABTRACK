import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../assets/firebase.js'

function normalizeDoc(snapshot) {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    ...data,
    archived: Boolean(data.archived),
  }
}

export default function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        setCategories(snapshot.docs.map(normalizeDoc))
        setLoading(false)
      },
      err => {
        setError(err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const addCategory = async payload => {
    const docRef = await addDoc(collection(db, 'categories'), {
      name: payload.name,
      archived: Boolean(payload.archived),
      createdAt: serverTimestamp(),
    })
    return docRef.id
  }

  const updateCategory = async (id, patch) => {
    await updateDoc(doc(db, 'categories', id), patch)
  }

  const archiveCategory = async id => {
    await updateDoc(doc(db, 'categories', id), { archived: true })
  }

  const restoreCategory = async id => {
    await updateDoc(doc(db, 'categories', id), { archived: false })
  }

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    archiveCategory,
    restoreCategory,
  }
}
