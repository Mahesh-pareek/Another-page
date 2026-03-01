/**
 * WinnerOverlay — full-screen victory announcement
 */
export default function WinnerOverlay({ winner, method, onClose, onNextMatch }) {
  return (
    <div className="winner-overlay" onClick={onClose}>
      <div className="winner-card" onClick={e => e.stopPropagation()}>
        <div className="winner-label">⚡ VICTORY ⚡</div>
        <div className="winner-name">{winner}</div>
        <div className="winner-method">{method}</div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-start" onClick={onNextMatch}>
            NEXT MATCH →
          </button>
          <button className="btn btn-reset" onClick={onClose}>
            DISMISS
          </button>
        </div>
      </div>
    </div>
  )
}
