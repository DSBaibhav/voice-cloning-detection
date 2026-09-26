import { Shield, Hash, Download, CheckCircle2 } from 'lucide-react';

const evidenceItems = [
  { type: 'Audio Fingerprint', id: 'AUD-84921', hash: 'a91f7d8c4e2f9b1d3c7a8e5f2b4d6c1a8f3e9b2d', size: '2.4 KB', created: '17:41:08', integrity: 'verified' },
  { type: 'Call Metadata', id: 'META-84921', hash: 'c32d8a1fb4e7c9d2f5a8b3e6c1d4f7a2b9e5c8d1', size: '1.1 KB', created: '17:41:08', integrity: 'verified' },
  { type: 'Voice Analysis', id: 'ANLY-84921', hash: 'f84e2c7a1d9b5f3e8c2a6d4b7e9f1c5a3d8b2e6f', size: '8.7 KB', created: '17:41:09', integrity: 'verified' },
  { type: 'Transcript Hash', id: 'TRN-84921', hash: '9b3f6d2e4a8c1f5b7d3e9a2c6f8b4d1e7a5c3f9b', size: '0.5 KB', created: '17:37:00', integrity: 'verified' },
  { type: 'Risk Assessment', id: 'RSK-84921', hash: 'e27c4b9f1d5a3e8c6b2f4d7a9c1e5b3f8d2a6c4e', size: '3.2 KB', created: '17:41:05', integrity: 'verified' },
  { type: 'Action History', id: 'ACT-84921', hash: 'd5a9c3e7b1f4d8a2c6e4b7f9d1a5c3e8b2f6d4a9', size: '1.8 KB', created: '17:41:08', integrity: 'verified' },
];

export function Evidence() {
  return (
    <div className="space-y-6 anim-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Digital Evidence</h1>
          <p className="text-sm text-text-muted mt-0.5">Cryptographically secured evidence records for all security incidents.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-text-secondary text-xs font-semibold hover:bg-elevated transition-all">
          <Download size={13} /> Export All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Evidence Items', value: '247' },
          { label: 'Verified', value: '247', color: 'text-success' },
          { label: 'Pending Verification', value: '0' },
          { label: 'Storage Used', value: '42.8 MB' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-semibold mb-2">{s.label}</p>
            <p className={`text-2xl font-bold font-mono ${s.color ?? 'text-text-primary'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Evidence cards */}
      <div className="grid grid-cols-2 gap-4">
        {evidenceItems.map(ev => (
          <div key={ev.id} className="bg-card border border-border rounded-xl p-5 hover:border-border-strong transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Shield size={16} className="text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">{ev.type}</p>
                <p className="text-xs font-mono text-text-muted">{ev.id}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-success" />
                <span className="text-[10px] font-semibold text-success uppercase tracking-wide">VERIFIED</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash size={11} className="text-text-muted shrink-0" />
                <span className="text-[10px] font-mono text-text-muted truncate">SHA-256: {ev.hash}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-text-muted">Created: </span>
                  <span className="font-mono text-text-secondary">{ev.created}</span>
                </div>
                <div>
                  <span className="text-text-muted">Size: </span>
                  <span className="font-mono text-text-secondary">{ev.size}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border flex gap-2">
              <button className="flex-1 py-1.5 rounded-lg border border-border text-[10px] font-semibold text-text-muted hover:text-text-secondary hover:bg-elevated transition-all">
                View
              </button>
              <button className="flex-1 py-1.5 rounded-lg border border-border text-[10px] font-semibold text-text-muted hover:text-text-secondary hover:bg-elevated transition-all flex items-center justify-center gap-1">
                <Download size={9} /> Export
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
