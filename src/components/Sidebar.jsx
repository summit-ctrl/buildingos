import {
  LayoutDashboard, Briefcase, MessageSquare, ClipboardList,
  Calendar, Wrench, Building2, Users, KeyRound, Package,
  HardHat, UserCheck, Settings,
} from 'lucide-react'

const NAV = [
  { id:'dashboard',   label:'Dashboard',       icon:LayoutDashboard },
  { id:'contacts',    label:'Contacts',         icon:Users },
  { id:'messages',    label:'Messages',         icon:MessageSquare },
  { id:'workorders',  label:'Work Orders',      icon:ClipboardList },
  { id:'calendar',    label:'Calendar',         icon:Calendar },
  { id:'maintenance', label:'Maintenance',      icon:Wrench },
  { id:'building',    label:'Building',         icon:Building2 },
  { id:'keys',        label:'Keys',             icon:KeyRound },
  { id:'parcels',     label:'Parcels',          icon:Package },
  { id:'contractors', label:'Contractors',      icon:HardHat },
  { id:'visitors',    label:'Visitor Check-In', icon:UserCheck },
  { id:'settings',    label:'Settings',         icon:Settings },
]

export default function Sidebar({ activePage, setActivePage, building }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-building">
        <div className="sidebar-building-placeholder">&#127963;</div>
        <div className="sidebar-building-name">
          {building.name} ({building.spNumber})
        </div>
        <div className="sidebar-building-addr">
          {building.address} {building.suburb} {building.state}
        </div>
      </div>

      <div className="sidebar-section-label">Navigation</div>
      {NAV.map(({ id, label, icon: Icon }) => (
        <div
          key={id}
          className={`nav-item${activePage === id ? ' active' : ''}`}
          onClick={() => setActivePage(id)}
        >
          <Icon className="nav-icon" size={16} />
          {label}
        </div>
      ))}
    </aside>
  )
}
