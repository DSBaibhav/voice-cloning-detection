/**
 * LiveCallAnalysisView — Section 10 to 22 of Master Specification
 * The most important screen in the platform:
 * - Live Audio Waveform & stream quality indicators
 * - Voice Authenticity card (Synthetic voice probability & vocoder anomalies)
 * - Speaker Identity Verification (Claimed identity vs voiceprint match)
 * - Voice Behavior & Prosody analysis
 * - Conversation Intelligence & Live Transcript with AI threat tags
 * - Central Model Risk Estimate (0-100) & attribution breakdown
 * - "Why This Call Was Flagged" expandable evidence panel
 * - Real-Time Threat Timeline
 * - Prevention Center Action Bar ([HOLD TRANSACTION], [VERIFY IDENTITY], etc.)
 */

import React, { useState, useEffect, useRef } from 'react'
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldAlert,
  AlertTriangle,
  Fingerprint,
  Activity,
  CheckCircle2,
  Lock,
  Pause,
  Play,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  Sliders,
  Radio,
  Clock
} from 'lucide-react'
import { RiskGauge } from '../components/common/RiskGauge'
import { HoldTransactionModal } from '../components/modals/HoldTransactionModal'
import { StepUpVerificationModal } from '../components/modals/StepUpVerificationModal'
import { AnalysisDetailsModal } from '../components/modals/AnalysisDetailsModal'
import { ThreatBadge } from '../components/common/ThreatBadge'

export function LiveCallAnalysisView({
  simScenario,
  simStepIndex = 0,
  onTriggerSimulationAction,
  onNavigate,
  isLiveMicActive = false,
  liveMicScore = 0,
  liveMicVerdict = 'idle',
  analyserNode = null,
}) {
  // Modal states
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isWhyFlaggedOpen, setIsWhyFlaggedOpen] = useState(true)

  // Call states
  const [isMuted, setIsMuted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [transcriptSearch, setTranscriptSearch] = useState('')
  const [transactionHeld, setTransactionHeld] = useState(false)
  const [escalated, setEscalated] = useState(false)

  // Waveform canvas ref
  const canvasRef = useRef(null)

  // Simulation derived state
  const scenario = simScenario || {
    caller: 'Unknown Caller (+91 98201 44521)',
    phone: '+91 98201 44521',
    claimedIdentity: 'Rajesh Sharma',
    claimedRole: 'Chief Financial Officer',
    durationTotal: 18,
    steps: []
  }

  const currentStep = scenario.steps ? (scenario.steps[simStepIndex] || scenario.steps[scenario.steps.length - 1] || {}) : {}

  const currentRisk = isLiveMicActive
    ? Math.round(liveMicScore * 100)
    : (currentStep.risk ?? 87)

  const currentSyntheticProb = isLiveMicActive
    ? Math.round(liveMicScore * 100)
    : (currentStep.syntheticProb ?? 84)

  const currentSpeakerMatch = isLiveMicActive
    ? (liveMicVerdict === 'bonafide' ? 95 : 42)
    : (currentStep.speakerMatch ?? 41)

  const currentContextRisk = isLiveMicActive ? 15 : (currentStep.contextRisk ?? 78)

  // Waveform animation loop
  useEffect(() => {
    let animId
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width
      const h = canvas.height
      const mid = h / 2

      ctx.lineWidth = 2
      ctx.strokeStyle = currentRisk >= 75 ? '#f43f5e' : currentRisk >= 50 ? '#f59e0b' : '#38bdf8'
      ctx.beginPath()

      const slices = 60
      const sliceWidth = w / slices
      let x = 0

      for (let i = 0; i < slices; i++) {
        const timeFactor = Date.now() / 200
        const amp = isPaused || isMuted
          ? 2
          : Math.sin(i * 0.3 + timeFactor) * 20 * (currentRisk > 50 ? 1.5 : 0.8) +
            Math.cos(i * 0.6 - timeFactor) * 12

        const y = mid + amp
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        x += sliceWidth
      }

      ctx.stroke()
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [isPaused, isMuted, currentRisk])

  // Transcript lines
  const transcriptList = scenario.steps
    ? scenario.steps.slice(0, simStepIndex + 1)
    : []

  const filteredTranscript = transcriptList.filter(
    (t) => !transcriptSearch || t.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* ── Top Call Info Bar ────────────────────────────────────────────── */}
      <div
        className="p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-sky-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE INBOUND TRUNK
              </span>
              <span className="text-xs text-slate-400 font-mono">CALL-9014</span>
            </div>
            <div className="text-base font-bold text-slate-100 mt-0.5">
              {scenario.claimedIdentity} <span className="text-xs text-slate-400 font-normal">({scenario.claimedRole})</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">{scenario.caller}</div>
          </div>
        </div>

        {/* Live Call Duration & Badges */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block">
              Call Elapsed
            </span>
            <span className="text-lg font-mono font-bold text-slate-100">
              {currentStep.time || '04:37'}
            </span>
          </div>

          <div className="h-8 w-px bg-white/10" />

          {transactionHeld ? (
            <span className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-600/50 text-xs font-mono font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              TRANSACTION HELD
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-600/50 text-xs font-mono font-bold">
              STEP-UP VERIFICATION TRIGGERED
            </span>
          )}
        </div>
      </div>

      {/* ── Two Column Architecture (Section 10) ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left / Center Column (7 cols): Audio Waveform & Intelligence ──── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 11: Live Audio Waveform Card */}
          <div
            className="p-6 rounded-3xl space-y-4 relative overflow-hidden"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100">Live Audio Stream &amp; Spectral Oscilloscope</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                  16 kHz Mono Float32
                </span>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-white/10"
                  title={isPaused ? 'Resume stream' : 'Pause stream'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-white/10"
                  title={isMuted ? 'Unmute stream' : 'Mute stream'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              </div>
            </div>

            {/* Canvas Oscilloscope */}
            <div className="h-32 w-full rounded-2xl bg-slate-950/80 border border-white/5 relative flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                width={700}
                height={128}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400">
                DSP Buffer Latency: 18ms
              </div>
            </div>

            {/* Audio Stream Telemetry Underneath (Section 11) */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono block">Stream Quality</span>
                <span className="font-mono font-bold text-slate-200 text-sm">96%</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono block">Signal Integrity</span>
                <span className="font-mono font-bold text-slate-200 text-sm">89%</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono block">Ambient Noise Floor</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">Low (Clean)</span>
              </div>
            </div>
          </div>

          {/* Section 12 & 13: Dual Cards: Voice Authenticity vs Speaker Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Voice Authenticity (Section 12) */}
            <div
              className="p-5 rounded-3xl space-y-4 flex flex-col justify-between"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Voice Authenticity
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-800">
                    HIGH SUSPICION
                  </span>
                </div>

                <div className="my-3">
                  <div className="text-3xl font-extrabold font-mono text-rose-400">
                    {currentSyntheticProb}%
                  </div>
                  <div className="text-xs text-slate-300 font-medium">Synthetic Voice Probability</div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Spectral Consistency:</span>
                    <span className="font-mono text-amber-400 font-bold">⚠️ Anomaly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prosody Consistency:</span>
                    <span className="font-mono text-amber-400 font-bold">⚠️ Anomaly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Natural Variation:</span>
                    <span className="font-mono text-amber-400 font-bold">⚠️ Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Speech Artifacts:</span>
                    <span className="font-mono text-rose-400 font-bold">⚠️ Detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Replay Indicators:</span>
                    <span className="font-mono text-emerald-400 font-bold">✓ Not Detected</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(true)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-sky-400 border border-white/5 transition flex items-center justify-center gap-1.5"
              >
                <span>View Analysis Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Speaker Verification (Section 13) */}
            <div
              className="p-5 rounded-3xl space-y-4 flex flex-col justify-between"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Speaker Identity
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                    IDENTITY MISMATCH
                  </span>
                </div>

                <div className="my-3">
                  <div className="text-3xl font-extrabold font-mono text-amber-400">
                    {currentSpeakerMatch}%
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    Current Voiceprint Match <span className="text-slate-400">(Expected 94%)</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Claimed Identity:</span>
                    <span className="font-semibold text-slate-200">Rajesh Sharma</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voiceprint Similarity:</span>
                    <span className="font-mono text-amber-400 font-bold">{currentSpeakerMatch}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Historical Consistency:</span>
                    <span className="font-mono text-slate-300">64%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Biometric Confidence:</span>
                    <span className="font-mono text-slate-300">89%</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(true)}
                className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(2,132,199,0.35)] transition flex items-center justify-center gap-1.5"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Verify Identity (Step-Up)</span>
              </button>
            </div>
          </div>

          {/* Section 15: Prosody & Voice Behavior Analysis */}
          <div
            className="p-5 rounded-3xl space-y-3"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100">Voice Behavior &amp; Prosodic Dynamics</span>
              <span className="text-[10px] font-mono text-slate-400">Real-time Latent Jitter</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">Pitch Variation</span>
                <span className="font-mono font-bold text-amber-400">14.2 Hz (Flat)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">Speaking Rate</span>
                <span className="font-mono font-bold text-slate-200">156 WPM</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">Pause Frequency</span>
                <span className="font-mono font-bold text-rose-400">Anomalous (1.1s)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-mono">Stress Patterns</span>
                <span className="font-mono font-bold text-amber-400">Synthetic Shelf</span>
              </div>
            </div>
          </div>

          {/* Section 16 & 17: Live Transcript & Conversational Threat Intelligence */}
          <div
            className="p-5 rounded-3xl space-y-4"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Conversation Intelligence &amp; Live Transcript</h3>
                <p className="text-xs text-slate-400">Automated social engineering, urgency, and financial intent detection</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={transcriptSearch}
                    onChange={(e) => setTranscriptSearch(e.target.value)}
                    placeholder="Filter transcript…"
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none w-36"
                  />
                </div>
              </div>
            </div>

            {/* Transcript Feed */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-2">
              {filteredTranscript.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Waiting for live conversational speech audio…
                </div>
              ) : (
                filteredTranscript.map((line, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition ${
                      line.tag && line.tag.includes('FINANCIAL')
                        ? 'bg-rose-950/25 border-rose-500/40'
                        : line.tag && line.tag.includes('URGENCY')
                        ? 'bg-amber-950/25 border-amber-500/40'
                        : line.speaker === 'Analyst'
                        ? 'bg-slate-900/70 border-white/5'
                        : 'bg-slate-900/40 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-300">
                        {line.speaker === 'Analyst' ? 'OPERATIONS DESK' : 'CALLER (Claimed: Rajesh Sharma)'}
                      </span>
                      <span className="font-mono text-slate-400">{line.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      "{line.text}"
                    </p>

                    {line.tag && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 text-rose-400">
                        <span>{line.tag}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column (5 cols): Risk Panel, Timeline & Actions ───────── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 18: Central Risk Gauge */}
          <RiskGauge
            score={currentRisk}
            syntheticVoice={currentSyntheticProb}
            speakerMismatch={100 - currentSpeakerMatch}
            prosodyAnomaly={63}
            conversationRisk={currentContextRisk}
          />

          {/* Section 19: Why this Call Was Flagged */}
          <div
            className="p-5 rounded-3xl space-y-3"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsWhyFlaggedOpen(!isWhyFlaggedOpen)}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Why This Call Was Flagged</span>
              </h3>
              {isWhyFlaggedOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {isWhyFlaggedOpen && (
              <div className="space-y-2 pt-2 text-xs">
                {[
                  { text: 'Synthetic voice characteristics (Neural vocoder HF shelf >4.2kHz)', sev: 'rose' },
                  { text: 'Speaker mismatch (Claimed CFO, voiceprint match only 41%)', sev: 'rose' },
                  { text: 'High-risk unlisted financial wire request (₹85,000 transfer)', sev: 'amber' },
                  { text: 'Urgency & verification avoidance (Reluctance to use SAP portal)', sev: 'amber' },
                ].map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${reason.sev === 'rose' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    <span className="text-slate-300 leading-relaxed">{reason.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 20: Real-Time Threat Timeline */}
          <div
            className="p-5 rounded-3xl space-y-4"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Threat Event Timeline</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Chrono Log</span>
            </div>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {[
                { time: '00:00', title: 'Call Started', desc: 'Inbound SIP connection opened' },
                { time: '00:20', title: 'Speaker Asserted', desc: 'Identity claimed as Rajesh Sharma' },
                { time: '01:04', title: 'Voice Anomaly Detected', desc: 'Phase jitter >4.2kHz indicates neural synthesis' },
                { time: '02:11', title: 'Speaker Mismatch', desc: 'Voiceprint similarity dropped to 41%' },
                { time: '02:48', title: 'Financial Wire Request', desc: '₹85,000 transfer requested to unlisted account' },
                { time: '04:02', title: 'Risk Threshold Exceeded', desc: 'Policy #POL-01 Activated (Hold Recommended)' },
              ].map((ev, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-7">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-900 border-2 border-sky-400 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400">{ev.time}</span>
                      <span className="text-xs font-semibold text-slate-200">{ev.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 21: Prevention Center Action Bar */}
          <div
            className="p-5 rounded-3xl space-y-4 border"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
              borderColor: 'rgba(244,63,94,0.3)',
            }}
          >
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-rose-400 block">
                Active Prevention Center
              </span>
              <h3 className="text-sm font-bold text-slate-100">Intervention Controls</h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(2,132,199,0.3)]"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Verify Identity</span>
              </button>

              <button
                type="button"
                onClick={() => setIsHoldModalOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(244,63,94,0.4)]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Hold Transaction</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEscalated(true)
                  alert('Incident escalated to Tier-3 Cyber Fraud Operations Desk.')
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-white/5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Escalate Incident</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert('Session terminated. Audio trunk quarantined.')
                  onNavigate('dashboard')
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-200 hover:text-rose-400 font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-white/5"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Call &amp; Block</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <HoldTransactionModal
        isOpen={isHoldModalOpen}
        onClose={() => setIsHoldModalOpen(false)}
        onConfirm={() => {
          setTransactionHeld(true)
          if (onTriggerSimulationAction) onTriggerSimulationAction('HOLD_TRANSACTION')
        }}
        transactionAmount="₹85,000"
        riskScore={currentRisk}
      />

      <StepUpVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        speakerName={scenario.claimedIdentity}
        onVerificationComplete={(outcome) => {
          if (outcome === 'failed') {
            setIsHoldModalOpen(true)
          }
        }}
      />

      <AnalysisDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  )
}
