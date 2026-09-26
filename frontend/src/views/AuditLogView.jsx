/**
 * AuditLogView & BlockchainIntegrity — Section 31 to 33 of Master Specification
 * Displays hash-chained immutable security audit trails.
 */

import React, { useState } from 'react'
import { FileText, KeyRound, Download, CheckCircle, ShieldCheck, Search, Link2 } from 'lucide-react'
import { INITIAL_AUDIT_LOGS } from '../data/mockData'

export function AuditLogView() {
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS)
  const [search, setSearch] = useState('')

  const handleExportCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'Event', 'User', 'Threat ID', 'Action', 'SHA-256 Hash']
    const rows = logs.map((l) => [l.id, l.timestamp, l.event, l.user, l.threatId, l.action, l.sha256])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `voxguard_audit_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
  }

  const filteredLogs = logs.filter(
    (l) => !search || l.id.toLowerCase().includes(search.toLowerCase()) || l.event.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            Cryptographic Security Audit Log
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident, hash-chained evidence ledger for voice incidents and intervention controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Section 33: Blockchain & Integrity Header Card */}
      <div
        className="p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 border"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7))',
          borderColor: 'rgba(16,185,129,0.3)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">Cryptographic Integrity Status</h3>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                ● CHAIN VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              All incident event blocks are linked via SHA-256 hash chains. Zero tampering detected across 1,042 blocks.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Root Hash</span>
          <span className="text-xs font-mono text-sky-400 font-bold">a91f7d8c...e421</span>
        </div>
      </div>

      {/* Audit Log Table (Section 31) */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Incident Event Ledger</span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail…"
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-900/60 border-b border-white/5">
              <tr>
                <th className="py-3.5 px-5">Entry ID</th>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Event</th>
                <th className="py-3.5 px-5">Actor / System</th>
                <th className="py-3.5 px-5">Threat ID</th>
                <th className="py-3.5 px-5">Enforced Action</th>
                <th className="py-3.5 px-5">Integrity</th>
                <th className="py-3.5 px-5">SHA-256 Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-5 font-mono text-slate-300 font-bold">{log.id}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-400">{log.timestamp}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-200">{log.event}</td>
                  <td className="py-3.5 px-5 text-slate-300">{log.user}</td>
                  <td className="py-3.5 px-5 font-mono text-rose-400 font-bold">{log.threatId}</td>
                  <td className="py-3.5 px-5 text-slate-300">{log.action}</td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 font-mono text-emerald-400 text-xs font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {log.integrity}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-400 text-[11px]">
                    {log.sha256.substring(0, 16)}…
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
