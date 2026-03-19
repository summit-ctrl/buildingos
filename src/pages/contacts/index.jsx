import { useState } from 'react'
import { Users } from 'lucide-react'
import ApartmentsTab from './ApartmentsTab'
import TenantsTab    from './TenantsTab'
import OwnersTab     from './OwnersTab'
import AgentsTab     from './AgentsTab'
import { APARTMENTS, TENANTS, OWNERS, AGENTS } from '../../data/seed'

const TABS = [
  { id: 'apartments', label: 'Apartments' },
  { id: 'tenants',    label: 'Tenants' },
  { id: 'owners',     label: 'Owners' },
  { id: 'agents',     label: 'Real Estate Agents' },
]

export default function ContactsPage({ building }) {
  const [tab, setTab] = useState('apartments')

  const [apartments, setApartments] = useState(APARTMENTS.filter(a => a.buildingId === building.id))
  const [tenants,    setTenants]    = useState(TENANTS.filter(t => t.buildingId === building.id))
  const [owners,     setOwners]     = useState(OWNERS.filter(o => o.buildingId === building.id))
  const [agents,     setAgents]     = useState(AGENTS.filter(a => a.buildingId === building.id))
  const [notes,      setNotes]      = useState({})

  const updateApartment = (id, changes) => setApartments(p => p.map(a => a.id === id ? { ...a, ...changes } : a))
  const updateTenant    = (id, changes) => setTenants(p => p.map(t => t.id === id ? { ...t, ...changes } : t))
  const updateOwner     = (id, changes) => setOwners(p => p.map(o => o.id === id ? { ...o, ...changes } : o))
  const updateAgent     = (id, changes) => setAgents(p => p.map(a => a.id === id ? { ...a, ...changes } : a))

  const addNote = (aptId, text) => setNotes(p => ({
    ...p,
    [aptId]: [...(p[aptId] || []), { id: Date.now(), text, createdAt: new Date().toLocaleString('en-AU') }]
  }))
  const deleteNote = (aptId, noteId) => setNotes(p => ({
    ...p,
    [aptId]: (p[aptId] || []).filter(n => n.id !== noteId)
  }))

  const counts = { apartments: apartments.length, tenants: tenants.length, owners: owners.length, agents: agents.length }

  return (
    <div className="main-content">
      <div className="page-header">
        <Users size={18} style={{ color: 'var(--text-muted)' }} />
        <span className="page-title">Contacts</span>
      </div>
      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            <span style={{ marginLeft: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, borderRadius: 9, fontSize: 11, fontWeight: 600, padding: '0 5px', background: tab === t.id ? 'var(--blue-light)' : 'var(--surface-2)', color: tab === t.id ? 'var(--blue)' : 'var(--text-muted)' }}>
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>
      {tab === 'apartments' && <ApartmentsTab apartments={apartments} tenants={tenants} owners={owners} agents={agents} notes={notes} onUpdateApartment={updateApartment} onAddNote={addNote} onDeleteNote={deleteNote} />}
      {tab === 'tenants'    && <TenantsTab    tenants={tenants} apartments={apartments} onUpdateTenant={updateTenant} />}
      {tab === 'owners'     && <OwnersTab     owners={owners}   apartments={apartments} agents={agents} onUpdateOwner={updateOwner} />}
      {tab === 'agents'     && <AgentsTab     agents={agents}   apartments={apartments} onUpdateAgent={updateAgent} />}
    </div>
  )
}
