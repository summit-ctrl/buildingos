import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { OWNERS, APARTMENTS, AGENTS, fullName, initials } from '../../data/seed'

function OwnerDrawer({ owner, onClose }) {
  const apt   = APARTMENTS.find(a => a.id === owner.apartmentId)
  const agent = owner.agentId ? AGENTS.find(a => a.id === owner.agentId) : null

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="avatar" style={{ width: 48, height: 48, fontSize: 15 }}>
              {initials(owner)}
            </div>
            <div>
              <div className="drawer-title">{fullName(owner)}</div>
              <div className="drawer-subtitle">
                Unit {apt?.unit} ·{' '}
                {owner.type === 'owner-occupied' ? 'Owner-occupied' : 'Investment'}
              </div>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="drawer-body">
          <div className="field-grid">
            <div className="field-group">
              <div className="field-label">Phone</div>
              <div className="field-value">{owner.phone}</div>
            </div>
            <div className="field-group">
              <div className="field-label">Email</div>
              <div className="field-value" style={{ fontSize: 13 }}>{owner.email}</div>
            </div>
            <div className="field-group" style={{ gridColumn: '1/-1' }}>
              <div className="field-label">Mailing address</div>
              <div className="field-value">{owner.address}</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="field-group">
            <div className="field-label">Ownership type</div>
            <span className={`badge ${owner.type === 'owner-occupied' ? 'badge-blue' : 'badge-gray'}`}>
              {owner.type === 'owner-occupied' ? 'Owner-occupied' : 'Investment property'}
            </span>
          </div>

          {agent && (
            <>
              <hr className="divider" />
              <div className="field-group">
                <div className="field-label">Managing agent</div>
                <div className="field-value">{agent.agencyName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {agent.agentName} · {agent.phone}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{agent.email}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default function OwnersTab({ buildingId }) {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [selected, setSelected] = useState(null)

  const owners = OWNERS.filter(o => o.buildingId === buildingId)

  const filtered = owners.filter(o => {
    const matchSearch =
      fullName(o).toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      APARTMENTS.find(a => a.id === o.apartmentId)?.unit.includes(search)
    const matchFilter =
      filter === 'all' ||
      (filter === 'investment'     && o.type === 'investment') ||
      (filter === 'owner-occupied' && o.type === 'owner-occupied') ||
      (filter === 'no-agent'       && !o.agentId && o.type === 'investment')
    return matchSearch && matchFilter
  })

  const counts = {
    all:            owners.length,
    investment:     owners.filter(o => o.type === 'investment').length,
    'owner-occupied': owners.filter(o => o.type === 'owner-occupied').length,
    'no-agent':     owners.filter(o => !o.agentId && o.type === 'investment').length,
  }

  return (
    <div className="page-body">
      <div className="toolbar" style={{ marginBottom: 20 }}>
        <div className="search-wrap">
          <Search className="search-icon" />
          <input
            className="search-input"
            placeholder="Search by name, email or unit…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {['all','investment','owner-occupied','no-agent'].map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: 13 }}
            onClick={() => setFilter(f)}
          >
            {{ all: 'All', investment: 'Investment', 'owner-occupied': 'Owner-occ', 'no-agent': 'No agent' }[f]}
            <span className="count-chip" style={{
              background: filter === f ? 'rgba(255,255,255,0.25)' : 'var(--blue-light)',
              color: filter === f ? '#fff' : 'var(--blue)',
            }}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Owner</th>
                <th>Unit</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Type</th>
                <th>Managing agent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state"><h3>No owners found</h3></div></td></tr>
              ) : filtered.map(o => {
                const apt   = APARTMENTS.find(a => a.id === o.apartmentId)
                const agent = o.agentId ? AGENTS.find(a => a.id === o.agentId) : null
                return (
                  <tr key={o.id} onClick={() => setSelected(o)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div className="avatar">{initials(o)}</div>
                        <span className="td-primary">{fullName(o)}</span>
                      </div>
                    </td>
                    <td>Unit {apt?.unit}</td>
                    <td>{o.phone}</td>
                    <td style={{ fontSize: 13 }}>{o.email}</td>
                    <td>
                      <span className={`badge ${o.type === 'owner-occupied' ? 'badge-blue' : 'badge-gray'}`}>
                        {o.type === 'owner-occupied' ? 'Owner-occ' : 'Investment'}
                      </span>
                    </td>
                    <td>
                      {agent
                        ? <span style={{ fontSize: 13 }}>{agent.agencyName}</span>
                        : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <OwnerDrawer owner={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
