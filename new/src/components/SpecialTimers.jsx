import { useState, useEffect, useRef } from 'react'

/**
 * SpecialTimers — Rulebook compliance timers:
 *   Pin Timer: 20s max, warning at 10s (§9.5)
 *   Immobilization Timer: 10s to prove movement (§9.5)
 * Click to start/stop. Auto-resets when done.
 */
export default function SpecialTimers({ addLog }) {
  return (
    <div className="panel">
      <div className="panel-title"><span className="dot"></span> RULE TIMERS</div>
      <div className="special-timers">
        <PinTimer addLog={addLog} />
        <ImmobilizationTimer addLog={addLog} />
      </div>
    </div>
  )
}

function PinTimer({ addLog }) {
  const MAX = 20
  const WARN = 10
  const [time, setTime] = useState(MAX)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (running && time > 0) {
      ref.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setRunning(false)
            clearInterval(ref.current)
            addLog('⚠ PIN LIMIT REACHED — RELEASE NOW', 'ko')
            return 0
          }
          if (prev === WARN + 1) {
            addLog('⚠ PIN WARNING — 10s elapsed')
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(ref.current)
  }, [running, addLog])

  const handleStart = () => {
    if (time <= 0) return
    if (!running) addLog('📌 PIN TIMER STARTED')
    setRunning(true)
  }
  const handlePause = () => {
    if (running) addLog('⏸ PIN TIMER PAUSED at ' + time + 's')
    setRunning(false)
  }
  const handleReset = () => {
    setRunning(false)
    clearInterval(ref.current)
    setTime(MAX)
  }

  let cls = 'special-timer'
  if (running && time <= 5) cls += ' critical'
  else if (running && time <= WARN) cls += ' warning'
  else if (running) cls += ' active'

  const pct = ((MAX - time) / MAX) * 100
  let barColor = 'var(--yellow)'
  if (time <= 5) barColor = 'var(--red)'
  else if (time <= WARN) barColor = 'var(--orange)'

  return (
    <div className={cls}>
      <div className="st-label">📌 PIN TIMER</div>
      <div className="st-time">{time}s</div>
      <div className="st-bar">
        <div className="st-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <div className="st-controls">
        {!running ? (
          <button className="st-btn st-btn-start" onClick={handleStart} disabled={time <= 0}>
            ▶ {time < MAX && time > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button className="st-btn st-btn-pause" onClick={handlePause}>⏸ Pause</button>
        )}
        <button className="st-btn st-btn-reset" onClick={handleReset}>↺</button>
      </div>
      <div className="st-hint">Max 20s · Warn at 10s</div>
    </div>
  )
}

function ImmobilizationTimer({ addLog }) {
  const MAX = 10
  const [time, setTime] = useState(MAX)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (running && time > 0) {
      ref.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setRunning(false)
            clearInterval(ref.current)
            addLog('💀 IMMOBILIZED — 10s COUNTDOWN COMPLETE', 'ko')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(ref.current)
  }, [running, addLog])

  const handleStart = () => {
    if (time <= 0) return
    if (!running) addLog('⏱ IMMOBILIZATION CHECK STARTED')
    setRunning(true)
  }
  const handlePause = () => {
    if (running) addLog('⏸ IMMOBILIZATION PAUSED at ' + time + 's')
    setRunning(false)
  }
  const handleReset = () => {
    setRunning(false)
    clearInterval(ref.current)
    setTime(MAX)
  }

  let cls = 'special-timer'
  if (running && time <= 3) cls += ' critical'
  else if (running && time <= 5) cls += ' warning'
  else if (running) cls += ' active'

  const pct = ((MAX - time) / MAX) * 100
  let barColor = 'var(--yellow)'
  if (time <= 3) barColor = 'var(--red)'
  else if (time <= 5) barColor = 'var(--orange)'

  return (
    <div className={cls}>
      <div className="st-label">💀 IMMOBILE CHECK</div>
      <div className="st-time">{time}s</div>
      <div className="st-bar">
        <div className="st-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <div className="st-controls">
        {!running ? (
          <button className="st-btn st-btn-start" onClick={handleStart} disabled={time <= 0}>
            ▶ {time < MAX && time > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button className="st-btn st-btn-pause" onClick={handlePause}>⏸ Pause</button>
        )}
        <button className="st-btn st-btn-reset" onClick={handleReset}>↺</button>
      </div>
      <div className="st-hint">Must move 1″ in 10s</div>
    </div>
  )
}
