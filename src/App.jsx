import React from "react"
import "./styles/global.css"
import { useState } from "react"
import Sidebar from "./components/Sidebar"
import ContactsPage from "./pages/contacts"
import ComingSoon from "./pages/ComingSoon"
import { BUILDINGS } from "./data/seed"

const PAGE_LABELS = {
  dashboard: "Dashboard", messages: "Messages", workorders: "Work Orders",
  calendar: "Calendar", maintenance: "Maintenance", building: "Building",
  keys: "Keys", parcels: "Parcels", contractors: "Contractors",
  visitors: "Visitor Check-In", settings: "Settings",
}

export default function App() {
  const [activePage, setActivePage] = useState("contacts")
  const building = BUILDINGS[0]
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} building={building} />
      {activePage === "contacts"
        ? <ContactsPage building={building} />
        : <ComingSoon title={PAGE_LABELS[activePage] ?? activePage} />}
    </div>
  )
}
