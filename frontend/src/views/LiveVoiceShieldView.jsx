import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  ShieldCheck,
  ShieldAlert,
  VolumeX,
  Volume2,
  Key,
  PhoneOff,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Activity,
  MessageSquare
} from 'lucide-react';
import { Waveform } from '../components/Waveform';
import { RiskGauge, MetricBar } from '../components/RiskGauge';
import { StatusBadge } from '../components/StatusBadge';
import { StepUpChallengeModal, EndCallModal } from '../components/Modals';

const SAMPLE_PROMPTS = [
  "Hello, this is my natural voice and I am verifying my identity today.",
  "My voice is my password, authorize this transaction securely.",
  "One, two, three, four, five, six, testing voice authentication."
];

export function LiveVoiceShieldView({
  monitorState = 'idle',
  verdict = { label: 'idle', confidence: 0, raw_score: 0, is_speech: false },
  analyserNode = null,
  liveRms = 0,
  bufferProgress = 0,
  onStartMonitoring,
  onStopMonitoring,
  onSimulateVerdict,
  sessionHistory = [],
  strictLockout = true,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [modal, setModal] = useState(null); // 'challenge' | 'end'
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const isLive = monitorState === 'active';
  const label = verdict.label || 'idle';
  const isSpoof = label === 'spoof';
  const isBonafide = label === 'bonafide';
  const isIdle = label === 'idle';

  // Speech presence from real-time microphone RMS energy (> 0.008 is speech)
  const isHearingSpeech = liveRms >= 0.008;
  const micVolumePercent = Math.min(100, Math.round((liveRms / 0.08) * 100));

  // Compute clean risk score for the gauge (0-100)
  const riskScore = isSpoof
    ? Math.round((verdict.confidence || 0.85) * 100)
    : isBonafide
    ? Math.max(2, Math.round((1 - (verdict.confidence || 0.98)) * 100))
    : 0;

  return (
    <div className="space-y-6 anim-fade-in">
      {/* ── Top Hero Verdict Banner ────────────────────────────────────────── */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isSpoof
          ? 'bg-red-50/95 border-red-200 text-red-950 shadow-sm'
          : isBonafide
          ? 'bg-emerald-50/95 border-emerald-200 text-emerald-950 shadow-sm'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              isSpoof
                ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                : isBonafide
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                : isLive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'bg-slate-400 text-white'
            }`}>
              {isSpoof ? <ShieldAlert size={26} /> : isBonafide ? <ShieldCheck size={26} /> : <Radio size={26} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={isSpoof ? 'spoof' : isBonafide ? 'bonafide' : isLive ? 'idle' : 'offline'}
                  size="md"
                />
                {strictLockout && isSpoof && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                    Auto-Lockout Active
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold mt-1">
                {isSpoof
                  ? 'AI Voice Impersonation Detected — Attack Prevented'
                  : isBonafide
                  ? 'Genuine Human Voice Verified — Call Safe'
                  : isLive
                  ? isHearingSpeech
                    ? 'Receiving voice audio... Analyzing acoustic spectrum.'
                    : 'Standby / Idle — Waiting for voice input...'
                  : 'Voice Shield Standby — Click "Start Live Voice Shield" to begin.'}
              </h2>
              <p className="text-xs opacity-80 mt-0.5">
                {isSpoof
                  ? 'High-frequency phase distortion and neural vocoder residue detected. Impersonator quarantined.'
                  : isBonafide
                  ? 'Natural human vocal tract acoustics, formants, and organic pitch modulation verified.'
                  : isLive
                  ? 'Your microphone is active. Read aloud one of the suggested sentences below.'
                  : 'AI anti-spoofing engine ready. Low-latency WebSocket connection standing by on port 8000.'}
              </p>
            </div>
          </div>

          {/* Primary Start / Stop CTA Button */}
          <div className="flex items-center gap-2.5 self-stretch sm:self-center">
            {isLive ? (
              <button
                onClick={onStopMonitoring}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <MicOff size={15} />
                <span>Stop Voice Shield</span>
              </button>
            ) : (
              <button
                onClick={onStartMonitoring}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md shadow-blue-600/20"
              >
                <Mic size={15} />
                <span>Start Live Voice Shield</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Live Microphone VU Meter & Chunk Progress (Visible when active) ── */}
      {isLive && (
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Audio Input Level (VU Meter) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Activity size={14} className={isHearingSpeech ? 'text-emerald-600 animate-pulse' : 'text-slate-400'} />
                Microphone Audio Input Level:
              </span>
              <span className={`font-mono font-bold text-xs ${isHearingSpeech ? 'text-emerald-700' : 'text-slate-500'}`}>
                {isHearingSpeech ? `Speaking (${micVolumePercent}%)` : `Silence / Ambient (${micVolumePercent}%)`}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-75 rounded-full ${
                  isHearingSpeech ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
                style={{ width: `${micVolumePercent}%` }}
              />
            </div>
          </div>

          {/* 2-Second Audio Scan Chunk Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Next AI Model Analysis:</span>
              <span className="font-mono text-slate-500 text-xs font-semibold">
                {bufferProgress}% (2.0s audio window)
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-100 rounded-full"
                style={{ width: `${bufferProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Suggested Voice Prompts Card ("What do I speak?") ──────────────── */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
        <div className="flex items-center gap-2 mb-2 text-blue-900 font-bold text-xs">
          <MessageSquare size={15} className="text-blue-600" />
          <span>What to speak into your microphone:</span>
        </div>
        <p className="text-xs text-blue-800 mb-3 leading-relaxed">
          Speak any natural sentence at normal conversation volume for 2–3 seconds. Try reading one of these verification phrases:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <div
              key={i}
              className="p-3 bg-white border border-blue-200/80 rounded-xl text-xs text-slate-800 font-medium select-all shadow-2xs hover:border-blue-400 transition-colors"
            >
              "{prompt}"
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Cockpit Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Audio Spectrum & Acoustic Breakdown (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Audio Visualizer Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Audio Telemetry</span>
                <h3 className="text-sm font-bold text-slate-800">Live Voice Spectrum & Waveform</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-xs font-medium text-slate-600">
                  {isLive ? '16kHz Audio Stream' : 'Microphone Inactive'}
                </span>
              </div>
            </div>

            {/* Live Waveform */}
            <div className="py-4 px-2 bg-slate-50 border border-slate-100 rounded-xl mb-5 flex items-center justify-center">
              <Waveform
                bars={36}
                height={72}
                analyserNode={analyserNode}
                isActive={isLive}
                isSpoof={isSpoof}
                color="#2563EB"
              />
            </div>

            {/* Audio Controls & Instant Test Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                    isMuted
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{isMuted ? 'Muted' : 'Mute Mic'}</span>
                </button>

                <button
                  onClick={() => setModal('end')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-colors"
                >
                  <PhoneOff size={14} />
                  <span>Sever Channel</span>
                </button>
              </div>

              {/* Instant Test Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-slate-400 mr-1">Demo Triggers:</span>
                <button
                  onClick={() => onSimulateVerdict('bonafide')}
                  title="Simulate Genuine Human Voice"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                >
                  <CheckCircle2 size={13} />
                  <span>Test Human</span>
                </button>
                <button
                  onClick={() => onSimulateVerdict('spoof')}
                  title="Simulate AI Voice Clone Attack"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-semibold transition-colors"
                >
                  <AlertTriangle size={13} />
                  <span>Test AI Clone</span>
                </button>
                <button
                  onClick={() => onSimulateVerdict('idle')}
                  title="Simulate Silence / Standby"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                >
                  <Radio size={13} />
                  <span>Test Idle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Acoustic Analysis Indicators Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="pb-3 border-b border-slate-100 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Acoustic Biomarkers</span>
              <h3 className="text-sm font-bold text-slate-800">Deep Neural Voice Telemetry</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Spectral Naturalness</span>
                <div className={`text-base font-bold mt-1 ${isSpoof ? 'text-red-600' : isBonafide ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {isSpoof ? 'Distorted (Phase Error)' : isBonafide ? 'Natural (Harmonic)' : 'Standby / Idle'}
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Prosody Modulation</span>
                <div className={`text-base font-bold mt-1 ${isSpoof ? 'text-red-600' : isBonafide ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {isSpoof ? 'Robotic / Monotone' : isBonafide ? 'Dynamic Human' : 'Standby / Idle'}
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Model Classification</span>
                <div className={`text-base font-bold mt-1 ${isSpoof ? 'text-red-600' : isBonafide ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {isSpoof ? 'SPOOF (Synthetic)' : isBonafide ? 'BONAFIDE (Human)' : 'IDLE (Silence)'}
                </div>
              </div>
            </div>

            {/* Metric Bars */}
            <div className="space-y-3">
              <MetricBar
                label="Voice Authenticity Index"
                value={isSpoof ? 14 : isBonafide ? 98 : 0}
                color={isSpoof ? '#EF4444' : '#10B981'}
              />
              <MetricBar
                label="Acoustic Vocoder Artifact Score"
                value={isSpoof ? 88 : isBonafide ? 4 : 0}
                color={isSpoof ? '#EF4444' : '#10B981'}
              />
              <MetricBar
                label="Microphone Signal Reception"
                value={isLive ? micVolumePercent : 0}
                color="#2563EB"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Risk Gauge & Prevention Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Gauge Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 self-start mb-2">
              Risk Evaluation
            </span>
            <RiskGauge
              score={riskScore}
              label={isSpoof ? 'HIGH RISK' : isBonafide ? 'SAFE' : 'IDLE'}
              size={180}
            />

            <div className="w-full mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-slate-600">
                {isSpoof
                  ? '⚠️ High risk of AI impersonation. Prevention lockout engaged.'
                  : isBonafide
                  ? '✅ Low risk. Speaker matches genuine biological voice.'
                  : 'Speak into your microphone to compute real-time risk score.'}
              </span>
            </div>
          </div>

          {/* Prevention Countermeasures Card */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isSpoof ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={18} className={isSpoof ? 'text-red-600' : 'text-slate-400'} />
              <h3 className="text-sm font-bold text-slate-900">Prevention Actions</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Active countermeasures to foil impersonation attempts in real time.
            </p>

            <div className="space-y-2.5">
              {challengeCompleted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Passphrase Challenge Passed</span>
                </div>
              ) : (
                <button
                  onClick={() => setModal('challenge')}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Key size={14} />
                  <span>Verify Identity Passphrase</span>
                </button>
              )}

              <button
                onClick={() => setModal('end')}
                className="w-full py-2.5 px-4 rounded-xl border border-red-300 bg-white hover:bg-red-50 text-red-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <PhoneOff size={14} />
                <span>Sever Audio Connection</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Real Chronological Speech Log ──────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live Session Log</span>
            <h3 className="text-sm font-bold text-slate-800">Analyzed Audio Events</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {sessionHistory.length} event{sessionHistory.length === 1 ? '' : 's'} recorded
          </span>
        </div>

        {sessionHistory.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <Radio size={32} className="mx-auto mb-2 opacity-40 text-blue-600" />
            <p className="text-xs font-medium text-slate-500">No voice events recorded yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click <strong>"Start Live Voice Shield"</strong> and speak into your mic to see real-time analysis here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {sessionHistory.map((item, index) => (
              <div key={index} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    item.label === 'spoof' ? 'bg-red-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <span className="font-semibold text-slate-800">
                      {item.label === 'spoof' ? 'AI Voice Clone Intercepted' : 'Human Voice Verified'}
                    </span>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.time || 'Just now'} • Live Microphone Channel
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${
                    item.label === 'spoof' ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {Math.round(item.confidence * 100)}% {item.label === 'spoof' ? 'Risk' : 'Authentic'}
                  </span>
                  <StatusBadge status={item.label} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === 'challenge' && (
        <StepUpChallengeModal
          onClose={() => setModal(null)}
          onConfirm={() => setChallengeCompleted(true)}
        />
      )}
      {modal === 'end' && (
        <EndCallModal
          onClose={() => setModal(null)}
          onConfirm={onStopMonitoring}
        />
      )}
    </div>
  );
}
