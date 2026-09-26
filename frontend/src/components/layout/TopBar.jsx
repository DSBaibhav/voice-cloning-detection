/**
 * TopBar Navigation Header Component for VoxGuard
 * Matches Section 4 of Master Specification:
 * - Current page title & Breadcrumb
 * - Global search trigger
 * - System status: ● PROTECTED (opens System Health Panel)
 * - Notification bell
 * - Role Switcher
 * - Live Microphone vs Demo Simulation mode switch
 */

import React from 'react'
import {
  Search,
  Bell,
  HelpCircle,
  ShieldCheck,
  Radio,
  Play,
  Volume2,
  VolumeX,
  User,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react'

export function TopBar({
  currentRoute,
  onOpenSearch,
  onOpenHealth,
  onOpenNotifications,
  onOpenGuide,
  activeMode, // 'mic' | 'simulation'
  onToggleMode,
  selectedScenario,
  onSelectScenario,
  unreadNotifications = 3,
  currentRole = 'Security Analyst',
  onSelectRole
}) {
  const routeTitles = {
    'dashboard': { title: 'Security Overview', breadcrumb: 'Overview / Dashboard' },
    'live-calls': { title: 'Live Monitored Calls', breadcrumb: 'Monitor / Live Calls' },
    'live-analysis': { title: 'Live Call Analysis & Impersonation Defense', breadcrumb: 'Monitor / Live Call Analysis' },
    'threats': { title: 'Threat Center & Investigations', breadcrumb: 'Monitor / Threats' },
    'trusted-speakers': { title: 'Trusted Speaker Registry', breadcrumb: 'Identity / Trusted Speakers' },
    'voice-profiles': { title: 'Biometric Voice Profiles', breadcrumb: 'Identity / Voice Profiles' },
    'verification': { title: 'Identity Verification Engine', breadcrumb: 'Identity / Verification' },
    'threat-analytics': { title: 'Threat Intelligence & Analytics', breadcrumb: 'Intelligence / Threat Analytics' },
    'attack-patterns': { title: 'Attack Pattern Intelligence', breadcrumb: 'Intelligence / Attack Patterns' },
    'prevention-center': { title: 'Active Prevention & Intervention', breadcrumb: 'Security / Prevention Center' },
    'security-policies': { title: 'Configurable Security Policies', breadcrumb: 'Security / Security Policies' },
    'verification-rules': { title: 'Acoustic Verification Rules', breadcrumb: 'Security / Verification Rules' },
    'audit-logs': { title: 'Cryptographic Security Audit Log', breadcrumb: 'Audit / Audit Logs' },
    'blockchain': { title: 'Immutable Blockchain Audit Trail', breadcrumb: 'Audit / Blockchain Integrity' },
    'integrations': { title: 'Enterprise Telephony & SIEM Integrations', breadcrumb: 'System / Integrations' },
    'settings': { title: 'System & Security Settings', breadcrumb: 'System / Settings' },
  }

  const { title, breadcrumb } = routeTitles[currentRoute] || { title: 'Dashboard', breadcrumb: 'Overview' }

  return (
    <header
      className="h-16 w-full flex items-center justify-between px-6 border-b border-white/5 sticky top-0 z-20"
      style={{
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* ── Left Breadcrumb & Page Title ──────────────────────────────────── */}
      <div>
        <div className="text-[11px] font-mono text-slate-400 font-medium tracking-wide flex items-center gap-1.5">
          <span>{breadcrumb}</span>
        </div>
        <h1 className="text-base font-bold text-slate-100 tracking-tight leading-tight">
          {title}
        </h1>
      </div>

      {/* ── Center / Right Controls ───────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Real Mic vs Demo Simulation Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => onToggleMode('mic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeMode === 'mic'
                ? 'bg-sky-600 text-white shadow-[0_0_12px_rgba(2,132,199,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Mic Mode</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleMode('simulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeMode === 'simulation'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Demo Attack Sim</span>
          </button>
        </div>

        {/* Global Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-white/10 hover:border-white/20 transition"
          title="Search calls, threats, speakers (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search SOC…</span>
          <kbd className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">⌘K</kbd>
        </button>

        {/* System Status: PROTECTED Badge */}
        <button
          type="button"
          onClick={onOpenHealth}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 transition shadow-[0_0_12px_rgba(16,185,129,0.15)]"
          title="Click to view System Health Diagnostics"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
          <span>PROTECTED</span>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 border border-white/10 hover:border-white/20 transition"
          aria-label="View security notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] flex items-center justify-center font-bold">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* System Guide */}
        <button
          type="button"
          onClick={onOpenGuide}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 border border-white/10 hover:border-white/20 transition"
          title="System Architecture Guide"
          aria-label="Open System Architecture Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Role Switcher */}
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-300 bg-slate-900/60 border border-white/10 hover:border-white/20 transition font-medium"
          >
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-white/10 shadow-xl p-1 hidden group-hover:block z-40 text-xs">
            {['Super Admin', 'Security Analyst', 'Manager', 'Viewer'].map((r) => (
              <button
                key={r}
                onClick={() => onSelectRole(r)}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                  currentRole === r ? 'bg-sky-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
