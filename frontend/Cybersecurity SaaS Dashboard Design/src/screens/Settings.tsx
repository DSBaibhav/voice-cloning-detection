import { useState } from 'react';

const SECTIONS = ['Account', 'Organization', 'Security', 'Detection', 'Notifications', 'Privacy', 'Integrations', 'Access Control'];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-accent' : 'bg-elevated border border-border'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Slider({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1 bg-border rounded-full appearance-none cursor-pointer accent-accent"
      />
      <span className="text-xs font-mono font-semibold text-text-primary w-8 text-right">{value}%</span>
    </div>
  );
}

export function Settings() {
  const [activeSection, setActiveSection] = useState('Detection');
  const [settings, setSettings] = useState({
    syntheticVoiceThreshold: 70,
    speakerMatchThreshold: 85,
    riskThreshold: 75,
    autoBlockHighRisk: true,
    requireVerification: true,
    notifyHighRisk: true,
    notifySpeakerMismatch: true,
    notifyFinancialRequest: true,
    notifyVerificationFailure: true,
    realtimeAnalysis: true,
    contextAnalysis: true,
    behaviorAnalysis: true,
    conversationIntelligence: true,
    logAllCalls: true,
    retainAudioFingerprints: true,
    anonymizeCallerData: false,
  });

  const set = (key: keyof typeof settings, val: any) => setSettings(s => ({ ...s, [key]: val }));

  return (
    <div className="space-y-6 anim-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Configure platform behavior, detection thresholds, and security policies.</p>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Section nav */}
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

        {/* Content */}
        <div className="col-span-10 space-y-5">
          {activeSection === 'Detection' && (
            <>
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-text-primary mb-5">Detection Thresholds</h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-text-primary font-medium">Synthetic Voice Threshold</p>
                        <p className="text-xs text-text-muted">Alert when synthetic voice probability exceeds this value</p>
                      </div>
                    </div>
                    <Slider value={settings.syntheticVoiceThreshold} onChange={v => set('syntheticVoiceThreshold', v)} />
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-text-primary font-medium">Speaker Match Threshold</p>
                        <p className="text-xs text-text-muted">Minimum voice match percentage to confirm speaker identity</p>
                      </div>
                    </div>
                    <Slider value={settings.speakerMatchThreshold} onChange={v => set('speakerMatchThreshold', v)} />
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-text-primary font-medium">Risk Score Alert Threshold</p>
                        <p className="text-xs text-text-muted">Trigger high-risk response above this overall risk score</p>
                      </div>
                    </div>
                    <Slider value={settings.riskThreshold} onChange={v => set('riskThreshold', v)} />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-text-primary mb-5">Analysis Modules</h2>
                <div className="space-y-4">
                  {[
                    { key: 'realtimeAnalysis', label: 'Real-time Voice Analysis', desc: 'Process voice streams continuously during calls' },
                    { key: 'contextAnalysis', label: 'Context & Intent Analysis', desc: 'Detect suspicious topics and patterns in conversation' },
                    { key: 'behaviorAnalysis', label: 'Behavioral Analysis', desc: 'Monitor pitch, rhythm, and speech pattern anomalies' },
                    { key: 'conversationIntelligence', label: 'Conversation Intelligence', desc: 'Identify urgency, authority claims, and social engineering' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-primary font-medium">{item.label}</p>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </div>
                      <Toggle value={settings[item.key as keyof typeof settings] as boolean} onChange={v => set(item.key as any, v)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-sm font-semibold text-text-primary mb-5">Automated Responses</h2>
                <div className="space-y-4">
                  {[
                    { key: 'autoBlockHighRisk', label: 'Auto-block Critical Threats', desc: 'Automatically hold transactions for risk scores above 90' },
                    { key: 'requireVerification', label: 'Require Verification for High-Risk', desc: 'Mandate identity verification for risk scores above threshold' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-primary font-medium">{item.label}</p>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </div>
                      <Toggle value={settings[item.key as keyof typeof settings] as boolean} onChange={v => set(item.key as any, v)} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeSection === 'Notifications' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-5">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'notifyHighRisk', label: 'High-Risk Alert', desc: 'Notify when a call reaches high-risk threshold' },
                  { key: 'notifySpeakerMismatch', label: 'Speaker Mismatch', desc: 'Notify when voice does not match enrolled profile' },
                  { key: 'notifyFinancialRequest', label: 'Financial Request Detected', desc: 'Alert on suspicious financial requests during calls' },
                  { key: 'notifyVerificationFailure', label: 'Verification Failure', desc: 'Notify when identity verification fails' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-primary font-medium">{item.label}</p>
                      <p className="text-xs text-text-muted">{item.desc}</p>
                    </div>
                    <Toggle value={settings[item.key as keyof typeof settings] as boolean} onChange={v => set(item.key as any, v)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'Privacy' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-5">Privacy & Data Retention</h2>
              <div className="space-y-4">
                {[
                  { key: 'logAllCalls', label: 'Log All Calls', desc: 'Store metadata and analysis results for all processed calls' },
                  { key: 'retainAudioFingerprints', label: 'Retain Audio Fingerprints', desc: 'Keep cryptographic audio fingerprints for evidence' },
                  { key: 'anonymizeCallerData', label: 'Anonymize Caller Data', desc: 'Partially mask caller identifiers in reports' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-primary font-medium">{item.label}</p>
                      <p className="text-xs text-text-muted">{item.desc}</p>
                    </div>
                    <Toggle value={settings[item.key as keyof typeof settings] as boolean} onChange={v => set(item.key as any, v)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!['Detection', 'Notifications', 'Privacy'].includes(activeSection) && (
            <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
              <p className="text-sm font-semibold text-text-primary mb-2">{activeSection} Settings</p>
              <p className="text-xs text-text-muted">Configuration options for {activeSection.toLowerCase()} management will appear here.</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button className="px-5 py-2.5 rounded-xl border border-border text-text-secondary text-sm hover:bg-elevated transition-all">Reset to Defaults</button>
            <button className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-bright transition-all">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
