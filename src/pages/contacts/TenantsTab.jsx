import { useState } from 'react'
import { Search, X, Phone, Mail, MessageSquare, FileText, Wrench, ChevronRight } from 'lucide-react'
import { fullName, initials } from '../../data/seed'

const BLUE = '#1d5fc4'

// ─── Entry types ──────────────────────────────────────────────────────────────
const ENTRY_TYPES = [
  { id:'call',     label:'Phone call',   icon:'📞', color:'#fef3c7', textColor:'#92400e' },
  { id:'email',    label:'Email',        icon:'✉️',  color:'#e8f0fd', textColor:'#1d5fc4' },
  { id:'sms',      label:'SMS',          icon:'💬', color:'#f0fdf4', textColor:'#15803d' },
  { id:'whatsapp', label:'WhatsApp',     icon:'📱', color:'#f0fdf4', textColor:'#15803d' },
  { id:'note',     label:'Note',         icon:'📝', color:'#f3f4f6', textColor:'#374151' },
  { id:'workorder',label:'Work order',   icon:'🔧', color:'#fae8ff', textColor:'#7c3aed' },
  { id:'letter',   label:'Letter/Notice',icon:'📄', color:'#fff7ed', textColor:'#c2410c' },
  { id:'visit',    label:'Site visit',   icon:'🏠', color:'#eff6ff', textColor:'#1d5fc4' },
  { id:'inspection',label:'Inspection',  icon:'🔍', color:'#f0fdf4', textColor:'#15803d' },
]

const DIRECTIONS = [
  { id:'inbound',  label:'Inbound  (from tenant)' },
  { id:'outbound', label:'Outbound (to tenant)' },
  { id:'internal', label:'Internal note' },
]

// Seed diary entries per tenant id
const SEED_DIARY = {
  'ten-1': [
    { id:'d1', type:'call',  direction:'inbound',  ts:'22 Mar 2026, 9:14 am',  author:'Building Manager', subject:'Hot water not working', body:'Tenant called to report no hot water. Advised plumber will attend next morning 9–11am. Reference WO-001 raised.' },
    { id:'d2', type:'sms',   direction:'inbound',  ts:'22 Mar 2026, 8:50 am',  author:'Aiden Walsh',       subject:'Follow-up re plumber', body:'Just checking — is the plumber still coming today?' },
    { id:'d3', type:'email', direction:'outbound', ts:'20 Mar 2026, 3:00 pm',  author:'Building Manager', subject:'Lease renewal offer attached', body:'Sent lease renewal offer for 2026–27. Requested response by 15 Apr 2026.' },
  ],
  'ten-2': [
    { id:'d4', type:'whatsapp', direction:'inbound', ts:'21 Mar 2026, 11:20 am', author:'Chloe Dubois',    subject:'Lease renewal enquiry', body:'Hi, I wanted to ask about renewing my lease. It expires in January.' },
    { id:'d5', type:'sms',      direction:'outbound',ts:'21 Mar 2026, 11:45 am', author:'Building Manager',subject:"Renewal response",       body:"Great timing! I'll send you the renewal offer this week." },
  ],
}

// ─── Diary log form ───────────────────────────────────────────────────────────
function LogEntryForm({ tenantName, onAdd, onClose }) {
  const [type,setType]           = useState('call')
  const [direction,setDirection] = useState('inbound')
  const [subject,setSubject]     = useState('')
  const [body,setBody]           = useState('')
  const [author,setAuthor]       = useState('Building Manager')
  const [date,setDate]           = useState(new Date().toISOString().slice(0,10))
  const [time,setTime]           = useState(new Date().toTimeString().slice(0,5))

  const et = ENTRY_TYPES.find(e => e.id === type)

  const PLACEHOLDERS = {
    call:      'Who called, what was discussed, what action was agreed…',
    email:     'Subject and summary of the email content…',
    sms:       'SMS content…',
    whatsapp:  'WhatsApp message content…',
    note:      'Internal note about this tenant…',
    workorder: 'Work order reference, issue description, outcome…',
    letter:    'Notice type, contents, method of delivery…',
    visit:     'Who attended, purpose, what was found, outcome…',
    inspection:'Inspection type, findings, follow-up required…',
  }

  function save() {
    if (!body.trim()) return
    const ts = new Date(`${date}T${time}`).toLocaleString('en-AU', {
      day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
    })
    onAdd({ id:'d-'+Date.now(), type, direction, ts, author, subject:subject.trim(), body:body.trim() })
    onClose()
  }

  return (
    <div style={{ padding:20, background:'#fafeff', borderTop:`2px solid ${BLUE}` }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'#111827' }}>📋 Log communication</div>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:18 }}>×</button>
      </div>

      {/* Type grid */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>Type</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
          {ENTRY_TYPES.map(e => (
            <div key={e.id} onClick={() => setType(e.id)}
              style={{ padding:'7px 6px', borderRadius:7, border:type===e.id?`2px solid ${BLUE}`:'1px solid #e5e7eb', background:type===e.id?'#eff6ff':'#fff', cursor:'pointer', textAlign:'center' }}>
              <div style={{ fontSize:16, marginBottom:2 }}>{e.icon}</div>
              <div style={{ fontSize:10, fontWeight:type===e.id?700:500, color:type===e.id?BLUE:'#374151', lineHeight:1.2 }}>{e.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Direction + author row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>Direction</div>
          <select value={direction} onChange={e=>setDirection(e.target.value)}
            style={{ width:'100%', padding:'8px 10px', borderRadius:6, border:'1px solid #d1d5db', fontSize:13, background:'#fff', boxSizing:'border-box', appearance:'auto' }}>
            {DIRECTIONS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>Logged by</div>
          <input value={author} onChange={e=>setAuthor(e.target.value)}
            style={{ width:'100%', padding:'8px 10px', borderRadius:6, border:'1px solid #d1d5db', fontSize:13, boxSizing:'border-box' }}/>
        </div>
      </div>

      {/* Date + time */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>Date</div>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{ width:'100%', padding:'8px 10px', borderRadius:6, border:'1px solid #d1d5db', fontSize:13, boxSizing:'border-box' }}/>
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>Time</div>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)}
            style={{ width:'100%', padding:'8px 10px', borderRadius:6, border:'1px solid #d1d5db', fontSize:13, boxSizing:'border-box' }}/>
        </div>
      </div>

      {/* Subject */}
      <div style={{ marginBottom:10 }}>
        <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>Subject / title</div>
        <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Brief subject line…"
          style={{ width:'100%', padding:'8px 10px', borderRadius:6, border:'1px solid #d1d5db', fontSize:13, boxSizing:'border-box' }}/>
      </div>

      {/* Body */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>{et.icon} Details</div>
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder={PLACEHOLDERS[type]} rows={4}
          style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #d1d5db', fontSize:13, resize:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
      </div>

      <div style={{ display:'flex', gap:8 }}>
        <button onClick={save} disabled={!body.trim()}
          style={{ flex:1, padding:'9px', borderRadius:6, border:'none', background:body.trim()?BLUE:'#d1d5db', color:'#fff', fontSize:13, fontWeight:600, cursor:body.trim()?'pointer':'not-allowed' }}>
          Save to diary
        </button>
        <button onClick={onClose}
          style={{ padding:'9px 14px', borderRadius:6, border:'1px solid #d1d5db', background:'#fff', fontSize:13, cursor:'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Diary timeline ───────────────────────────────────────────────────────────
function DiaryTimeline({ entries, onAdd, tenantName }) {
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState('all')

  const filtered = filterType === 'all' ? entries : entries.filter(e => e.type === filterType)
  const sorted   = [...filtered].sort((a,b) => new Date(b.ts) - new Date(a.ts))

  const directionBadge = d => ({
    inbound:  { bg:'#dcfce7', color:'#15803d', label:'Inbound' },
    outbound: { bg:'#e8f0fd', color:'#1d5fc4', label:'Outbound' },
    internal: { bg:'#f3f4f6', color:'#6b7280', label:'Internal' },
  }[d] || { bg:'#f3f4f6', color:'#6b7280', label:d }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>

      {/* Toolbar */}
      <div style={{ padding:'12px 16px', borderBottom:'1px solid #e5e7eb', background:'#fff', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#111827' }}>📋 Communication diary</div>
          <button onClick={() => setShowForm(s => !s)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:6, border:'none', background:BLUE, color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
            + Log entry
          </button>
        </div>
        {/* Type filter pills */}
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          <button onClick={() => setFilterType('all')}
            style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:500, cursor:'pointer', border:'none', background:filterType==='all'?BLUE:'#f3f4f6', color:filterType==='all'?'#fff':'#6b7280' }}>
            All ({entries.length})
          </button>
          {ENTRY_TYPES.filter(e => entries.some(en => en.type === e.id)).map(e => (
            <button key={e.id} onClick={() => setFilterType(e.id)}
              style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:500, cursor:'pointer', border:'none', background:filterType===e.id?e.color:'#f3f4f6', color:filterType===e.id?e.textColor:'#6b7280' }}>
              {e.icon} {e.label} ({entries.filter(en=>en.type===e.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Log form */}
      {showForm && <LogEntryForm tenantName={tenantName} onAdd={onAdd} onClose={() => setShowForm(false)}/>}

      {/* Timeline */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
        {sorted.length === 0
          ? (
            <div style={{ textAlign:'center', padding:'48px 0', color:'#9ca3af' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
              <div style={{ fontSize:14, fontWeight:500, color:'#374151', marginBottom:4 }}>No diary entries yet</div>
              <div style={{ fontSize:13 }}>Log calls, emails, messages and notes for this tenant.</div>
            </div>
          )
          : sorted.map((entry, i, arr) => {
              const et = ENTRY_TYPES.find(e => e.id === entry.type) || ENTRY_TYPES[4]
              const db = directionBadge(entry.direction)
              return (
                <div key={entry.id} style={{ display:'flex', gap:12, position:'relative', marginBottom:4 }}>
                  {/* Connecting line */}
                  {i < arr.length-1 && (
                    <div style={{ position:'absolute', left:13, top:28, bottom:-4, width:2, background:'#e5e7eb', zIndex:0 }}/>
                  )}
                  {/* Icon dot */}
                  <div style={{ width:28, height:28, borderRadius:'50%', background:et.color, border:'2px solid #fff', boxShadow:'0 0 0 2px #e5e7eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0, zIndex:1 }}>
                    {et.icon}
                  </div>
                  {/* Content card */}
                  <div style={{ flex:1, background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, padding:'10px 14px', marginBottom:12 }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:5 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                        <span style={{ fontSize:12, fontWeight:700, color:'#111827' }}>{et.label}</span>
                        <span style={{ fontSize:10, fontWeight:600, background:db.bg, color:db.color, padding:'2px 7px', borderRadius:99 }}>{db.label}</span>
                        {entry.subject && (
                          <span style={{ fontSize:12, color:'#374151', fontWeight:500 }}>— {entry.subject}</span>
                        )}
                      </div>
                      <span style={{ fontSize:11, color:'#9ca3af', whiteSpace:'nowrap', flexShrink:0 }}>{entry.ts}</span>
                    </div>
                    <div style={{ fontSize:13, color:'#374151', lineHeight:1.5, background:'#f9fafb', borderRadius:6, padding:'8px 10px', marginBottom:6 }}>
                      {entry.body}
                    </div>
                    <div style={{ fontSize:11, color:'#9ca3af' }}>Logged by {entry.author}</div>
                  </div>
                </div>
              )
            })
        }
      </div>
    </div>
  )
}

// ─── Tenant drawer ────────────────────────────────────────────────────────────
function TenantDrawer({ tenant, apartment, owner, agent, diary, onAddDiaryEntry, onClose }) {
  const [tab, setTab] = useState('details')

  const leaseEnd   = tenant.leaseEnd   ? new Date(tenant.leaseEnd)   : null
  const leaseStart = tenant.leaseStart ? new Date(tenant.leaseStart) : null
  const today      = new Date()
  const daysLeft   = leaseEnd ? Math.ceil((leaseEnd - today) / (1000*60*60*24)) : null
  const leaseStatus = daysLeft === null ? 'unknown'
    : daysLeft < 0   ? 'expired'
    : daysLeft < 30  ? 'expiring-soon'
    : daysLeft < 90  ? 'expiring'
    : 'active'
  const leaseStatusStyles = {
    active:         { bg:'#dcfce7', color:'#15803d', label:`Active · ${daysLeft}d left` },
    expiring:       { bg:'#fef3c7', color:'#92400e', label:`Expiring soon · ${daysLeft}d` },
    'expiring-soon':{ bg:'#fee2e2', color:'#dc2626', label:`Expires in ${daysLeft}d` },
    expired:        { bg:'#f3f4f6', color:'#6b7280', label:'Expired' },
    unknown:        { bg:'#f3f4f6', color:'#6b7280', label:'Unknown' },
  }[leaseStatus]

  const TABS = [
    { id:'details', label:'Details' },
    { id:'diary',   label:'Diary', badge: diary.length || null },
  ]

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}/>
      <div className="drawer" style={{ width:520 }}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:'50%', background:'#dcfce7', color:'#15803d', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:15, flexShrink:0 }}>
              {initials(tenant)}
            </div>
            <div>
              <div className="drawer-title">{fullName(tenant)}</div>
              <div className="drawer-subtitle">
                {apartment ? `Unit ${apartment.unit}` : ''} · {tenant.phone}
                {leaseStatus !== 'unknown' && (
                  <span style={{ marginLeft:8, fontSize:10, fontWeight:600, background:leaseStatusStyles.bg, color:leaseStatusStyles.color, padding:'2px 7px', borderRadius:99 }}>
                    {leaseStatusStyles.label}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}><X size={18}/></button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, borderBottom:'1px solid #e5e7eb', padding:'0 22px', background:'#fff', flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding:'10px 16px', border:'none', background:'none', cursor:'pointer', fontSize:13, fontWeight:500, color:tab===t.id?BLUE:'#6b7280', borderBottom:tab===t.id?`2px solid ${BLUE}`:'2px solid transparent', marginBottom:-1, display:'flex', alignItems:'center', gap:6 }}>
              {t.label}
              {t.badge && (
                <span style={{ background:'#e8f0fd', color:BLUE, fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:99 }}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Details tab */}
        {tab === 'details' && (
          <div className="drawer-body">
            {/* Quick actions */}
            <div style={{ display:'flex', gap:8, marginBottom:20 }}>
              {[
                { icon:<Phone size={14}/>, label:'Call', color:BLUE },
                { icon:<Mail size={14}/>, label:'Email', color:BLUE },
                { icon:<MessageSquare size={14}/>, label:'SMS', color:BLUE },
              ].map(a => (
                <button key={a.label}
                  style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'8px', borderRadius:7, border:`1px solid ${a.color}`, background:'#eff6ff', color:a.color, fontSize:13, fontWeight:500, cursor:'pointer' }}>
                  {a.icon} {a.label}
                </button>
              ))}
            </div>

            {/* Lease details */}
            <div style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:10, padding:'14px 16px', marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Lease</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[
                  { label:'Start date',   value:leaseStart?.toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}) },
                  { label:'End date',     value:leaseEnd?.toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}) },
                  { label:'Rent (pcm)',   value:tenant.rent ? `$${tenant.rent.toLocaleString()}` : '—' },
                  { label:'Move-in',      value:tenant.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}) : '—' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize:11, color:'#9ca3af', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.04em', fontWeight:600 }}>{f.label}</div>
                    <div style={{ fontSize:13, fontWeight:500, color:'#111827' }}>{f.value||'—'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact details */}
            <div style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:10, padding:'14px 16px', marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Contact</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[
                  { label:'Phone',  value:tenant.phone },
                  { label:'Email',  value:tenant.email },
                  { label:'Emergency contact', value:tenant.emergencyContact },
                  { label:'Pets',   value:tenant.pets ? '✅ Yes' : '❌ No' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize:11, color:'#9ca3af', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.04em', fontWeight:600 }}>{f.label}</div>
                    <div style={{ fontSize:13, color:'#374151' }}>{f.value||'—'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property */}
            {apartment && (
              <div style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:10, padding:'14px 16px', marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Property</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  {[
                    { label:'Unit',      value:`Unit ${apartment.unit}` },
                    { label:'Floor',     value:`Level ${apartment.floor}` },
                    { label:'Layout',    value:`${apartment.bedrooms}b ${apartment.bathrooms}ba` },
                    { label:'Parking',   value:apartment.parking || 'None' },
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontSize:11, color:'#9ca3af', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.04em', fontWeight:600 }}>{f.label}</div>
                      <div style={{ fontSize:13, color:'#374151' }}>{f.value||'—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diary preview — last 3 entries */}
            {diary.length > 0 && (
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#374151' }}>📋 Recent diary entries</div>
                  <button onClick={() => setTab('diary')} style={{ fontSize:12, color:BLUE, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                    View all {diary.length} <ChevronRight size={12}/>
                  </button>
                </div>
                {[...diary].sort((a,b) => new Date(b.ts)-new Date(a.ts)).slice(0,3).map(entry => {
                  const et = ENTRY_TYPES.find(e => e.id === entry.type) || ENTRY_TYPES[4]
                  return (
                    <div key={entry.id} style={{ display:'flex', gap:10, padding:'8px 10px', background:'#f9fafb', borderRadius:8, marginBottom:6, border:'1px solid #f3f4f6' }}>
                      <span style={{ fontSize:16 }}>{et.icon}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:600, color:'#111827', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {entry.subject || entry.body.substring(0,50)}
                        </div>
                        <div style={{ fontSize:11, color:'#9ca3af', marginTop:1 }}>{et.label} · {entry.ts}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Log entry prompt if empty */}
            {diary.length === 0 && (
              <div style={{ textAlign:'center', padding:'20px', background:'#f9fafb', borderRadius:10, border:'1px dashed #d1d5db' }}>
                <div style={{ fontSize:24, marginBottom:6 }}>📋</div>
                <div style={{ fontSize:13, fontWeight:500, color:'#374151', marginBottom:4 }}>No diary entries yet</div>
                <div style={{ fontSize:12, color:'#9ca3af', marginBottom:12 }}>Start logging calls, emails and messages for this tenant.</div>
                <button onClick={() => setTab('diary')}
                  style={{ padding:'7px 14px', borderRadius:6, border:'none', background:BLUE, color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  Open diary
                </button>
              </div>
            )}
          </div>
        )}

        {/* Diary tab */}
        {tab === 'diary' && (
          <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <DiaryTimeline
              entries={diary}
              onAdd={onAddDiaryEntry}
              tenantName={fullName(tenant)}
            />
          </div>
        )}
      </div>
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function TenantsTab({ tenants, apartments }) {
  const [search,setSearch]     = useState('')
  const [filter,setFilter]     = useState('all')
  const [selected,setSelected] = useState(null)
  const [diaries,setDiaries]   = useState(SEED_DIARY)

  const filtered = tenants.filter(t => {
    const apt = apartments?.find(a => a.id === t.apartmentId)
    const matchSearch = fullName(t).toLowerCase().includes(search.toLowerCase()) ||
      (apt && apt.unit.includes(search))
    const matchFilter = filter === 'all' ||
      (filter === 'active'  && new Date(t.leaseEnd) >= new Date()) ||
      (filter === 'expiring'&& (() => { const d=Math.ceil((new Date(t.leaseEnd)-new Date())/(1000*60*60*24)); return d>=0&&d<90 })()) ||
      (filter === 'expired' && new Date(t.leaseEnd) < new Date())
    return matchSearch && matchFilter
  })

  function addDiaryEntry(tenantId, entry) {
    setDiaries(prev => ({
      ...prev,
      [tenantId]: [...(prev[tenantId]||[]), entry]
    }))
  }

  const selectedTenant = tenants.find(t => t.id === selected)
  const selectedApt    = selectedTenant ? apartments?.find(a => a.id === selectedTenant.apartmentId) : null
  const selectedDiary  = selected ? (diaries[selected]||[]) : []

  return (
    <div className="page-body">
      <div className="toolbar" style={{ marginBottom:20 }}>
        <div className="search-wrap">
          <Search className="search-icon"/>
          <input className="search-input" placeholder="Search tenants or unit…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {['all','active','expiring','expired'].map(f => (
          <button key={f} className={`btn ${filter===f?'btn-primary':'btn-ghost'}`} style={{ padding:'6px 12px', fontSize:13 }} onClick={()=>setFilter(f)}>
            {{ all:'All', active:'Active', expiring:'Expiring (90d)', expired:'Expired' }[f]}
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
                <th>Rent</th>
                <th>Diary</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ textAlign:'center', padding:'40px', color:'#9ca3af', fontSize:13 }}>No tenants found.</td></tr>
                : filtered.map(t => {
                    const apt     = apartments?.find(a => a.id === t.apartmentId)
                    const dCount  = (diaries[t.id]||[]).length
                    const leaseEnd = t.leaseEnd ? new Date(t.leaseEnd) : null
                    const daysLeft = leaseEnd ? Math.ceil((leaseEnd - new Date())/(1000*60*60*24)) : null
                    const leaseColor = daysLeft===null?'#9ca3af':daysLeft<0?'#9ca3af':daysLeft<30?'#dc2626':daysLeft<90?'#d97706':'#16a34a'
                    return (
                      <tr key={t.id} onClick={() => setSelected(t.id)}
                        onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
                        onMouseLeave={e=>e.currentTarget.style.background=''}>
                        <td className="td-primary">
                          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                            <div style={{ width:30, height:30, borderRadius:'50%', background:'#dcfce7', color:'#15803d', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:11, flexShrink:0 }}>
                              {initials(t)}
                            </div>
                            {fullName(t)}
                          </div>
                        </td>
                        <td>{apt ? `Unit ${apt.unit}` : '—'}</td>
                        <td style={{ fontSize:12 }}>{t.phone}</td>
                        <td style={{ fontSize:12 }}>{t.email}</td>
                        <td>
                          <span style={{ fontSize:12, color:leaseColor, fontWeight:daysLeft!==null&&daysLeft<30?600:400 }}>
                            {leaseEnd ? leaseEnd.toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                            {daysLeft!==null&&daysLeft>=0&&daysLeft<90&&<span style={{ marginLeft:4, fontSize:11 }}>({daysLeft}d)</span>}
                          </span>
                        </td>
                        <td style={{ fontSize:13 }}>{t.rent ? `$${t.rent.toLocaleString()}` : '—'}</td>
                        <td>
                          {dCount > 0
                            ? <span style={{ background:'#e8f0fd', color:BLUE, fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:99, display:'flex', alignItems:'center', gap:4, width:'fit-content' }}>
                                📋 {dCount}
                              </span>
                            : <span style={{ color:'#d1d5db', fontSize:11 }}>—</span>
                          }
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
      </div>

      {selectedTenant && (
        <TenantDrawer
          tenant={selectedTenant}
          apartment={selectedApt}
          diary={selectedDiary}
          onAddDiaryEntry={(entry) => addDiaryEntry(selected, entry)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
