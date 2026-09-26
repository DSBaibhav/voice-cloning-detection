/**
 * GlobalSearchModal — Section 39 of Master Specification
 * Instant search across calls, threats, trusted speakers, and audit events.
 */

import React, { useState, useMemo } from 'react'
import { Search, X, Users, AlertTriangle, PhoneCall, FileText, ArrowRight } from 'lucide-react'
import { INITIAL_SPEAKERS, INITIAL_THREATS, INITIAL_AUDIT_LOGS } from '../../data/mockData'

export function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return { speakers: [], threats: [], auditLogs: [] }
    const q = query.toLowerCase()

    const speakers = INITIAL_SPEAKERS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.phone.includes(q)
    )

    const threats = INITIAL_THREATS.filter(
      (t) => t.id.toLowerCase().includes(q) || t.claimedIdentity.toLowerCase().includes(q) || t.threatType.toLowerCase().includes(q)
    )

    const auditLogs = INITIAL_AUDIT_LOGS.filter(
      (a) => a.id.toLowerCase().includes(q) || a.event.toLowerCase().includes(q) || a.action.toLowerCase().includes(q)
    )

    return { speakers, threats, auditLogs }
  }, [query])

  if (!isOpen) return null

  const totalResults = results.speakers.length + results.threats.length + results.auditLogs.length

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <Search className="w-5 h-5 text-sky-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by caller, speaker name, threat ID, policy, or audit event…"
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4">
          {!query ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type <strong className="text-sky-300">"Rajesh"</strong>, <strong className="text-sky-300">"THR-84921"</strong>, or <strong className="text-sky-300">"Wire"</strong> to search across all platform entities.
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Speakers Section */}
              {results.speakers.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>Trusted Speakers ({results.speakers.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.speakers.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onNavigate('trusted-speakers')
                          onClose()
                        }}
                        className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-sky-500/40 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky-950 border border-sky-800 flex items-center justify-center font-bold text-xs text-sky-300">
                            {s.name[0]}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-200">{s.name}</div>
                            <div className="text-[10px] text-slate-400">{s.role} • {s.department}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Threats Section */}
              {results.threats.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Threat Incidents ({results.threats.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.threats.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onNavigate('threats')
                          onClose()
                        }}
                        className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-rose-500/40 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-rose-400">{t.id}</span>
                            <span className="text-xs font-semibold text-slate-200">{t.threatType}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">Claimed: {t.claimedIdentity} • Risk: {t.risk}/100</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audit Logs Section */}
              {results.auditLogs.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Audit Events ({results.auditLogs.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.auditLogs.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onNavigate('audit-logs')
                          onClose()
                        }}
                        className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/40 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{a.event}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{a.id} • {a.action}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
