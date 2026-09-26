/**
 * TrustedSpeakersView & VoiceProfileView — Section 23 & 24 of Master Specification
 */

import React, { useState } from 'react'
import {
  Users,
  Fingerprint,
  CheckCircle,
  ShieldCheck,
  Smartphone,
  MapPin,
  Clock,
  ArrowRight,
  ChevronLeft,
  RotateCcw,
  Sliders,
  Shield
} from 'lucide-react'
import { INITIAL_SPEAKERS } from '../data/mockData'

export function TrustedSpeakersView({ onSelectProfile }) {
  const [speakers, setSpeakers] = useState(INITIAL_SPEAKERS)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            Trusted Speaker Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enrolled biometric voice profiles, baseline prosody parameters, and authorized verification devices.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('New speaker enrollment wizard initialized. Speak 3 verification sentences.')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(2,132,199,0.35)] transition"
        >
          <Fingerprint className="w-4 h-4" />
          <span>Enroll New Voice Profile</span>
        </button>
      </div>

      {/* Speakers Grid (Section 23) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {speakers.map((spk) => (
          <div
            key={spk.id}
            className="p-5 rounded-3xl flex flex-col justify-between space-y-4 border transition hover:border-sky-500/40"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border)',
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{spk.id}</span>
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {spk.status}
                </span>
              </div>

              <div className="my-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-md">
                  {spk.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{spk.name}</h3>
                  <div className="text-xs text-slate-400">{spk.role}</div>
                </div>
              </div>

              <div className="space-y-1.5 py-3 border-y border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Voice Profile:</span>
                  <span className="font-mono font-bold text-emerald-400">{spk.voiceProfileConfidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verified Calls:</span>
                  <span className="font-mono text-slate-200">{spk.verifiedCallsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Verified:</span>
                  <span className="font-mono text-slate-400 text-[11px]">{spk.lastVerified}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectProfile(spk.id)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-sky-400 border border-white/5 transition flex items-center justify-center gap-1.5"
            >
              <span>View Full Voice Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function VoiceProfileView({ speakerId = 'SPK-001', onBack }) {
  const speaker = INITIAL_SPEAKERS.find((s) => s.id === speakerId) || INITIAL_SPEAKERS[0]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Trusted Speakers</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => alert(`Voice re-enrollment prompt sent to ${speaker.email}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>Re-Enroll Voice</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card (Section 24) */}
      <div
        className="p-6 rounded-3xl flex flex-wrap items-center justify-between gap-6 border"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-xl">
            {speaker.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-100">{speaker.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{speaker.role} • {speaker.department}</div>
            <div className="text-xs font-mono text-slate-400 mt-1">{speaker.phone} • {speaker.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Voiceprint Confidence</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{speaker.voiceProfileConfidence}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Enrolled Date</span>
            <span className="text-xs font-bold font-mono text-slate-200">{speaker.enrollmentDate}</span>
          </div>
        </div>
      </div>

      {/* Prosodic Baseline & Known Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Baseline Acoustic &amp; Prosody Fingerprint</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="text-slate-400">Mean Fundamental Pitch (F0):</span>
              <span className="font-mono text-slate-200">{speaker.baselineProsody.avgPitchHz} Hz</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="text-slate-400">Natural Speaking Cadence:</span>
              <span className="font-mono text-slate-200">{speaker.baselineProsody.speakingRateWpm} WPM</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="text-slate-400">Typical Inter-Phoneme Pause:</span>
              <span className="font-mono text-slate-200">{speaker.baselineProsody.pauseFrequency}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="text-slate-400">Natural Glottal Jitter:</span>
              <span className="font-mono text-slate-200">{speaker.baselineProsody.jitterPercent}%</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span>Authorized Devices &amp; MDM Status</span>
          </h3>
          <div className="space-y-2 text-xs">
            {speaker.knownDevices.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-200">{d}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">● Authorized</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-slate-400 leading-relaxed">
            * Raw biometrics are protected under zero-knowledge vector hashing. No raw audio files are permanently retained.
          </div>
        </div>
      </div>
    </div>
  )
}
