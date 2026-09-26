import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Filter,
  Trash2,
  Mic,
  ArrowRight,
  Download
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export function ThreatHistoryView({
  sessionHistory = [],
  onClearHistory,
  onNavigate,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'spoof' | 'bonafide'

  const filtered = sessionHistory.filter(item => {
    if (filter === 'spoof') return item.label === 'spoof';
    if (filter === 'bonafide') return item.label === 'bonafide';
    return true;
  });

  return (
    <div className="space-y-6 anim-fade-in">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Threat & Call Incident Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of all voice streams evaluated by the AI classification engine in this session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sessionHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <Trash2 size={13} />
              <span>Clear Log</span>
            </button>
          )}
          <button
            onClick={() => onNavigate('live-shield')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Mic size={13} />
            <span>Live Scanner</span>
          </button>
        </div>
      </div>

      {/* ── Filter Tabs ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: `All Events (${sessionHistory.length})` },
          { id: 'spoof', label: `AI Clones (${sessionHistory.filter(h => h.label === 'spoof').length})` },
          { id: 'bonafide', label: `Genuine Humans (${sessionHistory.filter(h => h.label === 'bonafide').length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Incidents Table Card ────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-14 text-center text-slate-400">
            <ShieldAlert size={36} className="mx-auto mb-2 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No Incidents Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {filter !== 'all'
                ? `No ${filter} events recorded in this session.`
                : 'No voice evaluations logged yet. Start the Live Voice Shield and speak into your microphone to record real-time verdicts.'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => onNavigate('live-shield')}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span>Start Live Voice Shield</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Time</th>
                  <th className="py-3.5 px-4">Channel / Stream</th>
                  <th className="py-3.5 px-4">AI Classification</th>
                  <th className="py-3.5 px-4">Risk / Confidence</th>
                  <th className="py-3.5 px-4">Prevention Countermeasure</th>
                  <th className="py-3.5 px-5">Security Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item, idx) => {
                  const isAttack = item.label === 'spoof';
                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-slate-500 text-[11px]">
                        {item.time || '18:45:10'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        Live Audio Channel #1
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isAttack ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          <span className="font-semibold text-slate-900">
                            {isAttack ? 'AI Voice Clone (Synthetic)' : 'Genuine Human Voice'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className={isAttack ? 'text-red-600' : 'text-emerald-600'}>
                          {Math.round(item.confidence * 100)}% {isAttack ? 'Risk' : 'Authentic'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isAttack
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isAttack ? 'Auto-Lockout & Mute' : 'Allowed / Clean'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={item.label} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
