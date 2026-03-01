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

  const handleSubmit = () => {
    if (!newT1.trim() || !newT2.trim()) return
    onAdd(newT1.trim(), newT2.trim(), newType)
    setNewT1('')
    setNewT2('')
    setNewType('match')
    setShowAdd(false)
  }

  return (
    <div className="panel" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="panel-title" style={{ display: 'flex', alignItems: 'center' }}>
        <span className="dot"></span> MATCH SCHEDULE
        <button
          className="btn btn-small btn-start"
          style={{ marginLeft: 'auto', padding: '3px 10px' }}
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? '✕' : '+ ADD'}
        </button>
      </div>

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
  )
}
