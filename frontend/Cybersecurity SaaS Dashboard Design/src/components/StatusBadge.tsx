import type { RiskLevel } from '../types';

interface Props {
  level: RiskLevel | string;
  size?: 'sm' | 'md';
}

const config: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  safe:       { label: 'Safe',       dot: 'bg-success',  bg: 'bg-success/10',  text: 'text-success' },
  verified:   { label: 'Verified',   dot: 'bg-success',  bg: 'bg-success/10',  text: 'text-success' },
  analyzing:  { label: 'Analyzing',  dot: 'bg-accent',   bg: 'bg-accent/10',   text: 'text-accent-bright' },
  suspicious: { label: 'Suspicious', dot: 'bg-warning',  bg: 'bg-warning/10',  text: 'text-warning' },
  'high-risk':{ label: 'High Risk',  dot: 'bg-danger',   bg: 'bg-danger/10',   text: 'text-danger' },
  blocked:    { label: 'Blocked',    dot: 'bg-danger',   bg: 'bg-danger/10',   text: 'text-danger' },
  offline:    { label: 'Offline',    dot: 'bg-text-muted', bg: 'bg-elevated',  text: 'text-text-muted' },
  active:     { label: 'Active',     dot: 'bg-success',  bg: 'bg-success/10',  text: 'text-success' },
  inactive:   { label: 'Inactive',   dot: 'bg-text-muted', bg: 'bg-elevated',  text: 'text-text-muted' },
  investigating: { label: 'Investigating', dot: 'bg-warning', bg: 'bg-warning/10', text: 'text-warning' },
  resolved:   { label: 'Resolved',   dot: 'bg-success',  bg: 'bg-success/10',  text: 'text-success' },
};

export function StatusBadge({ level, size = 'sm' }: Props) {
  const c = config[level] ?? config.offline;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wide ${padding} ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
      {c.label}
    </span>
  );
}

export function RiskScore({ score, size = 'sm' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const color = score >= 80 ? 'text-danger' : score >= 60 ? 'text-warning' : 'text-success';
  const sizes = { sm: 'text-sm font-bold', md: 'text-xl font-bold', lg: 'text-4xl font-bold' };
  return <span className={`${sizes[size]} ${color} font-mono`}>{score}</span>;
}

export function ThreatTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    'AI Voice': 'bg-danger/10 text-danger border border-danger/20',
    'Replay Attack': 'bg-warning/10 text-warning border border-warning/20',
    'Speaker Mismatch': 'bg-purple/10 text-purple border border-purple/20',
    'Social Engineering': 'bg-accent/10 text-accent-bright border border-accent/20',
    'Identity Mismatch': 'bg-warning/10 text-warning border border-warning/20',
    'Suspicious Request': 'bg-elevated text-text-secondary border border-border',
  };
  const cls = colors[type] ?? 'bg-elevated text-text-secondary border border-border';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {type}
    </span>
  );
}
