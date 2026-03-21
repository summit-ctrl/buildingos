import './styles/global.css'
import { useState } from 'react'
import Sidebar        from './components/Sidebar'
import ContactsPage   from './pages/contacts'
import WorkOrdersPage from './pages/workorders'
import MessagesPage   from './pages/messages'
import ComingSoon     from './pages/ComingSoon'
import { BUILDINGS }  from './data/seed'

const PAGE_LABELS = {
  dashboard:   'Dashboard',
  calendar:    'Calendar',
  maintenance: 'Maintenance',
  building:    'Building',
  keys:        'Keys',
  parcels:     'Parcels',
  contractors: 'Contractors',
  visitors:    'Visitor Check-In',
  settings:    'Settings',
}

export default function App() {
  const [activePage, setActivePage] = useState('contacts')
  const [pendingWO,  setPendingWO]  = useState(null)
  const building = BUILDINGS[0]

  function handleCreateJobFromMessages(data) {
    setPendingWO(data)
    setActivePage('workorders')
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} building={building} />
      {activePage === 'contacts'   && <ContactsPage  building={building} />}
      {activePage === 'workorders' && (
        <WorkOrdersPage pendingWO={pendingWO} onClearPending={() => setPendingWO(null)} />
      )}
      {activePage === 'messages'   && (
        <MessagesPage onCreateJob={handleCreateJobFromMessages} />
      )}
      {!['contacts','workorders','messages'].includes(activePage) &&
        <ComingSoon title={PAGE_LABELS[activePage] ?? activePage} />
      }
    </div>
  )
}
