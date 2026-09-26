import { useState } from 'react';
import { Plus, Edit3, PauseCircle } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

interface Policy {
  id: string;
  name: string;
  conditions: string[];
  actions: string[];
  status: 'active' | 'inactive';
  triggeredCount: number;
}

const policies: Policy[] = [
  {
    id: 'pol-001',
    name: 'High-Risk Auto Hold',
    conditions: ['Risk Score > 80', 'Financial Request = TRUE'],
    actions: ['Require Verification', 'Hold Transaction'],
    status: 'active',
    triggeredCount: 47,
  },
  {
    id: 'pol-002',
    name: 'Speaker Mismatch Escalation',
    conditions: ['Speaker Match < 75%', 'Call Duration > 2 minutes'],
    actions: ['Trigger Verification', 'Alert Security Team'],
    status: 'active',
    triggeredCount: 23,
  },
  {
    id: 'pol-003',
    name: 'Synthetic Voice Block',
    conditions: ['Synthetic Voice Probability > 90%'],
    actions: ['Auto-Block Call', 'Log Evidence', 'Send Alert'],
    status: 'active',
    triggeredCount: 12,
  },
  {
    id: 'pol-004',
    name: 'Executive Impersonation Protocol',
    conditions: ['Claimed Identity = Executive', 'Risk Score > 60'],
    actions: ['Require Device Verification', 'Escalate to Manager'],
    status: 'inactive',
    triggeredCount: 8,
  },
];

function RuleBuilder() {
  const [conditions, setConditions] = useState([
    { field: 'Risk Score', op: '>', value: '80' },
    { field: 'Financial Request', op: '=', value: 'TRUE' },
  ]);
  const [actions, setActions] = useState(['Require Verification', 'Hold Transaction']);

  const FIELDS = ['Risk Score', 'Speaker Match', 'Synthetic Voice Probability', 'Financial Request', 'Claimed Identity', 'Call Duration'];
  const OPS = ['>', '<', '=', '≥', '≤', '≠'];
  const ACTIONS_LIST = ['Require Verification', 'Hold Transaction', 'End Call', 'Escalate', 'Alert Team', 'Log Evidence', 'Auto-Block'];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-text-primary mb-4">New Policy Builder</h2>

      {/* Conditions */}
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">WHEN</p>
        <div className="space-y-2">
          {conditions.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-[10px] font-bold text-accent w-8 text-center">AND</span>}
              {i === 0 && <span className="w-8" />}
              <select
                value={c.field}
                className="flex-1 bg-elevated border border-border rounded-lg py-2 px-3 text-xs text-text-secondary focus:outline-none focus:border-accent/50"
              >
                {FIELDS.map(f => <option key={f}>{f}</option>)}
              </select>
              <select
                value={c.op}
                className="w-16 bg-elevated border border-border rounded-lg py-2 px-2 text-xs text-text-secondary focus:outline-none focus:border-accent/50"
              >
                {OPS.map(o => <option key={o}>{o}</option>)}
              </select>
              <input
                value={c.value}
                className="w-24 bg-elevated border border-border rounded-lg py-2 px-3 text-xs text-text-secondary focus:outline-none focus:border-accent/50"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setConditions(c => [...c, { field: 'Risk Score', op: '>', value: '70' }])}
          className="mt-2 text-xs text-accent hover:text-accent-bright flex items-center gap-1 transition-colors"
        >
          <Plus size={11} /> Add condition
        </button>
      </div>

      {/* Actions */}
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">THEN</p>
        <div className="space-y-2">
          {actions.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-[10px] font-bold text-purple w-8 text-center">AND</span>}
              {i === 0 && <span className="w-8" />}
              <select
                value={a}
                className="flex-1 bg-elevated border border-border rounded-lg py-2 px-3 text-xs text-text-secondary focus:outline-none focus:border-accent/50"
              >
                {ACTIONS_LIST.map(ac => <option key={ac}>{ac}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button
          onClick={() => setActions(a => [...a, 'Alert Team'])}
          className="mt-2 text-xs text-accent hover:text-accent-bright flex items-center gap-1 transition-colors"
        >
          <Plus size={11} /> Add action
        </button>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 py-2.5 rounded-xl border border-border text-text-secondary text-sm hover:bg-elevated transition-all">Cancel</button>
        <button className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-bright transition-all">Save Policy</button>
      </div>
    </div>
  );
}

export function SecurityPolicies() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="space-y-6 anim-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Security Policies</h1>
          <p className="text-sm text-text-muted mt-0.5">Automated rules that govern threat response and verification workflows.</p>
        </div>
        <button
          onClick={() => setShowBuilder(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-accent rounded-xl text-white text-xs font-semibold hover:bg-accent-bright transition-all"
        >
          <Plus size={14} /> Create Policy
        </button>
      </div>

      {showBuilder && <RuleBuilder />}

      <div className="space-y-4">
        {policies.map(policy => (
          <div key={policy.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-sm font-semibold text-text-primary">{policy.name}</h2>
                  <StatusBadge level={policy.status} />
                </div>
                <p className="text-xs text-text-muted">Triggered {policy.triggeredCount} times this month</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-text-muted text-xs hover:text-text-secondary hover:bg-elevated transition-all">
                  <Edit3 size={11} /> Edit
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-text-muted text-xs hover:text-text-secondary hover:bg-elevated transition-all">
                  <PauseCircle size={11} /> {policy.status === 'active' ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">WHEN</p>
                <div className="space-y-1.5">
                  {policy.conditions.map((c, i) => (
                    <div key={c} className="flex items-center gap-2">
                      {i > 0 && <span className="text-[9px] font-bold text-accent-bright">AND</span>}
                      <div className={`px-3 py-1.5 bg-elevated border border-border rounded-lg text-xs text-text-secondary ${i > 0 ? '' : ''}`}>
                        {c}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">THEN</p>
                <div className="space-y-1.5">
                  {policy.actions.map((a, i) => (
                    <div key={a} className="flex items-center gap-2">
                      {i > 0 && <span className="text-[9px] font-bold text-purple">AND</span>}
                      <div className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-xs text-accent-bright">
                        {a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
