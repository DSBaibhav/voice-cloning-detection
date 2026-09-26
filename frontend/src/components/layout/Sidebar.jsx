/**
 * Sidebar Navigation Component for VoxGuard
 * Matches Section 3 of Master Specification:
 * - Logo 🛡️ VoxGuard
 * - OVERVIEW: Dashboard
 * - MONITOR: Live Calls, Call History, Threats
 * - IDENTITY: Trusted Speakers, Voice Profiles, Verification
 * - INTELLIGENCE: Threat Analytics, Attack Patterns, Risk Intelligence
 * - SECURITY: Prevention Center, Security Policies, Verification Rules
 * - AUDIT: Audit Logs, Evidence, Blockchain / Integrity
 * - SYSTEM: Integrations, Notifications, Settings
 * - Bottom User/Org Profile + System Status
 */

import React from 'react'
import {
  Shield,
  LayoutDashboard,
  PhoneCall,
  History,
  AlertTriangle,
  Users,
  Fingerprint,
  UserCheck,
  BarChart3,
  Flame,
  BrainCircuit,
  Lock,
  FileCheck2,
  Sliders,
  FileText,
  KeyRound,
  Link2,
  Cpu,
  Bell,
  Settings,
  ShieldCheck,
  Radio,
  ChevronRight
} from 'lucide-react'

export function Sidebar({ currentRoute, onNavigate, liveThreatCount = 2, isCollapsed = false, onToggleCollapse }) {
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'MONITOR',
      items: [
        { id: 'live-calls', label: 'Live Calls', icon: PhoneCall, badge: 'LIVE', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
        { id: 'live-analysis', label: 'Live Call Analysis', icon: Radio },
        { id: 'threats', label: 'Threats', icon: AlertTriangle, badge: liveThreatCount > 0 ? `${liveThreatCount}` : null, badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
      ],
    },
    {
      title: 'IDENTITY',
      items: [
        { id: 'trusted-speakers', label: 'Trusted Speakers', icon: Users },
        { id: 'voice-profiles', label: 'Voice Profiles', icon: Fingerprint },
        { id: 'verification', label: 'Verification', icon: UserCheck },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'threat-analytics', label: 'Threat Analytics', icon: BarChart3 },
        { id: 'attack-patterns', label: 'Attack Patterns', icon: Flame },
      ],
    },
    {
      title: 'SECURITY',
      items: [
        { id: 'prevention-center', label: 'Prevention Center', icon: Lock },
        { id: 'security-policies', label: 'Security Policies', icon: FileCheck2 },
        { id: 'verification-rules', label: 'Verification Rules', icon: Sliders },
      ],
    },
    {
      title: 'AUDIT',
      items: [
        { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
        { id: 'blockchain', label: 'Blockchain Integrity', icon: KeyRound },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'integrations', label: 'Integrations', icon: Cpu },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ]

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col transition-all duration-300 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* ── Brand Header ─────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(14,165,233,0.25), rgba(2,132,199,0.12))',
              border: '1px solid var(--border-glow)',
              boxShadow: '0 0 16px rgba(14,165,233,0.25)',
            }}
          >
            <Shield className="w-5 h-5 text-sky-400" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">VoxGuard</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60 uppercase">
                  SOC
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Voice Security Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation Links ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((sec) => (
          <div key={sec.title}>
            {!isCollapsed && (
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                {sec.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon
                const isActive = currentRoute === item.id

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between truncate">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom User Profile & Status ──────────────────────────────────── */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {!isCollapsed ? (
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                SA
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-200 truncate">Security Analyst</div>
                <div className="text-[10px] text-slate-400 truncate">FinCorp International</div>
              </div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" title="System Status: Protected" />
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" title="Protected" />
          </div>
        )}
      </div>
    </aside>
  )
}
