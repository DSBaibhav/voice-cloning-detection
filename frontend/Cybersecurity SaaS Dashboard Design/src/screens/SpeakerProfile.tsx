import { useState } from 'react';
import { ChevronRight, CheckCircle2, AlertTriangle, Phone, RefreshCw } from 'lucide-react';
import { MetricBar } from '../components/RiskGauge';
import { StatusBadge } from '../components/StatusBadge';
import { MiniSparkline } from '../components/Waveform';
import { VerifyIdentityModal } from '../components/Modals';
import type { Page } from '../types';

interface Props {
  onNavigate: (page: Page, data?: any) => void;
}

const VOICE_HISTORY = [91, 93, 94, 92, 95, 94, 93, 96, 94, 92, 94];
const CALL_HISTORY = [
  { date: 'Today, 14:32', duration: '2:18', result: 'verified', risk: 12 },
  { date: 'Today, 09:41', duration: '4:55', result: 'verified', risk: 18 },
  { date: 'Yesterday, 16:20', duration: '1:43', result: 'verified', risk: 9 },
  { date: 'Yesterday, 11:15', duration: '3:27', result: 'alert', risk: 34 },
  { date: '2 days ago, 14:08', duration: '6:12', result: 'verified', risk: 11 },
];

export function SpeakerProfile({ onNavigate }: Props) {
  const [showVerify, setShowVerify] = useState(false);

  return (
    <div className="space-y-5 anim-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <button onClick={() => onNavigate('trusted-speakers')} className="text-text-muted hover:text-text-secondary text-xs transition-colors">Trusted Speakers</button>
        <ChevronRight size={12} className="text-text-muted" />
        <span className="text-xs text-text-primary font-medium">Rajesh Sharma</span>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Profile card */}
        <div className="col-span-3 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-xl font-bold text-accent-bright mb-3">
                RS
              </div>
              <h1 className="text-base font-bold text-text-primary">Rajesh Sharma</h1>
              <p className="text-xs text-text-muted">Finance Manager</p>
              <p className="text-xs text-text-muted">Finance Department</p>
              <div className="mt-2"><StatusBadge level="active" /></div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Speaker ID', value: 'SP-001', mono: true },
                { label: 'Enrolled', value: 'Mar 15, 2024', mono: false },
                { label: 'Verify Score', value: '96%', mono: true, color: 'text-success' },
                { label: 'Total Calls', value: '247', mono: true },
                { label: 'Alerts', value: '2', mono: true, color: 'text-warning' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">{item.label}</span>
                  <span className={`text-xs font-semibold ${item.mono ? 'font-mono' : ''} ${(item as any).color ?? 'text-text-primary'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => setShowVerify(true)} className="w-full py-2.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-bright transition-all">
              Verify Now
            </button>
            <button className="w-full py-2 rounded-xl border border-border text-text-secondary text-xs font-semibold hover:bg-elevated transition-all flex items-center justify-center gap-1.5">
              <RefreshCw size={11} /> Re-enroll Voice
            </button>
          </div>
        </div>

        {/* Detail area */}
        <div className="col-span-9 space-y-5">
          {/* Voice match trend */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-text-primary">Voice Match History</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Avg:</span>
                <span className="text-sm font-mono font-bold text-success">94%</span>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {VOICE_HISTORY.map((v, i) => {
                const color = v >= 90 ? '#12B981' : '#F59E0B';
                const h = ((v - 80) / 20) * 80;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono text-text-muted">{v}%</span>
                    <div className="w-full rounded-sm" style={{ height: h, background: color, opacity: 0.8 }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice profile metrics */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Voice Profile Analysis</h2>
            <div className="space-y-3">
              {[
                { label: 'Overall Match', value: 94, color: '#12B981' },
                { label: 'Spectral Consistency', value: 97, color: '#12B981' },
                { label: 'Prosody Match', value: 91, color: '#12B981' },
                { label: 'Pitch Signature', value: 95, color: '#12B981' },
                { label: 'Behavioral Baseline', value: 93, color: '#12B981' },
              ].map(m => <MetricBar key={m.label} {...m} />)}
            </div>
          </div>

          {/* Call history */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Recent Calls</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Date & Time', 'Duration', 'Verification', 'Risk Score'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CALL_HISTORY.map((call, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-elevated transition-colors">
                    <td className="px-4 py-3.5 text-xs font-mono text-text-secondary">{call.date}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-text-muted">{call.duration}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {call.result === 'verified' ? (
                          <><CheckCircle2 size={12} className="text-success" /><span className="text-xs text-success font-semibold">Verified</span></>
                        ) : (
                          <><AlertTriangle size={12} className="text-warning" /><span className="text-xs text-warning font-semibold">Alert</span></>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-mono font-bold ${call.risk < 25 ? 'text-success' : call.risk < 50 ? 'text-warning' : 'text-danger'}`}>
                        {call.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showVerify && <VerifyIdentityModal onClose={() => setShowVerify(false)} />}
    </div>
  );
}
