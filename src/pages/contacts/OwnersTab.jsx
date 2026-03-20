import { useState } from 'react'
import { Search, X, Pencil, Check } from 'lucide-react'
import { fullName, initials } from '../../data/seed'

function OwnerDrawer({ owner, apt, agent, onClose, onUpdateOwner }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState({})

  function startEdit() { setDraft({ ...owner }); setEditing(true) }
  function saveEdit()  { onUpdateOwner(owner.id, draft); setEditing(false) }
  function cancelEdit(){ setEditing(false); setDraft({}) }
  function setField(k, v) { setDraft(d => ({ ...d, [k]: v })) }

  const inp = (label, field, opts = {}) => (
    <div className="field-group" style={opts.full ? { gridColumn: '1/-1' } : {}}>
      <div className="field-label">{label}</div>
      <input style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: 'var(--surface-2)', boxSizing: 'border-box' }}
        type={opts.type || 'text'} value={draft[field] ?? ''} onChange={e => setField(field, e.target.value)} />
    </div>
  )

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="avatar" style={{ width: 48, height: 48, fontSize: 15 }}>{initials(owner)}</div>
            <div>
              <div className="drawer-title">{fullName(owner)}</div>
              <div className="drawer-subtitle">Unit {apt?.unit} · {owner.type === 'owner-occupied' ? 'Owner-occupied' : 'Investment'}</div>
            </div>
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
            <>
              <div className="field-grid">
                {inp('First name', 'firstName')}
                {inp('Last name', 'lastName')}
                {inp('Phone', 'phone')}
                {inp('Email', 'email', { full: true })}
                {inp('Mailing address', 'address', { full: true })}
              </div>
              <hr className="divider" />
              <div className="field-group">
                <div className="field-label">Ownership type</div>
                <select value={draft.type ?? owner.type} onChange={e => setField('type', e.target.value)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: 'var(--surface-2)' }}>
                  <option value="investment">Investment property</option>
                  <option value="owner-occupied">Owner-occupied</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="field-grid">
                <div className="field-group"><div className="field-label">Phone</div><div className="field-value">{owner.phone}</div></div>
                <div className="field-group"><div className="field-label">Email</div><div className="field-value" style={{ fontSize: 13 }}>{owner.email}</div></div>
                <div className="field-group" style={{ gridColumn: '1/-1' }}><div className="field-label">Mailing address</div><div className="field-value">{owner.address}</div></div>
              </div>
              <hr className="divider" />
              <div className="field-group">
                <div className="field-label">Ownership type</div>
                <span className={`badge ${owner.type === 'owner-occupied' ? 'badge-blue' : 'badge-gray'}`}>{owner.type === 'owner-occupied' ? 'Owner-occupied' : 'Investment property'}</span>
              </div>
              {agent && (
                <>
                  <hr className="divider" />
                  <div className="field-group">
                    <div className="field-label">Managing agent</div>
                    <div className="field-value">{agent.agencyName}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{agent.agentName} · {agent.phone}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{agent.email}</div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default function OwnersTab({ owners, apartments, agents, onUpdateOwner }) {
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = owners.filter(o => {
    const matchSearch = fullName(o).toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase()) || apartments.find(a => a.id === o.apartmentId)?.unit.includes(search)
    const matchFilter = filter === 'all' || (filter === 'investment' && o.type === 'investment') || (filter === 'owner-occupied' && o.type === 'owner-occupied') || (filter === 'no-agent' && !o.agentId && o.type === 'investment')
    return matchSearch && matchFilter
  })

  const counts = {
    all: owners.length,
    investment: owners.filter(o => o.type === 'investment').length,
    'owner-occupied': owners.filter(o => o.type === 'owner-occupied').length,
    'no-agent': owners.filter(o => !o.agentId && o.type === 'investment').length,
  }

  return (
    <div className="page-body">
      <div className="toolbar" style={{ marginBottom: 20 }}>
        <div className="search-wrap">
          <Search className="search-icon" />
          <input className="search-input" placeholder="Search by name, email or unit…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all','investment','owner-occupied','no-agent'].map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setFilter(f)}>
            {{ all: 'All', investment: 'Investment', 'owner-occupied': 'Owner-occ', 'no-agent': 'No agent' }[f]}
            <span className="count-chip" style={{ background: filter === f ? 'rgba(255,255,255,0.25)' : 'var(--blue-light)', color: filter === f ? '#fff' : 'var(--blue)' }}>{counts[f]}</span>
          </button>
        ))}
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Owner</th><th>Unit</th><th>Phone</th><th>Email</th><th>Type</th><th>Managing agent</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={6}><div className="empty-state"><h3>No owners found</h3></div></td></tr>
                : filtered.map(o => {
                  const apt   = apartments.find(a => a.id === o.apartmentId)
                  const agent = o.agentId ? agents.find(a => a.id === o.agentId) : null
                  return (
                    <tr key={o.id} onClick={() => setSelected(o)}>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><div className="avatar">{initials(o)}</div><span className="td-primary">{fullName(o)}</span></div></td>
                      <td>Unit {apt?.unit}</td>
                      <td>{o.phone}</td>
                      <td style={{ fontSize: 13 }}>{o.email}</td>
                      <td><span className={`badge ${o.type === 'owner-occupied' ? 'badge-blue' : 'badge-gray'}`}>{o.type === 'owner-occupied' ? 'Owner-occ' : 'Investment'}</span></td>
                      <td>{agent ? <span style={{ fontSize: 13 }}>{agent.agencyName}</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
      {selected && <OwnerDrawer owner={owners.find(o => o.id === selected.id) || selected} apt={apartments.find(a => a.id === selected.apartmentId)} agent={selected.agentId ? agents.find(a => a.id === selected.agentId) : null} onClose={() => setSelected(null)} onUpdateOwner={(id, changes) => { onUpdateOwner(id, changes); setSelected(s => ({ ...s, ...changes })) }} />}
    </div>
  )
}
