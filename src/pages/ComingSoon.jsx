export default function ComingSoon({ title }) {
  return (
    <div className="main-content">
      <div className="page-header">
        <span className="page-title">{title}</span>
      </div>
      <div className="page-body">
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-state-icon">&#9881;</div>
          <h3>{title}</h3>
          <p>This section is coming soon.</p>
        </div>
      </div>
    </div>
  )
}
