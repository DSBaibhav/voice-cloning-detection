import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { analyticsData, attackPatterns } from '../data';
import type { Page } from '../types';

const DATE_RANGES = ['7 Days', '30 Days', '90 Days', 'Custom'];

interface Props {
  onNavigate: (page: Page, data?: any) => void;
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card2 border border-border rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-text-primary">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.color }}>{payload[0].value}%</p>
    </div>
  );
}

export function ThreatAnalytics({ onNavigate }: Props) {
  const [range, setRange] = useState('7 Days');

  const topMetrics = [
    { label: 'Total Threats', value: 162, change: '+12%', up: true },
    { label: 'AI Voice Attacks', value: 61, change: '+18%', up: true },
    { label: 'Replay Attacks', value: 36, change: '-8%', up: false },
    { label: 'Identity Mismatches', value: 31, change: '+5%', up: true },
    { label: 'Social Engineering', value: 23, change: '+22%', up: true },
    { label: 'Blocked Actions', value: 141, change: '+10%', up: true },
  ];

  return (
    <div className="space-y-6 anim-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Threat Analytics</h1>
          <p className="text-sm text-text-muted mt-0.5">Comprehensive intelligence on attack trends and detection performance.</p>
        </div>
        <div className="flex gap-1">
          {DATE_RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${range === r ? 'bg-accent text-white' : 'bg-card border border-border text-text-muted hover:text-text-secondary'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-6 gap-4">
        {topMetrics.map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-semibold mb-2">{m.label}</p>
            <p className="text-2xl font-bold font-mono text-text-primary mb-1">{m.value}</p>
            <div className={`flex items-center gap-1 text-xs ${m.up ? 'text-danger' : 'text-success'}`}>
              <TrendingUp size={10} className={m.up ? '' : 'rotate-180'} />
              <span>{m.change} vs prev period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-3 gap-5">
        {/* Threats over time */}
        <div className="col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Threats Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData.weeklyThreats}>
              <defs>
                <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#12B981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#12B981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2840" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#4A5A72', fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#4A5A72', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0F1420', border: '1px solid #1C2840', borderRadius: 8, fontSize: 11 }} />
              <Area dataKey="threats" stroke="#EF4444" strokeWidth={2} fill="url(#ag1)" name="Detected" />
              <Area dataKey="blocked" stroke="#12B981" strokeWidth={1.5} fill="url(#ag2)" name="Blocked" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Threat types pie */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Threat Types</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={analyticsData.threatTypes} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
                {analyticsData.threatTypes.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {analyticsData.threatTypes.map(t => (
              <div key={t.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
                  <span className="text-xs text-text-secondary">{t.name}</span>
                </div>
                <span className="text-xs font-mono font-semibold text-text-primary">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-5">
        {/* Risk distribution */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Risk Score Distribution</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={analyticsData.riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2840" vertical={false} />
              <XAxis dataKey="range" tick={{ fill: '#4A5A72', fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#4A5A72', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0F1420', border: '1px solid #1C2840', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {analyticsData.riskDistribution.map((_, i) => (
                  <Cell key={i} fill={i >= 3 ? '#EF4444' : i >= 2 ? '#F59E0B' : '#3D7DF5'} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attack patterns preview */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Top Attack Patterns</h2>
            <button onClick={() => onNavigate('attack-patterns')} className="text-xs text-accent hover:text-accent-bright transition-colors">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {attackPatterns.map(p => (
              <div key={p.id} className="p-3 bg-elevated rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-text-primary">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-danger">{p.avgRisk} avg</span>
                    <span className="text-[10px] text-text-muted">{p.occurrences}x</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.signals.slice(0, 2).map(s => (
                    <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-border text-text-muted">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
