import { useState } from 'react';
import { ChevronRight, AlertCircle, CheckCircle2, Download, Shield, Hash } from 'lucide-react';
import { RiskGauge, MetricBar } from '../components/RiskGauge';
import { ThreatTypeBadge, StatusBadge } from '../components/StatusBadge';
import { EscalateModal } from '../components/Modals';
import type { Page } from '../types';

const SECTIONS = ['Call Information', 'Voice Analysis', 'Conversation', 'Timeline', 'Actions Taken', 'Evidence', 'Audit Trail'];

interface Props {
  onNavigate: (page: Page, data?: any) => void;
  threatId?: string;
}

const TIMELINE_ITEMS = [
  { time: '17:41:08', event: 'Transaction Placed on Hold', severity: 'high' },
  { time: '17:41:05', event: 'Risk Threshold Exceeded — Score 87/100', severity: 'high' },
  { time: '17:40:58', event: 'Step-Up Verification Triggered', severity: 'medium' },
  { time: '17:40:22', event: 'High-Risk Financial Request Detected', severity: 'high' },
  { time: '17:39:44', event: 'Speaker Mismatch Confirmed — 71% vs 94% baseline', severity: 'high' },
  { time: '17:38:11', event: 'Voice Anomaly Detected', severity: 'medium' },
  { time: '17:37:04', event: 'Call Authenticated — Speaker identified as Rajesh Sharma', severity: 'neutral' },
  { time: '17:37:00', event: 'Inbound Call Received', severity: 'neutral' },
];

const EVIDENCE_ITEMS = [
  { label: 'Audio Fingerprint', id: 'AUD-84921', hash: 'a91f7d8c...e421', verified: true },
  { label: 'Call Metadata', id: 'META-84921', hash: 'c32d8a1f...b89c', verified: true },
  { label: 'Transcript Hash', id: 'TRN-84921', hash: 'f84e2c7a...d53b', verified: true },
  { label: 'Detection Results', id: 'DET-84921', hash: '9b3f6d2e...7a14', verified: true },
  { label: 'Risk Assessment', id: 'RSK-84921', hash: 'e27c4b9f...2d68', verified: true },
];

export function ThreatInvestigation({ onNavigate, threatId = '84921' }: Props) {
  const [activeSection, setActiveSection] = useState('Call Information');
  const [showEscalate, setShowEscalate] = useState(false);
  const [resolved, setResolved] = useState(false);

  return (
    <div className="space-y-5 anim-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => onNavigate('threat-center')} className="text-text-muted hover:text-text-secondary text-xs transition-colors">Threat Center</button>
            <ChevronRight size={12} className="text-text-muted" />
            <span className="text-xs text-text-primary font-medium">Investigation</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-text-primary font-mono">THREAT #{threatId}</h1>
            {!resolved && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 border border-danger/30 text-xs font-bold text-danger uppercase">
                <AlertCircle size={12} /> HIGH RISK
              </span>
            )}
            {resolved && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/30 text-xs font-bold text-success uppercase">
                <CheckCircle2 size={12} /> RESOLVED
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowEscalate(true)}
            className="px-4 py-2 rounded-xl border border-warning/30 text-warning text-xs font-semibold hover:bg-warning/10 transition-all"
          >
            Escalate
          </button>
          <button
            onClick={() => setResolved(true)}
            className="px-4 py-2 rounded-xl border border-success/30 text-success text-xs font-semibold hover:bg-success/10 transition-all"
          >
            Mark Resolved
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-text-secondary text-xs font-semibold hover:bg-elevated transition-all">
            <Download size={12} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Sections nav */}
        <div className="col-span-2">
          <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-20">
            {SECTIONS.map(s => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`w-full text-left px-4 py-3 text-xs font-medium border-b border-border last:border-0 transition-colors ${
                  activeSection === s ? 'bg-accent/10 text-accent-bright' : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="col-span-7 space-y-5">
          {/* Call Information */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Call Information</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Threat ID', value: `#${threatId}`, mono: true },
                { label: 'Detected At', value: '17:37:00, Dec 26 2026', mono: true },
                { label: 'Caller', value: '+91 98XXX XXXXX', mono: true },
                { label: 'Claimed Identity', value: 'Rajesh Sharma' },
                { label: 'Threat Type', value: 'AI Voice + Speaker Mismatch' },
                { label: 'Call Duration', value: '04:37' },
                { label: 'Organization', value: 'Meridian Financial Group' },
                { label: 'Agent', value: 'Kumar, Suresh (ID: AGT-042)' },
              ].map(item => (
                <div key={item.label} className="p-3 bg-elevated rounded-xl">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-0.5">{item.label}</p>
                  <p className={`text-xs font-medium text-text-primary ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Analysis */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Voice Analysis</h2>
            <div className="space-y-3">
              {[
                { label: 'Synthetic Voice Probability', value: 82, color: '#EF4444' },
                { label: 'Speaker Match Score', value: 71, color: '#EF4444' },
                { label: 'Prosody Anomaly Score', value: 63, color: '#F59E0B' },
                { label: 'Spectral Consistency', value: 34, color: '#EF4444' },
                { label: 'Natural Variation Index', value: 28, color: '#EF4444' },
              ].map(m => <MetricBar key={m.label} {...m} />)}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: 'Spectral Anomalies', value: 'Detected', color: 'text-danger' },
                { label: 'Prosody Match', value: 'Failed', color: 'text-danger' },
                { label: 'Replay Artifacts', value: 'None', color: 'text-success' },
              ].map(item => (
                <div key={item.label} className="p-2.5 bg-elevated rounded-lg text-center">
                  <p className="text-[9px] text-text-muted uppercase tracking-wide font-semibold mb-1">{item.label}</p>
                  <p className={`text-xs font-semibold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Incident Timeline</h2>
            <div className="relative">
              <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />
              <div className="space-y-4">
                {TIMELINE_ITEMS.map((evt, i) => (
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

          {/* Evidence */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-text-primary">Digital Evidence</h2>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 uppercase tracking-wide">
                All Verified
              </span>
            </div>
            <div className="space-y-3">
              {EVIDENCE_ITEMS.map(ev => (
                <div key={ev.id} className="flex items-center gap-3 p-3 bg-elevated rounded-xl border border-border">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Shield size={14} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary">{ev.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-text-muted">{ev.id}</span>
                      <span className="text-text-dim">·</span>
                      <Hash size={9} className="text-text-muted" />
                      <span className="text-[10px] font-mono text-text-muted truncate">{ev.hash}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-success" />
                    <span className="text-[10px] font-semibold text-success">VERIFIED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="col-span-3 space-y-5">
          <div className="bg-card border border-danger/20 rounded-xl p-5 flex flex-col items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-4 self-start">Risk Score</p>
            <RiskGauge score={87} label="HIGH RISK" size={160} />
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">Threat Summary</p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Threat Type</span>
                <ThreatTypeBadge type="AI Voice" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Status</span>
                <StatusBadge level={resolved ? 'resolved' : 'blocked'} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Action Taken</span>
                <span className="text-xs font-medium text-text-primary">Transaction Held</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Transaction</span>
                <span className="text-xs font-mono text-text-primary">₹85,000</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">Integrity</p>
            <div className="space-y-2">
              {[
                { label: 'Audit Chain', status: 'Intact' },
                { label: 'Evidence Hash', status: 'Verified' },
                { label: 'Log Integrity', status: 'Confirmed' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-success" />
                    <span className="text-[10px] text-success font-semibold">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showEscalate && <EscalateModal onClose={() => setShowEscalate(false)} />}
    </div>
  );
}
