import { useState, useRef } from 'react'

const BLUE = '#1d5fc4'

// ─── Reference data ───────────────────────────────────────────────────────────
const ISSUE_TYPES = [
  { id:'plumbing',    label:'Plumbing',       icon:'🔧' },
  { id:'electrical',  label:'Electrical',     icon:'⚡' },
  { id:'hvac',        label:'HVAC / Air Con', icon:'❄️' },
  { id:'structural',  label:'Structural',     icon:'🏗️' },
  { id:'pest',        label:'Pest Control',   icon:'🐛' },
  { id:'cleaning',    label:'Cleaning',       icon:'🧹' },
  { id:'security',    label:'Security',       icon:'🔒' },
  { id:'lift',        label:'Lift / Elevator',icon:'🛗' },
  { id:'fire',        label:'Fire Safety',    icon:'🔥' },
  { id:'landscaping', label:'Landscaping',    icon:'🌿' },
  { id:'appliance',   label:'Appliance',      icon:'🍳' },
  { id:'intercom',    label:'Intercom / Entry',icon:'📟' },
  { id:'carpark',     label:'Carpark',        icon:'🚗' },
  { id:'common',      label:'Common Area',    icon:'🏢' },
  { id:'admin',       label:'Administrative', icon:'📋' },
  { id:'other',       label:'Other',          icon:'❓' },
]
const PRIORITIES = ['Low','Medium','High','Urgent']
const STATUSES   = ['New','Assigned','In Progress','On Hold','Awaiting Parts','Awaiting Approval','Completed','Cancelled']
const UNITS      = ['101','102','103','201','202','203','301','302','401','402']
const JOB_AREA_OPTIONS = ['Private Lot','Common Area','Asset','Roof','Carpark','Lobby','Pool / Gym','Garden','NA']

const TENANTS = [
  { id:'t1', firstName:'Aiden',    lastName:'Walsh',     unit:'101', phone:'0481 234 567', email:'aiden.walsh@gmail.com' },
  { id:'t2', firstName:'Chloe',    lastName:'Dubois',    unit:'102', phone:'0492 345 678', email:'chloe.d@hotmail.com' },
  { id:'t3', firstName:'Marcus',   lastName:'Williams',  unit:'201', phone:'0403 456 789', email:'marcus.w@yahoo.com' },
  { id:'t4', firstName:'Yuki',     lastName:'Tanaka',    unit:'202', phone:'0415 567 890', email:'yuki.tanaka@gmail.com' },
  { id:'t5', firstName:'Isabelle', lastName:'Moreau',    unit:'301', phone:'0426 678 901', email:'imoreau@outlook.com' },
  { id:'t6', firstName:'Daniel',   lastName:'Kim',       unit:'401', phone:'0437 789 012', email:'d.kim@gmail.com' },
  { id:'t7', firstName:'Fatima',   lastName:'Al-Hassan', unit:'402', phone:'0448 890 123', email:'f.alhassan@icloud.com' },
]
const OWNERS = [
  { id:'o1', firstName:'James',  lastName:'Hartley', unit:'101', phone:'0412 345 678', email:'jhartley@gmail.com' },
  { id:'o2', firstName:'Mei',    lastName:'Chen',    unit:'102', phone:'0421 890 123', email:'mei.chen@outlook.com' },
  { id:'o3', firstName:'Nathan', lastName:'Brooks',  unit:'401', phone:'0461 789 012', email:'nbrooks@outlook.com' },
]
const AGENTS = [
  { id:'ag1', firstName:'Sarah', lastName:'Mitchell', agency:'Ray White Arncliffe', phone:'0412 567 890', email:'smitchell@raywhite.com' },
  { id:'ag2', firstName:'David', lastName:'Nguyen',   agency:'McGrath St George',   phone:'0421 678 901', email:'dnguyen@mcgrath.com.au' },
]
const CONTRACTORS = [
  { id:'con-1', company:'AquaFix Plumbing',        trade:'Plumbing',     phone:'02 9000 1111', email:'jobs@aquafix.com.au',     abn:'12 345 678 901',
    contacts:[ { id:'cp-1a', name:'Marco Esposito', role:'Senior Plumber',    phone:'0411 100 200', email:'marco@aquafix.com.au' }, { id:'cp-1b', name:'Jake Turner', role:'Plumber', phone:'0411 100 201', email:'jake@aquafix.com.au' } ] },
  { id:'con-2', company:'Bright Spark Electrical', trade:'Electrical',   phone:'02 9000 2222', email:'jobs@brightspark.com.au', abn:'98 765 432 109',
    contacts:[ { id:'cp-2a', name:'Leon Marsh',     role:'Master Electrician', phone:'0422 200 300', email:'leon@brightspark.com.au' }, { id:'cp-2b', name:'Amy Nguyen', role:'Electrician', phone:'0422 200 301', email:'amy@brightspark.com.au' } ] },
  { id:'con-3', company:'CoolAir HVAC',            trade:'HVAC',         phone:'02 9000 3333', email:'jobs@coolair.com.au',     abn:'55 444 333 221',
    contacts:[ { id:'cp-3a', name:'Sandra Lee',     role:'HVAC Technician',   phone:'0433 300 400', email:'sandra@coolair.com.au' } ] },
  { id:'con-4', company:'SecurePro Security',      trade:'Security',     phone:'02 9000 4444', email:'jobs@securepro.com.au',  abn:'77 666 555 443',
    contacts:[ { id:'cp-4a', name:'Darren Cole',    role:'Security Tech',     phone:'0444 400 500', email:'darren@securepro.com.au' }, { id:'cp-4b', name:'Priya Patel', role:'Account Manager', phone:'0444 400 501', email:'priya@securepro.com.au' } ] },
  { id:'con-5', company:'CleanTeam Services',      trade:'Cleaning',     phone:'02 9000 5555', email:'jobs@cleanteam.com.au',  abn:'33 222 111 009',
    contacts:[ { id:'cp-5a', name:'Maria Santos',   role:'Supervisor',        phone:'0455 500 600', email:'maria@cleanteam.com.au' }, { id:'cp-5b', name:'Kevin Park', role:'Cleaner', phone:'0455 500 601', email:'kevin@cleanteam.com.au' } ] },
  { id:'con-6', company:'PestAway',                trade:'Pest Control', phone:'02 9000 6666', email:'jobs@pestaway.com.au',   abn:'11 000 999 888',
    contacts:[ { id:'cp-6a', name:'Greg Wilson',    role:'Pest Controller',   phone:'0466 600 700', email:'greg@pestaway.com.au' } ] },
]

const ACTIVITY_TYPES = [
  { id:'note',      label:'Note',             icon:'📝', color:'#f3f4f6', textColor:'#374151' },
  { id:'status',    label:'Status change',    icon:'🔄', color:'#e8f0fd', textColor:'#1d5fc4' },
  { id:'call',      label:'Phone call',       icon:'📞', color:'#fef3c7', textColor:'#92400e' },
  { id:'email',     label:'Email sent',       icon:'✉️', color:'#f0fdf4', textColor:'#15803d' },
  { id:'sms',       label:'SMS sent',         icon:'💬', color:'#f0fdf4', textColor:'#15803d' },
  { id:'visit',     label:'Site visit',       icon:'🏠', color:'#fae8ff', textColor:'#7c3aed' },
  { id:'quote',     label:'Quote received',   icon:'💰', color:'#fef9c3', textColor:'#a16207' },
  { id:'invoice',   label:'Invoice received', icon:'🧾', color:'#dcfce7', textColor:'#15803d' },
  { id:'scheduled', label:'Work scheduled',   icon:'📅', color:'#e8f0fd', textColor:'#1d5fc4' },
  { id:'completed', label:'Work completed',   icon:'✅', color:'#dcfce7', textColor:'#15803d' },
  { id:'escalated', label:'Escalated',        icon:'⚠️', color:'#fee2e2', textColor:'#dc2626' },
]

const SEED = [
  { id:'WO-001', issueType:'plumbing',   title:'No hot water - Unit 101',          status:'In Progress',   priority:'High',   unit:'101', raisedByRole:'Tenant', raisedByName:'Aiden Walsh',      raisedByPhone:'0481 234 567', raisedByEmail:'aiden.walsh@gmail.com', accessContactId:'', accessContactName:'', accessContactPhone:'', jobArea:'Private Lot', contractorId:'con-1', contractorContactId:'cp-1a', createdAt:'20/03/2026, 09:14 am', photos:[], quotes:[], invoices:[], docs:[], notes:[], description:'No hot water since Monday morning. Hot water system approximately 8 years old.' },
  { id:'WO-002', issueType:'fire',       title:'Annual fire safety inspection',     status:'New',           priority:'Medium', unit:null,  raisedByRole:'Admin',  raisedByName:'Building Manager', raisedByPhone:'',              raisedByEmail:'',                      accessContactId:'', accessContactName:'', accessContactPhone:'', jobArea:'Asset',       contractorId:'',      contractorContactId:'',      createdAt:'20/03/2026, 10:00 am', photos:[], quotes:[], invoices:[], docs:[], notes:[], description:'Annual fire safety inspection as required by strata by-laws.' },
  { id:'WO-003', issueType:'electrical', title:'Power outage - Carpark B1',         status:'Completed',     priority:'Urgent', unit:null,  raisedByRole:'Admin',  raisedByName:'Building Manager', raisedByPhone:'',              raisedByEmail:'',                      accessContactId:'', accessContactName:'', accessContactPhone:'', jobArea:'Carpark',     contractorId:'con-2', contractorContactId:'cp-2a', createdAt:'15/03/2026, 07:30 am', photos:[], quotes:[], invoices:[], docs:[], notes:[], description:'Total power failure in B1 carpark affecting 12 spaces.' },
  { id:'WO-004', issueType:'cleaning',   title:'Deep clean after vacate - Unit 202',status:'Assigned',      priority:'Low',    unit:'202', raisedByRole:'Agent',  raisedByName:'Sarah Mitchell',   raisedByPhone:'0412 567 890',  raisedByEmail:'smitchell@raywhite.com', accessContactId:'', accessContactName:'', accessContactPhone:'', jobArea:'Private Lot', contractorId:'con-5', contractorContactId:'cp-5a', createdAt:'18/03/2026, 02:00 pm', photos:[], quotes:[], invoices:[], docs:[], notes:[], description:'Full clean required after tenant vacated unit 202.' },
  { id:'WO-005', issueType:'plumbing',   title:'Leak under sink - Unit 301',        status:'Awaiting Parts',priority:'Medium', unit:'301', raisedByRole:'Tenant', raisedByName:'Isabelle Moreau',  raisedByPhone:'0426 678 901',  raisedByEmail:'imoreau@outlook.com',    accessContactId:'', accessContactName:'', accessContactPhone:'', jobArea:'Private Lot', contractorId:'con-1', contractorContactId:'cp-1b', createdAt:'19/03/2026, 11:45 am', photos:[], quotes:[], invoices:[], docs:[], notes:[], description:'Slow drip under kitchen sink. Tenant placed bucket. Possibly valve seal.' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColor = s => ({'New':{bg:'#f3f4f6',color:'#374151'},'Assigned':{bg:'#e8f0fd',color:'#1d5fc4'},'In Progress':{bg:'#fef3c7',color:'#92400e'},'On Hold':{bg:'#fee2e2',color:'#dc2626'},'Awaiting Parts':{bg:'#fae8ff',color:'#7c3aed'},'Awaiting Approval':{bg:'#fae8ff',color:'#7c3aed'},'Completed':{bg:'#dcfce7',color:'#15803d'},'Cancelled':{bg:'#f3f4f6',color:'#6b7280'}}[s]??{bg:'#f3f4f6',color:'#374151'})
const priorityColor = p => ({'Low':{bg:'#f3f4f6',color:'#6b7280'},'Medium':{bg:'#fef9c3',color:'#a16207'},'High':{bg:'#fee2e2',color:'#dc2626'},'Urgent':{bg:'#ffd7d7',color:'#7f1d1d'}}[p]??{bg:'#f3f4f6',color:'#374151'})
const issueType = id => ISSUE_TYPES.find(t=>t.id===id)
const getContractor = id => CONTRACTORS.find(c=>c.id===id)
const getContractorContact = (conId,cpId) => getContractor(conId)?.contacts.find(c=>c.id===cpId)

// ─── UI helpers ───────────────────────────────────────────────────────────────
const Badge = ({label,bg,color,sm}) => <span style={{background:bg,color,fontSize:sm?10:11,fontWeight:600,padding:sm?'1px 5px':'2px 8px',borderRadius:99,whiteSpace:'nowrap'}}>{label}</span>
const SL = ({children,required}) => <div style={{fontSize:11,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>{children}{required&&<span style={{color:'#ef4444'}}> *</span>}</div>
const Btn = ({children,onClick,primary,sm,disabled}) => <button onClick={onClick} disabled={disabled} style={{padding:sm?'5px 10px':'8px 16px',borderRadius:6,fontSize:sm?12:13,fontWeight:500,cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.5:1,border:primary?'none':'1px solid #d1d5db',background:primary?BLUE:'#fff',color:primary?'#fff':'#374151',whiteSpace:'nowrap'}}>{children}</button>
function FInp({label,value,onChange,type='text',placeholder,required,disabled}) { return <div><SL required={required}>{label}</SL><input type={type} value={value??''} onChange={e=>onChange&&onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{width:'100%',padding:'9px 12px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,background:disabled?'#f9fafb':'#fff',boxSizing:'border-box'}}/></div> }
function FSel({label,value,onChange,options,required,disabled}) { return <div><SL required={required}>{label}</SL><select value={value??''} onChange={e=>onChange(e.target.value)} disabled={disabled} style={{width:'100%',padding:'9px 12px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,background:disabled?'#f9fafb':'#fff',boxSizing:'border-box',appearance:'auto'}}>{options.map(o=>typeof o==='string'?<option key={o} value={o}>{o}</option>:<option key={o.v} value={o.v}>{o.l}</option>)}</select></div> }
const FGrid = ({children,cols=2}) => <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:14,marginBottom:16}}>{children}</div>

function Section({icon,title,children}) {
  return <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:10,overflow:'hidden',marginBottom:16}}>
    <div style={{padding:'12px 16px',borderBottom:'1px solid #f3f4f6',display:'flex',alignItems:'center',gap:8}}>
      {icon&&<span style={{fontSize:16}}>{icon}</span>}
      <div style={{fontSize:14,fontWeight:700,color:'#111827'}}>{title}</div>
    </div>
    <div style={{padding:16}}>{children}</div>
  </div>
}

// ─── Photo / file upload ──────────────────────────────────────────────────────
function PhotoUpload({files,onChange}) {
  const camRef=useRef(), fileRef=useRef()
  function handleFiles(e,source) {
    const now=new Date().toLocaleString('en-AU',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'})
    const newFiles=Array.from(e.target.files).map(f=>({id:Date.now()+Math.random(),name:f.name,size:f.size,type:f.type,uploadedAt:now,source,url:f.type.startsWith('image/')?URL.createObjectURL(f):null}))
    onChange([...files,...newFiles]); e.target.value=''
  }
  const images=files.filter(f=>f.type?.startsWith('image/')), others=files.filter(f=>!f.type?.startsWith('image/'))
  return <div>
    <div style={{display:'flex',gap:10,marginBottom:12}}>
      {[{ref:camRef,icon:'📷',label:'Camera / photo',hint:'jpg, png, heic',accept:'image/*',capture:'environment'},{ref:fileRef,icon:'📎',label:'Upload file',hint:'pdf, word, jpg…',accept:'image/*,.pdf,.doc,.docx,.xls,.xlsx',capture:undefined}].map((b,i)=>(
        <div key={i} onClick={()=>b.ref.current.click()} style={{flex:1,border:'2px dashed #bfdbfe',borderRadius:8,padding:'14px',textAlign:'center',cursor:'pointer',background:'#f0f9ff'}} onMouseEnter={e=>e.currentTarget.style.background='#e0f2fe'} onMouseLeave={e=>e.currentTarget.style.background='#f0f9ff'}>
          <div style={{fontSize:24,marginBottom:4}}>{b.icon}</div>
          <div style={{fontSize:12,fontWeight:600,color:BLUE}}>{b.label}</div>
          <div style={{fontSize:11,color:'#9ca3af'}}>{b.hint}</div>
          <input ref={b.ref} type="file" accept={b.accept} capture={b.capture} multiple style={{display:'none'}} onChange={e=>handleFiles(e,i===0?'camera':'upload')}/>
        </div>
      ))}
    </div>
    {images.length>0&&<div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:10}}>{images.map(f=><div key={f.id} style={{position:'relative',width:80,height:80,borderRadius:6,overflow:'hidden',border:'1px solid #e5e7eb',background:'#f3f4f6',flexShrink:0}}>{f.url?<img src={f.url} alt={f.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>🖼️</div>}<button onClick={()=>onChange(files.filter(x=>x.id!==f.id))} style={{position:'absolute',top:2,right:2,background:'rgba(0,0,0,0.5)',border:'none',borderRadius:'50%',color:'#fff',width:18,height:18,fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button></div>)}</div>}
    {others.map(f=><div key={f.id} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',border:'1px solid #e5e7eb',borderRadius:6,marginBottom:6,background:'#fafafa'}}><span style={{fontSize:18}}>{f.type?.includes('pdf')?'📄':f.type?.includes('word')||f.type?.includes('doc')?'📝':'📎'}</span><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</div><div style={{fontSize:10,color:'#9ca3af'}}>{(f.size/1024).toFixed(1)} KB · {f.uploadedAt}</div></div><button onClick={()=>onChange(files.filter(x=>x.id!==f.id))} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',fontSize:14}}>×</button></div>)}
  </div>
}

// ─── Doc upload ───────────────────────────────────────────────────────────────
function DocUpload({files,onChange,label}) {
  const ref=useRef()
  function handleFiles(e) {
    const now=new Date().toLocaleString('en-AU',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'})
    const newFiles=Array.from(e.target.files).map(f=>({id:Date.now()+Math.random(),name:f.name,size:f.size,type:f.type,uploadedAt:now,description:''}))
    onChange([...files,...newFiles]); e.target.value=''
  }
  return <div>
    {files.map(f=><div key={f.id} style={{border:'1px solid #e5e7eb',borderRadius:8,padding:'10px 12px',marginBottom:10,background:'#fafafa'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}><span style={{fontSize:18}}>{f.type?.includes('pdf')?'📄':f.type?.includes('image')?'🖼️':f.type?.includes('word')||f.type?.includes('doc')?'📝':'📎'}</span><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</div><div style={{fontSize:10,color:'#9ca3af'}}>{(f.size/1024).toFixed(1)} KB · {f.uploadedAt}</div></div><button onClick={()=>onChange(files.filter(x=>x.id!==f.id))} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',fontSize:14}}>×</button></div>
      <input value={f.description} onChange={e=>onChange(files.map(x=>x.id===f.id?{...x,description:e.target.value}:x))} placeholder="Description…" style={{width:'100%',padding:'6px 10px',borderRadius:6,border:'1px solid #d1d5db',fontSize:12,background:'#fff',boxSizing:'border-box'}}/>
    </div>)}
    <div onClick={()=>ref.current.click()} style={{border:'2px dashed #bfdbfe',borderRadius:8,padding:'12px',textAlign:'center',cursor:'pointer',background:'#f0f9ff',color:BLUE,fontSize:13}} onMouseEnter={e=>e.currentTarget.style.background='#e0f2fe'} onMouseLeave={e=>e.currentTarget.style.background='#f0f9ff'}>
      ☁️ Upload {label}
      <input ref={ref} type="file" multiple style={{display:'none'}} onChange={handleFiles}/>
    </div>
  </div>
}

// ─── Activity log ─────────────────────────────────────────────────────────────
function ActivityLog({notes,onAdd}) {
  const [open,setOpen]=useState(false)
  const [type,setType]=useState('note')
  const [text,setText]=useState('')
  const [author,setAuthor]=useState('Building Manager')
  const [date,setDate]=useState(new Date().toISOString().slice(0,10))
  const [time,setTime]=useState(new Date().toTimeString().slice(0,5))
  const at=ACTIVITY_TYPES.find(a=>a.id===type)
  function add() {
    if(!text.trim()) return
    const ts=new Date(`${date}T${time}`).toLocaleString('en-AU',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})
    onAdd({id:Date.now(),type,text:text.trim(),author,ts,icon:at.icon,color:at.color,textColor:at.textColor,label:at.label})
    setText(''); setOpen(false)
  }
  const PLACEHOLDERS = { note:'Add a note about this work order…', status:'Describe the status change and reason…', call:'Who was called, what was discussed, outcome…', email:'Summary of email sent and to whom…', sms:'SMS content and recipient…', visit:'Details of site visit — who attended, what was found…', quote:'Quote details — amount, from whom, scope of works…', invoice:'Invoice details — amount, invoice number, from whom…', scheduled:'What was scheduled, date/time, who is attending…', completed:'What was completed, outcome, follow-up required…', escalated:'Why escalated, to whom, what action was taken…' }
  return <div>
    {!open
      ? <button onClick={()=>setOpen(true)} style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'10px 14px',borderRadius:8,border:`2px dashed ${BLUE}`,background:'#f0f9ff',color:BLUE,fontSize:13,fontWeight:600,cursor:'pointer',justifyContent:'center',marginBottom:notes.length>0?16:0}}>+ Add activity</button>
      : <div style={{border:`2px solid ${BLUE}`,borderRadius:10,padding:16,marginBottom:16,background:'#fafeff'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:'#111827'}}>Add activity</div>
            <button onClick={()=>setOpen(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',fontSize:18}}>×</button>
          </div>
          <div style={{marginBottom:12}}>
            <SL>Activity type</SL>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
              {ACTIVITY_TYPES.map(a=>(
                <div key={a.id} onClick={()=>setType(a.id)} style={{padding:'8px 6px',borderRadius:7,border:type===a.id?`2px solid ${BLUE}`:'1px solid #e5e7eb',background:type===a.id?'#eff6ff':'#fff',cursor:'pointer',textAlign:'center'}}>
                  <div style={{fontSize:18,marginBottom:2}}>{a.icon}</div>
                  <div style={{fontSize:10,fontWeight:type===a.id?700:500,color:type===a.id?BLUE:'#374151',lineHeight:1.2}}>{a.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
            <div><SL>Added by</SL><input value={author} onChange={e=>setAuthor(e.target.value)} style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,boxSizing:'border-box'}}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              <div><SL>Date</SL><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,boxSizing:'border-box'}}/></div>
              <div><SL>Time</SL><input type="time" value={time} onChange={e=>setTime(e.target.value)} style={{width:'100%',padding:'8px 10px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,boxSizing:'border-box'}}/></div>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <SL>{at.icon} {at.label} — details</SL>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={PLACEHOLDERS[type]||'Enter details…'} rows={3} style={{width:'100%',padding:'9px 12px',borderRadius:8,border:'1px solid #d1d5db',fontSize:13,resize:'none',fontFamily:'inherit',boxSizing:'border-box'}}/>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={add} disabled={!text.trim()} style={{padding:'8px 18px',borderRadius:6,border:'none',background:text.trim()?BLUE:'#d1d5db',color:'#fff',fontSize:13,fontWeight:600,cursor:text.trim()?'pointer':'not-allowed'}}>Save activity</button>
            <button onClick={()=>setOpen(false)} style={{padding:'8px 14px',borderRadius:6,border:'1px solid #d1d5db',background:'#fff',fontSize:13,cursor:'pointer'}}>Cancel</button>
          </div>
        </div>
    }
    {notes.length===0&&!open&&<div style={{textAlign:'center',padding:'24px 0',color:'#9ca3af',fontSize:13}}>No activity yet.</div>}
    {[...notes].reverse().map((n,i,arr)=>(
      <div key={n.id} style={{display:'flex',gap:12,position:'relative'}}>
        {i<arr.length-1&&<div style={{position:'absolute',left:13,top:28,bottom:-12,width:2,background:'#e5e7eb',zIndex:0}}/>}
        <div style={{width:28,height:28,borderRadius:'50%',background:n.color||'#f3f4f6',border:'2px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0,zIndex:1,boxShadow:'0 0 0 2px #e5e7eb'}}>{n.icon||'📝'}</div>
        <div style={{flex:1,paddingBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
            <span style={{fontSize:11,fontWeight:700,color:'#111827'}}>{n.author}</span>
            <span style={{fontSize:10,background:n.color||'#f3f4f6',color:n.textColor||'#374151',padding:'1px 6px',borderRadius:99,fontWeight:600}}>{n.label||n.type}</span>
            <span style={{fontSize:11,color:'#9ca3af',marginLeft:'auto'}}>{n.ts}</span>
          </div>
          <div style={{fontSize:13,color:'#374151',lineHeight:1.5,background:'#f9fafb',borderRadius:8,padding:'10px 12px',border:'1px solid #f3f4f6'}}>{n.text}</div>
        </div>
      </div>
    ))}
  </div>
}

// ─── Create / Edit form ───────────────────────────────────────────────────────
const EMPTY = () => ({
  raisedByRole:'Admin', raisedById:'', raisedByName:'', raisedByPhone:'', raisedByEmail:'',
  accessContactId:'', accessContactName:'', accessContactPhone:'',
  issueType:'', title:'', description:'', unit:'', jobArea:'',
  priority:'Medium', status:'New', poNumber:'',
  startDate:new Date().toISOString().slice(0,10), dueDate:'',
  contractorId:'', contractorContactId:'',
  photos:[], quotes:[], invoices:[], docs:[], notes:[],
  createdAt:new Date().toLocaleString('en-AU',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'}),
})

function CreateCaseForm({initial,isEdit,onSave,onCancel}) {
  const [f,setF]=useState(initial||EMPTY())
  const sf=(k,v)=>setF(p=>({...p,[k]:v}))

  function handleRoleChange(role) {
    sf('raisedByRole',role)
    if(role==='Tenant') sf('jobArea','Private Lot')
    sf('raisedById',''); sf('raisedByName',''); sf('raisedByPhone',''); sf('raisedByEmail','')
  }
  function handleRaiserSelect(id) {
    sf('raisedById',id)
    const all=[...TENANTS.map(t=>({...t,name:`${t.firstName} ${t.lastName}`})),...OWNERS.map(o=>({...o,name:`${o.firstName} ${o.lastName}`})),...AGENTS.map(a=>({...a,name:`${a.firstName} ${a.lastName}`}))]
    const p=all.find(x=>x.id===id)
    if(p){sf('raisedByName',p.name);sf('raisedByPhone',p.phone);sf('raisedByEmail',p.email)}
  }
  function handleAccessSelect(id) {
    sf('accessContactId',id)
    const t=TENANTS.find(x=>x.id===id)
    if(t){sf('accessContactName',`${t.firstName} ${t.lastName}`);sf('accessContactPhone',t.phone)}
  }
  function handleContractorChange(id){sf('contractorId',id);sf('contractorContactId','')}

  const selectedContractor=CONTRACTORS.find(c=>c.id===f.contractorId)
  const it=issueType(f.issueType)
  const roleOptions=[{v:'Admin',l:'Admin / Building Manager'},{v:'Tenant',l:'Tenant'},{v:'Owner',l:'Owner'},{v:'Agent',l:'Real Estate Agent'},{v:'Contractor',l:'Contractor'}]
  function getPeopleForRole(role) {
    if(role==='Tenant') return TENANTS.map(t=>({v:t.id,l:`${t.firstName} ${t.lastName} — Unit ${t.unit}`}))
    if(role==='Owner')  return OWNERS.map(o=>({v:o.id,l:`${o.firstName} ${o.lastName} — Unit ${o.unit}`}))
    if(role==='Agent')  return AGENTS.map(a=>({v:a.id,l:`${a.firstName} ${a.lastName} — ${a.agency}`}))
    return []
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden',background:'#f3f4f6'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={onCancel} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#6b7280'}}>←</button>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:'#111827'}}>{isEdit?`Edit ${f.id}`:'Create Work Order'}</div>
            <div style={{fontSize:11,color:'#9ca3af',marginTop:1}}>📅 {f.createdAt}</div>
          </div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Btn onClick={onCancel}>Cancel</Btn>
          <Btn primary onClick={()=>{if(!f.issueType||!f.title)return;const id=isEdit?f.id:'WO-'+(Date.now()+'').slice(-4);onSave({...f,id})}} disabled={!f.issueType||!f.title}>
            {isEdit?'Save Changes':'Save & Create'}
          </Btn>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'20px',display:'flex',gap:20,alignItems:'flex-start'}}>
        <div style={{flex:1,minWidth:0}}>

          <Section icon="👤" title="Raised by">
            <FGrid>
              <FSel label="Role" value={f.raisedByRole} onChange={handleRoleChange} options={roleOptions} required/>
              {getPeopleForRole(f.raisedByRole).length>0
                ? <div><SL>Select person</SL><select value={f.raisedById} onChange={e=>handleRaiserSelect(e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,background:'#fff',boxSizing:'border-box',appearance:'auto'}}><option value="">— Select —</option>{getPeopleForRole(f.raisedByRole).map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>
                : <FInp label="Name" value={f.raisedByName} onChange={v=>sf('raisedByName',v)} placeholder="Full name"/>
              }
              <FInp label="Phone" value={f.raisedByPhone} onChange={v=>sf('raisedByPhone',v)} placeholder="0412 345 678"/>
              <FInp label="Email" value={f.raisedByEmail} onChange={v=>sf('raisedByEmail',v)} placeholder="email@example.com"/>
            </FGrid>
            <div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:8,padding:'12px 14px',marginTop:4}}>
              <div style={{fontSize:12,fontWeight:600,color:'#0369a1',marginBottom:10}}>🔑 Access contact (for entry to unit)</div>
              <FGrid>
                <div><SL>Access person</SL><select value={f.accessContactId} onChange={e=>handleAccessSelect(e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:6,border:'1px solid #bae6fd',fontSize:13,background:'#fff',boxSizing:'border-box',appearance:'auto'}}><option value="">— Same as raiser / not required —</option>{TENANTS.map(t=><option key={t.id} value={t.id}>{t.firstName} {t.lastName} — Unit {t.unit}</option>)}</select></div>
                <FInp label="Access phone" value={f.accessContactPhone} onChange={v=>sf('accessContactPhone',v)} placeholder="Best number for access"/>
              </FGrid>
            </div>
          </Section>

          <Section icon="🔧" title="Type of issue">
            <div style={{marginBottom:14}}>
              <SL required>Select category</SL>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                {ISSUE_TYPES.map(t=>(
                  <div key={t.id} onClick={()=>sf('issueType',t.id)} style={{padding:'10px 8px',borderRadius:8,border:f.issueType===t.id?`2px solid ${BLUE}`:'1px solid #e5e7eb',background:f.issueType===t.id?'#eff6ff':'#fff',cursor:'pointer',textAlign:'center'}} onMouseEnter={e=>{if(f.issueType!==t.id)e.currentTarget.style.background='#f9fafb'}} onMouseLeave={e=>{if(f.issueType!==t.id)e.currentTarget.style.background='#fff'}}>
                    <div style={{fontSize:20,marginBottom:3}}>{t.icon}</div>
                    <div style={{fontSize:11,fontWeight:f.issueType===t.id?700:500,color:f.issueType===t.id?BLUE:'#374151'}}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <FGrid cols={1}><FInp label="Job title / summary" value={f.title} onChange={v=>sf('title',v)} placeholder="e.g. No hot water — Unit 101" required/></FGrid>
            <div><SL>Description — describe the issue in detail</SL><textarea value={f.description} onChange={e=>sf('description',e.target.value)} placeholder="Describe the problem in as much detail as possible. When did it start? What have you tried? Does it affect other areas?" rows={5} style={{width:'100%',padding:'9px 12px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,resize:'vertical',fontFamily:'inherit',background:'#fff',boxSizing:'border-box'}}/></div>
          </Section>

          <Section icon="📍" title="Location">
            <FGrid>
              <div><SL>Unit number</SL><select value={f.unit} onChange={e=>sf('unit',e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,background:'#fff',boxSizing:'border-box',appearance:'auto'}}><option value="">— Common area / no unit —</option>{UNITS.map(u=><option key={u} value={u}>Unit {u}</option>)}</select></div>
              <div><SL>Job area{f.raisedByRole==='Tenant'&&<span style={{fontSize:10,fontWeight:400,color:'#0369a1',marginLeft:4}}>— auto set to Private Lot</span>}</SL><select value={f.jobArea} onChange={e=>sf('jobArea',e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,background:'#fff',boxSizing:'border-box',appearance:'auto'}}><option value="">— Select area —</option>{JOB_AREA_OPTIONS.map(a=><option key={a} value={a}>{a}</option>)}</select></div>
            </FGrid>
            <div style={{border:'1px dashed #d1d5db',borderRadius:6,padding:'16px',background:'#f9fafb',textAlign:'center'}}>
              <div style={{fontSize:13,color:'#9ca3af',fontWeight:500}}>🔧 Asset register — coming soon</div>
              <div style={{fontSize:12,color:'#d1d5db',marginTop:4}}>Full asset register will be linked here</div>
            </div>
          </Section>

          <Section icon="📋" title="Case details">
            <FGrid>
              <FSel label="Priority" value={f.priority} onChange={v=>sf('priority',v)} options={PRIORITIES} required/>
              <FSel label="Status"   value={f.status}   onChange={v=>sf('status',v)}   options={STATUSES}   required/>
              <FInp label="Start date" value={f.startDate} onChange={v=>sf('startDate',v)} type="date"/>
              <FInp label="Due date"   value={f.dueDate}   onChange={v=>sf('dueDate',v)}   type="date"/>
              <FInp label="Purchase order number" value={f.poNumber} onChange={v=>sf('poNumber',v)} placeholder="e.g. PO-441"/>
            </FGrid>
          </Section>

          <Section icon="🏗️" title="Assign contractor">
            <FGrid>
              <div><SL>Contractor company</SL><select value={f.contractorId} onChange={e=>handleContractorChange(e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,background:'#fff',boxSizing:'border-box',appearance:'auto'}}><option value="">— Select contractor —</option>{CONTRACTORS.map(c=><option key={c.id} value={c.id}>{c.company} ({c.trade})</option>)}</select></div>
              <div><SL>Contact person{!f.contractorId&&<span style={{fontSize:10,color:'#9ca3af'}}> — select company first</span>}</SL><select value={f.contractorContactId} onChange={e=>sf('contractorContactId',e.target.value)} disabled={!f.contractorId} style={{width:'100%',padding:'9px 12px',borderRadius:6,border:'1px solid #d1d5db',fontSize:13,background:f.contractorId?'#fff':'#f9fafb',boxSizing:'border-box',appearance:'auto'}}><option value="">— Select person —</option>{selectedContractor?.contacts.map(c=><option key={c.id} value={c.id}>{c.name} — {c.role}</option>)}</select></div>
            </FGrid>
            {f.contractorId&&f.contractorContactId&&(()=>{const con=CONTRACTORS.find(c=>c.id===f.contractorId),cp=con?.contacts.find(c=>c.id===f.contractorContactId);if(!cp)return null;return <div style={{background:'#fef3c7',border:'1px solid #fde68a',borderRadius:8,padding:'12px 14px',display:'flex',alignItems:'center',gap:12}}><div style={{width:38,height:38,borderRadius:'50%',background:'#fde68a',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14,color:'#92400e',flexShrink:0}}>{cp.name.split(' ').map(n=>n[0]).join('')}</div><div><div style={{fontSize:13,fontWeight:600,color:'#111827'}}>{cp.name} <span style={{fontSize:11,color:'#92400e',fontWeight:400}}>· {cp.role}</span></div><div style={{fontSize:12,color:'#6b7280',marginTop:2}}>{con.company} · {cp.phone}</div><div style={{fontSize:12,color:'#6b7280'}}>{cp.email}</div></div></div>})()}
          </Section>

          <Section icon="💬" title="Notes & activity">
            <ActivityLog notes={f.notes} onAdd={n=>sf('notes',[...f.notes,n])}/>
          </Section>

        </div>

        <div style={{width:290,flexShrink:0}}>
          <Section icon="📷" title="Photos & files"><PhotoUpload files={f.photos} onChange={v=>sf('photos',v)}/></Section>
          <Section icon="💰" title="Quotes"><DocUpload files={f.quotes} onChange={v=>sf('quotes',v)} label="quotes"/></Section>
          <Section icon="🧾" title="Invoices"><DocUpload files={f.invoices} onChange={v=>sf('invoices',v)} label="invoices"/></Section>
          <Section icon="📄" title="Other documents"><DocUpload files={f.docs} onChange={v=>sf('docs',v)} label="documents"/></Section>
        </div>
      </div>
    </div>
  )
}

// ─── List view ────────────────────────────────────────────────────────────────
function WorkOrdersList({orders,onNew,onOpen}) {
  const [filter,setFilter]=useState('all')
  const [search,setSearch]=useState('')
  const filtered=orders.filter(o=>{
    const ms=o.title.toLowerCase().includes(search.toLowerCase())||o.id.toLowerCase().includes(search.toLowerCase())||o.raisedByName.toLowerCase().includes(search.toLowerCase())
    const sf=filter==='all'||(filter==='open'&&!['Completed','Cancelled'].includes(o.status))||o.status.toLowerCase().replace(/ /g,'-')===filter
    return ms&&sf
  })
  const counts={all:orders.length,open:orders.filter(o=>!['Completed','Cancelled'].includes(o.status)).length,new:orders.filter(o=>o.status==='New').length,'in-progress':orders.filter(o=>o.status==='In Progress').length,completed:orders.filter(o=>o.status==='Completed').length}
  const thS={textAlign:'left',fontSize:11,fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',padding:'0 12px 10px',borderBottom:'1px solid #e5e7eb'}
  const tdS={padding:'11px 12px',borderBottom:'1px solid #f3f4f6',fontSize:13,color:'#374151',verticalAlign:'middle',cursor:'pointer'}
  return <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
    <div style={{padding:'14px 20px 0',background:'#fff',borderBottom:'1px solid #e5e7eb',flexShrink:0}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <div style={{fontSize:17,fontWeight:700,color:'#111827'}}>Work Orders</div>
        <button onClick={onNew} style={{padding:'8px 16px',borderRadius:6,border:'none',background:BLUE,color:'#fff',fontSize:13,fontWeight:500,cursor:'pointer'}}>+ Create Work Order</button>
      </div>
      <div style={{display:'flex',gap:2}}>
        {[{id:'all',label:'All'},{id:'open',label:'Open'},{id:'new',label:'New'},{id:'in-progress',label:'In Progress'},{id:'completed',label:'Completed'}].map(t=>(
          <button key={t.id} onClick={()=>setFilter(t.id)} style={{padding:'8px 14px',border:'none',background:'none',cursor:'pointer',fontSize:13,fontWeight:500,color:filter===t.id?BLUE:'#6b7280',borderBottom:filter===t.id?`2px solid ${BLUE}`:'2px solid transparent',marginBottom:-1,display:'flex',alignItems:'center',gap:5}}>
            {t.label}<span style={{background:filter===t.id?'#e8f0fd':'#f3f4f6',color:filter===t.id?BLUE:'#6b7280',fontSize:11,fontWeight:600,padding:'1px 6px',borderRadius:9}}>{counts[t.id]||0}</span>
          </button>
        ))}
      </div>
    </div>
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 20px',background:'#fff',borderBottom:'1px solid #e5e7eb',flexShrink:0}}>
      <div style={{position:'relative',flex:'1 1 200px'}}>
        <span style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:13}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title, ID or contact…" style={{paddingLeft:30,paddingRight:10,paddingTop:6,paddingBottom:6,borderRadius:6,border:'1px solid #d1d5db',fontSize:13,width:'100%',boxSizing:'border-box'}}/>
      </div>
    </div>
    <div style={{flex:1,overflowY:'auto',padding:'0 20px 20px'}}>
      <div style={{background:'#fff',borderRadius:8,border:'1px solid #e5e7eb',marginTop:14,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['ID','Type','Title','Status','Priority','Raised By','Unit','Contractor','Due','📷'].map(h=><th key={h} style={thS}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.length===0
              ? <tr><td colSpan={10} style={{textAlign:'center',padding:'40px',color:'#9ca3af',fontSize:13}}>No work orders found.</td></tr>
              : filtered.map(o=>{
                  const it=issueType(o.issueType),sc=statusColor(o.status),pc=priorityColor(o.priority),con=getContractor(o.contractorId)
                  return <tr key={o.id} onClick={()=>onOpen(o)} onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={tdS}><span style={{fontFamily:'monospace',fontSize:11,fontWeight:700,color:BLUE}}>{o.id}</span></td>
                    <td style={tdS}><span title={it?.label}>{it?.icon}</span> <span style={{fontSize:11,color:'#6b7280'}}>{it?.label}</span></td>
                    <td style={tdS}><div style={{fontWeight:500,color:'#111827',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.title}</div></td>
                    <td style={tdS}><Badge label={o.status} {...sc}/></td>
                    <td style={tdS}><Badge label={o.priority} {...pc}/></td>
                    <td style={tdS}><div style={{fontSize:12}}>{o.raisedByName||'—'}<br/><span style={{color:'#9ca3af',fontSize:11}}>{o.raisedByRole}</span></div></td>
                    <td style={tdS}>{o.unit?<span style={{fontSize:12}}>Unit {o.unit}</span>:'—'}</td>
                    <td style={tdS}><span style={{fontSize:12}}>{con?.company||<span style={{color:'#9ca3af'}}>Unassigned</span>}</span></td>
                    <td style={tdS}><span style={{fontSize:12,color:o.dueDate&&new Date(o.dueDate)<new Date()&&!['Completed','Cancelled'].includes(o.status)?'#dc2626':'#374151'}}>{o.dueDate?new Date(o.dueDate).toLocaleDateString('en-AU',{day:'numeric',month:'short'}):'—'}</span></td>
                    <td style={tdS}>{o.photos.length>0?<span style={{background:'#e8f0fd',color:BLUE,fontSize:10,fontWeight:700,padding:'1px 5px',borderRadius:99}}>{o.photos.length}</span>:'—'}</td>
                  </tr>
                })
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>
}

// ─── Detail view ──────────────────────────────────────────────────────────────
function CaseDetail({order,onBack,onEdit}) {
  const it=issueType(order.issueType),sc=statusColor(order.status),pc=priorityColor(order.priority)
  const con=getContractor(order.contractorId),cp=getContractorContact(order.contractorId,order.contractorContactId)
  return <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
    <div style={{padding:'14px 20px',background:'#fff',borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <button onClick={onBack} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#6b7280'}}>←</button>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <span style={{fontFamily:'monospace',fontSize:12,fontWeight:700,color:BLUE}}>{order.id}</span>
            {it&&<span>{it.icon} <span style={{fontSize:12,color:'#6b7280'}}>{it.label}</span></span>}
            <Badge label={order.status} {...sc}/><Badge label={order.priority} {...pc}/>
          </div>
          <div style={{fontSize:15,fontWeight:600,color:'#111827'}}>{order.title}</div>
          <div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>Created {order.createdAt}</div>
        </div>
      </div>
      <button onClick={onEdit} style={{padding:'8px 16px',borderRadius:6,border:'none',background:BLUE,color:'#fff',fontSize:13,fontWeight:500,cursor:'pointer'}}>✏️ Edit</button>
    </div>
    <div style={{flex:1,overflowY:'auto',padding:'20px',display:'flex',gap:20,alignItems:'flex-start'}}>
      <div style={{flex:1,minWidth:0}}>
        <Section icon="👤" title="Raised by">
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14,marginBottom:order.accessContactName?14:0}}>
            <div><SL>Role</SL><Badge label={order.raisedByRole} bg='#f3f4f6' color='#374151'/></div>
            <div><SL>Name</SL><div style={{fontSize:13,fontWeight:500}}>{order.raisedByName||'—'}</div></div>
            <div><SL>Phone</SL><div style={{fontSize:13}}>{order.raisedByPhone||'—'}</div></div>
            <div><SL>Email</SL><div style={{fontSize:13}}>{order.raisedByEmail||'—'}</div></div>
          </div>
          {order.accessContactName&&<div style={{background:'#f0f9ff',border:'1px solid #bae6fd',borderRadius:8,padding:'10px 14px'}}>
            <div style={{fontSize:11,fontWeight:600,color:'#0369a1',marginBottom:4}}>🔑 Access contact</div>
            <div style={{fontSize:13,fontWeight:500}}>{order.accessContactName} · {order.accessContactPhone}</div>
          </div>}
        </Section>
        <Section icon="🔧" title="Issue">
          <div style={{background:'#f9fafb',borderRadius:8,padding:'12px 14px',marginBottom:14,border:'1px solid #f3f4f6',fontSize:13,color:'#374151',lineHeight:1.6}}>{order.description||'No description provided.'}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
            <div><SL>Unit</SL><div style={{fontSize:13}}>{order.unit?`Unit ${order.unit}`:'—'}</div></div>
            <div><SL>Job area</SL><div style={{fontSize:13}}>{order.jobArea||'—'}</div></div>
            <div><SL>Start date</SL><div style={{fontSize:13}}>{order.startDate?new Date(order.startDate).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}):'—'}</div></div>
            <div><SL>Due date</SL><div style={{fontSize:13}}>{order.dueDate?new Date(order.dueDate).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}):'—'}</div></div>
          </div>
        </Section>
        {con&&<Section icon="🏗️" title="Contractor">
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:cp?12:0}}>
            <div style={{width:38,height:38,borderRadius:8,background:'#fef3c7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🏗️</div>
            <div><div style={{fontSize:14,fontWeight:600}}>{con.company}</div><div style={{fontSize:12,color:'#6b7280'}}>{con.trade} · {con.phone}</div></div>
          </div>
          {cp&&<div style={{background:'#fef3c7',border:'1px solid #fde68a',borderRadius:8,padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:'#fde68a',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12,color:'#92400e'}}>{cp.name.split(' ').map(n=>n[0]).join('')}</div>
            <div><div style={{fontSize:13,fontWeight:600}}>{cp.name} · {cp.role}</div><div style={{fontSize:12,color:'#6b7280'}}>{cp.phone} · {cp.email}</div></div>
          </div>}
        </Section>}
        <Section icon="💬" title="Notes & activity">
          <ActivityLog notes={order.notes||[]} onAdd={()=>{}}/>
        </Section>
      </div>
      <div style={{width:270,flexShrink:0}}>
        {[{title:'Photos 📷',files:order.photos},{title:'Quotes 💰',files:order.quotes},{title:'Invoices 🧾',files:order.invoices},{title:'Documents 📄',files:order.docs}].map(({title,files})=>(
          <div key={title} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:10,overflow:'hidden',marginBottom:12}}>
            <div style={{padding:'10px 14px',borderBottom:'1px solid #f3f4f6',fontSize:13,fontWeight:600,color:'#111827',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              {title}{files.length>0&&<span style={{background:'#e8f0fd',color:BLUE,fontSize:10,fontWeight:700,padding:'1px 5px',borderRadius:99}}>{files.length}</span>}
            </div>
            <div style={{padding:'10px 14px'}}>
              {files.length===0?<div style={{fontSize:12,color:'#9ca3af',textAlign:'center',padding:'6px 0'}}>None attached</div>
              :files.map(f=><div key={f.id} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8}}>
                <span style={{fontSize:16}}>{f.type?.includes('image')?'🖼️':f.type?.includes('pdf')?'📄':'📎'}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</div>
                  {f.description&&<div style={{fontSize:11,color:'#374151',marginTop:1}}>{f.description}</div>}
                  <div style={{fontSize:10,color:'#9ca3af',marginTop:1}}>{f.uploadedAt}</div>
                </div>
              </div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function WorkOrdersPage() {
  const [view,setView]=useState('list')
  const [orders,setOrders]=useState(SEED)
  const [active,setActive]=useState(null)
  function handleSave(order) {
    setOrders(p=>{const ex=p.find(o=>o.id===order.id);return ex?p.map(o=>o.id===order.id?order:o):[...p,order]})
    setActive(order); setView('detail')
  }
  return (
    <div className="main-content" style={{padding:0,display:'flex',flexDirection:'column',height:'100%'}}>
      {view==='create' ? <CreateCaseForm onSave={handleSave} onCancel={()=>setView('list')}/>
      :view==='edit'   ? <CreateCaseForm initial={active} isEdit onSave={handleSave} onCancel={()=>setView('detail')}/>
      :view==='detail'&&active ? <CaseDetail order={orders.find(o=>o.id===active.id)||active} onBack={()=>setView('list')} onEdit={()=>setView('edit')}/>
      :<WorkOrdersList orders={orders} onNew={()=>setView('create')} onOpen={o=>{setActive(o);setView('detail')}}/>}
    </div>
  )
}
