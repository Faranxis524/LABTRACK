import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
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
  }
}

export default function useDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'departments'), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        setDepartments(snapshot.docs.map(normalizeDoc))
        setLoading(false)
      },
      err => {
        setError(err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const addDepartment = async payload => {
    const docRef = await addDoc(collection(db, 'departments'), {
      name: payload.name,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  }

  const updateDepartment = async (id, patch) => {
    await updateDoc(doc(db, 'departments', id), patch)
  }

  const removeDepartment = async id => {
    await deleteDoc(doc(db, 'departments', id))
  }

  return {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    removeDepartment,
  }
}
