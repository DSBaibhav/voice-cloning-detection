/**
 * ThreatBadge Component
 * Standardized status and severity badges matching Section 2 & 52.
 */

import React from 'react'

export function ThreatBadge({ status, type = 'status' }) {
  const norm = (status || '').toLowerCase()

  if (norm === 'blocked' || norm === 'critical' || norm === 'high risk') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
        {status}
      </span>
    )
  }

  if (norm === 'warning' || norm === 'elevated' || norm === 'investigating' || norm === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
        {status}
      </span>
    )
  }

  if (norm === 'verified' || norm === 'safe' || norm === 'resolved' || norm === 'active' || norm === 'low') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
        {status}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-950/80 text-sky-400 border border-sky-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
      {status}
    </span>
  )
}
