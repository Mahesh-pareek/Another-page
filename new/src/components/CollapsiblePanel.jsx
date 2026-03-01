import { useState } from 'react'

export default function CollapsiblePanel({ title, defaultOpen = true, className = '', children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`panel collapsible-panel ${open ? 'panel-open' : 'panel-collapsed'} ${className}`}>
      <div className="panel-title panel-toggle" onClick={() => setOpen(o => !o)}>
        <span className="dot"></span>
        {title}
        <span className={`chevron ${open ? 'chevron-open' : ''}`}>&#9662;</span>
      </div>
      <div className={`panel-body ${open ? 'panel-body-open' : 'panel-body-closed'}`}>
        {children}
      </div>
    </div>
  )
}
