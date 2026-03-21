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
  const [apartments, setApartments] = useState(
    APARTMENTS.filter(a => a.buildingId === building.id)
  )
  const [notes, setNotes] = useState({})

  const tenants = TENANTS.filter(t => t.buildingId === building.id)
  const owners  = OWNERS.filter(o => o.buildingId === building.id)
  const agents  = AGENTS.filter(a => a.buildingId === building.id)

  const counts = {
    apartments: apartments.length,
    tenants:    tenants.length,
    owners:     owners.length,
    agents:     agents.length,
  }

  function handleUpdateApartment(id, changes) {
    setApartments(prev => prev.map(a => a.id === id ? { ...a, ...changes } : a))
  }
  function handleAddNote(aptId, text) {
    setNotes(prev => ({
      ...prev,
      [aptId]: [...(prev[aptId] || []), {
        id: Date.now(),
        text,
        createdAt: new Date().toLocaleString('en-AU', {
          day: 'numeric', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      }]
    }))
  }
  function handleDeleteNote(aptId, noteId) {
    setNotes(prev => ({ ...prev, [aptId]: (prev[aptId] || []).filter(n => n.id !== noteId) }))
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <Users size={18} style={{ color: 'var(--text-muted)' }} />
        <span className="page-title">Contacts</span>
      </div>
      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span style={{
              marginLeft: 6, display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', minWidth: 18, height: 18,
              borderRadius: 9, fontSize: 11, fontWeight: 600, padding: '0 5px',
              background: tab === t.id ? 'var(--blue-light)' : 'var(--surface-2)',
              color: tab === t.id ? 'var(--blue)' : 'var(--text-muted)',
            }}>
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>
      {tab === 'apartments' && (
        <ApartmentsTab
          apartments={apartments}
          tenants={tenants}
          owners={owners}
          agents={agents}
          notes={notes}
          onUpdateApartment={handleUpdateApartment}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
      {tab === 'tenants' && <TenantsTab tenants={tenants} apartments={apartments} />}
      {tab === 'owners'  && <OwnersTab  owners={owners}   apartments={apartments} agents={agents} />}
      {tab === 'agents'  && <AgentsTab  agents={agents}   apartments={apartments} owners={owners} />}
    </div>
  )
}
