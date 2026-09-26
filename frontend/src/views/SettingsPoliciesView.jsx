import React from 'react';
import {
  Shield,
  Volume2,
  Lock,
  Sliders,
  CheckCircle2,
  Mic,
  Server,
  Zap
} from 'lucide-react';

export function SettingsPoliciesView({
  strictLockout = true,
  onToggleStrictLockout,
  soundEnabled = true,
  onToggleSound,
}) {
  return (
    <div className="space-y-6 anim-fade-in max-w-4xl">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Security Policies & Prevention Rules</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure how VoxGuard automatically intervenes when an AI voice clone or impersonator is detected.
        </p>
      </div>

      {/* ── Policy Rules Card ──────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <h2 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100">
          Automated Attack Countermeasures
        </h2>

        {/* Toggle 1: Strict Auto-Lockout */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Strict Auto-Lockout & Mute</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Recommended
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              When an AI-generated voice or synthetic clone is classified with high risk, immediately isolate and mute the incoming audio channel so the attacker cannot social-engineer or manipulate the agent.
            </p>
          </div>
          <button
            onClick={onToggleStrictLockout}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
              strictLockout ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
              strictLockout ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle 2: Audio Siren Alarm */}
        <div className="flex items-start justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Audible Incident Alarm</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Play an acoustic security chime through the browser speakers when an impersonation attack is detected, immediately alerting the operator.
            </p>
          </div>
          <button
            onClick={onToggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
              soundEnabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
              soundEnabled ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* ── Model & Diagnostic Settings ────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100">
          Detection Engine & Hardware Telemetry
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
              <Mic size={15} className="text-blue-600" />
              <span>Audio Input Hardware</span>
            </div>
            <p className="text-xs text-slate-500">
              Browser Web Audio API capturing mono 16,000 Hz PCM with active noise suppression and echo cancellation.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 pt-1">
              <CheckCircle2 size={13} />
              <span>Microphone Subsystem Ready</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
              <Server size={15} className="text-blue-600" />
              <span>FastAPI WebSocket Endpoint</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              ws://localhost:8000/ws/monitor
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 pt-1">
              <CheckCircle2 size={13} />
              <span>Connected & Streaming Low Latency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
