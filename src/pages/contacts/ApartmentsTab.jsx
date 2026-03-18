import { useState } from 'react'
import { Search, X, BedDouble, Car } from 'lucide-react'
import {
  APARTMENTS, TENANTS, OWNERS, AGENTS,
  fullName, initials, aptStatusLabel, aptStatusBadge,
} from '../../data/seed'

function ApartmentDrawer({ apt, onClose }) {
  const owner  = OWNERS.find(o => o.apartmentId === apt.id)
  const tenant = TENANTS.find(t => t.apartmentId === apt.id)
  const agent  = owner?.agentId ? AGENTS.find(a => a.id === owner.agentId) : null

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <div>
            <div className="drawer-title">Unit {apt.unit}</div>
            <div className="drawer-subtitle">
              Floor {apt.floor} &middot; {apt.bedrooms} bed / {apt.bathrooms} bath
              {apt.parking ? ` · Parking ${apt.parking}` : ''}
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="drawer-body">
          {/* Status */}
          <div className="field-group">
            <div className="field-label">Status</div>
            <span className={`badge ${aptStatusBadge(apt.status)}`}>
              {aptStatusLabel(apt.status)}
            </span>
          </div>

          <hr className="divider" />

          {/* Owner */}
          {owner ? (
            <div className="field-group">
              <div className="field-label">Owner</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div className="avatar">{initials(owner)}</div>
                <div>
                  <div className="field-value">{fullName(owner)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {owner.type === 'owner-occupied' ? 'Owner-occupied' : 'Investment property'}
                  </div>
                </div>
              </div>
              <div className="field-grid">
                <div>
                  <div className="field-label">Phone</div>
                  <div className="field-value">{owner.phone}</div>
                </div>
                <div>
                  <div className="field-label">Email</div>
                  <div className="field-value" style={{ fontSize: 13 }}>{owner.email}</div>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <div className="field-label">Mailing address</div>
                  <div className="field-value">{owner.address}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="field-group">
              <div className="field-label">Owner</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No owner recorded</div>
            </div>
          )}

          <hr className="divider" />

          {/* Managing Agent */}
          {agent ? (
            <div className="field-group">
              <div className="field-label">Managing agent</div>
              <div className="field-value">{agent.agencyName}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                {agent.agentName} &middot; {agent.phone}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{agent.email}</div>
            </div>
          ) : owner?.type === 'investment' ? (
            <div className="field-group">
              <div className="field-label">Managing agent</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No agent assigned</div>
            </div>
          ) : null}

          {/* Tenant */}
          {tenant ? (
            <>
              <hr className="divider" />
              <div className="field-group">
                <div className="field-label">Current tenant</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div className="avatar" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                    {initials(tenant)}
                  </div>
                  <div>
                    <div className="field-value">{fullName(tenant)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Lease ends {new Date(tenant.leaseEnd).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="field-grid">
                  <div>
                    <div className="field-label">Phone</div>
                    <div className="field-value">{tenant.phone}</div>
                  </div>
                  <div>
                    <div className="field-label">Rent (pcm)</div>
                    <div className="field-value">${tenant.rent.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="field-label">Lease start</div>
                    <div className="field-value">
                      {new Date(tenant.leaseStart).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div className="field-label">Lease end</div>
                    <div className="field-value">
                      {new Date(tenant.leaseEnd).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <div className="field-label">Emergency contact</div>
                    <div className="field-value">{tenant.emergencyContact}</div>
                  </div>
                  <div>
                    <div className="field-label">Pets registered</div>
                    <div className="field-value">{tenant.pets ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default function ApartmentsTab({ buildingId }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)

  const apts = APARTMENTS.filter(a => a.buildingId === buildingId)

  const filtered = apts.filter(a => {
    const matchSearch =
      a.unit.toLowerCase().includes(search.toLowerCase()) ||
      (() => {
        const t = TENANTS.find(t => t.apartmentId === a.id)
        const o = OWNERS.find(o => o.apartmentId === a.id)
        return (
          (t && fullName(t).toLowerCase().includes(search.toLowerCase())) ||
          (o && fullName(o).toLowerCase().includes(search.toLowerCase()))
        )
      })()
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    return matchSearch && matchStatus
  })

  const counts = {
    all:            apts.length,
    tenanted:       apts.filter(a => a.status === 'tenanted').length,
    'owner-occupied': apts.filter(a => a.status === 'owner-occupied').length,
    vacant:         apts.filter(a => a.status === 'vacant').length,
  }

  return (
    <div className="page-body">
      {/* Toolbar */}
      <div className="toolbar" style={{ marginBottom: 20 }}>
        <div className="search-wrap">
          <Search className="search-icon" />
          <input
            className="search-input"
            placeholder="Search by unit, tenant or owner…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all','tenanted','owner-occupied','vacant'].map(s => (
            <button
              key={s}
              className={`btn ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 12px', fontSize: 13 }}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'all' ? 'All' : aptStatusLabel(s)}
              <span className="count-chip" style={{
                background: filterStatus === s ? 'rgba(255,255,255,0.25)' : 'var(--blue-light)',
                color: filterStatus === s ? '#fff' : 'var(--blue)',
              }}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Unit</th>
                <th>Floor</th>
                <th>Type</th>
                <th>Status</th>
                <th>Tenant</th>
                <th>Owner</th>
                <th>Agent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-state-icon">&#127968;</div>
                      <h3>No apartments found</h3>
                      <p>Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(apt => {
                const tenant = TENANTS.find(t => t.apartmentId === apt.id)
                const owner  = OWNERS.find(o => o.apartmentId === apt.id)
                const agent  = owner?.agentId ? AGENTS.find(a => a.id === owner.agentId) : null
                return (
                  <tr key={apt.id} onClick={() => setSelected(apt)}>
                    <td className="td-primary">Unit {apt.unit}</td>
                    <td>Level {apt.floor}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
                        <BedDouble size={13} /> {apt.bedrooms}b
                        {apt.parking && <><Car size={13} style={{ marginLeft: 4 }} /> yes</>}
                      </span>
                    </td>
                    <td><span className={`badge ${aptStatusBadge(apt.status)}`}>{aptStatusLabel(apt.status)}</span></td>
                    <td>{tenant ? fullName(tenant) : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td>{owner  ? fullName(owner)  : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td>{agent  ? agent.agencyName : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <ApartmentDrawer apt={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
