import { useState } from 'react';
import { Search, Download, Filter, CheckCircle2, Hash } from 'lucide-react';
import { auditEvents } from '../data';
import type { Page } from '../types';

interface Props {
  onNavigate: (page: Page, data?: any) => void;
}

export function AuditLogs({ onNavigate }: Props) {
  const [search, setSearch] = useState('');

  const filtered = auditEvents.filter(e =>
    !search ||
    e.event.toLowerCase().includes(search.toLowerCase()) ||
    e.threatId.includes(search) ||
    e.actor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 anim-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Security Audit Log</h1>
          <p className="text-sm text-text-muted mt-0.5">Immutable record of all security events and actions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-text-secondary text-xs font-semibold hover:bg-elevated hover:text-text-primary transition-all">
          <Download size={13} /> Export Log
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events, threat IDs, actors..."
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs text-text-secondary placeholder-text-muted focus:outline-none focus:border-accent/50"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-xl text-xs text-text-secondary hover:text-text-primary transition-colors">
          <Filter size={12} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Timestamp', 'Event', 'Threat ID', 'Actor', 'Action', 'Result', 'Integrity'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(ev => (
              <tr key={ev.id} className="border-b border-border/50 hover:bg-elevated cursor-pointer transition-colors">
                <td className="px-4 py-3.5 text-xs font-mono text-text-muted">{ev.timestamp}</td>
                <td className="px-4 py-3.5 text-xs font-medium text-text-primary">{ev.event}</td>
                <td className="px-4 py-3.5 text-xs font-mono text-accent-bright">{ev.threatId}</td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">{ev.actor}</td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">{ev.action}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-semibold ${ev.result === 'success' ? 'text-success' : ev.result === 'failure' ? 'text-danger' : 'text-warning'}`}>
                    {ev.result.charAt(0).toUpperCase() + ev.result.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-success" />
                    <span className="text-[10px] font-semibold text-success uppercase tracking-wide">{ev.integrity}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Integrity notice */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Hash size={16} className="text-accent" />
          <div>
            <p className="text-xs font-semibold text-text-primary">Audit Chain Integrity</p>
            <p className="text-[10px] text-text-muted">
              All entries cryptographically linked. Log hash: <span className="font-mono">9f3c4a2e...d87b</span> · Last verified: 17:41:08
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-success" />
            <span className="text-xs font-semibold text-success">Intact</span>
          </div>
        </div>
      </div>
    </div>
  );
}
