import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, Phone, Shield, ShieldAlert, AlertTriangle,
  CheckCircle2, XCircle, ArrowRight
} from 'lucide-react';
import { MiniSparkline } from '../components/Waveform';
import { StatusBadge, RiskScore, ThreatTypeBadge } from '../components/StatusBadge';
import { recentThreats, threatActivityData } from '../data';
import type { Page } from '../types';

const SPARKLINES = {
  calls:     [8, 9, 11, 10, 12, 11, 13, 12],
  analyzed:  [1100, 1140, 1180, 1200, 1220, 1240, 1265, 1284],
  threats:   [190, 205, 215, 220, 228, 235, 241, 247],
  prevented: [145, 152, 158, 165, 172, 179, 184, 189],
  highrisk:  [26, 27, 29, 28, 30, 31, 31, 32],
  failures:  [14, 14, 15, 16, 16, 17, 17, 18],
};

function KpiCard({
  label, value, trend, trendVal, icon: Icon, color, sparkData, sparkColor
}: {
  label: string; value: string; trend: 'up' | 'down'; trendVal: string;
  icon: React.ElementType; color: string; sparkData: number[]; sparkColor: string;
}) {
  const isGoodUp = label === 'CALLS ANALYZED' || label === 'ATTACKS PREVENTED' || label === 'ACTIVE CALLS';
  const trendColor = trend === 'up' ? (isGoodUp ? 'text-success' : 'text-danger') : 'text-success';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-border-strong transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-1">{label}</p>
          <p className="text-3xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-mono)' }}>{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
          <TrendIcon size={11} />
          <span className="font-medium">{trendVal} vs yesterday</span>
        </div>
        <MiniSparkline data={sparkData} color={sparkColor} />
      </div>
    </div>
  );
}

const kpis = [
  { label: 'ACTIVE CALLS',        value: '12',   trend: 'up',   trendVal: '+3',  icon: Phone,      color: 'bg-accent/10 text-accent-bright',  sparkData: SPARKLINES.calls,    sparkColor: '#3D7DF5' },
  { label: 'CALLS ANALYZED',      value: '1,284', trend: 'up',  trendVal: '+89', icon: Shield,     color: 'bg-success/10 text-success',        sparkData: SPARKLINES.analyzed, sparkColor: '#12B981' },
  { label: 'THREATS DETECTED',    value: '247',  trend: 'up',   trendVal: '+12', icon: ShieldAlert, color: 'bg-danger/10 text-danger',         sparkData: SPARKLINES.threats,  sparkColor: '#EF4444' },
  { label: 'ATTACKS PREVENTED',   value: '189',  trend: 'up',   trendVal: '+8',  icon: CheckCircle2, color: 'bg-success/10 text-success',      sparkData: SPARKLINES.prevented, sparkColor: '#12B981' },
  { label: 'HIGH-RISK EVENTS',    value: '32',   trend: 'up',   trendVal: '+2',  icon: AlertTriangle, color: 'bg-warning/10 text-warning',     sparkData: SPARKLINES.highrisk, sparkColor: '#F59E0B' },
  { label: 'VERIFICATION FAILURES', value: '18', trend: 'up',  trendVal: '+1',  icon: XCircle,    color: 'bg-danger/10 text-danger',           sparkData: SPARKLINES.failures, sparkColor: '#EF4444' },
];

const TIME_RANGES = ['5 MIN', '15 MIN', '1 HR', '24 HR', '7 DAYS'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card2 border border-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-[10px] text-text-muted mb-1 font-mono">{label}</p>
      <p className="text-sm font-semibold text-danger">{payload[0]?.value} threats</p>
      <p className="text-xs text-text-secondary">Risk: {payload[1]?.value}%</p>
    </div>
  );
}

interface DashboardProps {
  onNavigate: (page: Page, data?: any) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [timeRange, setTimeRange] = useState('24 HR');

  return (
    <div className="space-y-6 anim-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Security Overview</h1>
          <p className="text-sm text-text-muted mt-0.5">Real-time protection against synthetic voice and impersonation attacks.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-success status-blink" />
          <span className="font-mono">Last updated: 17:41:08</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi as any} />
        ))}
      </div>

      {/* Security Status + Graph */}
      <div className="grid grid-cols-3 gap-6">
        {/* Real-time status card */}
        <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-4">Real-Time Security Status</p>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-3 h-3">
              <span className="pulse-dot w-3 h-3 rounded-full bg-success block" />
            </div>
            <span className="text-xl font-bold text-success tracking-wide">PROTECTED</span>
          </div>

          {/* Security visualization */}
          <div className="relative flex items-center justify-center py-4 mb-5">
            <div className="absolute w-28 h-28 rounded-full border border-success/10 animate-pulse" />
            <div className="absolute w-20 h-20 rounded-full border border-success/20" />
            <div className="w-14 h-14 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L22 6V13C22 18 18.5 22.5 14 24C9.5 22.5 6 18 6 13V6L14 2Z" stroke="#12B981" strokeWidth="1.5" fill="none"/>
                <path d="M10 14L13 17L18 11" stroke="#12B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              'AI Voice Detection',
              'Speaker Verification',
              'Context Analysis',
              'Prevention Engine',
            ].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">{item}</span>
                <span className="text-[10px] font-semibold text-success uppercase tracking-wide">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Activity Graph */}
        <div className="col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-text-primary">Threat Activity</h2>
            <div className="flex gap-1">
              {TIME_RANGES.map(t => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all
                    ${timeRange === t ? 'bg-accent text-white' : 'text-text-muted hover:text-text-secondary hover:bg-elevated'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={threatActivityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3D7DF5" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3D7DF5" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2840" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#4A5A72', fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#4A5A72', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={2} fill="url(#threatGrad)" dot={false} activeDot={{ r: 4, fill: '#EF4444' }} />
              <Area type="monotone" dataKey="risk" stroke="#3D7DF5" strokeWidth={1.5} fill="url(#riskGrad)" dot={false} activeDot={{ r: 3, fill: '#3D7DF5' }} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-danger" />
              <span className="text-[10px] text-text-muted">Threat Count</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-accent" style={{ borderStyle: 'dashed' }} />
              <span className="text-[10px] text-text-muted">Risk Index</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Threats */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Recent Threats</h2>
          <button
            onClick={() => onNavigate('threat-center')}
            className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-bright transition-colors"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Time', 'Caller', 'Claimed Identity', 'Threat Type', 'Risk', 'Action', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentThreats.map((row, i) => (
              <tr
                key={row.id}
                onClick={() => onNavigate('threat-investigation', { id: row.id })}
                className="border-b border-border/50 hover:bg-elevated cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3.5 text-xs font-mono text-text-muted">{row.time}</td>
                <td className="px-4 py-3.5 text-xs font-mono text-text-secondary">{row.caller}</td>
                <td className="px-4 py-3.5 text-xs font-medium text-text-primary">{row.claimedIdentity}</td>
                <td className="px-4 py-3.5"><ThreatTypeBadge type={row.threatType} /></td>
                <td className="px-4 py-3.5"><RiskScore score={row.riskScore} size="sm" /></td>
                <td className="px-4 py-3.5 text-xs text-text-secondary">{row.action}</td>
                <td className="px-4 py-3.5"><StatusBadge level={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
