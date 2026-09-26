import { useState } from 'react';
import { Phone, Clock, Pause, VolumeX, PhoneOff, AlertCircle, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { Waveform } from '../components/Waveform';
import { RiskGauge, MetricBar } from '../components/RiskGauge';
import { VerifyIdentityModal, HoldTransactionModal, EscalateModal, EndCallModal } from '../components/Modals';
import type { Page } from '../types';

const RISK_METRICS = [
  { label: 'Synthetic Voice',  value: 82, color: '#EF4444' },
  { label: 'Speaker Mismatch', value: 71, color: '#F59E0B' },
  { label: 'Prosody Anomaly',  value: 63, color: '#F59E0B' },
  { label: 'Conversation Risk', value: 76, color: '#EF4444' },
  { label: 'Identity Context', value: 84, color: '#EF4444' },
  { label: 'Behavioral Anomaly', value: 68, color: '#F59E0B' },
];

const VOICE_INDICATORS = [
  { label: 'Spectral Consistency', status: 'anomaly' },
  { label: 'Prosody Consistency',  status: 'anomaly' },
  { label: 'Natural Variation',    status: 'low' },
  { label: 'Speech Artifacts',     status: 'detected' },
  { label: 'Replay Indicators',    status: 'clear' },
];

const BEHAVIOR_METRICS = [
  { label: 'Pitch Variation',    value: 28 },
  { label: 'Speaking Rate',      value: 74 },
  { label: 'Pause Frequency',    value: 38 },
  { label: 'Emotional Variation', value: 22 },
  { label: 'Sentence Rhythm',    value: 45 },
  { label: 'Response Latency',   value: 82 },
];

const TRANSCRIPT = [
  { speaker: 'caller', text: 'Please transfer the amount to the vendor account immediately.' },
  { analysis: 'Financial request detected', severity: 'high' },
  { speaker: 'agent', text: 'I\'ll need to verify your identity before proceeding with any transaction.' },
  { speaker: 'caller', text: 'I don\'t have time for verification right now. This is urgent.' },
  { analysis: 'Verification avoidance detected', severity: 'medium' },
  { speaker: 'caller', text: 'This needs to happen right now. Authorize ₹85,000 to account 4821.' },
  { analysis: 'Urgency manipulation detected', severity: 'medium' },
  { speaker: 'agent', text: 'I\'m required to follow security protocols for all transactions.' },
  { speaker: 'caller', text: 'Just do it. The CEO has already approved this. Check your email.' },
  { analysis: 'Authority claim without verification', severity: 'high' },
];

const TIMELINE = [
  { time: '00:00', event: 'Call Started', severity: 'neutral' },
  { time: '00:17', event: 'Speaker Identified as Rajesh Sharma', severity: 'neutral' },
  { time: '01:04', event: 'Voice Anomaly Detected — Spectral irregularities', severity: 'high' },
  { time: '02:11', event: 'Speaker Mismatch — 71% match (threshold 85%)', severity: 'high' },
  { time: '03:28', event: 'High-Risk Financial Request — ₹85,000', severity: 'high' },
  { time: '04:02', event: 'Risk Threshold Exceeded — Score 78/100', severity: 'high' },
  { time: '04:05', event: 'Step-Up Verification Triggered', severity: 'medium' },
];

const FLAG_REASONS = [
  { text: 'Synthetic voice characteristics detected', severity: 'high' },
  { text: 'Speaker voice does not match enrolled profile', severity: 'high' },
  { text: 'Unusual prosody and speech rhythm patterns', severity: 'medium' },
  { text: 'High-risk financial transaction requested', severity: 'high' },
  { text: 'Caller attempting to bypass verification', severity: 'medium' },
];

interface Props {
  onNavigate: (page: Page, data?: any) => void;
}

export function LiveCallAnalysis({ onNavigate }: Props) {
  const [modal, setModal] = useState<'verify' | 'hold' | 'escalate' | 'end' | null>(null);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);

  const statusDot = (status: string) => {
    if (status === 'clear') return <CheckCircle2 size={12} className="text-success" />;
    return <AlertTriangle size={12} className="text-warning" />;
  };

  return (
    <div className="space-y-5 anim-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => onNavigate('live-calls')} className="text-text-muted hover:text-text-secondary text-xs transition-colors">Live Calls</button>
            <ChevronRight size={12} className="text-text-muted" />
            <span className="text-xs text-text-primary font-medium">Call Analysis</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-text-primary">Live Call Analysis</h1>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 border border-danger/30 text-xs font-bold text-danger uppercase tracking-wide">
              <AlertCircle size={12} /> HIGH RISK
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
            <Clock size={13} className="text-text-muted" />
            <span className="font-mono font-semibold text-text-primary">04:37</span>
          </div>
          <div className="px-4 py-2 bg-card border border-border rounded-lg">
            <span className="text-xs text-text-muted">Caller: </span>
            <span className="text-xs font-mono text-text-primary">+91 98XXX XXXXX</span>
          </div>
          <div className="px-4 py-2 bg-card border border-border rounded-lg">
            <span className="text-xs text-text-muted">Claimed: </span>
            <span className="text-xs font-medium text-text-primary">Finance Manager</span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left column */}
        <div className="col-span-8 space-y-5">
          {/* Audio panel */}
          <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-danger/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Live Audio</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-danger status-blink" />
                <span className="text-[10px] font-semibold text-danger tracking-wide">RECORDING</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-5 py-3">
              <Waveform bars={30} height={72} animated={!paused} color="#EF4444" />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { label: 'Audio Quality', value: '96%', color: 'text-success' },
                { label: 'Signal Integrity', value: '89%', color: 'text-success' },
                { label: 'Noise Level', value: 'Low', color: 'text-success' },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-0.5">{m.label}</p>
                  <p className={`text-sm font-semibold ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPaused(v => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary text-xs hover:bg-elevated hover:text-text-primary transition-all"
              >
                <Pause size={12} /> {paused ? 'Resume Analysis' : 'Pause Analysis'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary text-xs hover:bg-elevated hover:text-text-primary transition-all">
                <VolumeX size={12} /> Mute
              </button>
              <button
                onClick={() => setModal('end')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-semibold hover:bg-danger/20 transition-all ml-auto"
              >
                <PhoneOff size={12} /> End Call
              </button>
            </div>
          </div>

          {/* Voice Auth + Speaker Identity row */}
          <div className="grid grid-cols-2 gap-5">
            {/* Voice Authenticity */}
            <div className="bg-card border border-danger/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Voice Authenticity</p>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20 uppercase tracking-wide">High Suspicion</span>
              </div>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-danger font-mono">82%</div>
                <div className="text-xs text-text-muted mt-1">Synthetic Voice Probability</div>
              </div>
              <div className="space-y-2 mb-4">
                {VOICE_INDICATORS.map(ind => (
                  <div key={ind.label} className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">{ind.label}</span>
                    <div className="flex items-center gap-1.5">
                      {statusDot(ind.status)}
                      <span className={`text-[10px] font-semibold ${ind.status === 'clear' ? 'text-success' : 'text-warning'}`}>
                        {ind.status === 'clear' ? 'Clear' : ind.status === 'anomaly' ? 'Anomaly' : ind.status === 'detected' ? 'Detected' : 'Low'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 rounded-xl border border-accent/30 text-accent-bright text-xs font-semibold hover:bg-accent/10 transition-all">
                View Full Analysis
              </button>
            </div>

            {/* Speaker Identity */}
            <div className="bg-card border border-warning/20 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Speaker Identity</p>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 uppercase tracking-wide">Mismatch</span>
              </div>
              <div className="mb-4">
                <p className="text-xs text-text-muted mb-0.5">Claimed Identity</p>
                <p className="text-base font-semibold text-text-primary">Rajesh Sharma</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-elevated rounded-xl text-center">
                  <p className="text-[10px] text-text-muted mb-1">Expected Match</p>
                  <p className="text-xl font-bold font-mono text-success">94%</p>
                </div>
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-center">
                  <p className="text-[10px] text-text-muted mb-1">Current Match</p>
                  <p className="text-xl font-bold font-mono text-danger">71%</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {[
                  { label: 'Voice Similarity', value: 71, color: '#EF4444' },
                  { label: 'Historical Consistency', value: 64, color: '#EF4444' },
                  { label: 'Confidence', value: 89, color: '#12B981' },
                ].map(m => <MetricBar key={m.label} {...m} />)}
              </div>
              <button
                onClick={() => setModal('verify')}
                className="w-full py-2.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-bright transition-all"
              >
                VERIFY IDENTITY
              </button>
            </div>
          </div>

          {/* Voice Behavior + Conversation Intelligence */}
          <div className="grid grid-cols-2 gap-5">
            {/* Voice Behavior */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Voice Behavior</p>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 uppercase tracking-wide">Anomalous</span>
              </div>
              <div className="space-y-3">
                {BEHAVIOR_METRICS.map(m => {
                  const isAnomalous = m.value < 35 || m.value > 70;
                  const color = isAnomalous ? '#F59E0B' : '#12B981';
                  return <MetricBar key={m.label} label={m.label} value={m.value} color={color} />;
                })}
              </div>
            </div>

            {/* Conversation Intelligence */}
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-4">Conversation Intelligence</p>
              <div className="flex-1 space-y-2 overflow-y-auto max-h-64">
                {TRANSCRIPT.map((item, i) => {
                  if ('analysis' in item) {
                    const bg = item.severity === 'high' ? 'bg-danger/5 border-danger/20 text-danger' : 'bg-warning/5 border-warning/20 text-warning';
                    const dot = item.severity === 'high' ? 'bg-danger' : 'bg-warning';
                    return (
                      <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold uppercase tracking-wide ${bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
                        {item.analysis}
                      </div>
                    );
                  }
                  if ('speaker' in item) {
                    return (
                      <div key={i} className={`${item.speaker === 'caller' ? 'pl-3' : 'pl-0'}`}>
                        <span className={`text-[9px] font-semibold uppercase tracking-wide ${item.speaker === 'caller' ? 'text-warning' : 'text-text-muted'}`}>
                          {item.speaker === 'caller' ? 'CALLER' : 'AGENT'}
                        </span>
                        <p className={`text-xs mt-0.5 ${item.speaker === 'caller' ? 'text-text-primary' : 'text-text-secondary'}`}>
                          "{item.text}"
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          {/* Flag Reasons */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-4">Why This Call Was Flagged</p>
            <div className="space-y-2">
              {FLAG_REASONS.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:opacity-80 transition-opacity ${
                    r.severity === 'high'
                      ? 'bg-danger/5 border-danger/20'
                      : 'bg-warning/5 border-warning/20'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${r.severity === 'high' ? 'bg-danger' : 'bg-warning'}`} />
                  <span className="text-xs text-text-secondary flex-1">{r.text}</span>
                  <ChevronRight size={12} className="text-text-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-4 space-y-5">
          {/* Risk Gauge */}
          <div className="bg-card border border-danger/20 rounded-xl p-5 flex flex-col items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-4 self-start">Risk Assessment</p>
            <RiskGauge score={78} label="HIGH RISK" size={190} />
            <div className="w-full mt-5 space-y-3">
              {RISK_METRICS.map(m => <MetricBar key={m.label} {...m} />)}
            </div>
          </div>

          {/* Threat Timeline */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-4">Threat Timeline</p>
            <div className="relative">
              <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />
              <div className="space-y-4">
                {TIMELINE.map((evt, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      evt.severity === 'high' ? 'border-danger bg-danger/20' :
                      evt.severity === 'medium' ? 'border-warning bg-warning/20' :
                      'border-border bg-card'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        evt.severity === 'high' ? 'bg-danger' :
                        evt.severity === 'medium' ? 'bg-warning' :
                        'bg-text-muted'
                      }`} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-text-muted">{evt.time}</span>
                      <p className="text-xs text-text-secondary leading-snug">{evt.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prevention Actions */}
          <div className="bg-card border border-danger/30 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-danger/5 via-transparent to-transparent pointer-events-none" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">Protection Action</p>
            <p className="text-xs font-bold text-danger uppercase tracking-wide mb-1">HIGH-RISK IMPERSONATION</p>
            <p className="text-xs text-text-secondary mb-5">Step-up verification required before proceeding.</p>

            {held ? (
              <div className="p-3 bg-success/10 border border-success/20 rounded-xl mb-3 text-center">
                <CheckCircle2 size={16} className="text-success mx-auto mb-1" />
                <p className="text-xs font-semibold text-success">Transaction Held — Case #84921</p>
              </div>
            ) : (
              <button
                onClick={() => setModal('verify')}
                className="w-full py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-bright transition-all mb-3 shadow-lg shadow-accent/20"
              >
                VERIFY IDENTITY
              </button>
            )}

            <div className="space-y-2">
              <button className="w-full py-2 rounded-xl border border-border text-text-secondary text-xs font-semibold hover:bg-elevated hover:text-text-primary transition-all">
                Request Security Phrase
              </button>
              <button className="w-full py-2 rounded-xl border border-border text-text-secondary text-xs font-semibold hover:bg-elevated hover:text-text-primary transition-all">
                Send Trusted Device Verification
              </button>
              <button
                onClick={() => setModal('hold')}
                className="w-full py-2 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-semibold hover:bg-danger/20 transition-all"
              >
                Hold Transaction
              </button>
              <button
                onClick={() => setModal('escalate')}
                className="w-full py-2 rounded-xl border border-warning/30 text-warning text-xs font-semibold hover:bg-warning/10 transition-all"
              >
                Escalate
              </button>
              <button
                onClick={() => setModal('end')}
                className="w-full py-2 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-semibold hover:bg-danger/20 transition-all"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === 'verify' && (
        <VerifyIdentityModal
          onClose={() => setModal(null)}
          onComplete={() => { setModal('hold'); }}
        />
      )}
      {modal === 'hold' && (
        <HoldTransactionModal
          onClose={() => setModal(null)}
          onConfirm={() => setHeld(true)}
        />
      )}
      {modal === 'escalate' && <EscalateModal onClose={() => setModal(null)} />}
      {modal === 'end' && <EndCallModal onClose={() => setModal(null)} onConfirm={() => onNavigate('live-calls')} />}
    </div>
  );
}
