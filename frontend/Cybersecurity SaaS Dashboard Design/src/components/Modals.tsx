import { useState } from 'react';
import { X, CheckCircle2, XCircle, Smartphone, Mic, Shield, AlertTriangle } from 'lucide-react';

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
}

/* ─── Verify Identity Modal ─── */
interface VerifyModalProps {
  onClose: () => void;
  onComplete?: (passed: boolean) => void;
}

const steps = [
  { id: 1, label: 'Identity Challenge' },
  { id: 2, label: 'Voice Verification' },
  { id: 3, label: 'Trusted Device' },
  { id: 4, label: 'Result' },
];

export function VerifyIdentityModal({ onClose, onComplete }: VerifyModalProps) {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const next = () => {
    if (step === 2) {
      setAnalyzing(true);
      let p = 0;
      const t = setInterval(() => {
        p += 4;
        setProgress(p);
        if (p >= 100) { clearInterval(t); setAnalyzing(false); setStep(3); }
      }, 50);
      return;
    }
    if (step === 3) { setStep(4); return; }
    setStep(s => s + 1);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-card2 border border-border rounded-2xl w-[520px] shadow-2xl anim-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
              <Shield size={16} className="text-accent" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Verify Identity</h2>
              <p className="text-xs text-text-muted">Rajesh Sharma · Finance Manager</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-secondary transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 pt-5 gap-0">
          {steps.map((s, i) => (
            <div key={s.id} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                {i > 0 && <div className={`flex-1 h-px ${step > i ? 'bg-accent' : 'bg-border'} transition-colors`} />}
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all
                  ${step > s.id ? 'bg-success border-success text-white' : step === s.id ? 'border-accent text-accent' : 'border-border text-text-muted'}`}>
                  {step > s.id ? <CheckCircle2 size={12} /> : s.id}
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-px ${step > s.id + 1 ? 'bg-accent' : step > s.id ? 'bg-accent/40' : 'bg-border'} transition-colors`} />}
              </div>
              <span className={`text-[9px] font-medium uppercase tracking-wide mt-1.5 text-center
                ${step === s.id ? 'text-accent' : step > s.id ? 'text-success' : 'text-text-muted'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="px-6 py-6 min-h-[200px]">
          {step === 1 && (
            <div className="space-y-4 anim-fade-in">
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-sm text-text-secondary leading-relaxed">
                  Ask the caller to provide the registered security phrase associated with their voice profile.
                </p>
              </div>
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl">
                <p className="text-xs text-text-muted mb-1 uppercase tracking-wide font-semibold">Security Phrase Prompt</p>
                <p className="text-sm font-medium text-text-primary">"Please state your registered security passphrase now."</p>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4 anim-fade-in">
              <div className="flex flex-col items-center py-4">
                <div className="relative w-16 h-16 mb-4">
                  <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                    <Mic size={24} className="text-accent" />
                  </div>
                  {analyzing && (
                    <span className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-50" />
                  )}
                </div>
                <p className="text-sm text-text-secondary text-center">
                  {analyzing ? 'Analyzing voice response against stored profile...' : 'Ready to analyze voice response'}
                </p>
                {analyzing && (
                  <div className="w-full max-w-xs mt-4">
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-text-muted text-center mt-2">{progress}% complete</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4 anim-fade-in">
              <div className="flex flex-col items-center py-4">
                <div className="w-16 h-16 rounded-full bg-warning/15 border border-warning/30 flex items-center justify-center mb-4">
                  <Smartphone size={24} className="text-warning" />
                </div>
                <p className="text-sm font-medium text-text-primary mb-2">Verification Request Sent</p>
                <p className="text-sm text-text-secondary text-center">
                  A verification request has been sent to the trusted device registered for Rajesh Sharma.
                </p>
              </div>
              <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <p className="text-xs text-warning text-center font-medium">Awaiting device confirmation...</p>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="flex flex-col items-center py-4 anim-fade-in">
              <div className="w-16 h-16 rounded-full bg-danger/15 border border-danger/30 flex items-center justify-center mb-4">
                <XCircle size={32} className="text-danger" />
              </div>
              <p className="text-base font-bold text-danger mb-2">VERIFICATION FAILED</p>
              <p className="text-sm text-text-secondary text-center">
                Speaker identity could not be sufficiently verified. Voice match: 43% (threshold: 85%).
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6">
          {step < 4 ? (
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-text-secondary text-sm hover:bg-elevated hover:text-text-primary transition-all">
                Cancel
              </button>
              <button
                onClick={next}
                disabled={analyzing}
                className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-bright transition-all disabled:opacity-50"
              >
                {step === 2 && !analyzing ? 'Analyze Voice' : step === 2 && analyzing ? 'Analyzing...' : 'Continue'}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => onComplete?.(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-semibold hover:bg-danger/20 transition-all"
              >
                Hold Transaction
              </button>
              <button
                onClick={() => onComplete?.(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-warning/10 border border-warning/30 text-warning text-sm font-semibold hover:bg-warning/20 transition-all"
              >
                Escalate
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}

/* ─── Hold Transaction Modal ─── */
interface HoldModalProps {
  onClose: () => void;
  onConfirm?: () => void;
}

export function HoldTransactionModal({ onClose, onConfirm }: HoldModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  const confirm = () => { setConfirmed(true); setTimeout(() => { onConfirm?.(); onClose(); }, 2000); };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-card2 border border-border rounded-2xl w-[440px] shadow-2xl anim-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center">
              <AlertTriangle size={16} className="text-danger" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">Hold Transaction?</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-secondary">
            <X size={18} />
          </button>
        </div>

        {!confirmed ? (
          <>
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Transaction Amount', value: '₹85,000', mono: true },
                  { label: 'Risk Score', value: '87 / 100', mono: true, color: 'text-danger' },
                  { label: 'Reason', value: 'Voice impersonation risk' },
                  { label: 'Status', value: 'High Risk', color: 'text-danger' },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-card rounded-xl border border-border">
                    <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-1">{item.label}</p>
                    <p className={`text-sm font-semibold ${item.mono ? 'font-mono' : ''} ${item.color ?? 'text-text-primary'}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-danger/5 border border-danger/20 rounded-xl">
                <p className="text-xs text-danger font-medium">
                  This action will pause the transaction and flag it for security review. The caller will be informed of the delay.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-text-secondary text-sm hover:bg-elevated transition-all">
                Cancel
              </button>
              <button
                onClick={confirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-red-500 transition-all"
              >
                Confirm Hold
              </button>
            </div>
          </>
        ) : (
          <div className="px-6 py-8 flex flex-col items-center anim-fade-in">
            <div className="w-14 h-14 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mb-4">
              <CheckCircle2 size={28} className="text-success" />
            </div>
            <p className="text-base font-bold text-success mb-2">Transaction Placed on Hold</p>
            <p className="text-sm text-text-secondary text-center">
              Transaction #TXN-84921 has been held. Security team notified.
            </p>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

/* ─── Escalate Modal ─── */
export function EscalateModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-card2 border border-border rounded-2xl w-[440px] shadow-2xl anim-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">Escalate Incident</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-secondary"><X size={18} /></button>
        </div>
        {!sent ? (
          <>
            <div className="px-6 py-6 space-y-4">
              <div className="p-3 bg-card rounded-xl border border-border">
                <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-1">Threat ID</p>
                <p className="text-sm font-mono text-text-primary">#84921</p>
              </div>
              <div>
                <label className="text-xs text-text-muted font-medium block mb-1.5">Escalation Notes</label>
                <textarea
                  className="w-full bg-card border border-border rounded-xl p-3 text-sm text-text-secondary placeholder-text-muted focus:outline-none focus:border-accent/50 resize-none"
                  rows={3}
                  placeholder="Add context for the escalation team..."
                />
              </div>
              <div>
                <label className="text-xs text-text-muted font-medium block mb-1.5">Escalate To</label>
                <select className="w-full bg-card border border-border rounded-xl p-2.5 text-sm text-text-secondary focus:outline-none focus:border-accent/50">
                  <option>Tier 2 Security Team</option>
                  <option>Security Manager</option>
                  <option>CISO</option>
                  <option>External SOC</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-text-secondary text-sm hover:bg-elevated transition-all">
                Cancel
              </button>
              <button onClick={() => setSent(true)} className="flex-1 px-4 py-2.5 rounded-xl bg-warning text-black text-sm font-semibold hover:bg-yellow-400 transition-all">
                Escalate Incident
              </button>
            </div>
          </>
        ) : (
          <div className="px-6 py-8 flex flex-col items-center anim-fade-in">
            <div className="w-14 h-14 rounded-full bg-warning/15 border border-warning/30 flex items-center justify-center mb-4">
              <CheckCircle2 size={28} className="text-warning" />
            </div>
            <p className="text-base font-bold text-warning mb-2">Incident Escalated</p>
            <p className="text-sm text-text-secondary text-center">Tier 2 Security Team has been notified. Case #84921.</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 rounded-xl border border-border text-text-secondary text-sm hover:bg-elevated transition-all">Close</button>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}

/* ─── End Call Modal ─── */
export function EndCallModal({ onClose, onConfirm }: { onClose: () => void; onConfirm?: () => void }) {
  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-card2 border border-border rounded-2xl w-[420px] shadow-2xl anim-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">End Call?</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-secondary"><X size={18} /></button>
        </div>
        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-text-secondary">
            This will terminate the active call with the suspicious caller. All call data and evidence will be preserved.
          </p>
          <div className="p-3 bg-danger/5 border border-danger/20 rounded-xl">
            <p className="text-xs text-danger font-medium">Caller: +91 98XXX XXXXX · Duration: 04:37 · Risk: 78/100</p>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-text-secondary text-sm hover:bg-elevated transition-all">Cancel</button>
          <button onClick={() => { onConfirm?.(); onClose(); }} className="flex-1 px-4 py-2.5 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-red-500 transition-all">
            End Call
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
