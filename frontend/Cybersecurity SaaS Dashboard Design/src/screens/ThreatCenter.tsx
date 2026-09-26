import { useState } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { StatusBadge, RiskScore, ThreatTypeBadge } from '../components/StatusBadge';
import { recentThreats } from '../data';
import type { Page, ThreatRecord } from '../types';

const FILTERS = ['All', 'AI Voice', 'Replay Attack', 'Impersonation', 'Social Engineering', 'Identity Mismatch', 'Suspicious Request'];
const RISK_FILTERS = ['All Risk', 'Critical (80+)', 'High (60–79)', 'Medium (40–59)', 'Low (<40)'];

const extendedThreats: ThreatRecord[] = [
  ...recentThreats,
  { id: '84899', time: '14:05', caller: '+91 70XXX XXXXX', claimedIdentity: 'IT Director', threatType: 'Social Engineering', riskScore: 71, action: 'Escalated', status: 'resolved' },
  { id: '84895', time: '13:22', caller: '+1 800 XXX XXXX', claimedIdentity: 'CFO', threatType: 'AI Voice', riskScore: 88, action: 'Transaction Held', status: 'blocked' },
  { id: '84890', time: '12:44', caller: '+44 7XXX XXXXXX', claimedIdentity: 'Procurement Manager', threatType: 'Replay Attack', riskScore: 66, action: 'Verification', status: 'resolved' },
  { id: '84882', time: '11:58', caller: '+91 88XXX XXXXX', claimedIdentity: 'Finance Manager', threatType: 'Identity Mismatch', riskScore: 59, action: 'Monitored', status: 'resolved' },
  { id: '84875', time: '10:31', caller: '+91 99XXX XXXXX', claimedIdentity: 'CEO', threatType: 'AI Voice', riskScore: 93, action: 'Transaction Held', status: 'blocked' },
];

interface Props {
  onNavigate: (page: Page, data?: any) => void;
}

export function ThreatCenter({ onNavigate }: Props) {
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = extendedThreats.filter(t => {
    if (typeFilter !== 'All' && t.threatType !== typeFilter) return false;
    if (search && !t.caller.includes(search) && !t.claimedIdentity.toLowerCase().includes(search.toLowerCase()) && !t.id.includes(search)) return false;
    return true;
  });

  const stats = {
    total: extendedThreats.length,
    high: extendedThreats.filter(t => t.riskScore >= 80).length,
    blocked: extendedThreats.filter(t => t.status === 'blocked').length,
    investigating: extendedThreats.filter(t => t.status === 'investigating').length,
  };

  return (
    <div className="space-y-6 anim-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Threat Center</h1>
        <p className="text-sm text-text-muted mt-0.5">Centralized view of all detected threats and security incidents.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Threats', value: stats.total, color: 'text-text-primary' },
          { label: 'High Risk (80+)', value: stats.high, color: 'text-danger' },
          { label: 'Blocked', value: stats.blocked, color: 'text-danger' },
          { label: 'Investigating', value: stats.investigating, color: 'text-warning' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-semibold mb-2">{s.label}</p>
            <p className={`text-3xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by threat ID, caller, or identity..."
              className="w-full pl-9 pr-3 py-2 bg-elevated border border-border rounded-lg text-xs text-text-secondary placeholder-text-muted focus:outline-none focus:border-accent/50"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-elevated border border-border rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors">
            <Filter size={12} /> Filters
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === f
                  ? 'bg-accent text-white'
                  : 'bg-elevated text-text-muted hover:text-text-secondary hover:bg-border'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Threats table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Threat ID', 'Time', 'Caller', 'Claimed Identity', 'Type', 'Risk', 'Action', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr
                key={row.id}
                onClick={() => onNavigate('threat-investigation', { id: row.id })}
                className="border-b border-border/50 hover:bg-elevated cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3.5 text-xs font-mono text-accent-bright">#{row.id}</td>
                <td className="px-4 py-3.5 text-xs font-mono text-text-muted">{row.time}</td>
                <td className="px-4 py-3.5 text-xs font-mono text-text-secondary">{row.caller}</td>
                <td className="px-4 py-3.5 text-xs font-medium text-text-primary">{row.claimedIdentity}</td>
                <td className="px-4 py-3.5"><ThreatTypeBadge type={row.threatType} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    {row.riskScore >= 80 && <AlertCircle size={12} className="text-danger" />}
                    <RiskScore score={row.riskScore} size="sm" />
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">{row.action}</td>
                <td className="px-4 py-3.5"><StatusBadge level={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-text-muted text-sm">No threats match the current filters.</div>
        )}
      </div>
    </div>
  );
}
