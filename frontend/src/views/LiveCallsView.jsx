/**
 * LiveCallsView — Section 9 of Master Specification
 * Monitors active calls across VoIP, WebRTC, and SIP trunks.
 */

import React from 'react'
import { PhoneCall, Radio, ArrowRight, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react'
import { ThreatBadge } from '../components/common/ThreatBadge'

export function LiveCallsView({ onSelectCall, onOpenAnalysis }) {
  const activeCalls = [
    {
      id: 'CALL-9014',
      caller: '+91 98201 44521 (Inbound SIP)',
      claimedIdentity: 'Rajesh Sharma',
      role: 'Chief Financial Officer',
      duration: '04:37',
      voiceAuthenticity: 84, // % synthetic suspicion
      speakerMatch: 42,      // % match
      contextRisk: 78,       // % risk
      overallRisk: 87,
      riskBand: 'Critical',
      status: 'LIVE',
      actionNeeded: 'Step-Up Verification Required',
    },
    {
      id: 'CALL-9012',
      caller: '+91 97110 88234 (WebRTC Gateway)',
      claimedIdentity: 'Priya Patel',
      role: 'Head of Corporate Treasury',
      duration: '02:15',
      voiceAuthenticity: 6,
      speakerMatch: 96,
      contextRisk: 10,
      overallRisk: 12,
      riskBand: 'Low',
      status: 'LIVE',
      actionNeeded: 'Allow (Verified Safe)',
    },
    {
      id: 'CALL-9008',
      caller: '+1 415 882 1092 (International VoIP)',
      claimedIdentity: 'Vikram Malhotra',
      role: 'Managing Director',
      duration: '01:40',
      voiceAuthenticity: 74,
      speakerMatch: 58,
      contextRisk: 65,
      overallRisk: 72,
      riskBand: 'High',
      status: 'LIVE',
      actionNeeded: 'Mute & Challenge Caller',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              Live Call Monitoring
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              3 ACTIVE STREAMS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric and vocoder inspection across enterprise telephony trunks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenAnalysis('CALL-9014')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-[0_0_16px_rgba(2,132,199,0.35)] transition"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Launch Live Call Analysis Console</span>
        </button>
      </div>

      {/* Live Calls Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {activeCalls.map((call) => (
          <div
            key={call.id}
            onClick={() => onOpenAnalysis(call.id)}
            className={`p-5 rounded-3xl cursor-pointer border transition-all hover:scale-[1.01] ${
              call.overallRisk >= 75
                ? 'bg-rose-950/15 border-rose-500/30 hover:border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.12)]'
                : call.overallRisk >= 50
                ? 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/60'
                : 'bg-slate-900/60 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {call.status}
              </span>
              <span className="text-xs font-mono text-slate-400">{call.duration}</span>
            </div>

            <div className="my-4 space-y-1">
              <div className="text-sm font-bold text-slate-100">{call.claimedIdentity}</div>
              <div className="text-xs text-slate-400">{call.role}</div>
              <div className="text-[11px] font-mono text-slate-400">{call.caller}</div>
            </div>

            {/* Signal metrics bar */}
            <div className="space-y-2 py-3 border-y border-white/5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Synthetic Voice:</span>
                <span className={`font-mono font-bold ${call.voiceAuthenticity > 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {call.voiceAuthenticity}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Speaker Match:</span>
                <span className={`font-mono font-bold ${call.speakerMatch < 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {call.speakerMatch}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Overall Risk:</span>
                <span className={`font-mono font-bold px-1.5 py-0.2 rounded ${call.overallRisk >= 75 ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'}`}>
                  {call.overallRisk}/100
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-sky-400">Inspect Audio Waveform</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Calls Table */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-slate-100">Active Trunks Telemetry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-900/60 border-b border-white/5">
              <tr>
                <th className="py-3 px-5">Caller</th>
                <th className="py-3 px-5">Claimed Identity</th>
                <th className="py-3 px-5">Duration</th>
                <th className="py-3 px-5">Voice Authenticity</th>
                <th className="py-3 px-5">Speaker Match</th>
                <th className="py-3 px-5">Context Risk</th>
                <th className="py-3 px-5">Overall Risk</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeCalls.map((call) => (
                <tr key={call.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-5 font-mono text-slate-300">{call.caller}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-200">{call.claimedIdentity}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-300">{call.duration}</td>
                  <td className="py-3.5 px-5">
                    <span className={`font-mono font-bold ${call.voiceAuthenticity > 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {call.voiceAuthenticity}%
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`font-mono font-bold ${call.speakerMatch < 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {call.speakerMatch}%
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-300">{call.contextRisk}%</td>
                  <td className="py-3.5 px-5">
                    <span className={`font-mono font-bold px-2 py-0.5 rounded ${call.overallRisk >= 75 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                      {call.overallRisk}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 font-mono text-emerald-400 text-xs font-bold">
                      ● LIVE
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenAnalysis(call.id)}
                      className="px-3 py-1.5 rounded-xl bg-sky-950/70 text-sky-400 border border-sky-800/50 hover:bg-sky-900 transition font-semibold"
                    >
                      Open Live Analysis
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
