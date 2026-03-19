import { useState } from 'react'
import { Users } from 'lucide-react'
import ApartmentsTab    from './ApartmentsTab'
import TenantsTab       from './TenantsTab'
import OwnersTab        from './OwnersTab'
import AgentsTab        from './AgentsTab'
import BreachNoticesTab from './BreachNoticesTab'
import {
  APARTMENTS, TENANTS, OWNERS, AGENTS, BREACH_NOTICES,
} from '../../data/seed'

const TABS = [
  { id: 'apartments', label: 'Apartments' },
  { id: 'tenants',    label: 'Tenants' },
  { id: 'owners',     label: 'Owners' },
  { id: 'agents',     label: 'Real Estate Agents' },
  { id: 'breaches',   label: 'Breach Notices' },
]

export default function ContactsPage({ building }) {
  const [tab, setTab] = useState('apartments')

  const counts = {
    apartments: APARTMENTS.filter(a => a.buildingId === building.id).length,
    tenants:    TENANTS.filter(t => t.buildingId === building.id).length,
    owners:     OWNERS.filter(o => o.buildingId === building.id).length,
    agents:     AGENTS.filter(a => a.buildingId === building.id).length,
    breaches:   BREACH_NOTICES.filter(b => b.buildingId === building.id).length,
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <Users size={18} style={{ color: 'var(--text-muted)' }} />
        <span className="page-title">Contacts</span>
      </div>

      <div className="tabs">
        {TABQ.map(t => (
          <button
            key={t.id}
            className={`tab-btn${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span style={{
              marginLeft: 6,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 18, height: 18, borderRadius: 9,
              fontSize: 11, fontWeight: 600, padding: '0 5px',
              background: tab === t.id ? 'var(--blue-light)' : 'var(--surface-2)',
              color:      tab === t.id ? 'var(--blue)'       : 'var(--text-muted)',
            }}>
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>

      {tab === 'apartments' && <ApartmentsTab    buildingId={building.id} />}
      {tab === 'tenants'    && <TenantsTab        buildingId={building.id} />}
      {tab === 'owners'     && <OwnersTab         buildingId={building.id} />}
      {tab === 'agents'     && <AgentsTab         buildingId={building.id} />}
      {tab === 'breaches'   && <BreachNoticesTab  buildingId={building.id} />}
    </div>
  )
}
