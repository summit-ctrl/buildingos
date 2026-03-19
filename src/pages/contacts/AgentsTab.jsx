import { useState } from 'react'
import { Search, X, Pencil, Check } from 'lucide-react'

function AgentDrawer({ agent, apartments, onClose, onUpdateAgent }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState({})
  const units = apartments.filter(a => agent.unitsManaged.includes(a.id))

  function startEdit() { setDraft({ ...agent }); setEditing(true) }
  function saveEdit()  { onUpdateAgent(agent.id, draft); setEditing(false) }
  function cancelEdit(){ setEditing(false); setDraft({}) }
  function setField(k, v) { setDraft(d => ({ ...d, [k]: v })) }

  const inp = (label, field) => (
    <div className="field-group">
      <div className="field-label">{label}</div>
      <input style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: 'var(--surface-2)', boxSizing: 'border-box' }}
        value={draft[field] ?? ''} onChange={e => setField(field, e.target.value)} />
    </div>
  )

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <div>
            <div className="drawer-title">{agent.agencyName}</div>
            <div className="drawer-subtitle">{agent.agentName}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!editing
              ? <button onClick={startEdit} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', fontSize: 13 }}><Pencil size={13} /> Edit</button>
              : <>
                  <button onClick={saveEdit} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer', fontSize: 13 }}><Check size={13} /> Save</button>
                  <button onClick={cancelEdit} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                </>
            }
            <button className="drawer-close" onClick={onClose}><X size={18} /></button>
          </div>
        </div>
        <div className="drawer-body">
          {editing ? (
            <div className="field-grid">
              {inp('Agency name', 'agencyName')}
              {inp('Agent name',  'agentName')}
              {inp('Phone',        'phone')}
              {inp('Email',        'email')}
            </div>
          ) : (
            <>
              <div className="field-grid">
                <div className="field-group"><div className="field-label">Phone</div><div className="field-value">{agent.phone}</div></div>
                <div className="field-group"><div className="field-label">Email</div><div className="field-value" style={{ fontSize: 13 }}>{agent.email}</div></div>
              </div>
              <hr className="divider" />
              <div className="field-group">
                <div className="field-label">Units managed ({units.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {units.map(u => <span key={u.id} className="badge badge-blue">Unit {u.unit}</span>)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default function AgentsTab({ agents, apartments, onUpdateAgent }) {
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = agents.filter(a =>
    a.agencyName.toLowerCase().includes(search.toLowerCase()) ||
    a.agentName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-body">
      <div className="toolbar" style={{ marginBottom: 20 }}>
        <div className="search-wrap">
          <Search className="search-icon" />
          <input className="search-input" placeholder="Search agency or agent name…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Agency</th><th>Agent name</th><th>Phone</th><th>Email</th><th>Units managed</th></tr></thead>
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
      {selected && <AgentDrawer agent={agents.find(a => a.id === selected.id) || selected} apartments={apartments} onClose={() => setSelected(null)} onUpdateAgent={(id, changes) => { onUpdateAgent(id, changes); setSelected(s => ({ ...s, ...changes })) }} />}
    </div>
  )
}
