/**
 * IntegrationsView & DeveloperApi — Section 35 & 36 of Master Specification
 */

import React, { useState } from 'react'
import { Cpu, PhoneCall, Radio, Database, Bell, Terminal, KeyRound, Copy, Check } from 'lucide-react'

export function IntegrationsView() {
  const [copiedKey, setCopiedKey] = useState(false)

  const integrations = [
    { name: 'Enterprise SIP Trunk', type: 'Telephony', status: 'Connected', desc: 'Real-time media streaming from Cisco / Avaya PBX via TLS.' },
    { name: 'WebRTC Gateway', type: 'Voice Streaming', status: 'Connected', desc: 'In-browser agent customer call inspection.' },
    { name: 'Core Banking API', type: 'Financial Rails', status: 'Connected', desc: 'Allows automated transaction holds for suspicious wire transfers.' },
    { name: 'Slack Incident Alerts', type: 'Notifications', status: 'Connected', desc: 'Pushes critical impersonation alerts to #soc-incidents.' },
    { name: 'Splunk / SIEM Webhook', type: 'SIEM Log Export', status: 'Connected', desc: 'Streaming JSON audit events into enterprise security lake.' },
    { name: 'Okta / Azure AD SSO', type: 'Identity Provider', status: 'Configure', desc: 'Sync employee identity directory and authorized voice roles.' },
  ]

  const handleCopy = () => {
    navigator.clipboard.writeText('vx_live_9a8f1029c8e192038472910fa31c47b8')
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
          Enterprise Integrations &amp; Developer API
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Connect VoxGuard to your telephony trunks, banking cores, SIEM pipelines, and internal webhooks.
        </p>
      </div>

      {/* Integrations Grid (Section 35) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="p-5 rounded-3xl border flex flex-col justify-between space-y-4"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase">{item.type}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    item.status === 'Connected'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border-white/5'
                  }`}
                >
                  ● {item.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-2">{item.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
            </div>

            <button
              type="button"
              onClick={() => alert(`Configuring ${item.name}`)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-white/5 transition"
            >
              {item.status === 'Connected' ? 'Manage Connection' : 'Connect Integration'}
            </button>
          </div>
        ))}
      </div>

      {/* Developer API & Webhooks (Section 36) */}
      <div
        className="p-6 rounded-3xl space-y-4"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-sky-400" />
          <h3 className="text-sm font-bold text-slate-100">REST API &amp; Webhook Keys</h3>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Production API Key</span>
            <span className="font-mono text-xs text-slate-200">vx_live_9a8f1029c8e192038472910fa31c47b8</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied Key' : 'Copy Key'}</span>
          </button>
        </div>

        {/* Sample Webhook Payload */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Sample Outgoing Incident Webhook:</span>
          <pre className="p-4 rounded-2xl bg-slate-950 border border-white/5 font-mono text-xs text-sky-300 overflow-x-auto leading-relaxed">
{`POST /webhooks/threat
{
  "event": "THREAT_BLOCKED",
  "threat_id": "THR-84921",
  "risk_score": 87,
  "threat_type": "AI_VOICE_CLONE_FINANCIAL_SCAM",
  "caller_cli": "+91 98201 44521",
  "claimed_identity": "Rajesh Sharma",
  "action_enforced": "TRANSACTION_HELD",
  "sha256_evidence": "a91f7d8ce6b2910fae12089ef0437612b73c4d81726a3109e4f58c73294be421"
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}
