import { useState } from 'react';
import { Search, UserPlus, RefreshCw, CheckCircle2, Phone, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { trustedSpeakers } from '../data';
import type { Page } from '../types';

interface Props {
  onNavigate: (page: Page, data?: any) => void;
}

function VoiceMatchRing({ value }: { value: number }) {
  const color = value >= 90 ? '#12B981' : value >= 80 ? '#F59E0B' : '#EF4444';
  const r = 28;
  const circ = 2 * Math.PI * r;
  const fill = (value / 100) * circ;
  return (
    <div className="relative w-16 h-16">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#1C2840" strokeWidth="4" />
        <circle
          cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 32 32)"
          style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold font-mono" style={{ color }}>{value}%</span>
      </div>
    </div>
  );
}

export function TrustedSpeakers({ onNavigate }: Props) {
  const [search, setSearch] = useState('');

  const filtered = trustedSpeakers.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 anim-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Trusted Speakers</h1>
          <p className="text-sm text-text-muted mt-0.5">Manage enrolled voice profiles and identity verification status.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent rounded-xl text-white text-xs font-semibold hover:bg-accent-bright transition-all">
          <UserPlus size={14} /> Add Speaker
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Enrolled', value: trustedSpeakers.length },
          { label: 'Active', value: trustedSpeakers.filter(s => s.status === 'active').length, color: 'text-success' },
          { label: 'Avg Voice Match', value: Math.round(trustedSpeakers.reduce((a, s) => a + s.voiceMatch, 0) / trustedSpeakers.length) + '%', color: 'text-success' },
          { label: 'Alerts This Week', value: trustedSpeakers.reduce((a, s) => a + s.alerts, 0), color: 'text-warning' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-semibold mb-2">{s.label}</p>
            <p className={`text-3xl font-bold font-mono ${s.color ?? 'text-text-primary'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search speakers by name or role..."
          className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-sm text-text-secondary placeholder-text-muted focus:outline-none focus:border-accent/50"
        />
      </div>

      {/* Speaker cards grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(speaker => (
          <div
            key={speaker.id}
            className="bg-card border border-border rounded-xl p-5 hover:border-border-strong cursor-pointer transition-all group"
            onClick={() => onNavigate('speaker-profile', { id: speaker.id })}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent-bright shrink-0">
                  {speaker.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{speaker.name}</p>
                  <p className="text-xs text-text-muted">{speaker.role}</p>
                </div>
              </div>
              <StatusBadge level={speaker.status} />
            </div>

            {/* Voice match ring */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-1">Voice Profile</p>
                <p className="text-xs text-text-secondary">{speaker.department}</p>
                <p className="text-[10px] text-text-muted mt-1">Enrolled {speaker.enrollmentDate}</p>
              </div>
              <VoiceMatchRing value={speaker.voiceMatch} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Phone size={10} className="text-text-muted" />
                  <span className="text-sm font-bold font-mono text-text-primary">{speaker.totalCalls}</span>
                </div>
                <p className="text-[9px] text-text-muted">Total Calls</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <CheckCircle2 size={10} className="text-success" />
                  <span className="text-sm font-bold font-mono text-success">{speaker.verificationScore}%</span>
                </div>
                <p className="text-[9px] text-text-muted">Verify Score</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <AlertTriangle size={10} className={speaker.alerts > 0 ? 'text-warning' : 'text-text-muted'} />
                  <span className={`text-sm font-bold font-mono ${speaker.alerts > 0 ? 'text-warning' : 'text-text-primary'}`}>{speaker.alerts}</span>
                </div>
                <p className="text-[9px] text-text-muted">Alerts</p>
              </div>
            </div>

            <div className="text-[10px] text-text-muted mb-4">
              Last verified: <span className="text-text-secondary">{speaker.lastVerified}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
              <button className="flex-1 py-1.5 rounded-lg border border-border text-[10px] font-semibold text-text-muted hover:text-text-secondary hover:bg-elevated transition-all">
                View Profile
              </button>
              <button className="flex-1 py-1.5 rounded-lg border border-accent/30 text-[10px] font-semibold text-accent-bright hover:bg-accent/10 transition-all">
                Verify
              </button>
              <button className="flex-1 py-1.5 rounded-lg border border-border text-[10px] font-semibold text-text-muted hover:text-text-secondary hover:bg-elevated transition-all flex items-center justify-center gap-1">
                <RefreshCw size={9} /> Re-enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
