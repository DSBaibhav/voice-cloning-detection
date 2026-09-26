/**
 * DefenseLockoutModal — Active security lockdown modal triggered upon impersonation attack.
 */

export function DefenseLockoutModal({
  isOpen,
  incident,
  onDismiss,
  onExportIncident,
}) {
  if (!isOpen || !incident) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(10, 11, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        animation: 'fade-in-up 0.25s ease',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.25), 0 20px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Pulsing red top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: 'linear-gradient(90deg, #ef4444, #f59e0b, #ef4444)',
            boxShadow: '0 0 12px #ef4444',
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
            style={{
              background: 'var(--red-dim)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'var(--red-dim)', color: 'var(--red)' }}>
                Security Alert
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {incident.id || 'INC-SEC-01'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
              Impersonation Attack Intercepted
            </h2>
          </div>
        </div>

        {/* Threat Description */}
        <p className="text-sm text-slate-300 leading-relaxed">
          The AI acoustic engine detected a high-probability synthetic or cloned voice attacking the live session.
          Active quarantine has isolated this audio channel to prevent unauthorized impersonation.
        </p>

        {/* Telemetry Grid */}
        <div
          className="grid grid-cols-2 gap-3 p-4 rounded-2xl"
          style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
        >
          <div>
            <span className="text-[11px] uppercase font-semibold text-slate-400">Threat Type</span>
            <p className="text-sm font-semibold text-red-400 mt-0.5">AI Voice Clone / TTS</p>
          </div>
          <div>
            <span className="text-[11px] uppercase font-semibold text-slate-400">Confidence Score</span>
            <p className="text-sm font-semibold text-red-400 font-mono mt-0.5">
              {Math.round((incident.confidence || 0.8) * 100)}%
            </p>
          </div>
          <div>
            <span className="text-[11px] uppercase font-semibold text-slate-400">Defense Action</span>
            <p className="text-sm font-semibold text-emerald-400 mt-0.5">Audio Quarantined</p>
          </div>
          <div>
            <span className="text-[11px] uppercase font-semibold text-slate-400">Timestamp</span>
            <p className="text-sm font-mono text-slate-300 mt-0.5">
              {new Date(incident.timestamp || Date.now()).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: 'var(--red)',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
            }}
          >
            Acknowledge & Release Quarantine
          </button>

          <button
            type="button"
            onClick={onExportIncident}
            className="w-full sm:w-auto py-3 px-4 rounded-xl font-medium text-sm text-slate-300 hover:text-white transition"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
            }}
          >
            Export Incident Data
          </button>
        </div>
      </div>
    </div>
  )
}
