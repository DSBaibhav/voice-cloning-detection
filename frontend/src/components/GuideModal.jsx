/**
 * GuideModal — Explanatory guide detailing the architecture, how it works, and how to test.
 */

export function GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(10, 11, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        animation: 'fade-in-up 0.25s ease',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-glow)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">System Architecture & Testing Guide</h2>
              <p className="text-xs text-slate-400">AI-Powered Real-Time Anti-Spoofing & Attack Prevention</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close guide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 3 Step Explanation */}
        <div className="flex flex-col gap-4 text-sm text-slate-300">
          <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold text-sky-400 flex items-center gap-2 mb-1.5">
              <span>1. Passive Acoustic Analysis (AI + Vocoder Detection)</span>
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              The live microphone stream (16 kHz mono) is continuously monitored in 3-second sliding windows. The engine inspects deep latent representations from Meta's <strong className="text-slate-100">Wav2Vec2</strong> transformer foundation model and scans for digital vocoder anomalies:
            </p>
            <ul className="mt-2 list-disc list-inside text-xs text-slate-400 space-y-1">
              <li><strong className="text-slate-200">Spectral Roll-off:</strong> Detects unnatural high-frequency cutoff shelves typical of neural TTS.</li>
              <li><strong className="text-slate-200">Zero-Crossing Rate (ZCR):</strong> Flags micro-glitches and phase jitter (&gt;2× higher in AI voices).</li>
              <li><strong className="text-slate-200">High-Frequency Energy:</strong> Uncovers vocoder residual noise above 3.8 kHz.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-1.5">
              <span>2. Active Impersonation Prevention (Liveness Challenge)</span>
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              To defeat pre-recorded deepfakes, soundboard clones, or automated bots, the system issues an <strong className="text-slate-100">unpredictable challenge phrase</strong> with a live 12-second countdown. An attacker playing a pre-recorded clone cannot dynamically speak an unexpected sentence.
            </p>
          </div>

          <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mb-1.5">
              <span>3. How to Test Each State</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-semibold text-emerald-400 block mb-1">🟢 Test Real Voice (Bonafide)</span>
                Speak naturally into your microphone when the status turns green. Speak conversational sentences. Expected score: <strong className="text-emerald-300">85%–98% Bonafide</strong>.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="font-semibold text-red-400 block mb-1">🔴 Test AI Voice Clone (Spoof)</span>
                Play an AI voice from your phone (e.g. Gemini Live, ChatGPT Voice, Siri, or an ElevenLabs audio clip) close to your mic. Expected score: <strong className="text-red-400">70%–95% Spoof</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white transition"
            style={{ background: 'var(--accent)' }}
          >
            Got It, Back to Monitor
          </button>
        </div>
      </div>
    </div>
  )
}
