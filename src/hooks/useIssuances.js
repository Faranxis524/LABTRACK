import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../assets/firebase.js'

function normalizeDoc(snapshot) {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    ...data,
    qty: Number(data.qty ?? 0),
    createdAt: data.createdAt ?? null,
  }
}

export default function useIssuances() {
  const [issuances, setIssuances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'issuances'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        setIssuances(snapshot.docs.map(normalizeDoc))
        setLoading(false)
      },
      err => {
        setError(err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const latest = useMemo(() => issuances[0] ?? null, [issuances])

  const addIssuance = async payload => {
    const docRef = await addDoc(collection(db, 'issuances'), {
      ...payload,
      qty: Number(payload.qty ?? 0),
      createdAt: serverTimestamp(),
    })
    return docRef.id
  }

  return {
    issuances,
    latest,
    loading,
    error,
    addIssuance,
  }
}
