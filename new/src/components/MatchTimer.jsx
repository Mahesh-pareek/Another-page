/**
 * MatchTimer — 3-minute fight clock per Robowars Rulebook §9.3
 * Shows countdown, progress bar, and fight controls.
 */
export default function MatchTimer({
  timeLeft, totalTime, isRunning,
  onStartPause, onReset,
  onKO1, onKO2,
  team1Name, team2Name,
  onJudgesDecision, timeUp,
}) {
  const totalSecs = Math.floor(timeLeft / 10)
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  const tenths = timeLeft % 10
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`

  const pct = ((totalTime - timeLeft) / totalTime) * 100

  let timerClass = 'timer-display'
  if (timeLeft <= 0) timerClass += ' stopped'
  else if (!isRunning && timeLeft < totalTime) timerClass += ' paused'
  else if (isRunning && timeLeft <= 150) timerClass += ' danger'
  else if (isRunning && timeLeft <= 300) timerClass += ' warning'
  else if (isRunning) timerClass += ' running'
  else timerClass += ' stopped'

  let barColor = 'var(--green)'
  if (timeLeft <= 150) barColor = 'var(--red)'
  else if (timeLeft <= 300) barColor = 'var(--orange)'
  else if (timeLeft <= 600) barColor = 'var(--yellow)'

  return (
    <>
      <div className="panel-title">
        <span className="dot"></span> FIGHT TIMER
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text-dim)',
          letterSpacing: '1px',
        }}>
          {isRunning ? '● LIVE' : timeLeft <= 0 ? '■ ENDED' : '○ READY'}
          {!isRunning && timeLeft > 0 && timeLeft < totalTime && ' (PAUSED)'}
        </span>
      </div>

      <div className={timerClass}>{display}</div>

      <div className="timer-progress">
        <div
          className="timer-progress-fill"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>

      <div className="timer-controls">
        {!timeUp ? (
          <>
            <button className={`btn ${isRunning ? 'btn-pause' : 'btn-start'}`} onClick={onStartPause}>
              {isRunning ? '⏸ PAUSE' : '▶ START'}
            </button>
            <button className="btn btn-reset" onClick={onReset}>↺ RESET</button>
            <button className="btn btn-ko" onClick={onKO1}>KO → {team1Name}</button>
            <button className="btn btn-ko" onClick={onKO2}>KO → {team2Name}</button>
          </>
        ) : (
          <>
            <button className="btn btn-start" onClick={onJudgesDecision}>
              🏆 JUDGES DECISION
            </button>
            <button className="btn btn-ko" onClick={onKO1}>KO → {team1Name}</button>
            <button className="btn btn-ko" onClick={onKO2}>KO → {team2Name}</button>
            <button className="btn btn-reset" onClick={onReset}>↺ RESET</button>
          </>
        )}
      </div>
    </>
  )
}
