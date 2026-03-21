import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { AGENTS, APARTMENTS, OWNERS } from '../../data/seed'

function AgentDrawer({ agent, onClose }) {
  const units = APARTMENTS.filter(a => agent.unitsManaged.includes(a.id))
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <div>
            <div className="drawer-title">{agent.agencyName}</div>
            <div className="drawer-subtitle">{agent.agentName}</div>
          </div>
          <button className="drawer-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="drawer-body">
          <div className="field-grid">
            <div className="field-group">
              <div className="field-label">Phone</div>
              <div className="field-value">{agent.phone}</div>
            </div>
            <div className="field-group">
              <div className="field-label">Email</div>
              <div className="field-value" style={{ fontSize: 13 }}>{agent.email}</div>
            </div>
          </div>
          <hr className="divider" />
          <div className="field-group">
            <div className="field-label">Units managed ({units.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {units.map(u => (
                <span key={u.id} className="badge badge-blue">Unit {u.unit}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function AgentsTab({ buildingId }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const agents = AGENTS.filter(a => a.buildingId === buildingId)
  const filtered = agents.filter(a =>
    a.agencyName.toLowerCase().includes(search.toLowerCase()) ||
    a.agentName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-body">
      <div className="toolbar" style={{ marginBottom: 20 }}>
        <div className="search-wrap">
          <Search className="search-icon" />
          <input
            className="search-input"
            placeholder="Search agency or agent name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Agency</th>
                <th>Agent name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Units managed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} onClick={() => setSelected(a)}>
                  <td className="td-primary">{a.agencyName}</td>
                  <td>{a.agentName}</td>
                  <td>{a.phone}</td>
                  <td style={{ fontSize: 13 }}>{a.email}</td>
                  <td><span className="count-chip">{a.unitsManaged.length}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <AgentDrawer agent={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
