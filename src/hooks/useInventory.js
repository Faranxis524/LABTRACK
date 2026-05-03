import { useEffect, useMemo, useState } from 'react'
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

function computeStatus(item) {
  if (item.stock <= item.critical) return 'critical'
  if (item.stock <= item.reorder) return 'low'
  return 'ok'
}

function normalizeDoc(snapshot) {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    ...data,
    stock: Number(data.stock ?? 0),
    reorder: Number(data.reorder ?? 0),
    critical: Number(data.critical ?? 0),
    max: Number(data.max ?? 0),
    ordered: Boolean(data.ordered),
    status: data.status || computeStatus(data),
  }
}

export default function useInventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        setItems(snapshot.docs.map(normalizeDoc))
        setLoading(false)
      },
      err => {
        setError(err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const stats = useMemo(() => {
    const normalized = items.map(item => ({ ...item, status: computeStatus(item) }))
    return {
      total: normalized.length,
      ok: normalized.filter(item => item.status === 'ok').length,
      low: normalized.filter(item => item.status === 'low').length,
      critical: normalized.filter(item => item.status === 'critical').length,
      ordered: normalized.filter(item => item.ordered).length,
      items: normalized,
    }
  }, [items])

  const addItem = async payload => {
    const docRef = await addDoc(collection(db, 'inventory'), {
      ...payload,
      stock: Number(payload.stock ?? 0),
      reorder: Number(payload.reorder ?? 0),
      critical: Number(payload.critical ?? 0),
      max: Number(payload.max ?? 0),
      ordered: Boolean(payload.ordered),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  }

  const updateItem = async (id, patch) => {
    await updateDoc(doc(db, 'inventory', id), {
      ...patch,
      updatedAt: serverTimestamp(),
    })
  }

  const removeItem = async id => {
    await deleteDoc(doc(db, 'inventory', id))
  }

  const restockItem = async (id, qty) => {
    const item = items.find(entry => entry.id === id)
    if (!item) return
    await updateDoc(doc(db, 'inventory', id), {
      stock: Number(item.stock) + Number(qty),
      ordered: false,
      updatedAt: serverTimestamp(),
    })
  }

  return {
    items: stats.items,
    loading,
    error,
    stats,
    addItem,
    updateItem,
    removeItem,
    restockItem,
  }
}
