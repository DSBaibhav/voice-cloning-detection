/**
 * SecurityPoliciesView — Section 29 & 30 of Master Specification
 * Configurable policies, verification rules, and visual rule builder.
 */

import React, { useState } from 'react'
import { FileCheck2, Plus, Sliders, Check, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react'
import { INITIAL_POLICIES } from '../data/mockData'

export function SecurityPoliciesView() {
  const [policies, setPolicies] = useState(INITIAL_POLICIES)
  const [showBuilder, setShowBuilder] = useState(false)

  // Visual rule builder state
  const [ruleConditionMetric, setRuleConditionMetric] = useState('Risk Score')
  const [ruleConditionOp, setRuleConditionOp] = useState('>')
  const [ruleConditionVal, setRuleConditionVal] = useState('80')
  const [ruleAction, setRuleAction] = useState('Hold Transaction')

  const handleTogglePolicy = (id) => {
    setPolicies(policies.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)))
  }

  const handleCreateRule = () => {
    const newPolicy = {
      id: `POL-0${policies.length + 1}`,
      name: `Automated ${ruleAction} Rule`,
      enabled: true,
      condition: `WHEN [${ruleConditionMetric}] ${ruleConditionOp} [${ruleConditionVal}]`,
      actions: [ruleAction, 'Log Cryptographic Audit Trail'],
      priority: 'High',
      description: `Custom administrator rule triggered when ${ruleConditionMetric} exceeds ${ruleConditionVal}.`,
    }
    setPolicies([newPolicy, ...policies])
    setShowBuilder(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            Security Policies &amp; Verification Rules
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automate step-up identity challenges, call quarantines, and financial transaction freezes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBuilder(!showBuilder)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(2,132,199,0.35)] transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showBuilder ? 'Close Rule Builder' : 'New Security Policy'}</span>
        </button>
      </div>

      {/* Section 29: Visual Rule Builder */}
      {showBuilder && (
        <div
          className="p-6 rounded-3xl bg-slate-900/90 border border-sky-500/40 space-y-4 shadow-[0_0_30px_rgba(14,165,233,0.15)] animate-fade-in-up"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">Visual Policy Rule Builder</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-mono text-slate-400">WHEN</span>

            <select
              value={ruleConditionMetric}
              onChange={(e) => setRuleConditionMetric(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200"
            >
              <option>Risk Score</option>
              <option>Synthetic Voice Probability</option>
              <option>Speaker Identity Match</option>
              <option>Financial Transfer Request</option>
              <option>Credential Harvest Request</option>
            </select>

            <select
              value={ruleConditionOp}
              onChange={(e) => setRuleConditionOp(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 font-mono"
            >
              <option>&gt;</option>
              <option>&gt;=</option>
              <option>=</option>
              <option>&lt;</option>
            </select>

            <input
              type="text"
              value={ruleConditionVal}
              onChange={(e) => setRuleConditionVal(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200 font-mono w-24"
              placeholder="e.g. 80"
            />

            <span className="font-mono text-slate-400">THEN TRIGGER</span>

            <select
              value={ruleAction}
              onChange={(e) => setRuleAction(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-200"
            >
              <option>Hold Transaction</option>
              <option>Require Step-Up Verification</option>
              <option>Request Dynamic Security Phrase</option>
              <option>Send Push to Trusted Device</option>
              <option>Terminate Audio Trunk</option>
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleCreateRule}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-md"
            >
              Deploy Policy Rule
            </button>
          </div>
        </div>
      )}

      {/* Active Policies List */}
      <div className="space-y-4">
        {policies.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
            style={{
              background: 'var(--bg-surface)',
              borderColor: p.enabled ? 'var(--border)' : 'rgba(255,255,255,0.03)',
              opacity: p.enabled ? 1 : 0.6,
            }}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-sky-400">{p.id}</span>
                <h3 className="text-sm font-bold text-slate-100">{p.name}</h3>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded uppercase border ${
                    p.priority === 'Critical'
                      ? 'bg-rose-950 text-rose-400 border-rose-800'
                      : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}
                >
                  {p.priority}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
              <div className="inline-block p-2 rounded-xl bg-slate-900 border border-white/5 font-mono text-[11px] text-sky-300">
                {p.condition}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={p.enabled}
                  onChange={() => handleTogglePolicy(p.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600 relative" />
                <span className="text-xs font-mono font-medium text-slate-300">
                  {p.enabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
