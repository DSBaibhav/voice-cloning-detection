import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, PhoneOff, AlertTriangle, Key, BookOpen, Volume2, Mic } from 'lucide-react';

export function StepUpChallengeModal({ onClose, onConfirm }) {
  const [code] = useState(() => `SEC-${Math.floor(1000 + Math.random() * 9000)}-ALPHA`);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
    setTimeout(() => {
      if (onConfirm) onConfirm();
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs anim-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Key size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Step-Up Verification</h3>
              <p className="text-xs text-slate-500">Live Voice Passphrase Challenge</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Instruct the caller to read aloud this one-time dynamic passphrase. AI voice generation models and recorded replays cannot anticipate random phrases in real time.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Challenge Passphrase</p>
            <p className="text-xl font-mono font-bold text-blue-700 tracking-wider select-all">{code}</p>
          </div>

          {verified ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Challenge Verified Successfully
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleVerify}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Passphrase Verified Correctly
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
              >
                Failed / Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function EndCallModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs anim-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto mb-3">
          <PhoneOff size={22} />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Terminate Voice Session?</h3>
        <p className="text-xs text-slate-500 mb-5">
          This will sever the audio stream, log the security incident, and release hardware resources.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
          >
            Terminate & Log
          </button>
        </div>
      </div>
    </div>
  );
}

export function DemoGuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs anim-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">How to Use & Demonstrate SATYA VAANI</h2>
              <p className="text-xs text-slate-500">Live Voice Clone Detection & Impersonation Prevention Guide</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-700 text-xs leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mic size={16} className="text-blue-600" />
              1. How to Test Genuine Human Speech (Bonafide)
            </h3>
            <p className="text-slate-600">
              Click <strong>"Start Live Voice Shield"</strong>. When prompted by your browser, allow microphone access. Speak naturally into your microphone (e.g. read a sentence or talk casually for 3–5 seconds).
            </p>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Result: Shows <strong>"Human Voice (Bonafide)"</strong> with high authenticity (90–99%) and a green safe indicator.</span>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Volume2 size={16} className="text-red-600" />
              2. How to Test an AI Voice Clone (Spoof)
            </h3>
            <p className="text-slate-600">
              To test an AI voice, keep the Voice Shield running and play an AI-generated voice close to your microphone. Options:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Play a synthetic voice from your phone (e.g. Siri, Gemini Live, ChatGPT Voice, or ElevenLabs).</li>
              <li>Or click the <strong>"Simulate Impersonation Attack"</strong> button inside the app for an instant one-click demonstration.</li>
            </ul>
            <div className="flex items-center gap-2 text-red-800 font-semibold bg-red-50 border border-red-200 p-2.5 rounded-lg">
              <AlertTriangle size={16} className="text-red-600 shrink-0" />
              <span>Result: Shows <strong>"AI Voice Clone (Spoof)"</strong> with high risk score (70–95%), red alert gauge, and audible warning chime.</span>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert size={16} className="text-amber-600" />
              3. How to Demonstrate Attack Prevention
            </h3>
            <p className="text-slate-600">
              When an AI clone is intercepted, SATYA VAANI doesn't just alert; it takes active security countermeasures:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li><strong>Strict Auto-Lockout:</strong> If enabled, the channel is instantly muted/quarantined so the attacker cannot social-engineer the agent.</li>
              <li><strong>Step-Up Verification:</strong> Click "Verify Identity Challenge" to generate a dynamic unpredictable passphrase that synthetic neural vocoders cannot guess.</li>
              <li><strong>Incident Log:</strong> Every incident is recorded chronologically in the Threat Log with acoustic telemetry and cryptographic verification hashes.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Got it, Let's Start
          </button>
        </div>
      </div>
    </div>
  );
}
