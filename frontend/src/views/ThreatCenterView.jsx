/**
 * ThreatCenterView & ThreatInvestigationView — Section 25 & 26 of Master Specification
 */

import React, { useState } from 'react'
import {
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  ExternalLink,
  CheckCircle,
  FileText,
  Clock,
  Fingerprint,
  Lock,
  Share2,
  ChevronLeft
} from 'lucide-react'
import { INITIAL_THREATS } from '../data/mockData'
import { ThreatBadge } from '../components/common/ThreatBadge'

export function ThreatCenterView({ onSelectThreat }) {
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')

  const types = ['All', 'AI Voice', 'Replay', 'Impersonation', 'Credential Harvesting']
  const statuses = ['All', 'Blocked', 'Resolved', 'Investigating']

  const filteredThreats = INITIAL_THREATS.filter((t) => {
    if (filterType !== 'All' && !t.threatType.toLowerCase().includes(filterType.toLowerCase())) return false
    if (filterStatus !== 'All' && t.status.toLowerCase() !== filterStatus.toLowerCase()) return false
    if (search && !t.id.toLowerCase().includes(search.toLowerCase()) && !t.claimedIdentity.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            Threat Management Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Forensic analysis, evidence verification, and response audit trail for detected attacks.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {types.map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => setFilterType(tp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                filterType === tp
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incident ID, caller…"
            className="pl-8 pr-4 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none w-56"
          />
        </div>
      </div>

      {/* Threats Table */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-900/60 border-b border-white/5">
              <tr>
                <th className="py-3.5 px-5">Incident ID</th>
                <th className="py-3.5 px-5">Time</th>
                <th className="py-3.5 px-5">Caller CLI</th>
                <th className="py-3.5 px-5">Claimed Identity</th>
                <th className="py-3.5 px-5">Threat Classification</th>
                <th className="py-3.5 px-5">Risk Score</th>
                <th className="py-3.5 px-5">Enforced Action</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Investigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredThreats.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-5 font-mono font-bold text-rose-400">{t.id}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-300">{t.time}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-300">{t.caller}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-200">{t.claimedIdentity}</td>
                  <td className="py-3.5 px-5 text-slate-300">{t.threatType}</td>
                  <td className="py-3.5 px-5">
                    <span className="font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950 border border-rose-800">
                      {t.risk}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-300">{t.action}</td>
                  <td className="py-3.5 px-5">
                    <ThreatBadge status={t.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectThreat(t.id)}
                      className="px-3 py-1.5 rounded-xl bg-sky-950/70 text-sky-400 border border-sky-800/50 hover:bg-sky-900 transition font-semibold"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function ThreatInvestigationView({ threatId = 'THR-84921', onBack }) {
  const threat = INITIAL_THREATS.find((t) => t.id === threatId) || INITIAL_THREATS[0]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Threat Center</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => alert(`Report for ${threat.id} exported successfully.`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-white/5 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Forensic Dossier</span>
          </button>
          <button
            type="button"
            onClick={() => alert(`Incident ${threat.id} marked as resolved.`)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Mark Resolved</span>
          </button>
        </div>
      </div>

      {/* Case Banner */}
      <div
        className="p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 border"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'rgba(244,63,94,0.3)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 font-mono font-bold text-xl">
            87
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-rose-400">{threat.id}</span>
              <ThreatBadge status={threat.status} />
              <span className="text-xs text-slate-400 font-mono">{threat.date} • {threat.time}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1">{threat.threatType}</h2>
            <p className="text-xs text-slate-300">{threat.summary}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Cryptographic Hash</span>
          <span className="text-xs font-mono text-sky-400 font-bold">{threat.evidenceHash.substring(0, 16)}…</span>
        </div>
      </div>

      {/* 2-Column Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Evidence & Signals */}
        <div className="lg:col-span-8 space-y-6">
          {/* Signal Attribution */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Multi-Signal Forensic Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">Synthetic Probability</span>
                <span className="text-base font-bold font-mono text-rose-400">{threat.voiceAuthenticity}%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">Speaker Identity Match</span>
                <span className="text-base font-bold font-mono text-amber-400">{threat.speakerMatch}%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">Conversational Risk</span>
                <span className="text-base font-bold font-mono text-rose-400">78%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">Blockchain Receipt</span>
                <span className="text-xs font-semibold text-emerald-400 font-mono">Block #491024</span>
              </div>
            </div>
          </div>

          {/* Incident Transcript Snippet */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-slate-100">Intercepted Audio Transcript</h3>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
              <div className="text-slate-400 font-mono text-[10px]">17:41:02 — CALLER:</div>
              <p>"I cannot access the portal right now from London. Transfer ₹85,000 immediately to vendor account #092144. I don't have time to verify this!"</p>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-mono font-bold mt-2">
                <span>⚠️ FINANCIAL WIRE SCAM + URGENCY DETECTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions Taken & Chain of Custody */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Chain of Custody &amp; Actions</h3>
            <div className="space-y-3 text-xs">
              {[
                { time: '17:41:08', action: 'Synthetic Vocoder Detected (>4.2kHz)', actor: 'AI Engine' },
                { time: '17:41:10', action: 'Speaker Mismatch Flagged (41%)', actor: 'Biometrics Engine' },
                { time: '17:41:12', action: 'Transaction Held (₹85,000)', actor: 'Policy #POL-01' },
                { time: '17:41:15', action: 'SHA-256 Hash Chained to Ledger', actor: 'Integrity Daemon' },
              ].map((act, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{act.action}</div>
                    <div className="text-[10px] text-slate-400">{act.actor}</div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
