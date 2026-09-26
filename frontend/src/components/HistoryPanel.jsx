/**
 * HistoryPanel — scrollable log of past verdicts.
 *
 * Props:
 *   entries : Array<{ id, label, confidence, timestamp, challenge? }>
 */

const LABEL_STYLE = {
  bonafide:  { color: 'var(--green)',  bg: 'var(--green-dim)',  border: 'rgba(34,197,94,0.25)'  },
  spoof:     { color: 'var(--red)',    bg: 'var(--red-dim)',    border: 'rgba(239,68,68,0.25)'  },
  challenge: { color: 'var(--yellow)', bg: 'var(--yellow-dim)', border: 'rgba(245,158,11,0.25)' },
}

function ConfidenceBar({ value }) {
  const pct   = Math.round(value * 100)
  const color = value > 0.7 ? 'var(--green)'
              : value < 0.4 ? 'var(--red)'
              : 'var(--yellow)'

  return (
    <div className="flex items-center gap-2 mt-1">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: '4px', background: 'var(--bg-base)' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{
            width:      `${pct}%`,
            height:     '100%',
            background: color,
            transition: 'width 0.4s ease',
            borderRadius: '99px',
          }}
        />
      </div>
      <span
        className="text-xs font-mono shrink-0"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {pct}%
      </span>
    </div>
  )
}

export function HistoryPanel({ entries = [] }) {
  if (entries.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 rounded-2xl"
        style={{
          background: 'var(--bg-surface)',
          border:     '1px solid var(--border)',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          No verdicts yet — start monitoring to begin
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-surface)',
        border:     '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Verdict History
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-mono"
          style={{
            background: 'var(--accent-dim)',
            color:      'var(--accent-light)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {entries.length}
        </span>
      </div>

      {/* Entries */}
      <ul
        className="divide-y max-h-[520px] overflow-y-auto"
        style={{ '--tw-divide-opacity': 1, borderColor: 'var(--border)' }}
        aria-label="Verdict history log"
      >
        {entries.map((entry, idx) => {
          const s = LABEL_STYLE[entry.label] ?? LABEL_STYLE.bonafide
          const isNew = idx === 0

          return (
            <li
              key={entry.id}
              className="px-4 py-3"
              style={{
                animation: isNew ? 'fade-in-up 0.3s ease' : 'none',
                borderTop: idx > 0 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Label badge */}
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0"
                  style={{
                    background: s.bg,
                    color:      s.color,
                    border:     `1px solid ${s.border}`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {entry.label === 'bonafide' && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M10.28 2.28L5 7.56 2.72 5.28a1 1 0 00-1.44 1.44l3 3a1 1 0 001.44 0l6-6a1 1 0 00-1.44-1.44z"/>
                    </svg>
                  )}
                  {entry.label === 'spoof' && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M9.71 2.29a1 1 0 00-1.42 0L6 4.59 3.71 2.29a1 1 0 00-1.42 1.42L4.59 6 2.29 8.29a1 1 0 001.42 1.42L6 7.41l2.29 2.3a1 1 0 001.42-1.42L7.41 6l2.3-2.29a1 1 0 000-1.42z"/>
                    </svg>
                  )}
                  {entry.label}
                </span>

                {/* Timestamp */}
                <time
                  dateTime={new Date(entry.timestamp).toISOString()}
                  className="text-xs shrink-0 mt-0.5"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                >
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </time>
              </div>

              <ConfidenceBar value={entry.confidence} />

              {entry.challenge && (
                <p
                  className="mt-1.5 text-xs italic"
                  style={{ color: 'var(--yellow)' }}
                >
                  Challenge: "{entry.challenge}"
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
