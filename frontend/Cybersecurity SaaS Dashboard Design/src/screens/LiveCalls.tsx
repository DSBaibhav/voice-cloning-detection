import { Phone, Clock, ArrowRight } from 'lucide-react';
import { StatusBadge, RiskScore } from '../components/StatusBadge';
import { Waveform } from '../components/Waveform';
import { liveCalls } from '../data';
import type { Page } from '../types';

interface LiveCallsProps {
  onNavigate: (page: Page, data?: any) => void;
}

function RiskBar({ value }: { value: number }) {
  const color = value >= 70 ? '#EF4444' : value >= 50 ? '#F59E0B' : '#12B981';
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-mono font-semibold" style={{ color }}>{value}%</span>
    </div>
  );
}

export function LiveCalls({ onNavigate }: LiveCallsProps) {
  return (
    <div className="space-y-6 anim-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Live Calls</h1>
          <p className="text-sm text-text-muted mt-0.5">Monitor active conversations and real-time authentication signals.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success status-blink" />
          <span className="text-xs font-semibold text-success">{liveCalls.length} ACTIVE</span>
        </div>
      </div>

      {/* Call cards */}
      <div className="grid grid-cols-2 gap-4">
        {liveCalls.map((call) => {
          const isHighRisk = call.status === 'high-risk';
          const isSuspicious = call.status === 'suspicious';
          return (
            <div
              key={call.id}
              className={`bg-card border rounded-xl p-5 cursor-pointer hover:border-border-strong transition-all group ${
                isHighRisk ? 'border-danger/30 hover:border-danger/50' :
                isSuspicious ? 'border-warning/30 hover:border-warning/50' :
                'border-border'
              }`}
              onClick={() => isHighRisk || isSuspicious ? onNavigate('live-call-analysis') : undefined}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Phone size={13} className="text-text-muted" />
                    <span className="text-sm font-mono text-text-secondary">{call.caller}</span>
                  </div>
                  <p className="text-base font-semibold text-text-primary">{call.claimedIdentity}</p>
                </div>
                <StatusBadge level={call.status} size="md" />
              </div>

              {/* Waveform */}
              <div className="mb-4 py-2 px-1">
                <Waveform
                  bars={28}
                  height={52}
                  animated={call.status === 'high-risk' || call.status === 'suspicious'}
                  color={
                    isHighRisk ? '#EF4444' :
                    isSuspicious ? '#F59E0B' :
                    '#12B981'
                  }
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-1">Voice Authenticity</p>
                  <RiskBar value={call.voiceAuthenticity} />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-1">Speaker Match</p>
                  <RiskBar value={call.speakerMatch} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-text-muted" />
                    <span className="text-xs font-mono text-text-muted">{call.duration}</span>
                  </div>
                  <div className="text-xs text-text-muted">
                    Context: <span className={`font-medium ${call.contextRisk === 'high' ? 'text-danger' : call.contextRisk === 'medium' ? 'text-warning' : 'text-success'}`}>
                      {call.contextRisk.charAt(0).toUpperCase() + call.contextRisk.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted">Risk:</span>
                  <RiskScore score={call.overallRisk} size="sm" />
                  {(isHighRisk || isSuspicious) && (
                    <ArrowRight size={14} className="text-text-muted group-hover:text-accent transition-colors" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table view */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">All Active Calls</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Caller', 'Claimed Identity', 'Duration', 'Voice Auth.', 'Speaker Match', 'Context Risk', 'Overall Risk', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {liveCalls.map(call => (
              <tr
                key={call.id}
                className="border-b border-border/50 hover:bg-elevated cursor-pointer transition-colors"
                onClick={() => (call.status === 'high-risk' || call.status === 'suspicious') && onNavigate('live-call-analysis')}
              >
                <td className="px-4 py-3.5 text-xs font-mono text-text-secondary">{call.caller}</td>
                <td className="px-4 py-3.5 text-xs font-medium text-text-primary">{call.claimedIdentity}</td>
                <td className="px-4 py-3.5 text-xs font-mono text-text-muted">{call.duration}</td>
                <td className="px-4 py-3.5"><RiskBar value={call.voiceAuthenticity} /></td>
                <td className="px-4 py-3.5"><RiskBar value={call.speakerMatch} /></td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium capitalize ${call.contextRisk === 'high' ? 'text-danger' : call.contextRisk === 'medium' ? 'text-warning' : 'text-success'}`}>
                    {call.contextRisk}
                  </span>
                </td>
                <td className="px-4 py-3.5"><RiskScore score={call.overallRisk} size="sm" /></td>
                <td className="px-4 py-3.5"><StatusBadge level={call.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
