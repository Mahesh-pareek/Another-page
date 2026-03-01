import { useState, useCallback, useEffect, useRef } from 'react'
import MatchTimer from './components/MatchTimer'
import ScorePanel from './components/ScorePanel'
import SpecialTimers from './components/SpecialTimers'
import MatchSchedule from './components/MatchSchedule'
import WinnerOverlay from './components/WinnerOverlay'
import BottomBar from './components/BottomBar'

const MATCH_DURATION = 180 // 3 minutes per rulebook §9.3

const defaultSchedule = [
  { id: 1, team1: 'IRONCLAD', team2: 'VORTEX', status: 'live', type: 'match', winner: null },
  { id: 2, team1: 'PHANTOM', team2: 'WARHAMMER', status: 'upcoming', type: 'match', winner: null },
  { id: 3, team1: 'BUZZSAW', team2: 'TEMPEST', status: 'upcoming', type: 'match', winner: null },
  { id: 4, team1: 'CRUSHER', team2: 'BOLT', status: 'upcoming', type: 'rumble', winner: null },
]

const blankScores = () => ({ aggression: 0, control: 0, damage: 0 })

export default function App() {
  const [schedule, setSchedule] = useState(defaultSchedule)
  const [activeMatchId, setActiveMatchId] = useState(1)
  const activeMatch = schedule.find(m => m.id === activeMatchId)

  const [team1Name, setTeam1Name] = useState(activeMatch?.team1 || 'TEAM 1')
  const [team2Name, setTeam2Name] = useState(activeMatch?.team2 || 'TEAM 2')
  const [team1Scores, setTeam1Scores] = useState(blankScores())
  const [team2Scores, setTeam2Scores] = useState(blankScores())
  const [matchType, setMatchType] = useState('match')

  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef(null)

  const [winner, setWinner] = useState(null)
  const [winMethod, setWinMethod] = useState('')

  const [logs, setLogs] = useState([
    { text: 'SYSTEM ONLINE', type: 'event' },
    { text: 'ROBOWARS 8KG — TRYST IIT DELHI', type: 'event' },
  ])

  const addLog = useCallback((text, type = 'event') => {
    setLogs(prev => [{ text, type, ts: Date.now() }, ...prev].slice(0, 30))
  }, [])

  // ---- Timer tick ----
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            clearInterval(timerRef.current)
            addLog('⏱ TIME UP — JUDGES DECISION', 'event')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isRunning, addLog])

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    const handler = e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          handleStartPause()
          break
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) return
          e.preventDefault()
          handleResetTimer()
          break
        case 'KeyK':
          e.preventDefault()
          handleKO(1)
          break
        case 'KeyL':
          e.preventDefault()
          handleKO(2)
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const handleStartPause = () => {
    if (timeLeft <= 0) return
    setIsRunning(prev => {
      if (!prev) addLog('▶ FIGHT RESUMED')
      else addLog('⏸ TIMEOUT CALLED')
      return !prev
    })
  }

  const handleResetTimer = () => {
    setIsRunning(false)
    clearInterval(timerRef.current)
    setTimeLeft(MATCH_DURATION)
    setTeam1Scores(blankScores())
    setTeam2Scores(blankScores())
    setWinner(null)
    addLog('↺ MATCH RESET')
  }

  const handleKO = (teamNum) => {
    setIsRunning(false)
    clearInterval(timerRef.current)
    const w = teamNum === 1 ? team1Name : team2Name
    const l = teamNum === 1 ? team2Name : team1Name
    setWinner(w)
    setWinMethod(`KNOCKOUT — ${l} immobilized`)
    addLog(`💥 KO! ${w} WINS`, 'ko')
    setSchedule(prev => prev.map(m =>
      m.id === activeMatchId ? { ...m, status: 'done', winner: w } : m
    ))
  }

  const handleJudgesDecision = () => {
    const t1 = team1Scores.aggression + team1Scores.control + team1Scores.damage
    const t2 = team2Scores.aggression + team2Scores.control + team2Scores.damage
    if (t1 === t2) {
      addLog('⚖ SCORES TIED — MANUAL DECISION NEEDED', 'event')
      return
    }
    const w = t1 > t2 ? team1Name : team2Name
    setWinner(w)
    setWinMethod(`Judges Decision — ${t1} to ${t2}`)
    addLog(`🏆 ${w} WINS — JUDGES DECISION`, 'win')
    setSchedule(prev => prev.map(m =>
      m.id === activeMatchId ? { ...m, status: 'done', winner: w } : m
    ))
  }

  const handleSelectMatch = (id) => {
    const match = schedule.find(m => m.id === id)
    if (!match) return
    setIsRunning(false)
    clearInterval(timerRef.current)
    setActiveMatchId(id)
    setTeam1Name(match.team1)
    setTeam2Name(match.team2)
    setMatchType(match.type)
    setTimeLeft(MATCH_DURATION)
    setTeam1Scores(blankScores())
    setTeam2Scores(blankScores())
    setWinner(null)
    setSchedule(prev => prev.map(m => {
      if (m.id === id) return { ...m, status: 'live' }
      if (m.status === 'live' && m.id !== id) return { ...m, status: m.winner ? 'done' : 'upcoming' }
      return m
    }))
    addLog(`📋 LOADED: ${match.team1} vs ${match.team2}`)
  }

  const handleAddMatch = (t1, t2, type) => {
    const newId = schedule.length ? Math.max(...schedule.map(m => m.id)) + 1 : 1
    setSchedule(prev => [...prev, {
      id: newId, team1: t1.toUpperCase(), team2: t2.toUpperCase(),
      status: 'upcoming', type, winner: null,
    }])
    addLog(`+ MATCH ADDED: ${t1.toUpperCase()} vs ${t2.toUpperCase()}`)
  }

  const handleDeleteMatch = (id) => {
    if (id === activeMatchId) return
    setSchedule(prev => prev.filter(m => m.id !== id))
  }

  const handleUpdateScore = (team, cat, delta) => {
    const max = { aggression: 2, control: 2, damage: 3 }
    const setter = team === 1 ? setTeam1Scores : setTeam2Scores
    setter(prev => ({
      ...prev,
      [cat]: Math.max(0, Math.min(max[cat], prev[cat] + delta))
    }))
  }

  const done = schedule.filter(m => m.status === 'done').length

  return (
    <div className="app-layout">
      {/* ===== CENTER (Dynamic) ===== */}
      <div className="center-area">
        <div className="header">
          <div className="header-brand">
            <span className="robo">ROBO</span><span className="wars">WARS</span>
            <span className="kg">8KG</span>
          </div>
          <div className="header-event">
            TRYST &mdash; <span>IIT DELHI</span><br/>Live Scoreboard
          </div>
        </div>

        {/* Teams */}
        <div className="panel">
          <div className="versus-row">
            <div className="team-card team1">
              <div className="team-label">⬡ TEAM ALPHA</div>
              <input
                className="team-name-input"
                value={team1Name}
                onChange={e => setTeam1Name(e.target.value.toUpperCase())}
                spellCheck={false}
              />
            </div>
            <div className="vs-badge">VS</div>
            <div className="team-card team2">
              <div className="team-label">TEAM BETA ⬡</div>
              <input
                className="team-name-input"
                value={team2Name}
                onChange={e => setTeam2Name(e.target.value.toUpperCase())}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="panel timer-section">
          <MatchTimer
            timeLeft={timeLeft}
            totalTime={MATCH_DURATION}
            isRunning={isRunning}
            onStartPause={handleStartPause}
            onReset={handleResetTimer}
            onKO1={() => handleKO(1)}
            onKO2={() => handleKO(2)}
            team1Name={team1Name}
            team2Name={team2Name}
            onJudgesDecision={handleJudgesDecision}
            timeUp={timeLeft <= 0}
          />
        </div>

        {/* Scores */}
        <div className="scores-row">
          <ScorePanel team={1} teamName={team1Name} scores={team1Scores}
            onUpdate={(cat, d) => handleUpdateScore(1, cat, d)} />
          <ScorePanel team={2} teamName={team2Name} scores={team2Scores}
            onUpdate={(cat, d) => handleUpdateScore(2, cat, d)} />
        </div>

        {/* Special Timers (Pin 20s, Immobilization 10s) */}
        <SpecialTimers addLog={addLog} />
      </div>

      {/* ===== SIDEBAR (Static L — Right) ===== */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-text">
            <span className="r">ROBO</span><span className="w">WARS</span>
          </div>
          <div className="event-line">TRYST 2026 · IIT DELHI · 8KG</div>
        </div>

        <div className="panel">
          <div className="panel-title"><span className="dot"></span> MATCH TYPE</div>
          <div className="match-type-selector">
            {['match', 'resurrection', 'rumble'].map(t => (
              <button key={t}
                className={`match-type-btn ${matchType === t ? 'active' : ''}`}
                onClick={() => setMatchType(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <MatchSchedule
          schedule={schedule} activeMatchId={activeMatchId}
          onSelect={handleSelectMatch} onAdd={handleAddMatch}
          onDelete={handleDeleteMatch}
        />

        <div className="panel">
          <div className="panel-title"><span className="dot"></span> CONTROLS</div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={handleStartPause}>
              <span className="qa-icon">{isRunning ? '⏸' : '▶'}</span>
              {isRunning ? 'Pause Fight' : 'Start Fight'}
              <span className="kbd">SPACE</span>
            </button>
            <button className="quick-action-btn" onClick={handleResetTimer}>
              <span className="qa-icon">↺</span> Reset Match
              <span className="kbd">R</span>
            </button>
            <button className="quick-action-btn" onClick={() => handleKO(1)}
              style={{ borderColor: 'var(--cyan-dim)' }}>
              <span className="qa-icon">🏆</span> KO — {team1Name} Wins
              <span className="kbd">K</span>
            </button>
            <button className="quick-action-btn" onClick={() => handleKO(2)}
              style={{ borderColor: 'var(--orange-dim)' }}>
              <span className="qa-icon">🏆</span> KO — {team2Name} Wins
              <span className="kbd">L</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR (Static L — Bottom) ===== */}
      <div className="bottom-bar">
        <BottomBar done={done} total={schedule.length} matchType={matchType} logs={logs} />
      </div>

      {/* Winner Overlay */}
      {winner && (
        <WinnerOverlay winner={winner} method={winMethod}
          onClose={() => setWinner(null)}
          onNextMatch={() => {
            setWinner(null)
            const next = schedule.find(m => m.status === 'upcoming')
            if (next) handleSelectMatch(next.id)
          }}
        />
      )}
    </div>
  )
}
