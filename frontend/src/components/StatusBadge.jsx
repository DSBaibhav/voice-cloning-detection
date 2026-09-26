import React from 'react';

const CONFIG = {
  bonafide: { label: 'Human Voice (Bonafide)', dot: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  safe:     { label: 'Verified Genuine',       dot: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  verified: { label: 'Identity Verified',      dot: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  spoof:    { label: 'AI Voice Clone (Spoof)', dot: 'bg-red-500 animate-ping', bg: 'bg-red-50 border-red-200 text-red-800' },
  'high-risk': { label: 'Attack Intercepted',  dot: 'bg-red-500',    bg: 'bg-red-50 border-red-200 text-red-800' },
  blocked:  { label: 'Call Quarantined',       dot: 'bg-red-500',    bg: 'bg-red-50 border-red-200 text-red-800' },
  suspicious: { label: 'Anomalous Audio',      dot: 'bg-amber-500',  bg: 'bg-amber-50 border-amber-200 text-amber-800' },
  analyzing:{ label: 'Analyzing Audio...',     dot: 'bg-blue-500 animate-pulse', bg: 'bg-blue-50 border-blue-200 text-blue-800' },
  idle:     { label: 'Ready / Standby',        dot: 'bg-slate-400',  bg: 'bg-slate-100 border-slate-200 text-slate-700' },
  offline:  { label: 'Engine Offline',         dot: 'bg-slate-400',  bg: 'bg-slate-100 border-slate-200 text-slate-700' },
};

export function StatusBadge({ status = 'idle', size = 'sm' }) {
  const c = CONFIG[status?.toLowerCase()] || CONFIG.idle;
  const sizeClasses = size === 'lg' 
    ? 'px-3.5 py-1.5 text-xs' 
    : size === 'md' 
    ? 'px-2.5 py-1 text-xs' 
    : 'px-2 py-0.5 text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${sizeClasses} ${c.bg}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot} shrink-0`} />
      <span>{c.label}</span>
    </span>
  );
}

export function ThreatTypeBadge({ type }) {
  const colors = {
    'AI Voice Clone': 'bg-red-50 text-red-700 border-red-200',
    'Synthetic Voice': 'bg-red-50 text-red-700 border-red-200',
    'Vocoder Artifact': 'bg-orange-50 text-orange-700 border-orange-200',
    'Replay Attack': 'bg-amber-50 text-amber-700 border-amber-200',
    'Human Speech': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Standard Call': 'bg-blue-50 text-blue-700 border-blue-200',
  };
  const cls = colors[type] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${cls}`}>
      {type}
    </span>
  );
}
