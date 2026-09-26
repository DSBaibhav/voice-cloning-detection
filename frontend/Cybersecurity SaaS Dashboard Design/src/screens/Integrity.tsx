import { CheckCircle2, Hash, AlertCircle } from 'lucide-react';

const entries = [
  { id: 'EVT-84921', hash: 'a91f7d8c...e421', prev: 'd5a9c3e7...a9c1', ts: '17:41:08', event: 'Transaction Held', status: 'verified' },
  { id: 'EVT-84920', hash: 'c32d8a1f...b89c', prev: 'f84e2c7a...d53b', ts: '17:26:33', event: 'Verification Triggered', status: 'verified' },
  { id: 'EVT-84919', hash: '9b3f6d2e...7a14', prev: 'e27c4b9f...2d68', ts: '17:10:15', event: 'Identity Verified', status: 'verified' },
  { id: 'EVT-84918', hash: 'f84e2c7a...d53b', prev: 'a91f7d8c...e421', ts: '16:54:22', event: 'Replay Attack Blocked', status: 'verified' },
  { id: 'EVT-84917', hash: 'e27c4b9f...2d68', prev: 'c32d8a1f...b89c', ts: '16:31:05', event: 'Incident Escalated', status: 'verified' },
];

export function Integrity() {
  return (
    <div className="space-y-6 anim-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Immutable Audit Trail</h1>
        <p className="text-sm text-text-muted mt-0.5">Cryptographically linked event chain ensuring tamper-evident logging.</p>
      </div>

      {/* Status banner */}
      <div className="p-4 bg-success/5 border border-success/20 rounded-xl flex items-center gap-3">
        <CheckCircle2 size={20} className="text-success shrink-0" />
        <div>
          <p className="text-sm font-semibold text-success">Audit Chain Intact</p>
          <p className="text-xs text-text-secondary">All 247 events verified. Chain root: <span className="font-mono">0x4f7b2c1a...</span></p>
        </div>
        <div className="ml-auto px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-[9px] font-bold text-warning uppercase tracking-wider text-center">SIMULATED INTEGRITY</p>
          <p className="text-[9px] text-text-muted text-center">Prototype mode — not a live blockchain</p>
        </div>
      </div>

      {/* Chain visualization */}
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={entry.id} className="relative">
            {i < entries.length - 1 && (
              <div className="absolute left-5 top-full w-px h-3 bg-border z-10" />
            )}
            <div className="bg-card border border-border rounded-xl p-4 hover:border-border-strong transition-all">
              <div className="flex items-start gap-4">
                {/* Block indicator */}
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Hash size={14} className="text-accent" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-semibold text-text-primary">{entry.id}</span>
                    <span className="text-[10px] font-mono text-text-muted">{entry.ts}</span>
                    <span className="text-xs text-text-secondary">{entry.event}</span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-success" />
                      <span className="text-[10px] font-semibold text-success uppercase tracking-wide">VERIFIED</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] text-text-muted uppercase tracking-wide font-semibold mb-0.5">Block Hash</p>
                      <p className="text-[10px] font-mono text-text-secondary truncate">SHA-256: {entry.hash}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-text-muted uppercase tracking-wide font-semibold mb-0.5">Previous Hash</p>
                      <p className="text-[10px] font-mono text-text-secondary truncate">{entry.prev}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl flex items-start gap-3">
        <AlertCircle size={16} className="text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-warning mb-1">Prototype Notice</p>
          <p className="text-xs text-text-secondary">
            This integrity visualization is simulated for demonstration purposes. In production, events would be anchored to an immutable ledger (Hyperledger Fabric, private Ethereum, or equivalent). No actual blockchain transaction exists in this prototype.
          </p>
        </div>
      </div>
    </div>
  );
}
