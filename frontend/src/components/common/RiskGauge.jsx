/**
 * RiskGauge Component — Section 18 of Master Specification
 * Central Model Risk Estimate (0-100) with independent multi-signal breakdown.
 */

import React from 'react'
import { ShieldAlert, Info } from 'lucide-react'

export function RiskGauge({
  score = 87,
  syntheticVoice = 84,
  speakerMismatch = 58,
  prosodyAnomaly = 63,
  conversationRisk = 78,
  identityContext = 82,
}) {
  const getRiskColor = (val) => {
    if (val >= 75) return { text: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-950/20', bar: '#f43f5e', label: 'CRITICAL THREAT' }
    if (val >= 50) return { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20', bar: '#f59e0b', label: 'ELEVATED RISK' }
    if (val >= 25) return { text: 'text-sky-400', border: 'border-sky-500/40', bg: 'bg-sky-950/20', bar: '#38bdf8', label: 'MONITORING' }
    return { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/20', bar: '#10b981', label: 'LOW RISK' }
  }

  const currentLevel = getRiskColor(score)

  const signals = [
    { label: 'Synthetic Voice (Vocoder & AI)', value: syntheticVoice, weight: '40% weight' },
    { label: 'Speaker Identity Mismatch', value: speakerMismatch, weight: '25% weight' },
    { label: 'Conversation Threat (Wire/OTP)', value: conversationRisk, weight: '20% weight' },
    { label: 'Prosody & Cadence Anomaly', value: prosodyAnomaly, weight: '15% weight' },
  ]

  return (
    <div
      className="p-5 rounded-3xl space-y-5"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400 block">
            Integrated Risk Engine
          </span>
          <h3 className="text-sm font-bold text-slate-100">Model Risk Estimate</h3>
        </div>
        <span
          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${currentLevel.border} ${currentLevel.text} ${currentLevel.bg}`}
        >
          {currentLevel.label}
        </span>
      </div>

      {/* Main Score Center Display */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-white/5">
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl sm:text-5xl font-extrabold font-mono ${currentLevel.text}`}>
            {score}
          </span>
          <span className="text-sm text-slate-400 font-mono">/ 100</span>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-slate-200">Confidence Band</div>
          <div className="text-[10px] font-mono text-slate-400">Multi-Signal Weighted</div>
        </div>
      </div>

      {/* Breakdown of Signals */}
      <div className="space-y-3">
        <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
          <span>Signal Attribution Breakdown</span>
          <span className="text-[10px] font-mono">Normalized</span>
        </div>

        {signals.map((sig) => (
          <div key={sig.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 truncate">{sig.label}</span>
              <span className="font-mono text-slate-200 shrink-0">{sig.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${sig.value}%`,
                  backgroundColor: sig.value > 70 ? '#f43f5e' : sig.value > 45 ? '#f59e0b' : '#38bdf8',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 italic">
        * Model Risk Estimate combines orthogonal acoustic, biometric, and conversational intent models.
      </p>
    </div>
  )
}
