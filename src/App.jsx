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
  const [activePage, setActivePage]             = useState('contacts')
  const [workOrderPrefill, setWorkOrderPrefill] = useState(null)
  const building = BUILDINGS[0]

  function handleCreateJobFromMessage(prefill) {
    setWorkOrderPrefill(prefill)
    setActivePage('workorders')
  }

  function handlePageChange(page) {
    if (page !== 'workorders') setWorkOrderPrefill(null)
    setActivePage(page)
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={handlePageChange}
        building={building}
      />
      {activePage === 'contacts'   && <ContactsPage  building={building} />}
      {activePage === 'workorders' && <WorkOrdersPage prefill={workOrderPrefill} />}
      {activePage === 'messages'   && <MessagesPage   onCreateJob={handleCreateJobFromMessage} />}
      {!['contacts','workorders','messages'].includes(activePage) &&
        <ComingSoon title={PAGE_LABELS[activePage] ?? activePage} />
      }
    </div>
  )
}
