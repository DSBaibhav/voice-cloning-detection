import { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronRight, X, Shield, Activity, Server, Wifi } from 'lucide-react';
import type { Page } from '../types';

const breadcrumbs: Partial<Record<Page, string[]>> = {
  dashboard: ['Security', 'Dashboard'],
  'live-calls': ['Monitor', 'Live Calls'],
  'live-call-analysis': ['Monitor', 'Live Calls', 'Analysis'],
  'call-history': ['Monitor', 'Call History'],
  'threat-center': ['Monitor', 'Threat Center'],
  'threat-investigation': ['Monitor', 'Threat Center', 'Investigation'],
  'trusted-speakers': ['Identity', 'Trusted Speakers'],
  'speaker-profile': ['Identity', 'Trusted Speakers', 'Profile'],
  'voice-profiles': ['Identity', 'Voice Profiles'],
  'verification': ['Identity', 'Verification'],
  'threat-analytics': ['Intelligence', 'Threat Analytics'],
  'attack-patterns': ['Intelligence', 'Attack Patterns'],
  'prevention-center': ['Security', 'Prevention Center'],
  'security-policies': ['Security', 'Security Policies'],
  'audit-logs': ['Audit', 'Audit Logs'],
  'evidence': ['Audit', 'Evidence'],
  'integrity': ['Audit', 'Integrity'],
  'notifications': ['System', 'Notifications'],
  'integrations': ['System', 'Integrations'],
  'settings': ['System', 'Settings'],
};

interface TopbarProps {
  current: Page;
  onSearch?: (q: string) => void;
}

function SystemHealthPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-full right-16 mt-2 w-72 bg-card2 border border-border rounded-xl shadow-2xl z-50 anim-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold text-text-primary">System Health</span>
        <button onClick={onClose} className="text-text-muted hover:text-text-secondary">
          <X size={14} />
        </button>
      </div>
      <div className="p-4 space-y-3">
        {[
          { icon: Shield, label: 'AI Detection Engine', status: 'Operational', color: 'text-success' },
          { icon: Activity, label: 'Real-time Monitor', status: 'Operational', color: 'text-success' },
          { icon: Server, label: 'Voice Analysis API', status: 'Operational', color: 'text-success' },
          { icon: Wifi, label: 'Integration Layer', status: 'Operational', color: 'text-success' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <item.icon size={14} className="text-text-muted" />
            <span className="flex-1 text-xs text-text-secondary">{item.label}</span>
            <span className={`text-[10px] font-semibold ${item.color}`}>{item.status}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="h-px bg-border mb-3" />
        <div className="flex items-center justify-between text-[10px] text-text-muted">
          <span>Last check: 17:41:08</span>
          <span className="text-success font-medium">All systems nominal</span>
        </div>
      </div>
    </div>
  );
}

export function Topbar({ current }: TopbarProps) {
  const [showHealth, setShowHealth] = useState(false);
  const crumbs = breadcrumbs[current] ?? ['Security', 'Dashboard'];

  return (
    <header className="fixed top-0 left-60 right-0 h-14 z-20 flex items-center px-6 gap-4 border-b border-border bg-surface/95 backdrop-blur-sm">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-text-muted flex-1">
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={11} className="opacity-50" />}
            <span className={i === crumbs.length - 1 ? 'text-text-primary font-medium' : ''}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Search */}
      <div className="relative w-64">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search calls, threats, speakers..."
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-card border border-border text-text-secondary placeholder-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 relative">
        {/* System status */}
        <button
          onClick={() => setShowHealth(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 hover:bg-success/15 transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success status-blink" />
          <span className="text-[10px] font-semibold text-success tracking-wide">PROTECTED</span>
        </button>

        {showHealth && <SystemHealthPanel onClose={() => setShowHealth(false)} />}

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg bg-card border border-border hover:border-border-strong flex items-center justify-center text-text-muted hover:text-text-secondary transition-all">
          <Bell size={15} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
        </button>

        {/* Help */}
        <button className="w-8 h-8 rounded-lg bg-card border border-border hover:border-border-strong flex items-center justify-center text-text-muted hover:text-text-secondary transition-all">
          <HelpCircle size={15} />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent-bright cursor-pointer hover:bg-accent/30 transition-colors">
          AK
        </div>
      </div>
    </header>
  );
}
