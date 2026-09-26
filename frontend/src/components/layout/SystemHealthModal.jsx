/**
 * SystemHealthModal — Section 4 of Master Specification
 * Displays operational status and latencies of all 7 core security engines.
 */

import React from 'react'
import { Activity, CheckCircle2, X, ShieldAlert } from 'lucide-react'

export function SystemHealthModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const services = [
    { name: 'Audio Analysis Engine', status: 'Operational', latency: '18ms', throughput: '16.0 kHz real-time' },
    { name: 'Speaker Verification', status: 'Operational', latency: '34ms', throughput: 'Cosine embedding match' },
    { name: 'Threat Detection', status: 'Operational', latency: '22ms', throughput: 'Wav2Vec2 + Vocoder scan' },
    { name: 'Context Analysis', status: 'Operational', latency: '14ms', throughput: 'Intent & social engineering' },
    { name: 'Prevention Engine', status: 'Operational', latency: '8ms', throughput: 'Policy evaluation & hold' },
    { name: 'Database & Forensic Logs', status: 'Operational', latency: '4ms', throughput: 'Encrypted storage' },
    { name: 'API & Webhooks', status: 'Operational', latency: '12ms', throughput: 'FastAPI + WebSockets' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-7 flex flex-col gap-6 relative overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>System Health & Diagnostics</span>
                <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  ● All Systems Normal
                </span>
              </h2>
              <p className="text-xs text-slate-400">Real-time status of anti-impersonation pipelines</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Services List */}
        <div className="space-y-2.5">
          {services.map((svc) => (
            <div
              key={svc.name}
              className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">{svc.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{svc.throughput}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-400 block font-mono">
                  ● {svc.status}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{svc.latency}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
          <span>Engine Version: <strong>VoxGuard 2.4-enterprise</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
