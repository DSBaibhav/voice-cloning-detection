import { AlertCircle, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

const notifications = [
  { id: 1, type: 'high', icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', title: 'High-risk impersonation detected', detail: 'Caller claimed Finance Manager identity — AI voice detected (82%)', threatId: '#84921', time: '2 minutes ago', action: 'View Threat' },
  { id: 2, type: 'medium', icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', title: 'Speaker verification failed', detail: 'Voice match 71% — below 85% threshold for Rajesh Sharma', threatId: '#84921', time: '5 minutes ago', action: 'View Details' },
  { id: 3, type: 'medium', icon: AlertOctagon, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', title: 'Suspicious financial request', detail: 'Caller requested ₹85,000 transfer without verification', threatId: '#84921', time: '8 minutes ago', action: 'Review' },
  { id: 4, type: 'low', icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', title: 'Speaker mismatch on incoming call', detail: 'Unknown caller claiming to be CEO', threatId: '#84920', time: '19 minutes ago', action: 'View Call' },
  { id: 5, type: 'success', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', title: 'Identity successfully verified', detail: 'Priya Nair verified via voice + trusted device', threatId: '#84919', time: '32 minutes ago', action: 'View Log' },
  { id: 6, type: 'high', icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', title: 'AI Voice attack blocked', detail: 'Replay attack detected and call terminated automatically', threatId: '#84918', time: '1 hour ago', action: 'View Evidence' },
  { id: 7, type: 'success', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', title: 'Transaction hold confirmed', detail: 'Transfer of ₹85,000 placed on hold pending review', threatId: '#84921', time: '2 minutes ago', action: 'View Transaction' },
];

export function Notifications() {
  return (
    <div className="space-y-6 anim-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
          <p className="text-sm text-text-muted mt-0.5">Real-time security alerts and system notifications.</p>
        </div>
        <button className="text-xs text-accent hover:text-accent-bright transition-colors">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {notifications.map(n => {
          const Icon = n.icon;
          return (
            <div key={n.id} className={`flex items-start gap-4 p-4 bg-card border rounded-xl transition-all hover:border-border-strong ${n.border}`}>
              <div className={`w-9 h-9 rounded-xl ${n.bg} border ${n.border} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon size={16} className={n.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary mb-0.5">{n.title}</p>
                    <p className="text-xs text-text-secondary">{n.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-text-muted font-mono">{n.time}</span>
                    <p className="text-[10px] font-mono text-text-muted">{n.threatId}</p>
                  </div>
                </div>
              </div>
              <button className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:opacity-80 ${n.border} ${n.color}`}>
                {n.action}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
