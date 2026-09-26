/**
 * NotificationsDrawer — Section 34 of Master Specification
 * High-priority security incident alerts with action triggers.
 */

import React from 'react'
import { X, AlertOctagon, AlertTriangle, CheckCircle, ShieldAlert, ExternalLink } from 'lucide-react'

export function NotificationsDrawer({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null

  const notifications = [
    {
      id: 'NOTIF-01',
      severity: 'critical',
      title: 'High-risk impersonation detected',
      desc: 'Synthetic voice clone detected claiming identity Rajesh Sharma (CFO). Risk 87/100.',
      time: '2 mins ago',
      threatId: 'THR-84921',
      read: false,
    },
    {
      id: 'NOTIF-02',
      severity: 'warning',
      title: 'Speaker verification failed',
      desc: 'Voiceprint similarity dropped below threshold (41%). Liveness challenge triggered.',
      time: '14 mins ago',
      threatId: 'THR-84918',
      read: false,
    },
    {
      id: 'NOTIF-03',
      severity: 'warning',
      title: 'Suspicious financial request',
      desc: 'Caller requested ₹85,000 wire transfer without dual-custody authorization.',
      time: '26 mins ago',
      threatId: 'THR-84921',
      read: true,
    },
    {
      id: 'NOTIF-04',
      severity: 'safe',
      title: 'Verification successful',
      desc: 'Priya Patel (Treasury) verified with 96.4% biometric confidence.',
      time: '1 hour ago',
      threatId: null,
      read: true,
    },
  ]

  const getIcon = (sev) => {
    switch (sev) {
      case 'critical':
        return <AlertOctagon className="w-4 h-4 text-rose-400" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />
      case 'safe':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      default:
        return <ShieldAlert className="w-4 h-4 text-sky-400" />
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md h-full flex flex-col p-6 relative overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h2 className="text-base font-bold text-slate-100">Security Notifications</h2>
            <p className="text-xs text-slate-400">Real-time alerts and trigger interventions</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition ${
                n.severity === 'critical'
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : n.severity === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-900/60 border-white/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{getIcon(n.severity)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-100">{n.title}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.desc}</p>

                  {n.threatId && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('threats')
                        onClose()
                      }}
                      className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition"
                    >
                      <span>Investigate Incident #{n.threatId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <button type="button" className="hover:text-slate-200">Mark all as read</button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
