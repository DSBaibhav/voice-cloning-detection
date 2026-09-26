/**
 * SecurityMetrics — Real-time cybersecurity telemetry cards for voice monitoring.
 */

export function SecurityMetrics({
  totalFrames = 0,
  attacksBlocked = 0,
  challengesPassed = 0,
  strictDefense = true,
  onToggleStrict,
  onExportLogs,
  threatLevel = 'LOW', // 'LOW' | 'ELEVATED' | 'CRITICAL'
}) {
  const threatColors = {
    LOW: {
      text: 'var(--green)',
      bg: 'var(--green-dim)',
      border: 'rgba(34,197,94,0.3)',
      badge: 'Normal / Protected',
    },
    ELEVATED: {
      text: 'var(--yellow)',
      bg: 'var(--yellow-dim)',
      border: 'rgba(245,158,11,0.3)',
      badge: 'Suspicious Activity',
    },
    CRITICAL: {
      text: 'var(--red)',
      bg: 'var(--red-dim)',
      border: 'rgba(239,68,68,0.4)',
      badge: 'Active Threat Intercepted',
    },
  }

  const currentThreat = threatColors[threatLevel] ?? threatColors.LOW

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 4 Telemetry cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Threat Level */}
        <div
          className="p-5 rounded-2xl flex flex-col justify-between"
          style={{
            background: 'var(--bg-surface)',
            border: `1px solid ${currentThreat.border}`,
            boxShadow: `0 4px 20px ${currentThreat.bg}`,
            transition: 'all 0.3s ease',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">Threat Level</span>
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: currentThreat.text, boxShadow: `0 0 10px ${currentThreat.text}` }}
            />
          </div>
          <div>
            <p className="text-2xl font-bold font-mono tracking-tight" style={{ color: currentThreat.text }}>
              {threatLevel}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{currentThreat.badge}</p>
          </div>
        </div>

        {/* Attacks Blocked */}
        <div
          className="p-5 rounded-2xl flex flex-col justify-between"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">Attacks Blocked</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-slate-100">{attacksBlocked}</p>
            <p className="text-xs text-slate-400 mt-0.5">Clones intercepted</p>
          </div>
        </div>

        {/* Liveness Challenges */}
        <div
          className="p-5 rounded-2xl flex flex-col justify-between"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">Liveness Checks</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-slate-100">{challengesPassed}</p>
            <p className="text-xs text-slate-400 mt-0.5">Challenges passed</p>
          </div>
        </div>

        {/* Total Frames Audited */}
        <div
          className="p-5 rounded-2xl flex flex-col justify-between"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">Audio Streamed</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-slate-100">{totalFrames}</p>
            <p className="text-xs text-slate-400 mt-0.5">3-sec frames audited</p>
          </div>
        </div>
      </div>

      {/* Control bar: Strict mode toggle + Export audit logs */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl text-xs"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={strictDefense}
              onChange={onToggleStrict}
              className="accent-sky-500 w-4 h-4 rounded cursor-pointer"
            />
            <span className="font-medium text-slate-200 text-xs sm:text-sm">
              Active Quarantine Defense: <span className={strictDefense ? 'text-sky-400 font-semibold' : 'text-slate-400'}>{strictDefense ? 'Strict (Auto-Lockdown)' : 'Continuous Alert Mode'}</span>
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={onExportLogs}
          disabled={totalFrames === 0}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-200 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
          style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
          title="Export forensic audit log"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="font-medium">Export Audit Log (JSON)</span>
        </button>
      </div>
    </div>
  )
}
