import { useState } from 'react'

/**
 * MatchSchedule — sidebar component showing upcoming,
 * live, and completed matches with add/delete controls.
 */
export default function MatchSchedule({ schedule, activeMatchId, onSelect, onAdd, onDelete }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newT1, setNewT1] = useState('')
  const [newT2, setNewT2] = useState('')
  const [newType, setNewType] = useState('match')
  const [open, setOpen] = useState(true)

  const handleSubmit = () => {
    if (!newT1.trim() || !newT2.trim()) return
    onAdd(newT1.trim(), newT2.trim(), newType)
    setNewT1('')
    setNewT2('')
    setNewType('match')
    setShowAdd(false)
  }

  return (
    <div className={`panel collapsible-panel ${open ? 'panel-open' : 'panel-collapsed'}`} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="panel-title panel-toggle" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setOpen(o => !o)}>
        <span className="dot"></span> MATCH SCHEDULE
        <span className={`chevron ${open ? 'chevron-open' : ''}`}>&#9662;</span>
        <button
          className="btn btn-small btn-start"
          style={{ marginLeft: '8px', padding: '3px 10px' }}
          onClick={e => { e.stopPropagation(); setShowAdd(!showAdd) }}
        >
          {showAdd ? '✕' : '+ ADD'}
        </button>
      </div>

      <div className={`panel-body ${open ? 'panel-body-open' : 'panel-body-closed'}`} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {showAdd && (
        <div style={{
          padding: '10px',
          background: 'var(--bg-deep)',
          borderRadius: '6px',
          marginBottom: '8px',
          border: '1px solid var(--border)',
        }}>
          <div className="modal-field">
            <label>TEAM 1</label>
            <input value={newT1} onChange={e => setNewT1(e.target.value)}
              placeholder="Team name..." />
          </div>
          <div className="modal-field">
            <label>TEAM 2</label>
            <input value={newT2} onChange={e => setNewT2(e.target.value)}
              placeholder="Team name..." />
          </div>
          <div className="modal-field">
            <label>TYPE</label>
            <select value={newType} onChange={e => setNewType(e.target.value)}>
              <option value="match">Match</option>
              <option value="resurrection">Resurrection</option>
              <option value="rumble">Rumble</option>
              <option value="semifinal">Semi Final</option>
              <option value="final">Final</option>
            </select>
          </div>
          <button className="btn btn-start btn-small" onClick={handleSubmit}
            style={{ width: '100%' }}>
            ADD MATCH
          </button>
        </div>
      )}

      <div className="schedule-list" style={{ overflow: 'auto', flex: 1 }}>
        {schedule.map(m => (
          <div
            key={m.id}
            className={`schedule-item ${m.id === activeMatchId ? 'active' : ''}`}
            onClick={() => onSelect(m.id)}
          >
            <span className="match-num">#{m.id}</span>
            <div className="match-teams">
              {m.team1} <span className="vs">VS</span> {m.team2}
              {m.winner && (
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--green)',
                  fontFamily: 'var(--font-mono)',
                  marginTop: '2px',
                }}>
                  🏆 {m.winner}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span className={`match-status ${m.status}`}>
                {m.status === 'live' ? '● LIVE' : m.status === 'done' ? 'DONE' : 'NEXT'}
              </span>
              {m.id !== activeMatchId && m.status !== 'done' && (
                <button
                  className="score-btn"
                  style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}
                  onClick={e => { e.stopPropagation(); onDelete(m.id) }}
                  title="Remove match"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}

        {schedule.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            padding: '20px',
          }}>
            No matches scheduled
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
