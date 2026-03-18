import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { TENANTS, APARTMENTS, fullName, initials } from '../../data/seed'

function leaseStatus(endDate) {
  const end  = new Date(endDate)
  const now  = new Date()
  const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  if (days < 0)   return { label: 'Expired',     cls: 'badge-red' }
  if (days <= 60) return { label: 'Expiring soon', cls: 'badge-amber' }
  return             { label: 'Active',          cls: 'badge-green' }
}

function TenantDrawer({ tenant, onClose }) {
  const apt = APARTMENTS.find(a => a.id === tenant.apartmentId)
  const ls  = leaseStatus(tenant.leaseEnd)

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="avatar" style={{ width: 48, height: 48, fontSize: 15, background: 'var(--green-light)', color: 'var(--green)' }}>
              {initials(tenant)}
            </div>
            <div>
              <div className="drawer-title">{fullName(tenant)}</div>
              <div className="drawer-subtitle">Unit {apt?.unit} · Floor {apt?.floor}</div>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="drawer-body">
          <div className="field-grid">
            <div className="field-group">
              <div className="field-label">Phone</div>
              <div className="field-value">{tenant.phone}</div>
            </div>
            <div className="field-group">
              <div className="field-label">Email</div>
              <div className="field-value" style={{ fontSize: 13 }}>{tenant.email}</div>
            </div>
          </div>

          <hr className="divider" />

          <div className="field-group">
            <div className="field-label">Lease status</div>
            <span className={`badge ${ls.cls}`}>{ls.label}</span>
          </div>

          <div className="field-grid">
            <div className="field-group">
              <div className="field-label">Lease start</div>
              <div className="field-value">
                {new Date(tenant.leaseStart).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="field-group">
              <div className="field-label">Lease end</div>
              <div className="field-value">
                {new Date(tenant.leaseEnd).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="field-group">
              <div className="field-label">Monthly rent</div>
              <div className="field-value">${tenant.rent.toLocaleString()}</div>
            </div>
            <div className="field-group">
              <div className="field-label">Move-in date</div>
              <div className="field-value">
                {new Date(tenant.moveInDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="field-group">
            <div className="field-label">Emergency contact</div>
            <div className="field-value">{tenant.emergencyContact}</div>
          </div>

          <div className="field-group">
            <div className="field-label">Pets registered</div>
            <span className={`badge ${tenant.pets ? 'badge-amber' : 'badge-gray'}`}>
              {tenant.pets ? 'Yes — pet on record' : 'No pets'}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default function TenantsTab({ buildingId }) {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [selected, setSelected] = useState(null)

  const tenants = TENANTS.filter(t => t.buildingId === buildingId)

  const filtered = tenants.filter(t => {
    const apt = APARTMENTS.find(a => a.id === t.apartmentId)
    const matchSearch =
      fullName(t).toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      apt?.unit.includes(search)
    const ls = leaseStatus(t.leaseEnd)
    const matchFilter =
      filter === 'all' ||
      (filter === 'active'  && ls.label === 'Active') ||
      (filter === 'expiring' && ls.label === 'Expiring soon') ||
      (filter === 'expired'  && ls.label === 'Expired')
    return matchSearch && matchFilter
  })

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
        {['all','active','expiring','expired'].map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: 13 }}
            onClick={() => setFilter(f)}
          >
            {{ all: 'All', active: 'Active', expiring: 'Expiring', expired: 'Expired' }[f]}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Unit</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Lease end</th>
                <th>Rent/mo</th>
                <th>Lease</th>
                <th>Pets</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><h3>No tenants found</h3></div></td></tr>
              ) : filtered.map(t => {
                const apt = APARTMENTS.find(a => a.id === t.apartmentId)
                const ls  = leaseStatus(t.leaseEnd)
                return (
                  <tr key={t.id} onClick={() => setSelected(t)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div className="avatar" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                          {initials(t)}
                        </div>
                        <span className="td-primary">{fullName(t)}</span>
                      </div>
                    </td>
                    <td>Unit {apt?.unit}</td>
                    <td>{t.phone}</td>
                    <td style={{ fontSize: 13 }}>{t.email}</td>
                    <td>{new Date(t.leaseEnd).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>${t.rent.toLocaleString()}</td>
                    <td><span className={`badge ${ls.cls}`}>{ls.label}</span></td>
                    <td><span className={`badge ${t.pets ? 'badge-amber' : 'badge-gray'}`}>{t.pets ? 'Yes' : 'No'}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <TenantDrawer tenant={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
