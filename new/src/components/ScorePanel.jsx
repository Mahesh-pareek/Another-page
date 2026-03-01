/**
 * ScorePanel — Per-team scoring based on Rulebook §9.5
 *   Aggression: max 2
 *   Control: max 2
 *   Damage: max 3
 *   Total: max 7
 */
const categories = [
  { key: 'aggression', label: 'Aggression', max: 2 },
  { key: 'control', label: 'Control', max: 2 },
  { key: 'damage', label: 'Damage', max: 3 },
]

export default function ScorePanel({ team, teamName, scores, onUpdate }) {
  const cls = team === 1 ? 'team1' : 'team2'
  const total = scores.aggression + scores.control + scores.damage

  return (
    <div className={`panel score-panel ${cls}`}>
      <div className="panel-title">
        <span className="dot"></span>
        {teamName}
      </div>

      {categories.map(({ key, label, max }) => (
        <div className="score-category" key={key}>
          <div>
            <span className="cat-name">{label}</span>
            <span className="cat-max">/{max}</span>
          </div>
          <div className="score-controls">
            <button className="score-btn" onClick={() => onUpdate(key, -1)}>−</button>
            <span className="score-value">{scores[key]}</span>
            <button className="score-btn" onClick={() => onUpdate(key, 1)}>+</button>
          </div>
        </div>
      ))}

      <div className="total-score">
        <span className="total-label">TOTAL</span>
        <span className="total-value">{total}<span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 400 }}>/7</span></span>
      </div>
    </div>
  )
}
