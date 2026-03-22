import { useState, useRef, useEffect } from 'react'

const BLUE = '#1d5fc4'

const CONTACTS = [
  { id:'c1', type:'tenant', name:'Aiden Walsh',     unit:'101', phone:'0481 234 567', email:'aiden.walsh@gmail.com',  avatar:'AW', avatarBg:'#dcfce7', avatarColor:'#15803d', preferredChannel:'sms' },
  { id:'c2', type:'tenant', name:'Chloe Dubois',    unit:'102', phone:'0492 345 678', email:'chloe.d@hotmail.com',    avatar:'CD', avatarBg:'#dcfce7', avatarColor:'#15803d', preferredChannel:'whatsapp' },
  { id:'c3', type:'tenant', name:'Marcus Williams', unit:'201', phone:'0403 456 789', email:'marcus.w@yahoo.com',     avatar:'MW', avatarBg:'#dcfce7', avatarColor:'#15803d', preferredChannel:'email' },
  { id:'c4', type:'owner',  name:'James Hartley',   unit:'101', phone:'0412 345 678', email:'jhartley@gmail.com',     avatar:'JH', avatarBg:'#e8f0fd', avatarColor:'#1d5fc4', preferredChannel:'email' },
  { id:'c5', type:'agent',  name:'Sarah Mitchell',  unit:null,  phone:'0412 567 890', email:'smitchell@raywhite.com', avatar:'SM', avatarBg:'#fef3c7', avatarColor:'#92400e', preferredChannel:'email' },
]
const CHANNEL_ICONS  = { sms:'💬', whatsapp:'📱', email:'✉️', call:'📞' }
const CHANNEL_LABELS = { sms:'SMS', whatsapp:'WhatsApp', email:'Email', call:'Call' }

const BROADCAST_TEMPLATES = [
  { id:'bt1', label:'Maintenance notice',     text:'Dear resident,\n\nPlease be advised that scheduled maintenance will be carried out on [DATE] between [TIME]. Access to [AREA] may be restricted.\n\nFusion Building Management' },
  { id:'bt2', label:'Water interruption',     text:'IMPORTANT: Water will be shut off on [DATE] from [START TIME] to [END TIME] for essential repairs. Please store water in advance.\n\nFusion Building Management' },
  { id:'bt3', label:'Levy notice',            text:'Dear owner,\n\nYour strata levy for Q[X] [YEAR] is now due. Amount: $[AMOUNT]. Due date: [DATE].\n\nFusion Owners Corporation' },
  { id:'bt4', label:'Lease renewal reminder', text:'Hi [NAME],\n\nYour lease for Unit [UNIT] expires on [DATE]. Please contact us to discuss renewal options.\n\nFusion Building Management' },
  { id:'bt5', label:'Routine inspection',     text:'Dear [NAME],\n\nWe will be conducting a routine inspection of Unit [UNIT] on [DATE] between [TIME]. Please ensure access is available.\n\nFusion Building Management' },
  { id:'bt6', label:'Noise complaint',        text:'Dear resident,\n\nWe have received noise complaints. Please be mindful of your neighbours, particularly after 10pm.\n\nFusion Building Management' },
  { id:'bt7', label:'AGM notice',             text:'Dear owner,\n\nThe Annual General Meeting for Fusion SP85842 will be held on [DATE] at [TIME] at [LOCATION].\n\nFusion Owners Corporation' },
]

const AI_FAQS = [
  { q:'How do I pay my rent?',               a:'Rent can be paid via direct deposit to BSB 062-000 Account 12345678, referencing your unit number.' },
  { q:'How do I log a maintenance request?',  a:'Reply to this number, visit the resident portal, or call our office on 02 9567 8900 during business hours.' },
  { q:'What are the visitor parking rules?',  a:'Visitors may park in designated visitor bays for a maximum of 4 hours between 7am-10pm.' },
  { q:'What is the noise curfew?',            a:'No excessive noise after 10pm on weekdays and midnight on weekends.' },
  { q:'How do I book a facility?',            a:'Common facilities can be booked through the resident portal or by contacting building management.' },
]

const SEED_CONVOS = [
  { id:'cv1', contactId:'c1', channel:'sms', unread:2, messages:[
    { id:'m1', from:'them', text:'Hi, the hot water in my unit has stopped working.', ts:'9:14 am', photos:[] },
    { id:'m2', from:'me',   text:"Hi Aiden, I'll arrange a plumber for tomorrow morning 9-11am.", ts:'9:22 am', photos:[] },
    { id:'m3', from:'them', text:'Just checking — is the plumber still coming today?', ts:'8:50 am', unread:true, photos:[] },
  ]},
  { id:'cv2', contactId:'c2', channel:'whatsapp', unread:1, messages:[
    { id:'m4', from:'them', text:'Hi, I wanted to ask about renewing my lease. It expires in January.', ts:'Yesterday', photos:[] },
    { id:'m5', from:'me',   text:"Great timing! I'll send you the renewal offer this week.", ts:'Yesterday', photos:[] },
    { id:'m6', from:'them', text:'Sounds good 👍', ts:'Yesterday', unread:true, photos:[] },
  ]},
  { id:'cv3', contactId:'c4', channel:'email', unread:0, messages:[
    { id:'m7', from:'them', text:'Can you send me the latest levy notice and strata financials?', ts:'Mon', photos:[] },
    { id:'m8', from:'me',   text:'Hi James, attaching the Q1 levy notice and financials.', ts:'Mon', photos:[] },
  ]},
]

const Avatar = ({ initials, bg, color, size=36 }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.36, fontWeight:700, flexShrink:0 }}>{initials}</div>
)

export default function MessagesPage({ onCreateJob }) {
  const [view,setView]               = useState('inbox')
  const [convos,setConvos]           = useState(SEED_CONVOS)
  const [activeConvo,setActiveConvo] = useState(SEED_CONVOS[0])
  const [inputText,setInputText]     = useState('')
  const [pendingPhotos,setPendingPhotos] = useState([])   // photos staged before sending
  const [channel,setChannel]         = useState('sms')
  const [convoFilter,setConvoFilter] = useState('all')
  const [search,setSearch]           = useState('')

  // Select-to-job
  const [selectMode,setSelectMode]       = useState(false)
  const [selectedMsgs,setSelectedMsgs]   = useState([])
  const [showJobConfirm,setShowJobConfirm] = useState(false)
  const [jobTitle,setJobTitle]           = useState('')

  // Broadcast & AI
  const [bcChannel,setBcChannel]         = useState('sms')
  const [bcText,setBcText]               = useState('')
  const [bcRecipients,setBcRecipients]   = useState([])
  const [bcSent,setBcSent]               = useState(false)
  const [agentEnabled,setAgentEnabled]   = useState(true)
  const [agentHours,setAgentHours]       = useState('always')
  const [faqs,setFaqs]                   = useState(AI_FAQS)
  const [newQ,setNewQ]                   = useState('')
  const [newA,setNewA]                   = useState('')

  const msgEndRef  = useRef()
  const camRef     = useRef()
  const fileRef    = useRef()

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior:'smooth' }) }, [activeConvo, pendingPhotos])

  const totalUnread = convos.reduce((s,c) => s + c.unread, 0)
  const ct = c => CONTACTS.find(x => x.id === c.contactId)

  // ── Photo staging ──────────────────────────────────────────
  function handlePhotoFiles(e) {
    const newFiles = Array.from(e.target.files).map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      type: f.type,
    }))
    setPendingPhotos(prev => [...prev, ...newFiles])
    e.target.value = ''
  }

  function removePendingPhoto(id) {
    setPendingPhotos(prev => prev.filter(p => p.id !== id))
  }

  // ── Send message (with optional photos) ────────────────────
  function sendMessage() {
    if (!inputText.trim() && pendingPhotos.length === 0) return
    const msg = {
      id: 'm-' + Date.now(),
      from: 'me',
      text: inputText.trim(),
      photos: pendingPhotos,
      ts: new Date().toLocaleTimeString('en-AU', { hour:'2-digit', minute:'2-digit' }),
    }
    setConvos(cs => cs.map(c => c.id === activeConvo.id ? { ...c, messages:[...c.messages,msg], unread:0 } : c))
    setActiveConvo(ac => ({ ...ac, messages:[...ac.messages, msg] }))
    setInputText('')
    setPendingPhotos([])
  }

  // ── Select-to-job ──────────────────────────────────────────
  function toggleSelectMode() {
    setSelectMode(s => !s)
    setSelectedMsgs([])
    setShowJobConfirm(false)
  }

  function toggleMsgSelect(msgId) {
    setSelectedMsgs(prev => prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId])
  }

  function openJobConfirm() {
    const firstMsg = activeConvo.messages.find(m => selectedMsgs.includes(m.id))
    setJobTitle(firstMsg ? firstMsg.text.substring(0,70) + (firstMsg.text.length > 70 ? '…' : '') : '')
    setShowJobConfirm(true)
  }

  function createJob() {
    const contact = ct(activeConvo)
    const selMessages = activeConvo.messages.filter(m => selectedMsgs.includes(m.id))
    const selectedTexts = selMessages
      .map(m => `[${m.from === 'me' ? 'Manager' : contact?.name}] ${m.ts}: ${m.text}`)
      .join('\n')
    // Collect all photos from selected messages
    const allPhotos = selMessages.flatMap(m => m.photos || [])

    onCreateJob({
      title:           jobTitle,
      description:     `From ${CHANNEL_LABELS[activeConvo.channel]} conversation with ${contact?.name}:\n\n${selectedTexts}`,
      raisedByRole:    contact?.type === 'tenant' ? 'Tenant' : contact?.type === 'owner' ? 'Owner' : 'Agent',
      raisedByName:    contact?.name    || '',
      raisedByPhone:   contact?.phone   || '',
      raisedByEmail:   contact?.email   || '',
      unit:            contact?.unit    || '',
      jobArea:         contact?.type === 'tenant' ? 'Private Lot' : '',
      sourceChannel:   CHANNEL_LABELS[activeConvo.channel],
      photos:          allPhotos,
    })
  }

  const filteredConvos = convos.filter(c => {
    const contact = ct(c)
    if (convoFilter !== 'all' && contact?.type !== convoFilter) return false
    if (search && !contact?.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function sendBroadcast() {
    if (!bcText.trim() || bcRecipients.length === 0) return
    setBcSent(true); setTimeout(() => setBcSent(false), 3000); setBcText(''); setBcRecipients([])
  }

  return (
    <div className="main-content" style={{ padding:0, display:'flex', flexDirection:'column', height:'100%' }}>

      {/* ── Header tabs ── */}
      <div style={{ padding:'14px 20px 0', background:'#fff', borderBottom:'1px solid #e5e7eb', flexShrink:0 }}>
        <div style={{ fontSize:17, fontWeight:700, color:'#111827', marginBottom:10 }}>Messages</div>
        <div style={{ display:'flex', gap:2 }}>
          {[
            { id:'inbox',     label:'Inbox',    badge:totalUnread||null },
            { id:'broadcast', label:'Broadcast' },
            { id:'agent',     label:'AI Agent',  badge:agentEnabled?'On':null, badgeBg:'#dcfce7', badgeColor:'#15803d' },
          ].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{ padding:'8px 14px', border:'none', background:'none', cursor:'pointer', fontSize:13, fontWeight:500, color:view===t.id?BLUE:'#6b7280', borderBottom:view===t.id?`2px solid ${BLUE}`:'2px solid transparent', marginBottom:-1, display:'flex', alignItems:'center', gap:6 }}>
              {t.label}
              {t.badge && <span style={{ background:t.badgeBg||'#ef4444', color:t.badgeColor||'#fff', fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:99 }}>{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════ INBOX ═══════════════════ */}
      {view === 'inbox' && (
        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

          {/* Convo list */}
          <div style={{ width:280, borderRight:'1px solid #e5e7eb', background:'#fff', display:'flex', flexDirection:'column', flexShrink:0 }}>
            <div style={{ padding:'10px 12px', borderBottom:'1px solid #f3f4f6' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search…" style={{ width:'100%', padding:'7px 10px', borderRadius:6, border:'1px solid #d1d5db', fontSize:13, boxSizing:'border-box' }}/>
              <div style={{ display:'flex', gap:4, marginTop:8 }}>
                {['all','tenant','owner','agent'].map(f => (
                  <button key={f} onClick={() => setConvoFilter(f)} style={{ flex:1, padding:'4px 0', borderRadius:5, fontSize:11, fontWeight:500, cursor:'pointer', border:'none', background:convoFilter===f?BLUE:'#f3f4f6', color:convoFilter===f?'#fff':'#6b7280' }}>
                    {f==='all'?'All':f.charAt(0).toUpperCase()+f.slice(1)+'s'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ flex:1, overflowY:'auto' }}>
              {filteredConvos.map(c => {
                const contact=ct(c), last=c.messages[c.messages.length-1], isActive=activeConvo?.id===c.id
                return (
                  <div key={c.id} onClick={() => { setActiveConvo(c); setConvos(cs=>cs.map(x=>x.id===c.id?{...x,unread:0}:x)); setSelectMode(false); setSelectedMsgs([]); setShowJobConfirm(false); setPendingPhotos([]) }}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', cursor:'pointer', background:isActive?'#eff6ff':'transparent', borderBottom:'1px solid #f3f4f6' }}
                    onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background='#f9fafb'}}
                    onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background='transparent'}}>
                    <div style={{ position:'relative', flexShrink:0 }}>
                      <Avatar initials={contact?.avatar} bg={contact?.avatarBg} color={contact?.avatarColor} size={38}/>
                      <span style={{ position:'absolute', bottom:-1, right:-1, fontSize:12 }}>{CHANNEL_ICONS[c.channel]}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ fontSize:13, fontWeight:c.unread>0?700:500, color:'#111827', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{contact?.name}</div>
                        <div style={{ fontSize:11, color:'#9ca3af', flexShrink:0 }}>{last?.ts}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:2 }}>
                        <div style={{ fontSize:12, color:'#6b7280', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>
                          {last?.photos?.length>0?`📷 ${last.photos.length} photo${last.photos.length>1?'s':''}${last.text?' · '+last.text:''}`:(last?.from==='me'?'You: ':'')+last?.text}
                        </div>
                        {c.unread>0&&<span style={{ background:'#ef4444', color:'#fff', fontSize:10, fontWeight:700, minWidth:16, height:16, borderRadius:99, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{c.unread}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Chat panel ── */}
          {activeConvo && (() => {
            const contact = CONTACTS.find(x=>x.id===activeConvo.contactId)
            return (
              <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

                {/* Chat header */}
                <div style={{ padding:'12px 16px', borderBottom:'1px solid #e5e7eb', background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Avatar initials={contact?.avatar} bg={contact?.avatarBg} color={contact?.avatarColor} size={36}/>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:'#111827' }}>{contact?.name}</div>
                      <div style={{ fontSize:12, color:'#6b7280', marginTop:1 }}>{contact?.unit&&`Unit ${contact.unit} · `}{contact?.phone}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <button onClick={toggleSelectMode} style={{ padding:'6px 12px', borderRadius:6, border:selectMode?`2px solid ${BLUE}`:'1px solid #d1d5db', background:selectMode?'#eff6ff':'#fff', color:selectMode?BLUE:'#374151', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                      {selectMode ? '✕ Cancel' : '☑ Select messages'}
                    </button>
                    {['sms','whatsapp','email','call'].map(ch => (
                      <button key={ch} onClick={() => setChannel(ch)} title={CHANNEL_LABELS[ch]} style={{ padding:'5px 8px', borderRadius:6, border:channel===ch?`2px solid ${BLUE}`:'1px solid #d1d5db', background:channel===ch?'#eff6ff':'#fff', cursor:'pointer', fontSize:16, lineHeight:1 }}>{CHANNEL_ICONS[ch]}</button>
                    ))}
                  </div>
                </div>

                {/* Select mode banner */}
                {selectMode && (
                  <div style={{ padding:'8px 16px', background:'#eff6ff', borderBottom:'1px solid #bfdbfe', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
                    <div style={{ fontSize:13, color:BLUE, fontWeight:500 }}>
                      {selectedMsgs.length===0 ? '☑ Tap messages to select them' : `${selectedMsgs.length} message${selectedMsgs.length>1?'s':''} selected`}
                    </div>
                    {selectedMsgs.length>0 && (
                      <button onClick={openJobConfirm} style={{ padding:'6px 14px', borderRadius:6, border:'none', background:BLUE, color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                        🔧 Create Work Order
                      </button>
                    )}
                  </div>
                )}

                {/* Messages */}
                <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:8, background:'#f9fafb' }}>
                  {activeConvo.messages.map(m => {
                    const isMe=m.from==='me', isSelected=selectedMsgs.includes(m.id)
                    return (
                      <div key={m.id} onClick={() => selectMode && toggleMsgSelect(m.id)}
                        style={{ display:'flex', flexDirection:isMe?'row-reverse':'row', gap:8, alignItems:'flex-end', cursor:selectMode?'pointer':'default', opacity:selectMode&&!isSelected?0.55:1, transition:'opacity 0.15s' }}>
                        {!isMe && <Avatar initials={contact?.avatar} bg={contact?.avatarBg} color={contact?.avatarColor} size={28}/>}
                        {selectMode && (
                          <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${isSelected?BLUE:'#d1d5db'}`, background:isSelected?BLUE:'#fff', flexShrink:0, alignSelf:'center', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                            {isSelected && <span style={{ color:'#fff', fontSize:10, fontWeight:700 }}>✓</span>}
                          </div>
                        )}
                        <div style={{ maxWidth:'65%' }}>
                          {isSelected && <div style={{ fontSize:10, color:BLUE, fontWeight:600, marginBottom:3, textAlign:isMe?'right':'left' }}>Selected</div>}
                          {/* Photos in message */}
                          {m.photos && m.photos.length>0 && (
                            <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:m.text?6:0, justifyContent:isMe?'flex-end':'flex-start' }}>
                              {m.photos.map(p => (
                                <div key={p.id} style={{ width:120, height:90, borderRadius:10, overflow:'hidden', border:'2px solid #fff', boxShadow:'0 1px 4px rgba(0,0,0,0.15)', background:'#e5e7eb', flexShrink:0 }}>
                                  {p.url
                                    ? <img src={p.url} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>📎</div>
                                  }
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Text bubble */}
                          {m.text && (
                            <div style={{ padding:'10px 14px', borderRadius:isMe?'16px 16px 4px 16px':'16px 16px 16px 4px', background:isSelected?(isMe?'#1347a0':'#dbeafe'):isMe?BLUE:'#fff', color:isMe?'#fff':'#111827', fontSize:13, lineHeight:1.5, boxShadow:'0 1px 2px rgba(0,0,0,0.06)', border:isSelected?`2px solid ${BLUE}`:(isMe?'none':'1px solid #e5e7eb'), transition:'all 0.15s' }}>
                              {m.text}
                            </div>
                          )}
                          <div style={{ fontSize:11, color:'#9ca3af', marginTop:3, textAlign:isMe?'right':'left' }}>{m.ts}</div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={msgEndRef}/>
                </div>

                {/* Create job confirm */}
                {showJobConfirm && (
                  <div style={{ padding:'16px', background:'#fff', borderTop:'2px solid '+BLUE, flexShrink:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#111827', marginBottom:10 }}>
                      🔧 Create Work Order from {selectedMsgs.length} message{selectedMsgs.length>1?'s':''}
                      {activeConvo.messages.filter(m=>selectedMsgs.includes(m.id)&&m.photos?.length>0).flatMap(m=>m.photos).length > 0 && (
                        <span style={{ marginLeft:8, fontSize:11, background:'#dcfce7', color:'#15803d', padding:'2px 8px', borderRadius:99, fontWeight:600 }}>
                          📷 {activeConvo.messages.filter(m=>selectedMsgs.includes(m.id)&&m.photos?.length>0).flatMap(m=>m.photos).length} photo{activeConvo.messages.filter(m=>selectedMsgs.includes(m.id)&&m.photos?.length>0).flatMap(m=>m.photos).length>1?'s':''} attached
                        </span>
                      )}
                    </div>
                    <div style={{ marginBottom:10 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:5 }}>Job title</div>
                      <input value={jobTitle} onChange={e=>setJobTitle(e.target.value)} placeholder="e.g. No hot water — Unit 101" style={{ width:'100%', padding:'9px 12px', borderRadius:6, border:`1px solid ${BLUE}`, fontSize:13, boxSizing:'border-box', outline:'none' }}/>
                    </div>
                    <div style={{ fontSize:12, color:'#6b7280', marginBottom:12, background:'#f9fafb', borderRadius:6, padding:'8px 10px', lineHeight:1.5 }}>
                      <strong>Raised by:</strong> {CONTACTS.find(x=>x.id===activeConvo.contactId)?.name} · Messages + photos will be pre-filled in the form.
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={createJob} disabled={!jobTitle.trim()} style={{ flex:1, padding:'9px', borderRadius:6, border:'none', background:jobTitle.trim()?BLUE:'#d1d5db', color:'#fff', fontSize:13, fontWeight:600, cursor:jobTitle.trim()?'pointer':'not-allowed' }}>
                        Create Work Order →
                      </button>
                      <button onClick={()=>setShowJobConfirm(false)} style={{ padding:'9px 14px', borderRadius:6, border:'1px solid #d1d5db', background:'#fff', fontSize:13, cursor:'pointer' }}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* ── Message input area ── */}
                {!showJobConfirm && !selectMode && (
                  <div style={{ padding:'10px 14px 12px', background:'#fff', borderTop:'1px solid #e5e7eb', flexShrink:0 }}>
                    {channel === 'call'
                      ? <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px', background:'#f9fafb', borderRadius:8, border:'1px solid #e5e7eb' }}>
                          <span style={{ fontSize:24 }}>📞</span>
                          <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:500 }}>Call via Twilio</div><div style={{ fontSize:12, color:'#6b7280' }}>{contact?.phone}</div></div>
                          <button style={{ padding:'8px 16px', borderRadius:6, border:'none', background:BLUE, color:'#fff', fontSize:13, cursor:'pointer' }}>📞 Call now</button>
                        </div>
                      : <>
                          {/* Staged photo previews */}
                          {pendingPhotos.length > 0 && (
                            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8, padding:'8px', background:'#f9fafb', borderRadius:8, border:'1px solid #e5e7eb' }}>
                              {pendingPhotos.map(p => (
                                <div key={p.id} style={{ position:'relative', width:64, height:64, borderRadius:8, overflow:'hidden', border:'2px solid #bfdbfe', background:'#e5e7eb', flexShrink:0 }}>
                                  {p.url
                                    ? <img src={p.url} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📎</div>
                                  }
                                  <button onClick={() => removePendingPhoto(p.id)} style={{ position:'absolute', top:2, right:2, width:16, height:16, borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'none', color:'#fff', fontSize:9, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>×</button>
                                </div>
                              ))}
                              <div style={{ fontSize:11, color:'#6b7280', alignSelf:'center', paddingLeft:4 }}>{pendingPhotos.length} photo{pendingPhotos.length>1?'s':''} ready to send</div>
                            </div>
                          )}
                          {/* Input row */}
                          <div style={{ display:'flex', gap:6, alignItems:'flex-end' }}>
                            {/* Camera button */}
                            <button onClick={() => camRef.current.click()} title="Take photo" style={{ width:38, height:38, borderRadius:8, border:'1px solid #d1d5db', background:'#f9fafb', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                              📷
                            </button>
                            {/* File/attachment button */}
                            <button onClick={() => fileRef.current.click()} title="Attach file" style={{ width:38, height:38, borderRadius:8, border:'1px solid #d1d5db', background:'#f9fafb', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                              📎
                            </button>
                            <input ref={camRef}  type="file" accept="image/*" capture="environment" multiple style={{ display:'none' }} onChange={handlePhotoFiles}/>
                            <input ref={fileRef} type="file" accept="image/*,application/pdf,.doc,.docx" multiple style={{ display:'none' }} onChange={handlePhotoFiles}/>
                            {/* Text input */}
                            <input
                              value={inputText}
                              onChange={e => setInputText(e.target.value)}
                              onKeyDown={e => e.key==='Enter' && !e.shiftKey && sendMessage()}
                              placeholder={`Message via ${CHANNEL_LABELS[channel]}…`}
                              style={{ flex:1, padding:'10px 14px', borderRadius:8, border:'1px solid #d1d5db', fontSize:13, background:'#f9fafb', outline:'none' }}
                            />
                            {/* Send */}
                            <button onClick={sendMessage} style={{ padding:'10px 18px', borderRadius:8, border:'none', background:(inputText.trim()||pendingPhotos.length>0)?BLUE:'#d1d5db', color:'#fff', fontSize:13, fontWeight:500, cursor:(inputText.trim()||pendingPhotos.length>0)?'pointer':'not-allowed', flexShrink:0 }}>
                              Send
                            </button>
                          </div>
                          <div style={{ fontSize:11, color:'#9ca3af', marginTop:5 }}>
                            Preferred: {CHANNEL_ICONS[contact?.preferredChannel]} {CHANNEL_LABELS[contact?.preferredChannel]} · 📷 Camera / 📎 Attach
                          </div>
                        </>
                    }
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* ═══════════════════ BROADCAST ═══════════════════ */}
      {view === 'broadcast' && (
        <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>
          {bcSent
            ? <div style={{ textAlign:'center', padding:'60px 0' }}><div style={{ fontSize:48, marginBottom:12 }}>✅</div><div style={{ fontSize:18, fontWeight:600, color:'#111827', marginBottom:4 }}>Broadcast sent!</div><div style={{ fontSize:13, color:'#6b7280' }}>Queued for delivery via {CHANNEL_LABELS[bcChannel]}.</div></div>
            : <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:900 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:600, color:'#111827', marginBottom:14 }}>Compose broadcast</div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>Send via</div>
                    <div style={{ display:'flex', gap:8 }}>
                      {['sms','whatsapp','email'].map(ch => (
                        <button key={ch} onClick={() => setBcChannel(ch)} style={{ flex:1, padding:'10px 8px', borderRadius:8, border:bcChannel===ch?`2px solid ${BLUE}`:'1px solid #e5e7eb', background:bcChannel===ch?'#eff6ff':'#fff', cursor:'pointer', textAlign:'center' }}>
                          <div style={{ fontSize:22 }}>{CHANNEL_ICONS[ch]}</div>
                          <div style={{ fontSize:12, fontWeight:600, color:bcChannel===ch?BLUE:'#374151', marginTop:4 }}>{CHANNEL_LABELS[ch]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>Template</div>
                    <div style={{ border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden', background:'#fff', maxHeight:160, overflowY:'auto' }}>
                      {BROADCAST_TEMPLATES.map(t => (
                        <div key={t.id} onClick={() => setBcText(t.text)} style={{ padding:'8px 12px', fontSize:13, cursor:'pointer', borderBottom:'1px solid #f3f4f6' }} onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                          <span style={{ fontSize:11, fontWeight:600, background:'#e8f0fd', color:BLUE, padding:'2px 7px', borderRadius:99 }}>{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <textarea value={bcText} onChange={e=>setBcText(e.target.value)} placeholder="Type your message or select a template…" rows={7} style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #d1d5db', fontSize:13, resize:'vertical', fontFamily:'inherit', background:'#f9fafb', boxSizing:'border-box' }}/>
                    <div style={{ fontSize:11, color:'#9ca3af', marginTop:4 }}>{bcText.length} chars</div>
                  </div>
                  <button onClick={sendBroadcast} style={{ padding:'8px 16px', borderRadius:6, border:'none', background:BLUE, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer' }}>
                    {CHANNEL_ICONS[bcChannel]} Send to {bcRecipients.length} recipient{bcRecipients.length!==1?'s':''}
                  </button>
                  {bcRecipients.length===0 && <div style={{ fontSize:12, color:'#ef4444', marginTop:6 }}>Select at least one recipient →</div>}
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:600, color:'#111827', marginBottom:14 }}>Recipients <span style={{ fontSize:13, fontWeight:400, color:'#6b7280' }}>({bcRecipients.length} selected)</span></div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
                    {[{id:'all-tenants',l:'All tenants'},{id:'all-owners',l:'All owners'},{id:'all-agents',l:'All agents'},{id:'all',l:'Everyone'},{id:'none',l:'Clear'}].map(g => (
                      <button key={g.id} onClick={() => {
                        if(g.id==='all-tenants') setBcRecipients(CONTACTS.filter(c=>c.type==='tenant').map(c=>c.id))
                        else if(g.id==='all-owners') setBcRecipients(CONTACTS.filter(c=>c.type==='owner').map(c=>c.id))
                        else if(g.id==='all-agents') setBcRecipients(CONTACTS.filter(c=>c.type==='agent').map(c=>c.id))
                        else if(g.id==='all') setBcRecipients(CONTACTS.map(c=>c.id))
                        else setBcRecipients([])
                      }} style={{ padding:'5px 10px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', border:'1px solid #d1d5db', background:'#fff', color:'#374151' }}>
                        {g.l}
                      </button>
                    ))}
                  </div>
                  <div style={{ border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden', background:'#fff' }}>
                    {CONTACTS.map(c => {
                      const sel = bcRecipients.includes(c.id)
                      return (
                        <div key={c.id} onClick={() => setBcRecipients(r=>r.includes(c.id)?r.filter(x=>x!==c.id):[...r,c.id])}
                          style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', cursor:'pointer', borderBottom:'1px solid #f3f4f6', background:sel?'#eff6ff':'#fff' }}
                          onMouseEnter={e=>{if(!sel)e.currentTarget.style.background='#f9fafb'}} onMouseLeave={e=>{if(!sel)e.currentTarget.style.background=sel?'#eff6ff':'#fff'}}>
                          <input type="checkbox" checked={sel} onChange={()=>{}} style={{ accentColor:BLUE }}/>
                          <Avatar initials={c.avatar} bg={c.avatarBg} color={c.avatarColor} size={30}/>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:500, color:'#111827' }}>{c.name}</div>
                            <div style={{ fontSize:11, color:'#6b7280', marginTop:1 }}>{c.unit?`Unit ${c.unit} · `:''}{c.phone}</div>
                          </div>
                          <span style={{ background:c.type==='tenant'?'#dcfce7':c.type==='owner'?'#e8f0fd':'#fef3c7', color:c.type==='tenant'?'#15803d':c.type==='owner'?BLUE:'#92400e', fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:99 }}>{c.type}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
          }
        </div>
      )}

      {/* ═══════════════════ AI AGENT ═══════════════════ */}
      {view === 'agent' && (
        <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>
          <div style={{ maxWidth:800 }}>
            <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:'#111827', marginBottom:4 }}>🤖 AI Auto-reply Agent</div>
                <div style={{ fontSize:13, color:'#6b7280' }}>Automatically replies to inbound SMS and WhatsApp enquiries.</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:13, color:agentEnabled?'#15803d':'#9ca3af', fontWeight:500 }}>{agentEnabled?'Active':'Off'}</span>
                <div onClick={() => setAgentEnabled(e=>!e)} style={{ width:44, height:24, borderRadius:99, background:agentEnabled?'#16a34a':'#d1d5db', cursor:'pointer', position:'relative' }}>
                  <div style={{ position:'absolute', top:2, left:agentEnabled?22:2, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                </div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <div>
                <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:'16px', marginBottom:16 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:12 }}>Active hours</div>
                  {[{v:'always',l:'24/7 (always on)'},{v:'afterhours',l:'After hours only (6pm–8am)'},{v:'weekends',l:'Weekends only'}].map(o => (
                    <label key={o.v} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, cursor:'pointer', fontSize:13 }}>
                      <input type="radio" checked={agentHours===o.v} onChange={() => setAgentHours(o.v)} style={{ accentColor:BLUE }}/>{o.l}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:'16px' }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:8 }}>📚 Knowledge base</div>
                <div style={{ maxHeight:220, overflowY:'auto', marginBottom:12 }}>
                  {faqs.map((faq,i) => (
                    <div key={i} style={{ border:'1px solid #e5e7eb', borderRadius:8, padding:'8px 10px', marginBottom:6, background:'#f9fafb' }}>
                      <div style={{ fontSize:11, fontWeight:600, color:'#111827', marginBottom:3 }}>Q: {faq.q}</div>
                      <div style={{ fontSize:11, color:'#374151' }}>A: {faq.a}</div>
                      <button onClick={() => setFaqs(f=>f.filter((_,j)=>j!==i))} style={{ fontSize:10, color:'#ef4444', background:'none', border:'none', cursor:'pointer', padding:0, marginTop:4 }}>Remove</button>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:'1px solid #e5e7eb', paddingTop:10 }}>
                  <input value={newQ} onChange={e=>setNewQ(e.target.value)} placeholder="Question…" style={{ width:'100%', padding:'6px 10px', borderRadius:6, border:'1px solid #d1d5db', fontSize:12, marginBottom:5, boxSizing:'border-box' }}/>
                  <textarea value={newA} onChange={e=>setNewA(e.target.value)} placeholder="Answer…" rows={2} style={{ width:'100%', padding:'6px 10px', borderRadius:6, border:'1px solid #d1d5db', fontSize:12, resize:'none', fontFamily:'inherit', boxSizing:'border-box', marginBottom:6 }}/>
                  <button onClick={() => { if(!newQ.trim()||!newA.trim()) return; setFaqs(f=>[...f,{q:newQ,a:newA}]); setNewQ(''); setNewA('') }} style={{ padding:'6px 12px', borderRadius:6, border:'none', background:BLUE, color:'#fff', fontSize:12, cursor:'pointer' }}>Add to knowledge base</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
