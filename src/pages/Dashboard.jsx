import { useEffect, useMemo, useState } from 'react'
import { FiAlertTriangle, FiBell, FiBox, FiFileText, FiPlus, FiSettings, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import useInventory from '../hooks/useInventory.js'
import useIssuances from '../hooks/useIssuances.js'
import useDepartments from '../hooks/useDepartments.js'
import useCategories from '../hooks/useCategories.js'
import KPICards from '../components/KPICards.jsx'
import InventoryTable from '../components/InventoryTable.jsx'
import AlertsList from '../components/AlertsList.jsx'
import IssuanceTable from '../components/IssuanceTable.jsx'
import AddItemForm from '../components/AddItemForm.jsx'
import ManageSettings from '../components/ManageSettings.jsx'
import IssueModal from '../components/modals/IssueModal.jsx'
import RestockModal from '../components/modals/RestockModal.jsx'
import ReassignModal from '../components/modals/ReassignModal.jsx'
import ViewItemModal from '../components/modals/ViewItemModal.jsx'
import EditItemModal from '../components/modals/EditItemModal.jsx'
import ConfirmModal from '../components/modals/ConfirmModal.jsx'

const colors = {
  primary: '#1a5c2a',
  deep: '#0f3a1a',
  mid: '#236b35',
  light: '#2e8b45',
  gold: '#c8a84b',
  goldLight: '#e2c878',
  bg: '#f5f7f3',
  surface: '#ffffff',
  surface2: '#eef4ec',
  border: '#c2d9c5',
  borderDark: '#8fb89a',
  text: '#1e3a22',
  dim: '#5a7a5e',
  bright: '#0f2a13',
  warn: '#b87d00',
  danger: '#b32020',
  dangerBg: '#fff0f0',
  lowBg: '#fffbec',
  okBg: '#f0fff4',
}

  // use react-icons for consistent iconography
function computeStatus(item) {
  if (item.stock <= item.critical) return 'critical'
  if (item.stock <= item.reorder) return 'low'
  return 'ok'
}

function fmtNum(n) {
  return Number.isInteger(n) ? n : Number.parseFloat(Number(n).toFixed(2))
}

function nowClock() {
  return new Date().toLocaleTimeString('en-PH')
}


function SectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div
        style={{
          fontFamily: 'EB Garamond, Georgia, serif',
          fontSize: 20,
          fontWeight: 600,
          color: colors.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ display: 'inline-block', width: 4, height: 20, background: `linear-gradient(${colors.primary}, ${colors.light})`, borderRadius: 2 }} />
        {title}
      </div>
      {action}
    </div>
  )
}

function Button({ variant = 'primary', style, ...props }) {
  const common = {
    padding: '8px 18px',
    borderRadius: 7,
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    letterSpacing: '0.04em',
    ...style,
  }

  const variants = {
    primary: { background: `linear-gradient(135deg, ${colors.primary}, ${colors.light})`, color: '#fff', boxShadow: '0 2px 8px rgba(26,92,42,0.25)' },
    secondary: { background: colors.surface, color: colors.text, border: `1px solid ${colors.borderDark}` },
    success: { background: colors.okBg, color: colors.primary, border: '1px solid rgba(26,92,42,0.25)' },
    danger: { background: colors.dangerBg, color: colors.danger, border: '1px solid rgba(179,32,32,0.25)' },
  }

  return <button {...props} style={{ ...common, ...variants[variant] }} />
}

export default function Dashboard() {
  const { user, loading, logout } = useAuth()
  const {
    items: liveInventory,
    loading: inventoryLoading,
    addItem,
    updateItem,
    removeItem,
  } = useInventory()
  const {
    issuances: liveIssuances,
    loading: issuancesLoading,
    addIssuance,
  } = useIssuances()
  const {
    departments,
    addDepartment,
    removeDepartment,
  } = useDepartments()
  const {
    categories,
    addCategory,
    archiveCategory,
    restoreCategory,
  } = useCategories()
  const [tab, setTab] = useState('inventory')
  const [clock, setClock] = useState(nowClock())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [viewItem, setViewItem] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [issueOpen, setIssueOpen] = useState(false)
  const [restockItem, setRestockItem] = useState(null)
  const [reassignDepartment, setReassignDepartment] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setClock(nowClock()), 1000)
    return () => clearInterval(timer)
  }, [])

  const inventory = useMemo(() => {
    return liveInventory.map(item => ({ ...item, status: computeStatus(item) }))
  }, [liveInventory])

  const issuances = useMemo(() => {
    return liveIssuances.map(row => {
      const dateText =
        typeof row.ts === 'string'
          ? row.ts
          : row.createdAt?.toDate
            ? row.createdAt.toDate().toLocaleString('en-PH')
            : '—'

      return {
        id: row.id,
        ts: dateText,
        item: row.item || row.itemName || '—',
        qty: row.qty ?? 0,
        unit: row.unit || '—',
        dept: row.dept || row.departmentName || '—',
        requester: row.requester || '—',
        purpose: row.purpose || '—',
        by: row.by || row.issuedBy || '—',
      }
    })
  }, [liveIssuances])

  const handleOpenIssueModal = () => {
    if (inventoryLoading) {
      toast.error('Inventory is still loading. Please wait a moment.')
      return
    }

    if (!inventory.length) {
      toast.error('No inventory items available for issuance yet.')
      setTab('add')
      return
    }

    setIssueOpen(true)
  }

  const visibleInventory = useMemo(() => {
    return inventory.filter(item => {
      const match =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.categoryName || item.category || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.cas || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.departmentName || item.dept || '').toLowerCase().includes(search.toLowerCase())
      const statusMatch = !statusFilter || (statusFilter === 'ordered' ? item.ordered : item.status === statusFilter)
      const departmentMatch = !departmentFilter || (item.departmentId || item.dept) === departmentFilter || (item.departmentName || item.dept) === departmentFilter
      return match && statusMatch && departmentMatch
    })
  }, [departmentFilter, inventory, search, statusFilter])

  const counts = useMemo(() => {
    return {
      total: inventory.length,
      ok: inventory.filter(item => item.status === 'ok').length,
      low: inventory.filter(item => item.status === 'low').length,
      critical: inventory.filter(item => item.status === 'critical').length,
      alerts: inventory.filter(item => item.status !== 'ok' || item.ordered).length,
    }
  }, [inventory])

  const alerts = useMemo(() => {
    const list = []
    inventory.forEach(item => {
      const departmentLabel = item.departmentName || item.dept || '—'
      if (item.status === 'critical') {
        list.push({ type: 'critical', icon: <FiAlertTriangle />, title: `CRITICAL: ${item.name}`, meta: `[${departmentLabel}] — Stock: ${fmtNum(item.stock)} ${item.unit} · Critical threshold: ${fmtNum(item.critical)} ${item.unit}. Immediate reorder required.`, time: 'Just now' })
      } else if (item.status === 'low') {
        list.push({ type: 'low', icon: <FiAlertCircle />, title: `Low Stock: ${item.name}`, meta: `[${departmentLabel}] — Stock: ${fmtNum(item.stock)} ${item.unit} · Reorder point: ${fmtNum(item.reorder)} ${item.unit}. Schedule procurement soon.`, time: 'Just now' })
      }
      if (item.ordered) {
        list.push({ type: 'ordered', icon: <FiCheckCircle />, title: `Order Placed: ${item.name}`, meta: `[${departmentLabel}] — Supplier: ${item.supplier || 'N/A'}. Awaiting delivery.`, time: 'Just now' })
      }
    })
    return list
  }, [inventory])

  const handleAddItem = async (formData, formEl) => {
    try {
      const departmentId = formData.get('departmentId')
      const categoryId = formData.get('categoryId')
      const department = departments.find(entry => (entry.id ?? entry.name) === departmentId)
      const category = categories.find(entry => (entry.id ?? entry.name) === categoryId)

      await addItem({
        name: String(formData.get('name') || '').trim(),
        cas: String(formData.get('cas') || '').trim() || 'N/A',
        departmentId,
        departmentName: department?.name || '',
        categoryId,
        categoryName: category?.name || '',
        stock: Number(formData.get('stock') || 0),
        unit: String(formData.get('unit') || ''),
        reorder: Number(formData.get('reorder') || 0),
        critical: Number(formData.get('critical') || 0),
        max: Number(formData.get('max') || 0) || Number(formData.get('reorder') || 0) * 3,
        supplier: String(formData.get('supplier') || '').trim(),
        catalog: String(formData.get('catalog') || '').trim(),
        location: String(formData.get('location') || '').trim(),
        notes: String(formData.get('notes') || '').trim(),
        ordered: false,
      })

      formEl?.reset()
      toast.success('Consumable saved')
      setTab('inventory')
    } catch (error) {
      toast.error(error?.message || 'Failed to save item')
    }
  }

  const handleIssueSubmit = async (formData, formEl) => {
    try {
      const itemId = String(formData.get('itemId') || '')
      const item = inventory.find(entry => String(entry.id ?? entry.name) === itemId)
      const qty = Number(formData.get('qty') || 0)
      if (!item) throw new Error('Select a valid item')
      if (!item.id) throw new Error('Selected item is not linked to a valid inventory record')
      if (!qty || qty <= 0) throw new Error('Enter a valid quantity')
      if (qty > Number(item.stock)) throw new Error(`Insufficient stock. Available: ${fmtNum(item.stock)} ${item.unit}`)

      const departmentId = String(formData.get('departmentId') || '')
      const department = departments.find(entry => (entry.id ?? entry.name) === departmentId)

      await updateItem(item.id, { stock: Number(item.stock) - qty })
      await addIssuance({
        itemId: item.id,
        itemName: item.name,
        qty,
        unit: item.unit,
        departmentId,
        departmentName: department?.name || '',
        requester: String(formData.get('requester') || '').trim(),
        purpose: String(formData.get('purpose') || '').trim(),
        issuedBy: String(formData.get('issuedBy') || '').trim(),
      })

      formEl?.reset()
      setIssueOpen(false)
      toast.success('Issuance recorded')
    } catch (error) {
      toast.error(error?.message || 'Failed to record issuance')
    }
  }

  const handleRestockSubmit = async (formData, formEl) => {
    try {
      if (!restockItem) throw new Error('No item selected')
      const qty = Number(formData.get('qty') || 0)
      if (!qty || qty <= 0) throw new Error('Enter a valid quantity')
      await updateItem(restockItem.id, { stock: Number(restockItem.stock) + qty, ordered: false })
      formEl?.reset()
      setRestockItem(null)
      toast.success('Stock updated')
    } catch (error) {
      toast.error(error?.message || 'Failed to restock')
    }
  }

  const handleReassignSubmit = async (formData, formEl) => {
    try {
      if (!reassignDepartment) throw new Error('No department selected')
      const targetDepartmentId = String(formData.get('targetDepartmentId') || '')
      const target = departments.find(entry => (entry.id ?? entry.name) === targetDepartmentId)
      if (!target) throw new Error('Select a valid target department')

      const sourceId = reassignDepartment.id ?? reassignDepartment.name
      const sourceName = reassignDepartment.name
      const affected = inventory.filter(item => (item.departmentId || item.dept) === sourceId || (item.departmentName || item.dept) === sourceName)

      await Promise.all(affected.map(item => updateItem(item.id, { departmentId: target.id ?? target.name, departmentName: target.name })))
      await removeDepartment(sourceId)

      formEl?.reset()
      setReassignDepartment(null)
      toast.success('Department items reassigned')
    } catch (error) {
      toast.error(error?.message || 'Failed to reassign department')
    }
  }

  const handleDeleteDepartment = async dept => {
    try {
      const sourceId = dept.id ?? dept.name
      const hasItems = inventory.some(item => (item.departmentId || item.dept) === sourceId || (item.departmentName || item.dept) === dept.name)
      if (hasItems) {
        setReassignDepartment(dept)
        return
      }

      await removeDepartment(sourceId)
      toast.success('Department deleted')
    } catch (error) {
      toast.error(error?.message || 'Failed to delete department')
    }
  }

  const handleArchiveCategory = async category => {
    try {
      await archiveCategory(category.id)
      toast.success('Category archived')
    } catch (error) {
      toast.error(error?.message || 'Failed to archive category')
    }
  }

  const handleRestoreCategory = async category => {
    try {
      await restoreCategory(category.id)
      toast.success('Category restored')
    } catch (error) {
      toast.error(error?.message || 'Failed to restore category')
    }
  }

  const handleAddDepartment = async (formData, formEl) => {
    try {
      const name = String(formData.get('name') || '').trim()
      if (!name) throw new Error('Department name is required')
      await addDepartment({ name })
      formEl?.reset?.()
      toast.success('Department added')
    } catch (error) {
      toast.error(error?.message || 'Failed to add department')
    }
  }

   const handleAddCategory = async (formData, formEl) => {
     try {
       const name = String(formData.get('name') || '').trim()
       if (!name) throw new Error('Category name is required')
       await addCategory({ name, archived: false })
       formEl?.reset?.()
       toast.success('Category added')
     } catch (error) {
       toast.error(error?.message || 'Failed to add category')
     }
   }

    const handleEditSubmit = async (formData, formEl) => {
      try {
        if (!editItem) throw new Error('No item selected')
        const departmentId = formData.get('departmentId')
        const categoryId = formData.get('categoryId')
        const department = departments.find(entry => (entry.id ?? entry.name) === departmentId)
        const category = categories.find(entry => (entry.id ?? entry.name) === categoryId)

        await updateItem(editItem.id, {
          name: String(formData.get('name') || '').trim(),
          cas: String(formData.get('cas') || '').trim() || 'N/A',
          departmentId,
          departmentName: department?.name || '',
          categoryId,
          categoryName: category?.name || '',
          stock: Number(formData.get('stock') || 0),
          unit: String(formData.get('unit') || ''),
          reorder: Number(formData.get('reorder') || 0),
          critical: Number(formData.get('critical') || 0),
          max: Number(formData.get('max') || 0) || Number(formData.get('reorder') || 0) * 3,
          supplier: String(formData.get('supplier') || '').trim(),
          catalog: String(formData.get('catalog') || '').trim(),
          location: String(formData.get('location') || '').trim(),
          notes: String(formData.get('notes') || '').trim(),
        })

        formEl?.reset?.()
        setEditItem(null)
        toast.success('Item updated')
      } catch (error) {
        toast.error(error?.message || 'Failed to update item')
      }
    }

    const handleDeleteConfirm = async () => {
      try {
        if (!deleteItem) return
        await removeItem(deleteItem.id)
        toast.success('Item deleted')
        setDeleteItem(null)
      } catch (error) {
        toast.error(error?.message || 'Failed to delete item')
      }
    }

  if (loading || inventoryLoading || issuancesLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: colors.bg, color: colors.primary, fontFamily: 'IBM Plex Sans, sans-serif' }}>
        Loading dashboard...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div style={{ minHeight: '100vh', backgroundImage: `linear-gradient(rgba(245,247,243,0.85), rgba(245,247,243,0.85)), url('/pnc-bg.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', color: colors.text, fontFamily: 'IBM Plex Sans, sans-serif', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(26,92,42,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(26,92,42,0.05) 0%, transparent 50%), linear-gradient(rgba(26,92,42,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(26,92,42,0.025) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.deep} 0%, ${colors.primary} 50%, ${colors.mid} 100%)`,
            padding: '12px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            borderBottom: `3px solid ${colors.gold}`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
            <img src="/pnc-logo.png" alt="PNC Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: 26, fontWeight: 600, color: '#fff', lineHeight: 1.1 }}>
              Laboratory Consumable Monitoring System
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: colors.goldLight, marginTop: 4 }}>
              University of Cabuyao · Pamantasan ng Cabuyao
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#fff', textAlign: 'right' }}>{clock}</div>
            </div>
            <Button variant="secondary" type="button" onClick={async () => { await logout(); toast.success('Signed out'); }}>
              Logout
            </Button>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 2, padding: '0 32px', background: colors.primary, borderBottom: `3px solid ${colors.gold}` }}>
          {[
            ['inventory', <><FiBox style={{verticalAlign:'middle'}} /> <span style={{marginLeft:8}}>Inventory</span></>],
            ['alerts', <><FiBell style={{verticalAlign:'middle'}} /> <span style={{marginLeft:8}}>Alerts</span></>],
            ['issuance', <><FiFileText style={{verticalAlign:'middle'}} /> <span style={{marginLeft:8}}>Issuance Records</span></>],
            ['add', <><FiPlus style={{verticalAlign:'middle'}} /> <span style={{marginLeft:8}}>Add Item</span></>],
            ['settings', <><FiSettings style={{verticalAlign:'middle'}} /> <span style={{marginLeft:8}}>Settings</span></>],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              style={{
                padding: '11px 22px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: 'none',
                background: tab === key ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: tab === key ? colors.goldLight : 'rgba(255,255,255,0.65)',
                borderBottom: tab === key ? `3px solid ${colors.goldLight}` : '3px solid transparent',
                marginBottom: -3,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <main style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto', width: '100%', flex: 1 }}>
          {tab === 'inventory' && (
            <section>
              <KPICards total={counts.total} ok={counts.ok} low={counts.low} critical={counts.critical} />

              <SectionHeader title="Inventory Register" action={<Button variant="primary" type="button" onClick={() => setTab('add')}>+ Add Item</Button>} />

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.7fr) 160px 200px', gap: 14, marginBottom: 16, alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                  <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by name, category, CAS number, or department…" style={{ width: '100%', minWidth: 0, padding: '9px 12px', background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, fontSize: 13, color: colors.bright, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} style={{ width: '100%', minWidth: 0, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, padding: '9px 12px', fontSize: 13, boxSizing: 'border-box' }}>
                  <option value="">All Status</option>
                  <option value="ok">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="critical">Critical</option>
                  <option value="ordered">Ordered</option>
                </select>
                <select value={departmentFilter} onChange={event => setDepartmentFilter(event.target.value)} style={{ width: '100%', minWidth: 0, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 7, padding: '9px 12px', fontSize: 13, boxSizing: 'border-box' }}>
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id ?? dept.name} value={dept.id ?? dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

               <InventoryTable
                 items={visibleInventory}
                 onRestock={item => setRestockItem(item)}
                 onToggleOrdered={async item => {
                   try {
                     await updateItem(item.id, { ordered: !item.ordered })
                   } catch (error) {
                     toast.error(error?.message || 'Failed to update status')
                   }
                 }}
                  onDelete={(item) => setDeleteItem(item)}
                 onView={setViewItem}
                 onEdit={setEditItem}
               />
            </section>
          )}

          {tab === 'alerts' && (
            <section>
              <SectionHeader title="Active Alerts" action={<Button variant="secondary" type="button" onClick={() => toast.success('Alerts refresh automatically from inventory state')}>Refresh</Button>} />
              <AlertsList alerts={alerts} onClearAll={() => toast.success('Alerts are regenerated from inventory state')} />
            </section>
          )}

          {tab === 'issuance' && (
            <section>
              <SectionHeader title="Issuance Records" action={<Button variant="primary" type="button" onClick={handleOpenIssueModal}>+ Record Issuance</Button>} />
              <IssuanceTable rows={issuances} />
            </section>
          )}

          {tab === 'add' && (
            <section>
              <AddItemForm
                departments={departments}
                categories={categories.filter(category => !category.archived)}
                onSubmit={handleAddItem}
                onClear={form => form?.reset?.()}
              />
            </section>
          )}

          {tab === 'settings' && (
            <section>
              <ManageSettings
                departments={departments}
                categories={categories}
                onAddDepartment={handleAddDepartment}
                onAddCategory={handleAddCategory}
                onDeleteDepartment={handleDeleteDepartment}
                onReassignDepartment={dept => setReassignDepartment(dept)}
                onArchiveCategory={handleArchiveCategory}
                onRestoreCategory={handleRestoreCategory}
              />
            </section>
          )}
        </main>

        <IssueModal open={issueOpen} items={inventory} departments={departments} onClose={() => setIssueOpen(false)} onSubmit={handleIssueSubmit} />
        <RestockModal open={Boolean(restockItem)} item={restockItem} onClose={() => setRestockItem(null)} onSubmit={handleRestockSubmit} />
        <ReassignModal open={Boolean(reassignDepartment)} sourceDepartment={reassignDepartment} departments={departments} onClose={() => setReassignDepartment(null)} onSubmit={handleReassignSubmit} />
        <ViewItemModal open={Boolean(viewItem)} item={viewItem} onClose={() => setViewItem(null)} />
        <EditItemModal open={Boolean(editItem)} item={editItem} departments={departments} categories={categories.filter(c => !c.archived)} onClose={() => setEditItem(null)} onSubmit={handleEditSubmit} />
        <ConfirmModal open={Boolean(deleteItem)} title="Delete Item" message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`} confirmText="Delete" cancelText="Cancel" onConfirm={handleDeleteConfirm} onClose={() => setDeleteItem(null)} tone="danger" />

        <div style={{ background: colors.deep, color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.1em', padding: '10px 32px', borderTop: `2px solid ${colors.gold}`, marginTop: 'auto' }}>
          University of Cabuyao · Pamantasan ng Cabuyao · Laboratory Consumables Monitoring System &nbsp;|&nbsp; © 2026 UC College of Engineering.
        </div>
      </div>
    </div>
  )
}