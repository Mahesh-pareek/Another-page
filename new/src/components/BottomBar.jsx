/**
 * BottomBar — persistent status strip showing:
 *   - Match count, type, elapsed
 *   - Rolling event log
 */
import { useState, useEffect } from 'react'

export default function BottomBar({ done, total, matchType, logs }) {
  const [clock, setClock] = useState(getTime())

  useEffect(() => {
    const id = setInterval(() => setClock(getTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bottom-section">
      <div className="bottom-stat">
        <span className="stat-label">MATCHES</span>
        <span className="stat-value">{done}/{total}</span>
      </div>

      <div className="bottom-divider" />

      <div className="bottom-stat">
        <span className="stat-label">TYPE</span>
        <span className="stat-value" style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}>
          {matchType}
        </span>
      </div>

      <div className="bottom-divider" />

      <div className="bottom-stat">
        <span className="stat-label">CLOCK</span>
        <span className="stat-value" style={{ fontFamily: 'var(--font-mono)' }}>
          {clock}
        </span>
      </div>

      <div className="bottom-divider" />

      <div className="bottom-stat">
        <span className="stat-label">WEIGHT</span>
        <span className="stat-value">8 KG</span>
      </div>

      <div className="bottom-divider" />

      <div className="match-log">
        {logs.map((log, i) => (
          <div key={i} className={`log-entry ${log.type}`}>
            {log.text}
          </div>
        ))}
      </div>
    </div>
  )
}

function getTime() {
  const d = new Date()
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}
