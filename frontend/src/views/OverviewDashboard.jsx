import React from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mic,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Server,
  Cpu,
  Lock
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export function OverviewDashboard({
  sessionCalls = 0,
  bonafideCount = 0,
  spoofCount = 0,
  sessionHistory = [],
  onNavigate,
}) {
  const protectionRate = sessionCalls > 0
    ? Math.round(((sessionCalls - spoofCount) / sessionCalls) * 100)
    : 100;

  return (
    <div className="space-y-6 anim-fade-in">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Security Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry and protection performance against synthetic voice impersonation.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">All Security Systems Armed</span>
        </div>
      </div>

      {/* ── KPI Cards Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Calls */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Analyzed</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{sessionCalls}</div>
          <p className="text-xs text-slate-500 mt-1">Live voice segments evaluated</p>
        </div>

        {/* Card 2: Genuine Humans Verified */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Genuine Humans</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">{bonafideCount}</div>
          <p className="text-xs text-slate-500 mt-1">Natural biological vocal tract verified</p>
        </div>

        {/* Card 3: AI Clones Intercepted */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attacks Intercepted</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-red-600 font-mono">{spoofCount}</div>
          <p className="text-xs text-slate-500 mt-1">AI voice clones blocked from breach</p>
        </div>

        {/* Card 4: Protection Rate */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Clean Call Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lock size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{protectionRate}%</div>
          <p className="text-xs text-slate-500 mt-1">Identity integrity score</p>
        </div>
      </div>

      {/* ── System Readiness & Quick Launch ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Architecture Status */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Engine Readiness</span>
              <h3 className="text-sm font-bold text-slate-800">Active AI Detection Pipeline</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Low-Latency Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold mb-1">
                <Cpu size={14} className="text-blue-600" />
                <span>PRIMARY MODEL</span>
              </div>
              <p className="text-xs font-bold text-slate-900">Wav2Vec2 Synthetic</p>
              <p className="text-[10px] text-slate-500 mt-0.5">facebook/wav2vec2-base</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold mb-1">
                <Server size={14} className="text-blue-600" />
                <span>INFERENCE LATENCY</span>
              </div>
              <p className="text-xs font-bold text-slate-900">&lt; 45 ms / chunk</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Streaming WebSocket buffer</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold mb-1">
                <Lock size={14} className="text-blue-600" />
                <span>PREVENTION POLICY</span>
              </div>
              <p className="text-xs font-bold text-slate-900">Strict Auto-Lockout</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Active countermeasures</p>
            </div>
          </div>

          {/* Quick CTA to live shield */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Mic size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-900">Ready to test voice authentication?</h4>
                <p className="text-[11px] text-blue-700">Open the Live Voice Shield to scan your microphone in real time.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('live-shield')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>Launch Shield</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Right: Recent Threat Log preview */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-800">Session Activity</span>
            <button
              onClick={() => onNavigate('threats')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All
            </button>
          </div>

          {sessionHistory.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400">
              <ShieldCheck size={28} className="text-slate-300 mb-2" />
              <p className="text-xs font-medium text-slate-500">No activity yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Run a voice test to log incidents.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-60">
              {sessionHistory.slice(0, 4).map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">
                      {item.label === 'spoof' ? 'AI Voice Intercepted' : 'Human Voice Verified'}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">{item.time || 'Just now'}</p>
                  </div>
                  <StatusBadge status={item.label} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
