import { useState } from 'react'
import { Search, X, Pencil, Check, StickyNote, Trash2 } from 'lucide-react'
import { aptStatusLabel, aptStatusBadge, initials, fullName } from '../../data/seed'

function Field({ label, value, editing, field, draft, onChange, type = 'text' }) {
  return (
    <div className="field-group">
      <div className="field-label">{label}</div>
      {editing
        ? <input style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: 'var(--surface-2)' }} type={type} value={draft[field] ?? ''} onChange={e => onChange(field, e.target.value)} />
        : <div className="field-value">{value ?? '—'}</div>}
    </div>
  )
}

function ApartmentDrawer({ apt, tenant, owner, agent, notes, onClose, onUpdateApartment, onAddNote, onDeleteNote }) {
  const [drawerTab, setDrawerTab] = useState('details')
  const [editing, setEditing]     = useState(false)
  const [draft, setDraft]         = useState({})
  const [noteText, setNoteText]   = useState('')

  function startEdit() { setDraft({ ...apt }); setEditing(true) }
  function saveEdit()  { onUpdateApartment(apt.id, draft); setEditing(false) }
  function cancelEdit(){ setEditing(false); setDraft({}) }
  function setField(k, v) { setDraft(d => ({ ...d, [k]: v })) }

  const aptNotes = notes[apt.id] || []

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <div>
            <div className="drawer-title">Unit {apt.unit}</div>
            <div className="drawer-subtitle">Floor {apt.floor} · {apt.bedrooms}b {apt.bathrooms}ba</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {drawerTab === 'details' && !editing && (
              <button onClick={startEdit} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', fontSize: 13 }}>
                <Pencil size={13} /> Edit
              </button>
            )}
            {editing && (
              <>
                <button onClick={saveEdit} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer', fontSize: 13 }}>
                  <Check size={13} /> Save
                </button>
                <button onClick={cancelEdit} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface-2)', cursor: 'pointer', fontSize: 13 }}>
                  Cancel
                </button>
              </>
            )}
            <button className="drawer-close" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        {/* Drawer sub-tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
          {['details','notes'].map(t => (
            <button key={t} onClick={() => { setDrawerTab(t); setEditing(false) }} style={{ padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: drawerTab === t ? 'var(--blue)' : 'var(--text-muted)', borderBottom: drawerTab === t ? '2px solid var(--blue)' : '2px solid transparent', marginBottom: -1, textTransform: 'capitalize' }}>
              {t}{t === 'notes' && aptNotes.length > 0 && <span style={{ marginLeft: 5, background: 'var(--blue-light)', color: 'var(--blue)', borderRadius: 8, padding: '1px 6px', fontSize: 11 }}>{aptNotes.length}</span>}
            </button>
          ))}
        </div>

        <div className="drawer-body">
          {drawerTab === 'details' && (
            <>
              <div className="field-group">
                <div className="field-label">Status</div>
                {editing
                  ? <select value={draft.status ?? apt.status} onChange={e => setField('status', e.target.value)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: 'var(--surface-2)' }}>
                      <option value="tenanted">Tenanted</option>
                      <option value="owner-occupied">Owner-occupied</option>
                      <option value="vacant">Vacant</option>
                    </select>
                  : <span className={`badge ${aptStatusBadge(apt.status)}`}>{aptStatusLabel(apt.status)}</span>}
              </div>

              <div className="field-grid">
                <Field label="Bedrooms"  value={apt.bedrooms}  editing={editing} field="bedrooms"  draft={draft} onChange={setField} type="number" />
                <Field label="Bathrooms" value={apt.bathrooms} editing={editing} field="bathrooms" draft={draft} onChange={setField} type="number" />
                <Field label="Parking"   value={apt.parking}   editing={editing} field="parking"   draft={draft} onChange={setField} />
                <Field label="Entitlement" value={apt.entitlement + '%'} editing={editing} field="entitlement" draft={draft} onChange={setField} type="number" />
              </div>

              {owner && (
                <>
                  <hr className="divider" />
                  <div className="field-group">
                    <div className="field-label">Owner</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div className="avatar">{initials(owner)}</div>
                      <div>
                        <div className="field-value">{fullName(owner)}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{owner.type === 'owner-occupied' ? 'Owner-occupied' : 'Investment property'}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

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

              {tenant && (
                <>
                  <hr className="divider" />
                  <div className="field-group">
                    <div className="field-label">Current tenant</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div className="avatar" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>{initials(tenant)}</div>
                      <div>
                        <div className="field-value">{fullName(tenant)}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Lease ends {new Date(tenant.leaseEnd).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                  </div>
                  <div className="field-grid">
                    <div className="field-group"><div className="field-label">Rent (pcm)</div><div className="field-value">${tenant.rent.toLocaleString()}</div></div>
                    <div className="field-group"><div className="field-label">Lease start</div><div className="field-value">{new Date(tenant.leaseStart).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</div></div>
                  </div>
                </>
              )}
            </>
          )}

          {drawerTab === 'notes' && (
            <div>
              {/* Add note */}
              <div style={{ marginBottom: 20 }}>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Add a note about this unit…"
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, resize: 'vertical', fontFamily: 'inherit', background: 'var(--surface-2)', boxSizing: 'border-box' }}
                />
                <button
                  onClick={() => { if (noteText.trim()) { onAddNote(apt.id, noteText.trim()); setNoteText('') } }}
                  style={{ marginTop: 8, padding: '8px 16px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
                >
                  Add Note
                </button>
              </div>

              {/* Notes list */}
              {aptNotes.length === 0
                ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    <StickyNote size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                    <div>No notes yet</div>
                  </div>
                : [...aptNotes].reverse().map(n => (
                  <div key={n.id} style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--surface-2)', marginBottom: 10, position: 'relative' }}>
                    <div style={{ fontSize: 13, lineHeight: 1.5, paddingRight: 24 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{n.createdAt}</div>
                    <button onClick={() => onDeleteNote(apt.id, n.id)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function ApartmentsTab({ apartments, tenants, owners, agents, notes, onUpdateApartment, onAddNote, onDeleteNote }) {
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = apartments.filter(a => {
    const tenant = tenants.find(t => t.apartmentId === a.id)
    const owner  = owners.find(o => o.apartmentId === a.id)
    const matchSearch =
      a.unit.includes(search) ||
      (tenant && fullName(tenant).toLowerCase().includes(search.toLowerCase())) ||
      (owner  && fullName(owner).toLowerCase().includes(search.toLowerCase()))
    const matchFilter =
      filter === 'all' ||
      (filter === 'tenanted'       && a.status === 'tenanted') ||
      (filter === 'owner-occupied' && a.status === 'owner-occupied') ||
      (filter === 'vacant'         && a.status === 'vacant')
    return matchSearch && matchFilter
  })

  const counts = {
    all: apartments.length,
    tenanted:       apartments.filter(a => a.status === 'tenanted').length,
    'owner-occupied': apartments.filter(a => a.status === 'owner-occupied').length,
    vacant:         apartments.filter(a => a.status === 'vacant').length,
  }

  return (
    <div className="page-body">
      <div className="toolbar" style={{ marginBottom: 20 }}>
        <div className="search-wrap">
          <Search className="search-icon" />
          <input className="search-input" placeholder="Search by unit, tenant or owner…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all','tenanted','owner-occupied','vacant'].map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => setFilter(f)}>
            {{ all: 'All', tenanted: 'Tenanted', 'owner-occupied': 'Owner-occ', vacant: 'Vacant' }[f]}
            <span className="count-chip" style={{ background: filter === f ? 'rgba(255,255,255,0.25)' : 'var(--blue-light)', color: filter === f ? '#fff' : 'var(--blue)' }}>{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Unit</th><th>Floor</th><th>Type</th><th>Status</th><th>Tenant</th><th>Owner</th><th>Agent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const tenant = tenants.find(t => t.apartmentId === a.id)
                const owner  = owners.find(o => o.apartmentId === a.id)
                const agent  = owner?.agentId ? agents.find(ag => ag.id === owner.agentId) : null
                const noteCount = (notes[a.id] || []).length
                return (
                  <tr key={a.id} onClick={() => setSelected(a)}>
                    <td className="td-primary">
                      Unit {a.unit}
                      {noteCount > 0 && <span style={{ marginLeft: 6, background: 'var(--amber)', color: '#fff', borderRadius: 8, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>{noteCount}</span>}
                    </td>
                    <td>Level {a.floor}</td>
                    <td><span style={{ marginRight: 4 }}>🛏</span>{a.bedrooms}b <span style={{ marginRight: 4, marginLeft: 4 }}>🚿</span>{a.bathrooms}b {a.parking && <><span style={{ marginLeft: 4, marginRight: 4 }}>🚗</span>yes</>}</td>
                    <td><span className={`badge ${aptStatusBadge(a.status)}`}>{aptStatusLabel(a.status)}</span></td>
                    <td>{tenant ? fullName(tenant) : '—'}</td>
                    <td>{owner ? fullName(owner) : '—'}</td>
                    <td style={{ fontSize: 13 }}>{agent ? agent.agencyName : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (() => {
        const tenant = tenants.find(t => t.apartmentId === selected.id)
        const owner  = owners.find(o => o.apartmentId === selected.id)
        const agent  = owner?.agentId ? agents.find(ag => ag.id === owner.agentId) : null
        // Keep selected in sync with apartments array
        const liveApt = apartments.find(a => a.id === selected.id) || selected
        return (
          <ApartmentDrawer
            apt={liveApt}
            tenant={tenant} owner={owner} agent={agent}
            notes={notes}
            onClose={() => setSelected(null)}
            onUpdateApartment={(id, changes) => { onUpdateApartment(id, changes); setSelected(s => ({ ...s, ...changes })) }}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
          />
        )
      })()}
    </div>
  )
}
