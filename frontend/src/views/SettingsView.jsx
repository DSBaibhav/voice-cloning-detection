/**
 * SettingsView — Section 37 & 38 of Master Specification
 * Role-based access, security settings, 2FA, and detection sensitivity thresholds.
 */

import React, { useState } from 'react'
import { Settings, Shield, Lock, Sliders, UserCheck, Key } from 'lucide-react'

export function SettingsView({ currentRole = 'Security Analyst', onSelectRole }) {
  const [synthThreshold, setSynthThreshold] = useState(70)
  const [riskThreshold, setRiskThreshold] = useState(80)
  const [autoHold, setAutoHold] = useState(true)

  const roles = [
    { role: 'Super Admin', desc: 'Full control over security policies, encryption keys, integrations, and user access.' },
    { role: 'Security Analyst', desc: 'Can investigate live calls, trigger step-up challenges, and confirm transaction holds.' },
    { role: 'Manager', desc: 'View reports, audit logs, threat analytics, and export compliance dossiers.' },
    { role: 'Viewer', desc: 'Read-only access to dashboards and non-sensitive telemetry.' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
          System &amp; Security Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Role-based access permissions, detection sensitivity thresholds, and multi-factor security.
        </p>
      </div>

      {/* Role-Based Access Control (Section 38) */}
      <div
        className="p-6 rounded-3xl space-y-4"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-sky-400" />
          <h3 className="text-sm font-bold text-slate-100">Role-Based Access Control (RBAC)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r) => (
            <div
              key={r.role}
              onClick={() => onSelectRole(r.role)}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                currentRole === r.role
                  ? 'bg-sky-950/40 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                  : 'bg-slate-900/60 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{r.role}</span>
                {currentRole === r.role && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detection & Intervention Thresholds (Section 30) */}
      <div
        className="p-6 rounded-3xl space-y-5"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-sky-400" />
          <h3 className="text-sm font-bold text-slate-100">Detection Sensitivity Thresholds</h3>
        </div>

        <div className="space-y-4 max-w-xl text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium">Synthetic Voice Detection Sensitivity</span>
              <span className="font-mono text-sky-400 font-bold">{synthThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={synthThreshold}
              onChange={(e) => setSynthThreshold(e.target.value)}
              className="w-full accent-sky-500"
            />
            <p className="text-[10px] text-slate-400">Trigger challenge phrases when vocoder probability crosses this mark.</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium">Automatic Transaction Hold Threshold</span>
              <span className="font-mono text-rose-400 font-bold">{riskThreshold}/100</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(e.target.value)}
              className="w-full accent-rose-500"
            />
            <p className="text-[10px] text-slate-400">Calls exceeding this composite risk score will have associated banking wires held immediately.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
