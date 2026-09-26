/**
 * ThreatAnalyticsView & AttackPatterns — Section 27 & 28 of Master Specification
 */

import React from 'react'
import { BarChart3, Flame, TrendingUp, ShieldAlert, ArrowRight, Layers } from 'lucide-react'
import { ATTACK_PATTERNS } from '../data/mockData'

export function ThreatAnalyticsView({ onSelectPattern }) {
  const threatTypes = [
    { name: 'AI Voice Clone (TTS)', count: 118, pct: 47.8, color: '#f43f5e' },
    { name: 'Speaker Impersonation', count: 64, pct: 25.9, color: '#f59e0b' },
    { name: 'Voice Replay Attack', count: 39, pct: 15.8, color: '#38bdf8' },
    { name: 'Social Engineering', count: 26, pct: 10.5, color: '#a855f7' },
  ]

  const departments = [
    { name: 'Finance & Treasury', threats: 142, risk: 'High' },
    { name: 'IT Helpdesk & Admin', threats: 58, risk: 'Medium' },
    { name: 'Executive Offices', threats: 31, risk: 'High' },
    { name: 'Customer Operations', threats: 16, risk: 'Low' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
          Threat Analytics &amp; Attack Intelligence
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Macro vulnerability trends, target vectors, and machine-learned impersonation attack patterns.
        </p>
      </div>

      {/* Threats by Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-3xl space-y-4"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-sm font-bold text-slate-100">Attacks by Modality (Last 30 Days)</h3>
          <div className="space-y-3">
            {threatTypes.map((t) => (
              <div key={t.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{t.name}</span>
                  <span className="font-mono text-slate-300">{t.count} incidents ({t.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${t.pct}%`, backgroundColor: t.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-6 rounded-3xl space-y-4"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-sm font-bold text-slate-100">Target Vectors by Department</h3>
          <div className="space-y-2.5">
            {departments.map((d) => (
              <div
                key={d.name}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{d.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{d.threats} intercepted attacks</div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${d.risk === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                  {d.risk} Priority
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 28: Attack Pattern Intelligence */}
      <div
        className="p-6 rounded-3xl space-y-5"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Recurring Attack Pattern Intelligence</span>
            </h3>
            <p className="text-xs text-slate-400">Automated clustering of multi-stage voice social engineering tactics</p>
          </div>
          <span className="text-[10px] font-mono text-sky-400 font-bold bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
            3 ACTIVE CLUSTERS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ATTACK_PATTERNS.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-rose-400 font-bold">{p.id}</span>
                  <span className="text-amber-400 font-bold">{p.trend}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 mt-1">{p.name}</h4>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  {p.occurrences} cases • Avg Risk {p.avgRisk}/100
                </div>

                <div className="mt-3 space-y-1.5 text-[11px] text-slate-300">
                  <span className="text-slate-400 font-medium block">Key Signatures:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                    {p.commonCharacteristics.slice(0, 3).map((c, i) => (
                      <li key={i} className="truncate">{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-400 block mb-1">Defense:</span>
                <span className="text-xs font-semibold text-emerald-400 block truncate">{p.recommendedDefense}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
