/**
 * StepUpVerificationModal — Section 22 of Master Specification
 * 4-Step Interactive Verification Flow:
 * STEP 1: Dynamic Identity Phrase Challenge
 * STEP 2: Acoustic Voiceprint Match
 * STEP 3: Out-of-Band Trusted Device Push
 * STEP 4: Verification Result & Audit Proof
 */

import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Smartphone,
  Mic,
  Fingerprint,
  X,
  ArrowRight,
  RotateCcw
} from 'lucide-react'

export function StepUpVerificationModal({
  isOpen,
  onClose,
  speakerName = 'Rajesh Sharma',
  expectedMatch = 94,
  onVerificationComplete
}) {
  const [step, setStep] = useState(1)
  const [challengePhrase, setChallengePhrase] = useState('Quantum orbit verify delta seven')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationOutcome, setVerificationOutcome] = useState(null) // 'passed' | 'failed'

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setIsVerifying(false)
      setVerificationOutcome(null)
      const phrases = [
        'Delta sapphire authentic cadence nine',
        'Echo vector verified horizon seven',
        'Cobalt fortress protocol alpha four',
        'Quantum orbit verify delta seven'
      ]
      setChallengePhrase(phrases[Math.floor(Math.random() * phrases.length)])
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2)
      setIsVerifying(true)
      setTimeout(() => {
        setIsVerifying(false)
        setStep(3)
      }, 1400)
    } else if (step === 3) {
      setIsVerifying(true)
      setTimeout(() => {
        setIsVerifying(false)
        // Simulate result based on whether speaker is suspect
        const outcome = 'failed' // Default for suspect call in simulation
        setVerificationOutcome(outcome)
        setStep(4)
        if (onVerificationComplete) onVerificationComplete(outcome)
      }, 1600)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Step-Up Identity Verification</h2>
              <p className="text-xs text-slate-400">Target Identity: <strong className="text-slate-200">{speakerName}</strong></p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Step Progress Indicator */}
        <div className="flex items-center justify-between px-2">
          {[
            { num: 1, label: 'Challenge Phrase' },
            { num: 2, label: 'Voiceprint' },
            { num: 3, label: 'Device Push' },
            { num: 4, label: 'Verdict' },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step === s.num
                      ? 'bg-sky-500 text-white shadow-[0_0_12px_#0284c7]'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
              </div>
              {idx < 3 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Body */}
        <div className="min-h-[160px] flex flex-col justify-center">
          {step === 1 && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3 text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                STEP 1: Request Security Phrase Aloud
              </span>
              <p className="text-xs text-slate-300">
                Instruct the caller to repeat this unpredictable acoustic phrase:
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-base font-bold text-amber-300 font-mono tracking-wide">
                "{challengePhrase}"
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3 text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
                STEP 2: Comparing Voiceprint Embeddings
              </span>
              <div className="flex justify-center py-2">
                <Fingerprint className="w-12 h-12 text-sky-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-300">
                Analyzing phoneme resonance &amp; vocal tract spectral signature against enrolled profile...
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3 text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
                STEP 3: Out-of-Band Device Verification
              </span>
              <div className="flex justify-center py-2">
                <Smartphone className="w-10 h-10 text-sky-400 animate-bounce" />
              </div>
              <p className="text-xs text-slate-300">
                Pushing biometric challenge to enrolled corporate device: <strong>iPhone 15 Pro (Corp-MDM)</strong>...
              </p>
            </div>
          )}

          {step === 4 && (
            <div
              className={`p-5 rounded-2xl text-center space-y-3 border ${
                verificationOutcome === 'passed'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex justify-center">
                {verificationOutcome === 'passed' ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                ) : (
                  <XCircle className="w-12 h-12 text-rose-500" />
                )}
              </div>
              <h3 className="text-base font-bold text-slate-100">
                {verificationOutcome === 'passed' ? 'Identity Successfully Verified' : 'Step-Up Verification FAILED'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {verificationOutcome === 'passed'
                  ? 'Caller matched enrolled biometric voiceprint (96.2%) and confirmed device token.'
                  : 'Device push was timed out/denied and acoustic phrase challenge returned 41% voiceprint match. Impersonation attack confirmed.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          {step < 4 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isVerifying}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(2,132,199,0.4)] transition disabled:opacity-50"
              >
                <span>{step === 1 ? 'Listen & Verify Acoustic Match' : step === 3 ? 'Trigger Device Challenge' : 'Processing…'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
            >
              Close &amp; Update SOC Audit Log
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
