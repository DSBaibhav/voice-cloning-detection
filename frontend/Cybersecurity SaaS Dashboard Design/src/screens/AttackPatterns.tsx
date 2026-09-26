import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { attackPatterns } from '../data';
import type { Page } from '../types';

interface Props {
  onNavigate: (page: Page, data?: any) => void;
}

export function AttackPatterns({ onNavigate }: Props) {
  return (
    <div className="space-y-6 anim-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Attack Pattern Intelligence</h1>
        <p className="text-sm text-text-muted mt-0.5">Recurring attack signatures detected across voice security incidents.</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {attackPatterns.map(pattern => (
          <div key={pattern.id} className="bg-card border border-border rounded-xl p-5 hover:border-border-strong transition-all">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-sm font-semibold text-text-primary leading-snug flex-1 mr-3">{pattern.name}</h2>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg ${
                pattern.trend === 'up' ? 'bg-danger/10 text-danger' :
                pattern.trend === 'down' ? 'bg-success/10 text-success' :
                'bg-elevated text-text-muted'
              }`}>
                {pattern.trend === 'up' ? <TrendingUp size={10} /> : pattern.trend === 'down' ? <TrendingDown size={10} /> : <Minus size={10} />}
                {pattern.trend === 'up' ? 'Rising' : pattern.trend === 'down' ? 'Declining' : 'Stable'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-elevated rounded-xl text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-1">Occurrences</p>
                <p className="text-2xl font-bold font-mono text-text-primary">{pattern.occurrences}</p>
              </div>
              <div className="p-3 bg-elevated rounded-xl text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-1">Avg Risk</p>
                <p className="text-2xl font-bold font-mono text-danger">{pattern.avgRisk}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">Common Signals</p>
              <div className="space-y-1.5">
                {pattern.signals.map(signal => (
                  <div key={signal} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-danger shrink-0" />
                    <span className="text-xs text-text-secondary">{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-text-muted mb-4">
              First seen: <span className="text-text-secondary">{pattern.firstSeen}</span> ·
              Last seen: <span className="text-text-secondary ml-1">{pattern.lastSeen}</span>
            </div>

            <button
              onClick={() => onNavigate('threat-center')}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-accent/30 text-accent-bright text-xs font-semibold hover:bg-accent/10 transition-all"
            >
              View Cases <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary panel */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Pattern Intelligence Summary</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Patterns Identified', value: '3', color: 'text-text-primary' },
            { label: 'Total Occurrences', value: '38', color: 'text-text-primary' },
            { label: 'Highest Avg Risk', value: '82', color: 'text-danger' },
            { label: 'Rising Patterns', value: '1', color: 'text-danger' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 bg-elevated rounded-xl">
              <p className={`text-2xl font-bold font-mono ${s.color} mb-1`}>{s.value}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
