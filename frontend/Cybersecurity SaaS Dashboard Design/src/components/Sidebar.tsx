import {
  LayoutDashboard, Radio, Clock, ShieldAlert, Users, Fingerprint, CheckCircle2,
  BarChart3, Zap, ShieldCheck, FileText, HardDrive, Link, BookOpen, Bell,
  Settings, LogOut, ChevronRight, Layers
} from 'lucide-react';
import type { Page } from '../types';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const nav: NavGroup[] = [
  {
    group: 'OVERVIEW',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    group: 'MONITOR',
    items: [
      { id: 'live-calls', label: 'Live Calls', icon: Radio },
      { id: 'call-history', label: 'Call History', icon: Clock },
      { id: 'threat-center', label: 'Threat Center', icon: ShieldAlert },
    ],
  },
  {
    group: 'IDENTITY',
    items: [
      { id: 'trusted-speakers', label: 'Trusted Speakers', icon: Users },
      { id: 'voice-profiles', label: 'Voice Profiles', icon: Fingerprint },
      { id: 'verification', label: 'Verification', icon: CheckCircle2 },
    ],
  },
  {
    group: 'INTELLIGENCE',
    items: [
      { id: 'threat-analytics', label: 'Threat Analytics', icon: BarChart3 },
      { id: 'attack-patterns', label: 'Attack Patterns', icon: Zap },
    ],
  },
  {
    group: 'SECURITY',
    items: [
      { id: 'prevention-center', label: 'Prevention Center', icon: ShieldCheck },
      { id: 'security-policies', label: 'Security Policies', icon: Layers },
    ],
  },
  {
    group: 'AUDIT',
    items: [
      { id: 'audit-logs', label: 'Audit Logs', icon: BookOpen },
      { id: 'evidence', label: 'Evidence', icon: HardDrive },
      { id: 'integrity', label: 'Integrity', icon: FileText },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'integrations', label: 'Integrations', icon: Link },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-60 flex flex-col z-30 border-r border-border bg-surface">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L15 4V9C15 12.5 12.5 15.5 9 17C5.5 15.5 3 12.5 3 9V4L9 1Z" stroke="#3D7DF5" strokeWidth="1.5" fill="none"/>
              <path d="M6 9.5C6.5 8 7.5 7 9 7C10.5 7 11.5 8 12 9.5" stroke="#3D7DF5" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="9" cy="10.5" r="1.5" fill="#3D7DF5" opacity="0.8"/>
              <path d="M7.5 9.5C7 8.5 7 7.5 7.5 7" stroke="#3D7DF5" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
              <path d="M10.5 9.5C11 8.5 11 7.5 10.5 7" stroke="#3D7DF5" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-text-primary">VOXGUARD</div>
            <div className="text-[9px] text-text-muted tracking-wide leading-tight">Voice Identity Protection</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {nav.map((group) => (
          <div key={group.group} className="mb-1">
            <div className="px-3 pt-3 pb-1">
              <span className="text-[9px] font-semibold tracking-widest text-text-muted uppercase">{group.group}</span>
            </div>
            {group.items.map((item) => {
              const active = current === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                    transition-all duration-150 group relative
                    ${active
                      ? 'bg-accent/10 text-accent-bright font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-accent" />
                  )}
                  <Icon size={15} className={active ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === 'live-calls' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-success status-blink" />
                  )}
                  {item.id === 'notifications' && (
                    <span className="text-[9px] font-bold bg-danger text-white rounded-full w-4 h-4 flex items-center justify-center">3</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent-bright">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-text-primary truncate">Arjun Kumar</div>
            <div className="text-[10px] text-text-muted truncate">Security Analyst</div>
          </div>
          <button className="text-text-muted hover:text-text-secondary transition-colors">
            <LogOut size={14} />
          </button>
        </div>
        <div className="text-[9px] text-text-muted mb-1.5 font-medium uppercase tracking-wide">Meridian Financial Grp</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success status-blink" />
          <span className="text-[10px] font-semibold text-success tracking-wide">SYSTEM PROTECTED</span>
        </div>
      </div>
    </aside>
  );
}
